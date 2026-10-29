// FILE PATH: app/api/cms/audit/route.ts
// TECHNOVA STUDIO // CMS AUDIT LOG RETRIEVAL

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, logs: [], data: [], fallback: true });
    }

    const db = await getDb();
    const logs = await db
      .collection(MONGO_COLLECTIONS.CMS_AUDIT_LOG)
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, logs, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

