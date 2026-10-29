// FILE PATH: app/api/cms/versions/route.ts
// TECHNOVA STUDIO // CMS SECTION VERSION HISTORY & ROLLBACK

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || searchParams.get('sectionKey');

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, versions: [], data: [], fallback: true });
    }

    const db = await getDb();
    const query = section ? { sectionKey: section } : {};
    const versions = await db
      .collection(MONGO_COLLECTIONS.CMS_VERSIONS)
      .find(query)
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ success: true, versions, data: versions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorRole = request.headers.get('x-author-role');
    const authorId = request.headers.get('x-author-id');

    if (authorRole !== 'admin' && authorRole !== 'manager' && !authorId?.includes('admin')) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED // CLEARANCE REQUIRED' }, { status: 403 });
    }

    const { versionId } = await request.json();
    if (!versionId) {
      return NextResponse.json({ success: false, error: 'Missing versionId' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, fallback: true });
    }

    const db = await getDb();
    const version = await db.collection(MONGO_COLLECTIONS.CMS_VERSIONS).findOne({ id: versionId });
    if (!version) {
      return NextResponse.json({ success: false, error: 'Version snapshot not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    await db.collection(MONGO_COLLECTIONS.CMS_SECTIONS).updateOne(
      { sectionKey: version.sectionKey },
      {
        $set: {
          publishedData: version.data,
          draftData: version.data,
          status: 'PUBLISHED',
          publishedAt: now,
          publishedBy: `Reverted by ${request.headers.get('x-author-name') || 'Admin'}`,
        },
      },
      { upsert: true }
    );

    await db.collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG).insertOne({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: now,
      authorId: authorId || 'admin',
      authorName: request.headers.get('x-author-name') || 'Admin',
      action: 'REVERT_VERSION',
      sectionKey: version.sectionKey,
      summary: `Reverted ${version.sectionKey} to snapshot v${version.versionNumber}`,
    });

    return NextResponse.json({ success: true, revertedTo: version });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

