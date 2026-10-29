// FILE PATH: app/api/targets/route.ts
// TECHNOVA STUDIO // DYNAMIC TARGET TRACKING & LIVE SYNC API

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { StudioTarget, DEFAULT_TARGETS } from '@/lib/store';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        targets: DEFAULT_TARGETS,
        fallback: true,
      });
    }

    const db = await getDb();
    const targetsCol = db.collection(MONGO_COLLECTIONS.TARGETS);
    const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);
    const inquiriesCol = db.collection(MONGO_COLLECTIONS.INQUIRIES);

    let targets = (await targetsCol.find({}).toArray()) as unknown as StudioTarget[];
    if (targets.length === 0) {
      targets = DEFAULT_TARGETS;
    }

    // 1. Live system data calculation
    const [leads, projects, inquiries] = await Promise.all([
      leadsCol.find({}).toArray(),
      projectsCol.find({}).toArray(),
      inquiriesCol.find({}).toArray(),
    ]);

    // Live Metrics:
    // Revenue: won leads value + locked deals inquiry revenue
    const wonLeadsRev = leads
      .filter((l: any) => l.status === 'DEAL_WON')
      .reduce((sum: number, l: any) => sum + (l.value || 0), 0);
    const inqRev = inquiries
      .filter((i: any) => i.status === 'LOCKED_DEAL')
      .reduce((sum: number, i: any) => sum + (i.expectedRevenue || 0), 0);
    const liveRevenue = wonLeadsRev + inqRev;

    // Deals Won:
    const wonCount =
      leads.filter((l: any) => l.status === 'DEAL_WON').length +
      inquiries.filter((i: any) => i.status === 'LOCKED_DEAL').length;

    // Leads Contacted:
    const contactedCount = leads.filter(
      (l: any) => l.status === 'CONTACTED' || l.status === 'FOLLOW_UP' || l.status === 'INTERESTED' || l.status === 'DEAL_WON'
    ).length;

    // Projects Delivered:
    const deliveredCount = projects.filter((p: any) => p.status === 'COMPLETED').length;

    // Enrich targets with current live values
    const enrichedTargets = targets.map((t) => {
      let current = t.currentValue || 0;
      if (t.metric === 'REVENUE') current = liveRevenue;
      else if (t.metric === 'DEALS_WON') current = wonCount;
      else if (t.metric === 'LEADS_CONTACTED') current = contactedCount;
      else if (t.metric === 'PROJECTS_DELIVERED') current = deliveredCount;

      return {
        ...t,
        currentValue: current,
      };
    });

    return NextResponse.json({
      success: true,
      targets: enrichedTargets,
      liveTelemetry: {
        liveRevenue,
        wonCount,
        contactedCount,
        deliveredCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }

    const body = await request.json();
    const { targets } = body;

    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ success: false, error: 'Targets array is required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, targets, fallback: true });
    }

    const db = await getDb();
    const targetsCol = db.collection(MONGO_COLLECTIONS.TARGETS);

    await targetsCol.deleteMany({});
    await targetsCol.insertMany(targets as any);

    return NextResponse.json({ success: true, targets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
