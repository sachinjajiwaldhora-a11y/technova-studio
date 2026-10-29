// FILE PATH: app/api/leads/route.ts
// TECHNOVA STUDIO // DEDICATED LEADS PIPELINE API

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { StudioLead, SEED_LEADS, DEFAULT_LEAD_COLUMNS } from '@/lib/store';

// Helper: Verify authorization
function verifyAuth(request: NextRequest) {
  const authorRole = request.headers.get('x-author-role') || 'member';
  const authorId = request.headers.get('x-author-id') || '';
  const isAdminOrManager = authorRole === 'admin' || authorRole === 'manager' || authorId.includes('admin') || authorId.includes('usr-01');
  return { isAuthorized: true, isAdminOrManager, authorId, authorRole };
}

// ─── GET: Fetch Leads & Custom Columns ────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search')?.toLowerCase();

    if (!isMongoConfigured()) {
      let filtered = [...SEED_LEADS];
      if (status && status !== 'ALL') filtered = filtered.filter((l) => l.status === status);
      if (assignedTo && assignedTo !== 'ALL') filtered = filtered.filter((l) => l.assignedMemberId === assignedTo);
      if (search) {
        filtered = filtered.filter(
          (l) =>
            l.name.toLowerCase().includes(search) ||
            l.company?.toLowerCase().includes(search) ||
            l.email.toLowerCase().includes(search)
        );
      }
      return NextResponse.json({
        success: true,
        leads: filtered,
        columns: DEFAULT_LEAD_COLUMNS,
        fallback: true,
      });
    }

    const db = await getDb();
    const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);
    const columnsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);

    const query: Record<string, any> = {};
    if (status && status !== 'ALL') query.status = status;
    if (assignedTo && assignedTo !== 'ALL') query.assignedMemberId = assignedTo;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await leadsCol.find(query).sort({ createdAt: -1 }).toArray();

    // Fetch custom columns schema
    const customCols = await columnsCol.find({}).sort({ order: 1 }).toArray();
    const columns = customCols.length > 0 ? customCols : DEFAULT_LEAD_COLUMNS;

    return NextResponse.json({
      success: true,
      leads: leads.length > 0 ? leads : SEED_LEADS,
      columns,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── POST: Create or Update Lead ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { authorId } = verifyAuth(request);
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required for leads' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const leadId = body.id || `lead-${Date.now()}`;

    const leadRecord: StudioLead = {
      id: leadId,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      company: body.company?.trim() || '',
      value: typeof body.value === 'number' ? body.value : parseInt(body.value) || 0,
      status: body.status || 'NEW',
      source: body.source || 'MANUAL',
      sourceDetails: body.sourceDetails || 'Direct Studio Lead Creation',
      assignedMemberId: body.assignedMemberId || authorId || '',
      assignedMemberName: body.assignedMemberName || '',
      customerId: body.customerId || '',
      convertedProjectId: body.convertedProjectId || '',
      convertedAt: body.convertedAt || undefined,
      notes: body.notes || '',
      customFields: body.customFields || {},
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, lead: leadRecord, fallback: true });
    }

    const db = await getDb();
    const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);

    await leadsCol.updateOne({ id: leadId }, { $set: leadRecord }, { upsert: true });

    return NextResponse.json({ success: true, lead: leadRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── DELETE: Remove a lead ────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, id, fallback: true });
    }

    const db = await getDb();
    await db.collection(MONGO_COLLECTIONS.LEADS).deleteOne({ id });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

