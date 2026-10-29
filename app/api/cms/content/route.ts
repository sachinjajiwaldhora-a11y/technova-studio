// FILE PATH: app/api/cms/content/route.ts
// TECHNOVA STUDIO // CMS CONTENT READ & WRITE WITH SERVER-SIDE RBAC

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { CMS_SEED_DEFAULTS } from '@/lib/cms';
import { CMSSectionKey } from '@/lib/cms-types';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

// ─── GET: Read section content ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') as CMSSectionKey | null;
    const mode = searchParams.get('mode') || 'published'; // 'published' or 'draft'
    if (mode !== 'published' && mode !== 'draft') {
      return NextResponse.json({ success: false, error: 'Invalid CMS mode' }, { status: 400 });
    }
    if (mode === 'draft') {
      const member = await getAuthenticatedMember(request);
      if (!hasAnyRole(member, ['admin', 'manager'])) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    if (!isMongoConfigured()) {
      if (section && CMS_SEED_DEFAULTS[section]) {
        return NextResponse.json({ success: true, data: CMS_SEED_DEFAULTS[section], draftSections: [], fallback: true });
      }
      return NextResponse.json({ success: true, data: CMS_SEED_DEFAULTS, draftSections: [], fallback: true });
    }

    const db = await getDb();
    const collection = db.collection(MONGO_COLLECTIONS.CMS_SECTIONS);

    if (section && !Object.hasOwn(CMS_SEED_DEFAULTS, section)) {
      return NextResponse.json({ success: false, error: 'Unknown CMS section' }, { status: 404 });
    }

    if (section) {
      const record = await collection.findOne({ sectionKey: section });
      if (record) {
        const payload = mode === 'draft' ? (record.draftData || record.publishedData) : record.publishedData;
        return NextResponse.json({
          success: true,
          data: payload || CMS_SEED_DEFAULTS[section],
          draftSections: record.status === 'DRAFT_CHANGED' ? [section] : [],
        });
      }
      return NextResponse.json({ success: true, data: CMS_SEED_DEFAULTS[section], draftSections: [] });
    }

    // Return all sections
    const allRecords = await collection.find({}).toArray();
    const result: Record<string, unknown> = { ...CMS_SEED_DEFAULTS };
    const draftSections: CMSSectionKey[] = [];

    allRecords.forEach((rec) => {
      if (rec.sectionKey) {
        result[rec.sectionKey] = mode === 'draft' ? (rec.draftData || rec.publishedData) : rec.publishedData;
        if (rec.status === 'DRAFT_CHANGED') draftSections.push(rec.sectionKey);
      }
    });

    return NextResponse.json({ success: true, data: result, draftSections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── POST: Save draft or Publish section (Server-Side Auth Required) ──────────
export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden: admin or manager access required' }, { status: 403 });
    }

    const body = await request.json();
    const rawSectionKey: unknown = body.sectionKey;
    const data = body.data ?? body.content;
    const mode = body.mode ?? (body.action === 'publish' ? 'publish' : 'draft');

    if (
      typeof rawSectionKey !== 'string' ||
      !Object.hasOwn(CMS_SEED_DEFAULTS, rawSectionKey) ||
      data === undefined
    ) {
      return NextResponse.json({ success: false, error: 'A valid sectionKey and data are required' }, { status: 400 });
    }
    const sectionKey = rawSectionKey as CMSSectionKey;
    if (!['draft', 'publish', 'discard'].includes(mode)) {
      return NextResponse.json({ success: false, error: 'Invalid CMS mode' }, { status: 400 });
    }

    const authorId = member.id;
    const authorName = member.name;

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        fallback: true,
        message: 'MongoDB not configured. Data cached in local storage.',
      });
    }

    const db = await getDb();
    const sectionsCol = db.collection(MONGO_COLLECTIONS.CMS_SECTIONS);
    const versionsCol = db.collection(MONGO_COLLECTIONS.CMS_VERSIONS);
    const auditCol = db.collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG);

    const now = new Date().toISOString();
    if (mode === 'discard') {
      const record = await sectionsCol.findOne({ sectionKey });
      await sectionsCol.updateOne(
        { sectionKey },
        {
          $set: {
            sectionKey,
            draftData: record?.publishedData || CMS_SEED_DEFAULTS[sectionKey],
            status: 'PUBLISHED',
            lastEditedAt: now,
            lastEditedBy: authorName,
          },
        },
        { upsert: true }
      );
      await auditCol.insertOne({
        id: `aud-${Date.now().toString(36)}`,
        timestamp: now,
        authorId,
        authorName,
        action: 'DISCARD_DRAFT',
        sectionKey,
        summary: `Discarded draft for section ${sectionKey.toUpperCase()}`,
      });
      return NextResponse.json({ success: true, sectionKey, mode, timestamp: now });
    }

    if (mode === 'publish') {
      if (sectionKey === 'featured_work' && data && typeof data === 'object' && 'projects' in data) {
        const projects = (data as { projects?: Array<Record<string, unknown>> }).projects || [];
        const linkedProjects: Array<Record<string, unknown>> = [];
        const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);

        for (const project of projects) {
          if (typeof project.projectId !== 'string') continue;
          const internalProject = await projectsCol.findOne({ id: project.projectId });
          if (internalProject?.status === 'COMPLETED') {
            linkedProjects.push(project);
          }
        }

        const existing = await sectionsCol.findOne({ sectionKey: 'featured_work' });
        const nextIds = new Set(linkedProjects.map((project) => String(project.projectId)));
        const previousProjects = (existing?.publishedData?.projects || []) as Array<{ projectId?: string }>;
        for (const previous of previousProjects) {
          if (previous.projectId && !nextIds.has(previous.projectId)) {
            await db.collection(MONGO_COLLECTIONS.FEATURED_PROJECTS).updateOne(
              { projectId: previous.projectId },
              { $set: { isFeatured: false, publicVisibility: false, updatedAt: now } }
            );
          }
        }

        for (const project of linkedProjects) {
          const publicOverrides = {
            title: project.title,
            tagline: project.tagline,
            category: project.category,
            tags: project.tags,
            problem: project.problem,
            solution: project.solution,
            result: project.result,
            techStack: project.techStack,
            coverImage: project.coverImage,
            liveUrl: project.liveUrl,
            allowIframe: project.allowIframe,
          };
          await db.collection(MONGO_COLLECTIONS.FEATURED_PROJECTS).updateOne(
            { projectId: project.projectId },
            {
              $set: {
                projectId: project.projectId,
                isFeatured: Boolean(project.featured),
                publicVisibility: Boolean(project.featured),
                order: Number(project.order) || 1,
                publicOverrides,
                updatedAt: now,
              },
            },
            { upsert: true }
          );
        }
      }

      // 1. Update published and clear draft differences
      await sectionsCol.updateOne(
        { sectionKey },
        {
          $set: {
            sectionKey,
            publishedData: data,
            draftData: data,
            status: 'PUBLISHED',
            publishedAt: now,
            publishedBy: authorName,
            lastEditedAt: now,
            lastEditedBy: authorName,
          },
        },
        { upsert: true }
      );

      // 2. Snapshot to versions (keep last 10)
      const verCount = await versionsCol.countDocuments({ sectionKey });
      await versionsCol.insertOne({
        id: `ver-${Date.now()}-${verCount + 1}`,
        sectionKey,
        versionNumber: verCount + 1,
        data,
        authorId,
        authorName,
        timestamp: now,
        summary: `Published version ${verCount + 1} of ${sectionKey.toUpperCase()}`,
      });

      // 3. Log to audit trail
      await auditCol.insertOne({
        id: `aud-${Date.now().toString(36)}`,
        timestamp: now,
        authorId,
        authorName,
        action: 'PUBLISH',
        sectionKey,
        summary: `Published section ${sectionKey.toUpperCase()}`,
      });
    } else if (mode === 'draft') {
      // Save as draft
      await sectionsCol.updateOne(
        { sectionKey },
        {
          $set: {
            sectionKey,
            draftData: data,
            status: 'DRAFT_CHANGED',
            lastEditedAt: now,
            lastEditedBy: authorName,
          },
        },
        { upsert: true }
      );

      await auditCol.insertOne({
        id: `aud-${Date.now().toString(36)}`,
        timestamp: now,
        authorId,
        authorName,
        action: 'SAVE_DRAFT',
        sectionKey,
        summary: `Saved draft for section ${sectionKey.toUpperCase()}`,
      });
    }

    return NextResponse.json({ success: true, sectionKey, mode, timestamp: now });
  } catch (error: any) {
    console.error('CMS API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
