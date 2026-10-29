// FILE PATH: app/api/data/[collection]/route.ts
// TECHNOVA STUDIO // UNIFIED MONGODB COLLECTION ROUTE HANDLER

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, Filter, Document } from 'mongodb';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';

// Map URL slugs to MongoDB collection names
const COLLECTION_MAP: Record<string, string> = {
  members: MONGO_COLLECTIONS.MEMBERS,
  projects: MONGO_COLLECTIONS.PROJECTS,
  inquiries: MONGO_COLLECTIONS.INQUIRIES,
  leads: MONGO_COLLECTIONS.INQUIRIES,
  announcements: MONGO_COLLECTIONS.ANNOUNCEMENTS,
  sheets: MONGO_COLLECTIONS.SHEETS,
  cms: MONGO_COLLECTIONS.CMS,
  rbac: MONGO_COLLECTIONS.RBAC,
  'join-requests': MONGO_COLLECTIONS.JOIN_REQUESTS,
  join_requests: MONGO_COLLECTIONS.JOIN_REQUESTS,
};

function resolveCollection(slug: string): string | null {
  return COLLECTION_MAP[slug.toLowerCase()] || null;
}

function buildDocFilter(id: string): Filter<Document> {
  if (ObjectId.isValid(id) && id.length === 24) {
    return { $or: [{ id }, { _id: new ObjectId(id) }] };
  }
  return { id };
}

// ─── GET: Fetch documents ───────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection: slug } = await params;
    const collectionName = resolveCollection(slug);

    if (!collectionName) {
      return NextResponse.json(
        { success: false, error: `Invalid collection: ${slug}` },
        { status: 404 }
      );
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          success: false,
          fallback: true,
          message: 'MongoDB is not configured.',
          data: [],
        },
        { status: 200 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const trackingCode = searchParams.get('trackingCode');

    // Single item by id or tracking code
    if (id) {
      const item = await collection.findOne(buildDocFilter(id));
      return NextResponse.json({ success: true, data: item });
    }

    if (trackingCode) {
      const item = await collection.findOne({ trackingCode });
      return NextResponse.json({ success: true, data: item });
    }

    // CMS config is a single document
    if (collectionName === MONGO_COLLECTIONS.CMS) {
      const cmsDoc = await collection.findOne({ id: 'technova_main_cms' }) || await collection.findOne({});
      return NextResponse.json({ success: true, data: cmsDoc });
    }

    // All documents in collection
    const items = await collection.find({}).toArray();

    // Map _id if id isn't explicitly set
    const sanitized = items.map((doc) => ({
      ...doc,
      id: doc.id || doc._id.toString(),
    }));

    return NextResponse.json({ success: true, data: sanitized });
  } catch (error: any) {
    console.error('MongoDB GET Error:', error);
    return NextResponse.json(
      { success: false, fallback: true, error: error.message },
      { status: 500 }
    );
  }
}

// ─── POST: Insert document(s) ────────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection: slug } = await params;
    const collectionName = resolveCollection(slug);

    if (!collectionName) {
      return NextResponse.json(
        { success: false, error: `Invalid collection: ${slug}` },
        { status: 404 }
      );
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { success: false, fallback: true, message: 'MongoDB is not configured' },
        { status: 200 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);
    const body = await request.json();

    if (Array.isArray(body)) {
      const result = await collection.insertMany(body);
      return NextResponse.json({ success: true, insertedCount: result.insertedCount });
    } else {
      // If it has an id, upsert to avoid duplicate key errors
      if (body.id) {
        const result = await collection.replaceOne({ id: body.id }, body, { upsert: true });
        return NextResponse.json({ success: true, result });
      }
      const result = await collection.insertOne(body);
      return NextResponse.json({ success: true, insertedId: result.insertedId });
    }
  } catch (error: any) {
    console.error('MongoDB POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── PUT: Update or replace document ─────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection: slug } = await params;
    const collectionName = resolveCollection(slug);

    if (!collectionName) {
      return NextResponse.json(
        { success: false, error: `Invalid collection: ${slug}` },
        { status: 404 }
      );
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { success: false, fallback: true, message: 'MongoDB is not configured' },
        { status: 200 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);
    const body = await request.json();

    const targetId = body.id || (body._id ? body._id.toString() : '');
    if (!targetId && collectionName !== MONGO_COLLECTIONS.CMS) {
      return NextResponse.json(
        { success: false, error: 'Document id is required for update' },
        { status: 400 }
      );
    }

    const filter: Filter<Document> = collectionName === MONGO_COLLECTIONS.CMS
      ? { id: 'technova_main_cms' }
      : buildDocFilter(targetId);

    const updateDoc = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.updateOne(
      filter,
      { $set: updateDoc },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('MongoDB PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete document ─────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection: slug } = await params;
    const collectionName = resolveCollection(slug);

    if (!collectionName) {
      return NextResponse.json(
        { success: false, error: `Invalid collection: ${slug}` },
        { status: 404 }
      );
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { success: false, fallback: true, message: 'MongoDB is not configured' },
        { status: 200 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing document id query param' },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne(buildDocFilter(id));
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error: any) {
    console.error('MongoDB DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
