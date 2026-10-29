// FILE PATH: app/api/cms/seed/route.ts
// TECHNOVA STUDIO // PRE-FILL CMS WITH SEED DEFAULTS

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { CMS_SEED_DEFAULTS } from '@/lib/cms';
import { CMSSectionKey } from '@/lib/cms-types';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin'])) {
      return NextResponse.json({ success: false, error: 'Forbidden: admin access required' }, { status: 403 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'MongoDB not configured. System running with memory/local defaults.',
      });
    }

    const db = await getDb();
    const sectionsCol = db.collection(MONGO_COLLECTIONS.CMS_SECTIONS);
    const bridgeCol = db.collection(MONGO_COLLECTIONS.FEATURED_PROJECTS);
    const auditCol = db.collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG);

    const now = new Date().toISOString();
    let seededSections = 0;

    // Seed all 15 sections
    for (const [key, payload] of Object.entries(CMS_SEED_DEFAULTS)) {
      const sectionKey = key as CMSSectionKey;
      await sectionsCol.updateOne(
        { sectionKey },
        {
          $setOnInsert: {
            sectionKey,
            publishedData: payload,
            draftData: payload,
            status: 'PUBLISHED',
            publishedAt: now,
            publishedBy: 'System Seed Protocol',
            lastEditedAt: now,
            lastEditedBy: 'System Seed Protocol',
          },
        },
        { upsert: true }
      );
      seededSections++;
    }

    // Connect seed completed projects (prj-003 Krypton Defense)
    await bridgeCol.updateOne(
      { projectId: 'prj-003' },
      {
        $setOnInsert: {
          projectId: 'prj-003',
          isFeatured: true,
          publicVisibility: true,
          order: 1,
          publicOverrides: {
            title: 'KRYPTON DEFENSE AI — SPATIAL COMMAND INTERFACE',
            category: 'ZERO-KNOWLEDGE AUTH / SPATIAL UI',
            result: '0.02s execution // 99.999% uptime // 0 security vulnerabilities',
            allowIframe: true,
          },
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    await auditCol.insertOne({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: now,
      authorId: member.id,
      authorName: member.name,
      action: 'PUBLISH',
      sectionKey: 'hero',
      summary: `Pre-filled ${seededSections} CMS sections and initial completed project bridge mappings.`,
    });

    return NextResponse.json({
      success: true,
      seededSections,
      message: 'All 15 CMS sections and completed project bridge mappings initialized.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
