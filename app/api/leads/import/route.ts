import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { DEFAULT_LEAD_COLUMNS, LeadColumn, StudioLead } from '@/lib/store';
import { parseUploadedLeadFile } from '@/lib/lead-parser';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_LEADS_PER_IMPORT = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.action !== 'commit' || !Array.isArray(body.leads)) {
        return NextResponse.json({ success: false, error: 'A valid import confirmation is required' }, { status: 400 });
      }
      if (body.leads.length === 0 || body.leads.length > MAX_LEADS_PER_IMPORT) {
        return NextResponse.json(
          { success: false, error: `Confirm between 1 and ${MAX_LEADS_PER_IMPORT} leads at a time` },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const createdLeads: StudioLead[] = body.leads.flatMap((candidate: unknown) => {
        if (!isRecord(candidate)) return [];
        const name = typeof candidate.name === 'string' ? candidate.name.trim().slice(0, 160) : '';
        const email = typeof candidate.email === 'string' ? candidate.email.trim().slice(0, 254) : '';
        if (!name && !email) return [];

        const rawCustomFields = isRecord(candidate.customFields) ? candidate.customFields : {};
        const customFields = Object.fromEntries(
          Object.entries(rawCustomFields)
            .filter(([key, value]) => /^[a-zA-Z0-9_-]{1,80}$/.test(key) && ['string', 'number', 'boolean'].includes(typeof value))
            .slice(0, 80)
            .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 2000) : value])
        );

        const statusValues = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'INTERESTED', 'DEAL_WON', 'LOST'] as const;
        const sourceValues = ['WEBSITE', 'MANUAL', 'WEBHOOK', 'META_ADS', 'GOOGLE_ADS', 'REFERRAL', 'OUTREACH'] as const;
        const lead: StudioLead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          name: name || email.split('@')[0],
          email,
          phone: typeof candidate.phone === 'string' ? candidate.phone.slice(0, 80) : '',
          company: typeof candidate.company === 'string' ? candidate.company.slice(0, 160) : '',
          value: typeof candidate.value === 'number' && Number.isFinite(candidate.value) ? candidate.value : 0,
          status: statusValues.includes(candidate.status as typeof statusValues[number])
            ? candidate.status as StudioLead['status']
            : 'NEW',
          source: sourceValues.includes(candidate.source as typeof sourceValues[number])
            ? candidate.source as StudioLead['source']
            : 'MANUAL',
          sourceDetails: typeof candidate.sourceDetails === 'string'
            ? candidate.sourceDetails.slice(0, 500)
            : 'Imported from PDF',
          assignedMemberId: member.id,
          assignedMemberName: member.name,
          customerId: '',
          convertedProjectId: '',
          notes: typeof candidate.notes === 'string' ? candidate.notes.slice(0, 5000) : '',
          customFields,
          createdAt: now,
          updatedAt: now,
        };
        return [lead];
      });

      if (!createdLeads.length) {
        return NextResponse.json({ success: false, error: 'No valid lead records were selected for import' }, { status: 422 });
      }

      const customColumnLabels = new Map<string, string>();
      for (const lead of createdLeads) {
        for (const key of Object.keys(lead.customFields || {})) {
          customColumnLabels.set(key, key.replace(/_/g, ' ').toUpperCase());
        }
      }

      let newColumns: LeadColumn[] = [];
      if (isMongoConfigured()) {
        const db = await getDb();
        const columnsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);
        const savedColumns = await columnsCol.find({}).toArray();
        const existingIds = new Set([
          ...DEFAULT_LEAD_COLUMNS.map((column) => column.id),
          ...savedColumns.map((column) => String(column.id)),
        ]);
        let order = Math.max(
          DEFAULT_LEAD_COLUMNS.length,
          ...savedColumns.map((column) => Number(column.order) || 0)
        );
        newColumns = [...customColumnLabels.entries()]
          .filter(([id]) => !existingIds.has(id))
          .map(([id, label]) => ({
            id,
            label,
            type: 'text' as const,
            isSystem: false,
            visible: true,
            order: ++order,
            width: '160px',
          }));

        if (newColumns.length) await columnsCol.insertMany(newColumns);
        await db.collection(MONGO_COLLECTIONS.LEADS).insertMany(createdLeads);
      }

      return NextResponse.json({
        success: true,
        stage: 'complete',
        message: `Added ${createdLeads.length} confirmed leads`,
        count: createdLeads.length,
        leads: createdLeads,
        newColumns,
        fallback: !isMongoConfigured(),
      });
    }

    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_FILE_BYTES) {
      return NextResponse.json({ success: false, error: 'The uploaded file exceeds the 10 MB limit' }, { status: 413 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file was provided in the upload request' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ success: false, error: 'The uploaded file is empty (0 bytes)' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ success: false, error: 'The uploaded file exceeds the 10 MB limit' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawColumns = formData.get('columns');
    let columns: LeadColumn[] = DEFAULT_LEAD_COLUMNS;
    if (typeof rawColumns === 'string') {
      try {
        const parsedColumns: unknown = JSON.parse(rawColumns);
        if (Array.isArray(parsedColumns)) {
          const validColumns = parsedColumns.filter(
            (column: unknown): column is LeadColumn =>
              Boolean(
                column &&
                  typeof column === 'object' &&
                  typeof (column as LeadColumn).id === 'string' &&
                  typeof (column as LeadColumn).label === 'string'
              )
          );
          if (validColumns.length) columns = validColumns;
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid lead column schema' }, { status: 400 });
      }
    }
    if (isMongoConfigured()) {
      const db = await getDb();
      const savedColumns = await db
        .collection(MONGO_COLLECTIONS.LEAD_COLUMNS)
        .find({})
        .sort({ order: 1 })
        .toArray();
      if (savedColumns.length) columns = savedColumns as unknown as LeadColumn[];
    }
    const parseResult = await parseUploadedLeadFile(buffer, file.name, file.type, columns);
    if (!parseResult.leads.length) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.warnings.join('; ') || 'No leads were recognized. Use the generated PDF schema prompt and try again.',
        },
        { status: 422 }
      );
    }
    if (parseResult.leads.length > MAX_LEADS_PER_IMPORT) {
      return NextResponse.json(
        { success: false, error: `The file contains ${parseResult.leads.length} leads; the maximum per import is ${MAX_LEADS_PER_IMPORT}` },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      stage: 'preview',
      message: `Found ${parseResult.leads.length} leads in ${file.name}. Nothing has been added yet.`,
      count: parseResult.leads.length,
      leads: parseResult.leads,
      detectedType: parseResult.detectedType,
      warnings: parseResult.warnings,
    });
  } catch (error) {
    console.error('Lead import error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to process the lead import.' },
      { status: 500 }
    );
  }
}
