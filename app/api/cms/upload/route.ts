// FILE PATH: app/api/cms/upload/route.ts
// TECHNOVA STUDIO // MEDIA ASSET UPLOAD WITH VALIDATION

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { CMSMediaItem } from '@/lib/cms-types';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

export async function POST(request: NextRequest) {
  try {
    const authorRole = request.headers.get('x-author-role');
    const authorId = request.headers.get('x-author-id');
    if (authorRole !== 'admin' && authorRole !== 'manager' && !authorId?.includes('admin')) {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED // CLEARANCE REQUIRED' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Allowed: PNG, JPEG, WebP, SVG' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File exceeds maximum limit of 5MB' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const mediaItem: CMSMediaItem = {
      id: `med-${Date.now().toString(36)}`,
      fileName: file.name,
      fileUrl: dataUrl,
      mimeType: file.type,
      sizeBytes: file.size,
      altText: altText || file.name.replace(/\.[^/.]+$/, ''),
      uploadedAt: new Date().toISOString(),
      uploadedBy: request.headers.get('x-author-name') || 'Admin',
    };

    if (isMongoConfigured()) {
      try {
        const db = await getDb();
        await db.collection(MONGO_COLLECTIONS.CMS_MEDIA).insertOne(mediaItem);
        await db.collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG).insertOne({
          id: `aud-${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          authorId: authorId || 'admin',
          authorName: request.headers.get('x-author-name') || 'Admin',
          action: 'UPLOAD_MEDIA',
          sectionKey: 'media',
          summary: `Uploaded image ${file.name} (${Math.round(file.size / 1024)} KB)`,
        });
      } catch (dbErr) {
        // Fallback returned cleanly
      }
    }

    return NextResponse.json({
      success: true,
      media: mediaItem,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
