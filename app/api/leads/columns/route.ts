// FILE PATH: app/api/leads/columns/route.ts
// TECHNOVA STUDIO // DYNAMIC LEAD COLUMNS SCHEMA & CUSTOM FIELD MANAGEMENT

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { LeadColumn, DEFAULT_LEAD_COLUMNS } from '@/lib/store';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

// ─── GET: Fetch all active columns ────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, columns: DEFAULT_LEAD_COLUMNS, fallback: true });
    }

    const db = await getDb();
    const columnsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);
    const saved = await columnsCol.find({}).sort({ order: 1 }).toArray();

    return NextResponse.json({
      success: true,
      columns: saved.length > 0 ? saved : DEFAULT_LEAD_COLUMNS,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── POST: Save / update column structure ─────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    const body = await request.json();
    const { columns } = body;

    if (!Array.isArray(columns) || columns.length === 0) {
      return NextResponse.json({ success: false, error: 'Columns array is required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, columns, fallback: true });
    }

    const db = await getDb();
    const columnsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);

    // Overwrite with updated schema structure
    await columnsCol.deleteMany({});
    await columnsCol.insertMany(columns);

    return NextResponse.json({ success: true, columns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
