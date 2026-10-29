// FILE PATH: app/api/seed/route.ts
// TECHNOVA STUDIO // MONGODB DATABASE SEEDING ENDPOINT

import { NextRequest, NextResponse } from 'next/server';
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
  SEED_LEADS,
  SEED_CUSTOMERS,
  DEFAULT_TARGETS,
  DEFAULT_LEAD_COLUMNS,
} from '@/lib/store';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  const member = await getAuthenticatedMember(request);
  if (!hasAnyRole(member, ['admin'])) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
  }
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
      const { password, ...safeMember } = member;
      await membersCol.updateOne(
        { id: member.id },
        { $setOnInsert: { ...safeMember, passwordHash: await hashPassword(password) } },
        { upsert: true }
      );
    }

    // 2. Projects
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);
    for (const project of SEED_PROJECTS) {
      await projectsCol.updateOne({ id: project.id }, { $setOnInsert: project }, { upsert: true });
    }

    // 3. Inquiries
    const inquiriesCol = db.collection(MONGO_COLLECTIONS.INQUIRIES);
    for (const inquiry of SEED_INQUIRIES) {
      await inquiriesCol.updateOne({ id: inquiry.id }, { $setOnInsert: inquiry }, { upsert: true });
    }

    // 4. Announcements
    const annCol = db.collection(MONGO_COLLECTIONS.ANNOUNCEMENTS);
    for (const ann of SEED_ANNOUNCEMENTS) {
      await annCol.updateOne({ id: ann.id }, { $setOnInsert: ann }, { upsert: true });
    }

    // 5. Custom Sheets
    const sheetsCol = db.collection(MONGO_COLLECTIONS.SHEETS);
    for (const sheet of SEED_SHEETS) {
      await sheetsCol.updateOne({ id: sheet.id }, { $setOnInsert: sheet }, { upsert: true });
    }

    // 6. CMS Configuration
    const cmsCol = db.collection(MONGO_COLLECTIONS.CMS);
    await cmsCol.updateOne(
      { id: 'technova_main_cms' },
      { $setOnInsert: { id: 'technova_main_cms', ...SEED_CMS, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    // 7. Role Permissions
    const rbacCol = db.collection(MONGO_COLLECTIONS.RBAC);
    for (const rbac of DEFAULT_ROLE_PERMISSIONS) {
      await rbacCol.updateOne({ roleId: rbac.roleId }, { $setOnInsert: rbac }, { upsert: true });
    }

    // 8. Join Requests
    const joinCol = db.collection(MONGO_COLLECTIONS.JOIN_REQUESTS);
    for (const jr of SEED_JOIN_REQUESTS) {
      await joinCol.updateOne({ id: jr.id }, { $setOnInsert: jr }, { upsert: true });
    }

    // 9. Dedicated Leads
    const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);
    for (const lead of SEED_LEADS) {
      await leadsCol.updateOne({ id: lead.id }, { $setOnInsert: lead }, { upsert: true });
    }

    // 10. Studio Customers
    const custCol = db.collection(MONGO_COLLECTIONS.CUSTOMERS);
    for (const cust of SEED_CUSTOMERS) {
      await custCol.updateOne({ id: cust.id }, { $setOnInsert: cust }, { upsert: true });
    }

    // 11. Velocity Targets
    const targetsCol = db.collection(MONGO_COLLECTIONS.TARGETS);
    for (const target of DEFAULT_TARGETS) {
      await targetsCol.updateOne({ id: target.id }, { $setOnInsert: target }, { upsert: true });
    }

    // 12. Lead Columns
    const leadColsCol = db.collection(MONGO_COLLECTIONS.LEAD_COLUMNS);
    for (const col of DEFAULT_LEAD_COLUMNS) {
      await leadColsCol.updateOne({ id: col.id }, { $setOnInsert: col }, { upsert: true });
    }

    // Create Indexes for high performance
    await membersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await projectsCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    await inquiriesCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    await leadsCol.createIndex({ email: 1 }).catch(() => {});
    await leadsCol.createIndex({ status: 1 }).catch(() => {});
    await custCol.createIndex({ id: 1 }, { unique: true }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Technova Studio MongoDB database successfully seeded with initial collections and indexes!',
      collections: [
        { name: MONGO_COLLECTIONS.MEMBERS, count: SEED_MEMBERS.length },
        { name: MONGO_COLLECTIONS.PROJECTS, count: SEED_PROJECTS.length },
        { name: MONGO_COLLECTIONS.INQUIRIES, count: SEED_INQUIRIES.length },
        { name: MONGO_COLLECTIONS.LEADS, count: SEED_LEADS.length },
        { name: MONGO_COLLECTIONS.CUSTOMERS, count: SEED_CUSTOMERS.length },
        { name: MONGO_COLLECTIONS.TARGETS, count: DEFAULT_TARGETS.length },
        { name: MONGO_COLLECTIONS.LEAD_COLUMNS, count: DEFAULT_LEAD_COLUMNS.length },
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
