// FILE PATH: scripts/seed-mongodb.mjs
// TECHNOVA STUDIO // STANDALONE MONGODB SEED SCRIPT
// Run with: node scripts/seed-mongodb.mjs

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

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
      await membersCol.replaceOne({ id: m.id }, m, { upsert: true });
    }
    await membersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_MEMBERS.length} studio_members`);

    const projectsCol = db.collection('studio_projects');
    for (const p of SEED_PROJECTS) {
      await projectsCol.replaceOne({ id: p.id }, p, { upsert: true });
    }
    await projectsCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_PROJECTS.length} studio_projects`);

    const inqCol = db.collection('studio_inquiries');
    for (const inq of SEED_INQUIRIES) {
      await inqCol.replaceOne({ id: inq.id }, inq, { upsert: true });
    }
    await inqCol.createIndex({ trackingCode: 1 }, { sparse: true }).catch(() => {});
    console.log(`✓ Seeded ${SEED_INQUIRIES.length} studio_inquiries`);

    console.log('\n\x1b[32m[SUCCESS]\x1b[0m MongoDB successfully connected and seeded!');
  } catch (err) {
    console.error('\x1b[31m[FAILED]\x1b[0m Seeding error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runSeed();
