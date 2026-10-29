// FILE PATH: app/api/cms/featured/route.ts
// TECHNOVA STUDIO // COMPLETED PROJECTS -> FEATURED BRIDGE API (SAFE SANITIZED EXPOSURE)

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { FeaturedProjectBridge, FeaturedProjectItem } from '@/lib/cms-types';
import { StudioProject } from '@/lib/store';

// ─── GET: Fetch completed projects and their featured bridge mappings ─────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, projects: [], data: [], fallback: true });
    }

    const db = await getDb();
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);
    const bridgeCol = db.collection(MONGO_COLLECTIONS.FEATURED_PROJECTS);

    // 1. Fetch completed projects ONLY from studio_projects
    const completedProjects = (await projectsCol
      .find({ status: 'COMPLETED' })
      .toArray()) as unknown as StudioProject[];

    // 2. Fetch featured bridge mapping records
    const bridges = (await bridgeCol
      .find({})
      .toArray()) as unknown as FeaturedProjectBridge[];

    const bridgeMap = new Map<string, FeaturedProjectBridge>();
    bridges.forEach((b) => bridgeMap.set(b.projectId, b));

    // 3. Assemble sanitized public items
    const assembledList: FeaturedProjectItem[] = [];

    completedProjects.forEach((prj) => {
      const bridge = bridgeMap.get(prj.id);

      // If publicOnly requested: only include if explicitly enabled for public visibility
      if (publicOnly && (!bridge || !bridge.publicVisibility || !bridge.isFeatured)) {
        return;
      }

      const overrides = bridge?.publicOverrides || {};

      // EXPLICIT SANITIZATION: Strictly NO private client financials, dealNotes, internal hourLogs, or managerNotes
      const item: FeaturedProjectItem = {
        id: `feat-${prj.id}`,
        projectId: prj.id,
        code: `PRJ // ${prj.id.toUpperCase()}`,
        title: overrides.title || prj.title,
        tagline: overrides.tagline || (prj.description?.slice(0, 90) + '...'),
        category: overrides.category || (prj.type === 'DEV_BUILD' ? 'SPATIAL WEBGL / 3D ARCHITECTURE' : 'FLAGSHIP ENTERPRISE OS'),
        tags: overrides.tags || prj.tags || ['Verified Build'],
        metrics: overrides.result || '120 FPS // VERIFIED PRODUCTION',
        description: prj.description || '',
        problem: overrides.problem || 'High-load architecture requiring sub-millisecond execution telemetry.',
        solution: overrides.solution || 'Engineered custom zero-latency WebGL shaders and distributed cloud clusters.',
        result: overrides.result || '120 FPS locked // 99.99% uptime // Zero security vulnerabilities',
        techStack: overrides.techStack || ['WebGL', 'GLSL', 'TypeScript', 'Next.js'],
        liveUrl: overrides.liveUrl || prj.liveUrl || 'https://technovastudio.com',
        repoUrl: prj.repoUrl,
        coverImage: overrides.coverImage,
        allowIframe: overrides.allowIframe ?? true,
        featured: bridge?.isFeatured ?? false,
        order: bridge?.order ?? 99,
      };

      assembledList.push(item);
    });

    // Sort by configured order
    assembledList.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      projects: assembledList,
      data: assembledList,
      totalCompleted: completedProjects.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── POST: Update featured bridge status & public overrides ──────────────────
export async function POST(request: NextRequest) {
  try {
    const authorRole = request.headers.get('x-author-role');
    const authorId = request.headers.get('x-author-id');
    if (authorRole !== 'admin' && authorRole !== 'manager' && !authorId?.includes('admin')) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED // CLEARANCE REQUIRED' }, { status: 403 });
    }

    const body = (await request.json()) as FeaturedProjectBridge;
    if (!body.projectId) {
      return NextResponse.json({ success: false, error: 'Missing projectId' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, fallback: true });
    }

    const db = await getDb();
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);
    const bridgeCol = db.collection(MONGO_COLLECTIONS.FEATURED_PROJECTS);

    // Verify project exists and is COMPLETED
    const prj = await projectsCol.findOne({ id: body.projectId });
    if (!prj || prj.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Only COMPLETED projects can be featured on public site' },
        { status: 400 }
      );
    }

    const updateDoc = {
      projectId: body.projectId,
      isFeatured: Boolean(body.isFeatured),
      publicVisibility: Boolean(body.publicVisibility),
      order: body.order || 1,
      publicOverrides: body.publicOverrides || {},
      updatedAt: new Date().toISOString(),
    };

    await bridgeCol.updateOne({ projectId: body.projectId }, { $set: updateDoc }, { upsert: true });

    // Log to audit trail
    await db.collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG).insertOne({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      authorId: authorId || 'admin',
      authorName: request.headers.get('x-author-name') || 'Admin',
      action: 'TOGGLE_FEATURED',
      sectionKey: 'projects',
      summary: `Updated featured status for project ${body.projectId} (Featured: ${body.isFeatured}, Visible: ${body.publicVisibility})`,
    });

    return NextResponse.json({ success: true, bridge: updateDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

