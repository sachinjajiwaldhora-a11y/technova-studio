// FILE PATH: app/api/health/route.ts
// TECHNOVA STUDIO // DATABASE HEALTH & CONNECTION STATUS CHECK

import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured } from '@/lib/mongodb';

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        status: 'warning',
        database: 'unconfigured',
        message: 'MONGODB_URI is not set or still contains placeholders (<username>/<password>) in .env.',
      },
      { status: 200 }
    );
  }

  try {
    const startTime = Date.now();
    const db = await getDb();
    const pingResult = await db.command({ ping: 1 });
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'online',
      database: 'mongodb',
      connected: true,
      targetDatabase: db.databaseName,
      latency: `${latencyMs}ms`,
      pingResult,
      message: 'MongoDB connected successfully. Terminal log has been emitted.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
