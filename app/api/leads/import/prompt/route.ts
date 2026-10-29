import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { DEFAULT_LEAD_COLUMNS, LeadColumn } from '@/lib/store';
import { buildLeadImportPrompt } from '@/lib/lead-import-prompt';

export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    const body = await request.json().catch(() => ({}));
    const requestedColumns = Array.isArray(body.columns)
      ? body.columns.filter(
          (column: unknown): column is LeadColumn =>
            Boolean(
              column &&
                typeof column === 'object' &&
                typeof (column as LeadColumn).id === 'string' &&
                typeof (column as LeadColumn).label === 'string'
            )
        )
      : [];
    let columns = requestedColumns.length ? requestedColumns : DEFAULT_LEAD_COLUMNS;
    if (isMongoConfigured()) {
      const db = await getDb();
      const savedColumns = await db
        .collection(MONGO_COLLECTIONS.LEAD_COLUMNS)
        .find({})
        .sort({ order: 1 })
        .toArray();
      if (savedColumns.length) columns = savedColumns as unknown as LeadColumn[];
    }

    return NextResponse.json({
      success: true,
      columns,
      prompt: buildLeadImportPrompt(columns),
    });
  } catch (error) {
    console.error('Lead import prompt error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load the current lead schema.' }, { status: 500 });
  }
}
