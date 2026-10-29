// FILE PATH: app/api/leads/webhook/route.ts
// TECHNOVA STUDIO // WEBHOOK INGESTION ENGINE FOR AD INTEGRATIONS & EXTERNAL LEADS

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { StudioLead, LeadSource } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.LEADS_WEBHOOK_SECRET;
    if (process.env.NODE_ENV === 'production' && !webhookSecret) {
      return NextResponse.json({ success: false, error: 'Webhook integration is not configured' }, { status: 503 });
    }
    if (webhookSecret) {
      const providedSecret = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
      const expected = Buffer.from(webhookSecret);
      const provided = Buffer.from(providedSecret);
      if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }
    if (!isMongoConfigured()) {
      return NextResponse.json({ success: false, error: 'Webhook storage is not configured' }, { status: 503 });
    }

    const rawBody = await request.json().catch(() => ({}));

    // Normalize incoming payload across various webhook standards (Zapier, Meta, Google, Webhook)
    const name =
      rawBody.name ||
      rawBody.fullName ||
      rawBody.full_name ||
      (rawBody.first_name ? `${rawBody.first_name} ${rawBody.last_name || ''}`.trim() : '') ||
      'Anonymous Ad Inbound';

    const email = rawBody.email || rawBody.email_address || rawBody.work_email || '';
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Webhook rejected: valid email address is required' },
        { status: 400 }
      );
    }

    const phone = rawBody.phone || rawBody.phone_number || rawBody.mobile || '';
    const company = rawBody.company || rawBody.organization || rawBody.business_name || 'Inbound Enterprise';

    // Parse value / budget
    let value = 0;
    if (typeof rawBody.value === 'number') {
      value = rawBody.value;
    } else if (rawBody.budget || rawBody.deal_size) {
      const parsed = parseInt(String(rawBody.budget || rawBody.deal_size).replace(/[^0-9]/g, ''));
      if (!isNaN(parsed)) value = parsed;
    }

    // Determine Source
    let source: LeadSource = 'WEBHOOK';
    const rawSource = String(rawBody.source || rawBody.utm_source || rawBody.platform || '').toUpperCase();
    if (rawSource.includes('META') || rawSource.includes('FACEBOOK') || rawSource.includes('INSTAGRAM')) {
      source = 'META_ADS';
    } else if (rawSource.includes('GOOGLE') || rawSource.includes('ADWORDS')) {
      source = 'GOOGLE_ADS';
    } else if (rawSource.includes('REFERRAL')) {
      source = 'REFERRAL';
    } else if (rawSource.includes('OUTREACH')) {
      source = 'OUTREACH';
    }

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // Preserve any extra custom payload keys in customFields
    const standardKeys = new Set([
      'name', 'fullName', 'full_name', 'first_name', 'last_name',
      'email', 'email_address', 'work_email',
      'phone', 'phone_number', 'mobile',
      'company', 'organization', 'business_name',
      'value', 'budget', 'deal_size',
      'source', 'utm_source', 'platform',
      'notes', 'message',
    ]);

    const customFields: Record<string, any> = {};
    Object.keys(rawBody).forEach((k) => {
      if (!standardKeys.has(k)) {
        customFields[k] = rawBody[k];
      }
    });

    const leadRecord: StudioLead = {
      id: leadId,
      name,
      email,
      phone,
      company,
      value,
      status: 'NEW',
      source,
      sourceDetails: rawBody.campaign || rawBody.ad_name || rawBody.utm_campaign || 'Automated Webhook Relay',
      notes: rawBody.notes || rawBody.message || 'Auto-ingested via Technova External Webhook Gateway.',
      customFields,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    await db.collection(MONGO_COLLECTIONS.LEADS).insertOne(leadRecord as any);

    return NextResponse.json({
      success: true,
      leadId,
      status: 'ACCEPTED',
      source,
      timestamp: now,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Simple healthcheck / webhook test responder
export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    endpoint: '/api/leads/webhook',
    protocol: 'REST / JSON',
    supportedSources: ['META_ADS', 'GOOGLE_ADS', 'WEBHOOK', 'MANUAL'],
    timestamp: new Date().toISOString(),
  });
}
