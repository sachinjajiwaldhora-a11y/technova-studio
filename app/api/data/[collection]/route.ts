// FILE PATH: app/api/data/[collection]/route.ts
// TECHNOVA STUDIO // UNIFIED MONGODB COLLECTION ROUTE HANDLER

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, Filter, Document } from 'mongodb';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { getAuthenticatedMember } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

// Map URL slugs to MongoDB collection names
const COLLECTION_MAP: Record<string, string> = {
  members: MONGO_COLLECTIONS.MEMBERS,
  projects: MONGO_COLLECTIONS.PROJECTS,
  inquiries: MONGO_COLLECTIONS.INQUIRIES,
  leads: MONGO_COLLECTIONS.LEADS,
  customers: MONGO_COLLECTIONS.CUSTOMERS,
  targets: MONGO_COLLECTIONS.TARGETS,
  lead_columns: MONGO_COLLECTIONS.LEAD_COLUMNS,
  'lead-columns': MONGO_COLLECTIONS.LEAD_COLUMNS,
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
  const filters: Filter<Document>[] = [{ id }, { email: id }];
  if (ObjectId.isValid(id) && id.length === 24) {
    filters.push({ _id: new ObjectId(id) });
  }
  return { $or: filters };
}

function sanitizeDocument(doc: Document, canViewPrivate: boolean): Document {
  const {
    _id,
    password,
    passwordHash,
    privateNotes,
    private_notes,
    managerNotes,
    manager_notes,
    ...safeDoc
  } = doc;

  if (canViewPrivate) return safeDoc;

  if (safeDoc.clientInfo && typeof safeDoc.clientInfo === 'object') {
    const { budget, expectedRevenue, ...clientInfo } = safeDoc.clientInfo;
    safeDoc.clientInfo = clientInfo;
  }
  delete safeDoc.expectedRevenue;
  delete safeDoc.budget;
  delete safeDoc.dealNotes;
  return safeDoc;
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

    if (!(await getAuthenticatedMember(request))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
      if (!item) return NextResponse.json({ success: true, data: null });
      const member = await getAuthenticatedMember(request);
      return NextResponse.json({
        success: true,
        data: { ...sanitizeDocument(item, member?.role === 'admin' || member?.role === 'manager'), id: item.id || item._id.toString() },
      });
    }

    if (trackingCode) {
      const item = await collection.findOne({ trackingCode });
      if (!item) return NextResponse.json({ success: true, data: null });
      const member = await getAuthenticatedMember(request);
      return NextResponse.json({
        success: true,
        data: { ...sanitizeDocument(item, member?.role === 'admin' || member?.role === 'manager'), id: item.id || item._id.toString() },
      });
    }

    // CMS config is a single document
    if (collectionName === MONGO_COLLECTIONS.CMS) {
      const cmsDoc = await collection.findOne({ id: 'technova_main_cms' }) || await collection.findOne({});
      return NextResponse.json({ success: true, data: cmsDoc });
    }

    // All documents in collection
    const items = await collection.find({}).toArray();

    // Map _id if id isn't explicitly set
    const member = await getAuthenticatedMember(request);
    const sanitized = items.map((doc) => {
      return {
        ...sanitizeDocument(doc, member?.role === 'admin' || member?.role === 'manager'),
        id: doc.id || doc._id.toString(),
      };
    });

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

    const isPublicCollection =
      collectionName === MONGO_COLLECTIONS.INQUIRIES ||
      collectionName === MONGO_COLLECTIONS.JOIN_REQUESTS;
    const member = isPublicCollection ? null : await getAuthenticatedMember(request);
    if (!isPublicCollection && !member) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (
      member &&
      new Set<string>([MONGO_COLLECTIONS.MEMBERS, MONGO_COLLECTIONS.RBAC, MONGO_COLLECTIONS.CMS]).has(collectionName) &&
      member.role !== 'admin'
    ) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
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
    if (
      isPublicCollection &&
      (!body || Array.isArray(body) || typeof body !== 'object' || typeof body.id !== 'string')
    ) {
      return NextResponse.json({ success: false, error: 'A valid record with an id is required' }, { status: 400 });
    }

    if (isPublicCollection) {
      if (collectionName === MONGO_COLLECTIONS.INQUIRIES) {
        if (
          typeof body.clientName !== 'string' ||
          !body.clientName.trim() ||
          typeof body.email !== 'string' ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
        ) {
          return NextResponse.json({ success: false, error: 'Valid client name and email address are required' }, { status: 400 });
        }

        const normalizedEmail = body.email.trim().toLowerCase();
        const incomingKind = body.kind === 'CALL_BOOKING' ? 'CALL_BOOKING' : 'PROJECT_INQUIRY';
        const incomingTitle = typeof body.title === 'string' ? body.title.slice(0, 200) : '';

        // Deduplication Guard: Check if an inquiry with same email + kind/title was created within last 2 minutes
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const existingInquiry = await collection.findOne({
          email: normalizedEmail,
          kind: incomingKind,
          $or: [
            { id: body.id },
            { trackingCode: body.trackingCode },
            { submittedAt: { $gte: twoMinutesAgo } },
          ],
        });

        if (existingInquiry) {
          // Return the already created inquiry to prevent duplicate cards
          return NextResponse.json({
            success: true,
            duplicateIgnored: true,
            id: existingInquiry.id,
            trackingCode: existingInquiry.trackingCode,
            message: 'Inquiry successfully queued into pipeline.',
          });
        }

        const intake = {
          id: body.id,
          trackingCode: body.trackingCode,
          kind: incomingKind,
          clientName: body.clientName.slice(0, 160),
          company: typeof body.company === 'string' ? body.company.slice(0, 160) : '',
          email: normalizedEmail,
          title: incomingTitle,
          scope: typeof body.scope === 'string' ? body.scope.slice(0, 500) : 'General Inquiry',
          description: typeof body.description === 'string' ? body.description.slice(0, 5000) : '',
          budget: typeof body.budget === 'string' ? body.budget.slice(0, 100) : '',
          timeline: typeof body.timeline === 'string' ? body.timeline.slice(0, 100) : '',
          callTimeSlot: typeof body.callTimeSlot === 'string' ? body.callTimeSlot.slice(0, 100) : '',
          meetingPlatform: typeof body.meetingPlatform === 'string' ? body.meetingPlatform.slice(0, 100) : '',
          preferredCallDate: typeof body.preferredCallDate === 'string' ? body.preferredCallDate.slice(0, 40) : '',
          followUpDate: typeof body.followUpDate === 'string' ? body.followUpDate.slice(0, 40) : '',
          assignedSalesId: 'usr-02',
          leadSource: 'WEBSITE_HUD',
          status: 'NEW_INQUIRY',
          submittedAt: new Date().toISOString(),
          expectedRevenue: Number(body.expectedRevenue) || 0,
          dealNotes: typeof body.dealNotes === 'string' ? body.dealNotes.slice(0, 2000) : '',
          phone: typeof body.phone === 'string' ? body.phone.slice(0, 40) : '',
        };
        const result = await collection.insertOne(intake);
        return NextResponse.json({ success: true, insertedId: result.insertedId, id: intake.id, trackingCode: intake.trackingCode });
      }

      if (
        typeof body.fullName !== 'string' ||
        !body.fullName.trim() ||
        typeof body.email !== 'string' ||
        !body.email.trim()
      ) {
        return NextResponse.json({ success: false, error: 'Candidate name and email address are required' }, { status: 400 });
      }

      const normalizedEmail = body.email.trim().toLowerCase();
      const existingDoc = await collection.findOne({
        $or: [{ id: body.id }, { email: normalizedEmail }],
      });

      const parsedSkills = Array.isArray(body.skills)
        ? body.skills.filter((skill: unknown) => typeof skill === 'string').slice(0, 40)
        : typeof body.skills === 'string'
        ? (body.skills as string).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 40)
        : [];

      if (existingDoc) {
        // Prevent duplicate insertions: update the existing applicant application and reset status to PENDING
        await collection.updateOne(
          { _id: existingDoc._id },
          {
            $set: {
              fullName: body.fullName.slice(0, 160),
              portfolioUrl: typeof body.portfolioUrl === 'string' ? body.portfolioUrl.slice(0, 2048) : '',
              githubUrl: typeof body.githubUrl === 'string' ? body.githubUrl.slice(0, 2048) : '',
              department: typeof body.department === 'string' ? body.department.slice(0, 100) : 'Fullstack Engineering',
              skills: parsedSkills,
              statement: typeof body.statement === 'string' ? body.statement.slice(0, 5000) : '',
              status: 'PENDING', // Always set to PENDING on application submission so it appears in the onboarding queue
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }
        );
        return NextResponse.json({ success: true, updated: true, id: existingDoc.id });
      }

      const intake = {
        id: body.id || `join-${Date.now().toString(36)}`,
        fullName: body.fullName.slice(0, 160),
        email: normalizedEmail,
        portfolioUrl: typeof body.portfolioUrl === 'string' ? body.portfolioUrl.slice(0, 2048) : '',
        githubUrl: typeof body.githubUrl === 'string' ? body.githubUrl.slice(0, 2048) : '',
        department: typeof body.department === 'string' ? body.department.slice(0, 100) : 'Fullstack Engineering',
        skills: parsedSkills,
        statement: typeof body.statement === 'string' ? body.statement.slice(0, 5000) : '',
        submittedAt: body.submittedAt || new Date().toISOString(),
        status: 'PENDING',
      };
      const result = await collection.insertOne(intake);
      return NextResponse.json({ success: true, insertedId: result.insertedId, id: intake.id });
    }

    if (Array.isArray(body)) {
      const result = await collection.insertMany(body);
      return NextResponse.json({ success: true, insertedCount: result.insertedCount });
    } else {
      if (body.id) {
        const { _id, password, passwordHash, ...safeUpdate } = body;
        const passHashUpdate: Record<string, string> = {};
        if (collectionName === MONGO_COLLECTIONS.MEMBERS && typeof password === 'string' && password.trim()) {
          passHashUpdate.passwordHash = await hashPassword(password.trim());
        }
        const updateOps: Record<string, any> = {
          $set: { ...safeUpdate, ...passHashUpdate },
        };
        if (passHashUpdate.passwordHash) {
          updateOps.$unset = { password: '' };
        }
        const result = await collection.updateOne(
          { id: body.id },
          updateOps,
          { upsert: true }
        );
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

    const member = await getAuthenticatedMember(request);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const targetId = body.id || (body._id ? body._id.toString() : '');

    const isAdmin = member.role === 'admin';
    const isSelfMemberUpdate = collectionName === MONGO_COLLECTIONS.MEMBERS &&
      (member.id === targetId || member.email === targetId);

    if (
      new Set<string>([MONGO_COLLECTIONS.MEMBERS, MONGO_COLLECTIONS.RBAC, MONGO_COLLECTIONS.CMS]).has(collectionName) &&
      !isAdmin &&
      !isSelfMemberUpdate
    ) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { success: false, fallback: true, message: 'MongoDB is not configured' },
        { status: 200 }
      );
    }

    const db = await getDb();
    const collection = db.collection(collectionName);
    if (!targetId && collectionName !== MONGO_COLLECTIONS.CMS) {
      return NextResponse.json(
        { success: false, error: 'Document id is required for update' },
        { status: 400 }
      );
    }

    const filter: Filter<Document> = collectionName === MONGO_COLLECTIONS.CMS
      ? { id: 'technova_main_cms' }
      : buildDocFilter(targetId);

    const { _id, password, passwordHash, ...safeBody } = body;
    const passHashUpdate: Record<string, string> = {};
    if (collectionName === MONGO_COLLECTIONS.MEMBERS && typeof password === 'string' && password.trim()) {
      passHashUpdate.passwordHash = await hashPassword(password.trim());
    }
    const updateDoc = {
      ...safeBody,
      ...passHashUpdate,
      updatedAt: new Date().toISOString(),
    };

    const updateOps: Record<string, any> = {
      $set: updateDoc,
    };
    if (passHashUpdate.passwordHash) {
      updateOps.$unset = { password: '' };
    }

    const result = await collection.updateOne(
      filter,
      updateOps,
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

    const member = await getAuthenticatedMember(request);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (
      new Set<string>([MONGO_COLLECTIONS.MEMBERS, MONGO_COLLECTIONS.RBAC, MONGO_COLLECTIONS.CMS]).has(collectionName) &&
      member.role !== 'admin'
    ) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
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

    if (collectionName === MONGO_COLLECTIONS.MEMBERS && (id === member.id || id === member.email)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own active administrator account' },
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
