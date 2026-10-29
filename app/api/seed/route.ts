// FILE PATH: app/api/seed/route.ts
// TECHNOVA STUDIO // MONGODB DATABASE SEEDING ENDPOINT

import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import {
  SEED_MEMBERS,
  SEED_PROJECTS,
  SEED_INQUIRIES,
  SEED_ANNOUNCEMENTS,
  SEED_SHEETS,
  SEED_CMS,
  DEFAULT_ROLE_PERMISSIONS,
  SEED_JOIN_REQUESTS,
} from '@/lib/store';

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: 'MONGODB_URI is not configured in .env.local',
        instruction: 'Add MONGODB_URI=mongodb+srv://... to your .env.local file first.',
      },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();

    // 1. Members
    const membersCol = db.collection(MONGO_COLLECTIONS.MEMBERS);
    for (const member of SEED_MEMBERS) {
      await membersCol.replaceOne({ id: member.id }, member, { upsert: true });
    }

    // 2. Projects
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);
    for (const project of SEED_PROJECTS) {
      await projectsCol.replaceOne({ id: project.id }, project, { upsert: true });
    }

    // 3. Inquiries
    const inquiriesCol = db.collection(MONGO_COLLECTIONS.INQUIRIES);
    for (const inquiry of SEED_INQUIRIES) {
      await inquiriesCol.replaceOne({ id: inquiry.id }, inquiry, { upsert: true });
    }

    // 4. Announcements
    const annCol = db.collection(MONGO_COLLECTIONS.ANNOUNCEMENTS);
    for (const ann of SEED_ANNOUNCEMENTS) {
      await annCol.replaceOne({ id: ann.id }, ann, { upsert: true });
    }

    // 5. Custom Sheets
    const sheetsCol = db.collection(MONGO_COLLECTIONS.SHEETS);
    for (const sheet of SEED_SHEETS) {
      await sheetsCol.replaceOne({ id: sheet.id }, sheet, { upsert: true });
    }

    // 6. CMS Configuration
    const cmsCol = db.collection(MONGO_COLLECTIONS.CMS);
    await cmsCol.replaceOne(
      { id: 'technova_main_cms' },
      { id: 'technova_main_cms', ...SEED_CMS, updatedAt: new Date().toISOString() },
      { upsert: true }
    );

    // 7. Role Permissions
    const rbacCol = db.collection(MONGO_COLLECTIONS.RBAC);
    for (const rbac of DEFAULT_ROLE_PERMISSIONS) {
      await rbacCol.replaceOne({ roleId: rbac.roleId }, rbac, { upsert: true });
    }

    // 8. Join Requests
    const joinCol = db.collection(MONGO_COLLECTIONS.JOIN_REQUESTS);
    for (const jr of SEED_JOIN_REQUESTS) {
      await joinCol.replaceOne({ id: jr.id }, jr, { upsert: true });
    }

    // Create Indexes for high performance
    await membersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await projectsCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    await inquiriesCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Technova Studio MongoDB database successfully seeded with initial collections and indexes!',
      collections: [
        { name: MONGO_COLLECTIONS.MEMBERS, count: SEED_MEMBERS.length },
        { name: MONGO_COLLECTIONS.PROJECTS, count: SEED_PROJECTS.length },
        { name: MONGO_COLLECTIONS.INQUIRIES, count: SEED_INQUIRIES.length },
        { name: MONGO_COLLECTIONS.ANNOUNCEMENTS, count: SEED_ANNOUNCEMENTS.length },
        { name: MONGO_COLLECTIONS.SHEETS, count: SEED_SHEETS.length },
        { name: MONGO_COLLECTIONS.CMS, count: 1 },
        { name: MONGO_COLLECTIONS.RBAC, count: DEFAULT_ROLE_PERMISSIONS.length },
        { name: MONGO_COLLECTIONS.JOIN_REQUESTS, count: SEED_JOIN_REQUESTS.length },
      ],
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
