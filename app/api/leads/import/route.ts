// FILE PATH: app/api/leads/import/route.ts
// TECHNOVA STUDIO // LEAD FILE UPLOAD & PARSER API (CSV / EXCEL / PDF)

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { StudioLead, LeadColumn, DEFAULT_LEAD_COLUMNS } from '@/lib/store';
import { parseUploadedLeadFile } from '@/lib/lead-parser';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const authorRole = request.headers.get('x-author-role') || 'member';
    const authorId = request.headers.get('x-author-id') || 'usr-system';
    const authorName = request.headers.get('x-author-name') || 'Lead Import Engine';

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided in the upload request' },
        { status: 400 }
      );
    }

    const filename = file.name || 'imported_leads.csv';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'The uploaded file is empty (0 bytes)' },
        { status: 400 }
      );
    }

    // Parse records using the multi-format lead parser
    const parseResult = await parseUploadedLeadFile(buffer, filename, file.type);

    if (!parseResult.leads || parseResult.leads.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            parseResult.warnings.length > 0
              ? parseResult.warnings.join('; ')
              : 'Unable to extract any valid lead records from the file. Ensure the file contains name or email columns.',
        },
        { status: 422 }
      );
    }

    const now = new Date().toISOString();
    const createdLeads: StudioLead[] = [];
    const detectedNewColumns: Record<string, string> = {};

    parseResult.leads.forEach((item, index) => {
      const leadId = `lead-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`;
      const leadRecord: StudioLead = {
        id: leadId,
        name: item.name?.trim() || `Imported Lead #${index + 1}`,
        email: item.email?.trim() || '',
        phone: item.phone?.trim() || '',
        company: item.company?.trim() || '',
        value: typeof item.value === 'number' ? item.value : 0,
        status: item.status || 'NEW',
        source: item.source || 'MANUAL',
        sourceDetails: item.sourceDetails || `Imported from ${filename}`,
        assignedMemberId: item.assignedMemberId || authorId,
        assignedMemberName: item.assignedMemberName || authorName,
        customerId: '',
        convertedProjectId: '',
        notes: item.notes?.trim() || '',
        customFields: item.customFields || {},
        createdAt: now,
        updatedAt: now,
      };

      // Collect any custom fields to ensure columns exist in dynamic schema
      if (item.customFields) {
        Object.keys(item.customFields).forEach((key) => {
          if (!detectedNewColumns[key]) {
            detectedNewColumns[key] = key.replace(/_/g, ' ').toUpperCase();
          }
        });
      }

      createdLeads.push(leadRecord);
    });

    // If MongoDB is connected, persist leads and any new columns directly
    if (isMongoConfigured()) {
      const db = await getDb();
      const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);
      const columnsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);

      // Insert leads batch
      if (createdLeads.length > 0) {
        await leadsCol.insertMany(createdLeads);
      }

      // Check if new custom columns need to be added to dynamic sheet schema
      const existingCols = await columnsCol.find({}).toArray();
      const existingColIds = new Set(
        existingCols.length > 0
          ? existingCols.map((c) => c.id)
          : DEFAULT_LEAD_COLUMNS.map((c) => c.id)
      );

      const newColumnRecords: LeadColumn[] = [];
      let currentOrder = existingCols.length || DEFAULT_LEAD_COLUMNS.length;

      for (const [colId, colLabel] of Object.entries(detectedNewColumns)) {
        if (!existingColIds.has(colId)) {
          currentOrder++;
          newColumnRecords.push({
            id: colId,
            label: colLabel,
            type: 'text',
            isSystem: false,
            visible: true,
            order: currentOrder,
            width: '160px',
          });
        }
      }

      if (newColumnRecords.length > 0) {
        await columnsCol.insertMany(newColumnRecords);
      }

      return NextResponse.json({
        success: true,
        message: `Successfully imported and parsed ${createdLeads.length} leads from ${filename}`,
        count: createdLeads.length,
        leads: createdLeads,
        detectedType: parseResult.detectedType,
        warnings: parseResult.warnings,
        newColumns: newColumnRecords,
      });
    }

    // Fallback response for LocalStorage environments
    return NextResponse.json({
      success: true,
      message: `Parsed ${createdLeads.length} leads from ${filename} (Local Store)`,
      count: createdLeads.length,
      leads: createdLeads,
      detectedType: parseResult.detectedType,
      warnings: parseResult.warnings,
      fallback: true,
    });
  } catch (error: any) {
    console.error('Lead Import Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal server error while parsing lead file',
      },
      { status: 500 }
    );
  }
}
