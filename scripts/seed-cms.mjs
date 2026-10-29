// FILE PATH: scripts/seed-cms.mjs
// TECHNOVA STUDIO // PRE-FILL MONGODB COLLECTIONS WITH 15 CMS SECTIONS

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://sachinbishoi:hn%40hYNQX%40Em9AcT@technovastudio.f6ejzkq.mongodb.net/?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB || 'technova_studio';

console.log('🚀 [CMS SEED] Initializing MongoDB CMS Seeding Pipeline...');
console.log(`📡 Target Cluster: ${uri.split('@')[1]?.split('?')[0] || 'localhost'}`);
console.log(`📦 Database: ${dbName}`);

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB.');

    const db = client.db(dbName);
    const sectionsCol = db.collection('cms_sections');
    const versionsCol = db.collection('cms_versions');
    const auditCol = db.collection('cms_audit_log');
    const bridgeCol = db.collection('featured_projects');

    console.log('📝 Seeding 15 CMS sections...');
    const SECTION_KEYS = [
      'hero',
      'trust_strip',
      'featured_work',
      'services',
      'process',
      'stats',
      'testimonials',
      'about',
      'architect',
      'contact',
      'forms',
      'footer',
      'seo',
      'theme_default',
      'ai_agent',
    ];

    for (const key of SECTION_KEYS) {
      await sectionsCol.updateOne(
        { sectionKey: key },
        {
          $setOnInsert: {
            id: key,
            sectionKey: key,
            status: 'PUBLISHED',
            lastEditedBy: 'system-seed',
            lastEditedAt: new Date().toISOString(),
            publishedBy: 'system-seed',
            publishedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    }
    console.log('✅ 15 CMS sections initialized in `cms_sections`.');

    // Baseline audit log
    await auditCol.updateOne(
      { id: 'audit-baseline-init' },
      {
        $setOnInsert: {
          id: 'audit-baseline-init',
          timestamp: new Date().toISOString(),
          action: 'publish',
          sectionKey: 'all',
          authorId: 'system-seed',
          authorName: 'System Baseline',
          summary: 'CMS initial collections baseline migration',
        },
      },
      { upsert: true }
    );
    console.log('✅ Baseline audit trail initialized in `cms_audit_log`.');

    // Baseline version snapshot
    await versionsCol.updateOne(
      { id: 'ver-baseline-hero' },
      {
        $setOnInsert: {
          id: 'ver-baseline-hero',
          sectionKey: 'hero',
          versionNumber: 1,
          authorId: 'system-seed',
          authorName: 'System Baseline',
          timestamp: new Date().toISOString(),
          summary: 'Baseline v1 hero snapshot',
        },
      },
      { upsert: true }
    );
    console.log('✅ Baseline version history initialized in `cms_versions`.');

    // Seed bridge mapping for completed project prj-003
    await bridgeCol.updateOne(
      { projectId: 'prj-003' },
      {
        $set: {
          projectId: 'prj-003',
          isFeatured: true,
          publicVisibility: true,
          order: 1,
          publicOverrides: {
            title: 'KRYPTON DEFENSE AI — SPATIAL COMMAND INTERFACE',
            category: 'ZERO-KNOWLEDGE AUTH / SPATIAL UI',
            result: '0.02s execution // 99.999% uptime // 0 security vulnerabilities',
            allowIframe: true,
          },
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
    console.log('✅ Completed projects bridge seeded in `featured_projects`.');

    console.log('🎉 [CMS SEED] Finished successfully.');
  } catch (err) {
    console.error('❌ [CMS SEED] Failed:', err);
  } finally {
    await client.close();
  }
}

seed();
