// FILE PATH: scripts/seed-mongodb.mjs
// TECHNOVA STUDIO // STANDALONE MONGODB SEED SCRIPT
// Run with: node scripts/seed-mongodb.mjs

import { MongoClient } from 'mongodb';
import { randomBytes, scryptSync } from 'node:crypto';
import fs from 'fs';
import path from 'path';

function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  return `scrypt-v1$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

// Parse .env.local and .env manually if dotenv is not installed
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx > -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'technova_studio';

if (!uri) {
  console.error('\x1b[31m[ERROR]\x1b[0m MONGODB_URI is not set in environment or .env.local');
  console.log('\nPlease add your MongoDB connection string to .env.local:');
  console.log('MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority\n');
  process.exit(1);
}

const client = new MongoClient(uri);

async function runSeed() {
  try {
    console.log('\x1b[36m[CONNECTING]\x1b[0m Connecting to MongoDB...');
    await client.connect();
    console.log('\x1b[32m[CONNECTED]\x1b[0m Database target:', dbName);

    const db = client.db(dbName);

    // Initial Seeds
    const SEED_MEMBERS = [
      {
        id: 'usr-01',
        name: 'Sachin (Admin)',
        email: 'sachinjajiwaldhora@gmail.com',
        password: 'NOVA-SACHIN-2025',
        role: 'admin',
        department: 'Management',
        skills: ['Executive Command', 'WebGL', 'Architecture', 'Strategy', 'Next.js'],
        clearanceCode: 'LVL-09-OMEGA',
        photoInitials: 'SJ',
        accentColor: '#dc2626',
        privateNotes: 'Main Studio Admin & Executive Lead.',
        managerNotes: '',
        activeProjectIds: ['prj-001', 'prj-003'],
        metrics: { tasksCompleted: 48, tasksOverdue: 0, avgCompletionDays: 2.2, hoursLoggedTotal: 410, deliveryRatePct: 98 },
        createdAt: '2025-01-01',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'usr-01b',
        name: 'Anuj (Admin)',
        email: 'anujb2296@gmail.com',
        password: 'NOVA-ANUJ-2025',
        role: 'admin',
        department: 'Management',
        skills: ['Operations', 'System Architecture', 'High-End Tech', 'Team Strategy'],
        clearanceCode: 'LVL-09-OMEGA',
        photoInitials: 'AB',
        accentColor: '#ef4444',
        privateNotes: 'Studio Co-Admin & Operations Director.',
        managerNotes: '',
        activeProjectIds: ['prj-001', 'prj-002'],
        metrics: { tasksCompleted: 42, tasksOverdue: 0, avgCompletionDays: 2.5, hoursLoggedTotal: 385, deliveryRatePct: 97 },
        createdAt: '2025-01-01',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'usr-02',
        name: 'Riya Sharma',
        email: 'manager@technovastudio.dev',
        password: 'NOVA-MGR-KEY',
        role: 'manager',
        department: 'Fullstack Engineering',
        skills: ['React', 'Three.js', 'Node.js', 'System Design', 'Rust WASM'],
        clearanceCode: 'LVL-07-SIGMA',
        photoInitials: 'RS',
        accentColor: '#7c3aed',
        privateNotes: '',
        managerNotes: '',
        activeProjectIds: ['prj-001', 'prj-002'],
        metrics: { tasksCompleted: 28, tasksOverdue: 1, avgCompletionDays: 3.2, hoursLoggedTotal: 284, deliveryRatePct: 97 },
        createdAt: '2025-01-15',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'usr-03',
        name: 'Dev Malhotra',
        email: 'core@technovastudio.dev',
        password: 'NOVA-CORE-KEY',
        role: 'working_member',
        department: 'WebGL & Graphics',
        skills: ['GLSL', 'WebGL', 'Three.js', 'Shader Writing', 'Canvas API'],
        clearanceCode: 'LVL-05-ALPHA',
        photoInitials: 'DM',
        accentColor: '#0891b2',
        privateNotes: 'Working on Q1 shader optimization. Need to check render pipeline for mobile.',
        managerNotes: '',
        activeProjectIds: ['prj-001'],
        metrics: { tasksCompleted: 19, tasksOverdue: 0, avgCompletionDays: 2.1, hoursLoggedTotal: 198, deliveryRatePct: 100 },
        createdAt: '2025-02-01',
        lastActive: new Date().toISOString(),
      },
      {
        id: 'usr-04',
        name: 'Priya Nair',
        email: 'recruit@technovastudio.dev',
        password: 'NOVA-INIT-KEY',
        role: 'member',
        department: 'Growth & Sales',
        skills: ['Lead Generation', 'Cold Outreach', 'Market Research', 'CRM'],
        clearanceCode: 'LVL-01-RESTRICTED',
        photoInitials: 'PN',
        accentColor: '#059669',
        privateNotes: '',
        managerNotes: '',
        activeProjectIds: ['prj-002'],
        metrics: { tasksCompleted: 6, tasksOverdue: 1, avgCompletionDays: 4.0, hoursLoggedTotal: 52, deliveryRatePct: 86 },
        createdAt: '2025-02-18',
        lastActive: new Date().toISOString(),
      },
    ];

    const SEED_PROJECTS = [
      {
        id: 'prj-001',
        title: 'Aetherius Quantum — WebGL Telemetry Engine',
        description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport.',
        source: 'CLIENT_INQUIRY',
        type: 'DEV_BUILD',
        status: 'ACTIVE',
        priority: 'CRITICAL',
        trackingCode: 'NV-INQ-1042',
        assignedMemberIds: ['usr-02', 'usr-03'],
        managerId: 'usr-02',
        createdBy: 'usr-01',
        startDate: '2025-02-15',
        dueDate: '2025-04-30',
        estimatedHours: 320,
        actualHours: 148,
        tags: ['WebGL', 'GLSL', 'Client', 'High-Priority'],
        liveUrl: 'https://aetherius-staging.vercel.app',
        createdAt: '2025-02-14T09:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prj-002',
        title: 'Q2 Lead Generation — FinTech & Defense AI Verticals',
        description: 'Systematic outreach campaign targeting 200+ FinTech startups and Defense AI companies in US & EU markets.',
        source: 'INTERNAL_TEAM',
        type: 'LEAD_GEN',
        status: 'ACTIVE',
        priority: 'HIGH',
        assignedMemberIds: ['usr-04'],
        managerId: 'usr-02',
        createdBy: 'usr-02',
        startDate: '2025-03-01',
        dueDate: '2025-04-15',
        estimatedHours: 80,
        actualHours: 22,
        tags: ['Lead Gen', 'Sales', 'Internal', 'FinTech'],
        createdAt: '2025-03-01T08:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prj-003',
        title: 'Krypton Defense AI — Spatial Command Interface',
        description: 'Real-Time Spatial Command Interface for defense analytics. Institutional-grade UI with zero-knowledge auth.',
        source: 'CLIENT_INQUIRY',
        type: 'CLIENT_COMMISSION',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignedMemberIds: ['usr-01', 'usr-02'],
        managerId: 'usr-01',
        createdBy: 'usr-01',
        startDate: '2025-01-05',
        dueDate: '2025-03-01',
        estimatedHours: 500,
        actualHours: 487,
        tags: ['Defense', 'AI', 'Client', 'Completed'],
        liveUrl: 'https://krypton-defense.io',
        createdAt: '2025-01-04T09:00:00Z',
        updatedAt: '2025-03-01T17:00:00Z',
      },
    ];

    const SEED_INQUIRIES = [
      {
        id: 'inq-001',
        trackingCode: 'NV-INQ-1042',
        clientName: 'Siddharth Mehra',
        company: 'NovaPulse Analytics',
        email: 'sid@novapulse.io',
        phone: '+91 98100 45567',
        scope: 'AI-driven real-time data visualization dashboard with WebGL animations',
        budget: '$35,000',
        expectedRevenue: 35000,
        leadSource: 'WEBSITE_HUD',
        preferredCallDate: '2025-04-05',
        status: 'NEW_INQUIRY',
        assignedSalesId: 'usr-04',
        dealNotes: 'Founder reached via booking form. Mentioned urgency — Q2 board demo.',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        followUpDate: '2025-04-02',
      },
      {
        id: 'inq-002',
        trackingCode: 'NV-CALL-2098',
        clientName: 'Natasha Voronova',
        company: 'Vertex Capital Partners',
        email: 'n.voronova@vertexcap.com',
        phone: '+44 7700 900456',
        scope: 'Full brand identity redesign + interactive investor portal',
        budget: '$60,000',
        expectedRevenue: 60000,
        leadSource: 'REFERRAL',
        preferredCallDate: '2025-04-08',
        status: 'CALL_SCHEDULED',
        assignedSalesId: 'usr-02',
        dealNotes: 'Referred by Elena Rostova (Krypton client). High intent. Call confirmed April 8.',
        submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        followUpDate: '2025-04-08',
      },
    ];

    console.log('\x1b[33m[SEEDING]\x1b[0m Upserting initial records into MongoDB...');

    const membersCol = db.collection('studio_members');
    for (const m of SEED_MEMBERS) {
      const { password, ...safeMember } = m;
      await membersCol.updateOne(
        { id: m.id },
        { $setOnInsert: { ...safeMember, passwordHash: hashPassword(password) } },
        { upsert: true }
      );
    }
    await membersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_MEMBERS.length} studio_members`);

    const projectsCol = db.collection('studio_projects');
    for (const p of SEED_PROJECTS) {
      await projectsCol.updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
    }
    await projectsCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_PROJECTS.length} studio_projects`);

    const inqCol = db.collection('studio_inquiries');
    for (const inq of SEED_INQUIRIES) {
      await inqCol.updateOne({ id: inq.id }, { $setOnInsert: inq }, { upsert: true });
    }
    await inqCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_INQUIRIES.length} studio_inquiries`);

    // 4. Dedicated Leads Pipeline
    const SEED_LEADS = [
      {
        id: 'lead-101',
        name: 'Marcus Vance',
        email: 'm.vance@vanguard-robotics.io',
        phone: '+1 (555) 234-8901',
        company: 'Vanguard Robotics',
        value: 65000,
        status: 'INTERESTED',
        source: 'WEBSITE',
        sourceDetails: 'Hero CTA // 3D Interactive Showcase',
        assignedMemberId: 'usr-01',
        assignedMemberName: 'Sachin (Admin)',
        notes: 'Requires 120 FPS WebGL spatial digital twin for enterprise robotics line.',
        createdAt: '2026-10-15T09:30:00Z',
        updatedAt: '2026-10-20T14:15:00Z',
      },
      {
        id: 'lead-102',
        name: 'Elena Rostova',
        email: 'elena@solaris-defense.com',
        phone: '+1 (555) 987-6543',
        company: 'Solaris Defense Labs',
        value: 120000,
        status: 'DEAL_WON',
        source: 'WEBHOOK',
        sourceDetails: 'Webhook // Enterprise Inbound Integration',
        assignedMemberId: 'usr-01b',
        assignedMemberName: 'Anuj (Admin)',
        customerId: 'CUST-2026-001',
        convertedProjectId: 'prj-001',
        convertedAt: '2026-10-24T11:00:00Z',
        notes: 'Signed deal for orbital command console UI. Converted to live project.',
        createdAt: '2026-10-18T16:45:00Z',
        updatedAt: '2026-10-24T11:00:00Z',
      },
      {
        id: 'lead-103',
        name: 'Tariq Al-Mansoor',
        email: 'tariq@hyperion-ventures.ae',
        phone: '+971 50 123 4567',
        company: 'Hyperion Ventures',
        value: 45000,
        status: 'CONTACTED',
        source: 'META_ADS',
        sourceDetails: 'Campaign: AI Systems & Design Q4',
        assignedMemberId: 'usr-02',
        assignedMemberName: 'Dev Sharma',
        notes: 'Pitch deck sent. Technical follow-up scheduled.',
        createdAt: '2026-10-22T08:10:00Z',
        updatedAt: '2026-10-25T10:00:00Z',
      },
      {
        id: 'lead-104',
        name: 'Sarah Chen',
        email: 'sarah.c@quantumbit.capital',
        phone: '+1 (555) 345-6789',
        company: 'QuantumBit Capital',
        value: 85000,
        status: 'NEW',
        source: 'WEBHOOK',
        sourceDetails: 'Partner API Webhook Relay',
        assignedMemberId: 'usr-01',
        assignedMemberName: 'Sachin (Admin)',
        notes: 'High-frequency algorithmic trading analytics dashboard scoping.',
        createdAt: '2026-10-28T12:00:00Z',
        updatedAt: '2026-10-28T12:00:00Z',
      },
    ];

    const leadsCol = db.collection('studio_leads');
    for (const lead of SEED_LEADS) {
      await leadsCol.updateOne({ id: lead.id }, { $setOnInsert: lead }, { upsert: true });
    }
    await leadsCol.createIndex({ email: 1 }).catch(() => {});
    await leadsCol.createIndex({ status: 1 }).catch(() => {});
    console.log(`✓ Seeded ${SEED_LEADS.length} studio_leads`);

    // 5. Studio Customers
    const SEED_CUSTOMERS = [
      {
        id: 'CUST-2026-001',
        name: 'Elena Rostova',
        email: 'elena@solaris-defense.com',
        phone: '+1 (555) 987-6543',
        company: 'Solaris Defense Labs',
        firstLeadId: 'lead-102',
        projectIds: ['prj-001'],
        totalLifetimeValue: 120000,
        status: 'ACTIVE_CLIENT',
        createdAt: '2026-10-24T11:00:00Z',
        updatedAt: '2026-10-24T11:00:00Z',
      },
    ];

    const custCol = db.collection('studio_customers');
    for (const cust of SEED_CUSTOMERS) {
      await custCol.updateOne({ id: cust.id }, { $setOnInsert: cust }, { upsert: true });
    }
    await custCol.createIndex({ id: 1 }, { unique: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_CUSTOMERS.length} studio_customers`);

    // 6. Studio Velocity Targets
    const DEFAULT_TARGETS = [
      {
        id: 'tgt-revenue',
        title: 'Monthly Revenue Pipeline',
        metric: 'REVENUE',
        targetValue: 250000,
        period: 'MONTHLY',
        unit: '$',
        color: 'from-emerald-500 to-cyan-500',
      },
      {
        id: 'tgt-deals',
        title: 'Deals Won (Monthly)',
        metric: 'DEALS_WON',
        targetValue: 8,
        period: 'MONTHLY',
        unit: '#',
        color: 'from-violet-500 to-pink-500',
      },
      {
        id: 'tgt-leads',
        title: 'Leads Contacted',
        metric: 'LEADS_CONTACTED',
        targetValue: 25,
        period: 'MONTHLY',
        unit: '#',
        color: 'from-cyan-500 to-blue-500',
      },
      {
        id: 'tgt-projects',
        title: 'Flagship Deliveries',
        metric: 'PROJECTS_DELIVERED',
        targetValue: 6,
        period: 'QUARTERLY',
        unit: '#',
        color: 'from-amber-500 to-orange-500',
      },
    ];

    const targetsCol = db.collection('studio_targets');
    for (const target of DEFAULT_TARGETS) {
      await targetsCol.updateOne({ id: target.id }, { $setOnInsert: target }, { upsert: true });
    }
    console.log(`✓ Seeded ${DEFAULT_TARGETS.length} studio_targets`);

    // 7. Lead Columns Schema
    const DEFAULT_LEAD_COLUMNS = [
      { id: 'name', label: 'Lead Contact', type: 'text', isSystem: true, visible: true, order: 1, width: '180px' },
      { id: 'company', label: 'Company / Org', type: 'text', isSystem: true, visible: true, order: 2, width: '160px' },
      { id: 'status', label: 'Stage Status', type: 'select', options: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'INTERESTED', 'DEAL_WON', 'LOST'], isSystem: true, visible: true, order: 3, width: '140px' },
      { id: 'source', label: 'Lead Source', type: 'select', options: ['WEBSITE', 'MANUAL', 'WEBHOOK', 'META_ADS', 'GOOGLE_ADS', 'REFERRAL', 'OUTREACH'], isSystem: true, visible: true, order: 4, width: '130px' },
      { id: 'value', label: 'Deal Value ($)', type: 'currency', isSystem: true, visible: true, order: 5, width: '130px' },
      { id: 'assignedMemberName', label: 'Assigned Specialist', type: 'text', isSystem: true, visible: true, order: 6, width: '160px' },
      { id: 'email', label: 'Contact Email', type: 'email', isSystem: true, visible: true, order: 7, width: '190px' },
      { id: 'phone', label: 'Phone Number', type: 'phone', isSystem: true, visible: true, order: 8, width: '140px' },
      { id: 'customerId', label: 'Customer ID', type: 'text', isSystem: true, visible: true, order: 9, width: '140px' },
      { id: 'notes', label: 'Notes & Telemetry', type: 'text', isSystem: true, visible: true, order: 10, width: '220px' },
    ];

    const leadColsCol = db.collection('studio_lead_columns');
    for (const col of DEFAULT_LEAD_COLUMNS) {
      await leadColsCol.updateOne({ id: col.id }, { $setOnInsert: col }, { upsert: true });
    }
    console.log(`✓ Seeded ${DEFAULT_LEAD_COLUMNS.length} studio_lead_columns`);

    console.log('\n\x1b[32m[SUCCESS]\x1b[0m MongoDB successfully connected and seeded!');
  } catch (err) {
    console.error('\x1b[31m[FAILED]\x1b[0m Seeding error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runSeed();
