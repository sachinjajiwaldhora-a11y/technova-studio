// FILE PATH: lib/mongodb.ts
// TECHNOVA STUDIO // MONGODB CLIENT CONNECTION & POOLING

import { MongoClient, Db } from 'mongodb';

const DEFAULT_MONGO_URI = 'mongodb+srv://sachinbishoi:hn%40hYNQX%40Em9AcT@technovastudio.f6ejzkq.mongodb.net/?retryWrites=true&w=majority';
const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
const dbName = process.env.MONGODB_DB || 'technova_studio';

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

// Track if we already logged to avoid duplicate logs during Next.js hot-reloads
let hasLoggedSuccess = false;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoLoggedSuccess: boolean | undefined;
}

if (global._mongoLoggedSuccess) {
  hasLoggedSuccess = true;
}

function initConnection(mongoUri: string): Promise<MongoClient> {
  const mongoClient = new MongoClient(mongoUri);

  return mongoClient
    .connect()
    .then(async (c) => {
      // Verify connection with a quick ping
      try {
        await c.db(dbName).command({ ping: 1 });
      } catch (pingErr) {
        // Fallback: ping warning if any
      }

      if (!hasLoggedSuccess && !global._mongoLoggedSuccess) {
        hasLoggedSuccess = true;
        global._mongoLoggedSuccess = true;

        console.log('\n\x1b[1;32m======================================================================\x1b[0m');
        console.log('\x1b[1;32m 🍃 [MONGODB] CONNECTED SUCCESSFULLY // TECHNOVA CLOUD DATABASE ACTIVE\x1b[0m');
        console.log(`\x1b[36m    Target Database :\x1b[0m \x1b[1m${dbName}\x1b[0m`);
        console.log(`\x1b[36m    Status          :\x1b[0m \x1b[32mREADY & ACCEPTING QUERIES\x1b[0m`);
        console.log('\x1b[1;32m======================================================================\x1b[0m\n');
      }
      return c;
    })
    .catch((err) => {
      console.error('\n\x1b[1;31m======================================================================\x1b[0m');
      console.error('\x1b[1;31m ❌ [MONGODB] CONNECTION FAILED // VERIFY CREDENTIALS IN .env\x1b[0m');
      console.error(`\x1b[33m    Error Details   :\x1b[0m ${err.message}`);
      console.error('\x1b[1;31m======================================================================\x1b[0m\n');
      throw err;
    });
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the connection
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = initConnection(uri);
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, avoid using a global variable.
    clientPromise = initConnection(uri);
  }
}

/**
 * Returns the cached MongoClient promise, or null if MONGODB_URI is not set.
 */
export function getMongoClientPromise(): Promise<MongoClient> | null {
  // Re-check URI in case it was loaded or updated at runtime
  const currentUri = process.env.MONGODB_URI || uri;
  if (!clientPromise && currentUri) {
    clientPromise = initConnection(currentUri);
  }
  return clientPromise;
}

/**
 * Helper to get the MongoDB database instance.
 * Throws a descriptive error if MONGODB_URI is not configured.
 */
export async function getDb(): Promise<Db> {
  const currentUri = process.env.MONGODB_URI || uri;
  if (!clientPromise) {
    if (currentUri) {
      clientPromise = initConnection(currentUri);
    } else {
      console.warn('\n\x1b[33m⚠️  [MONGODB] MONGODB_URI is not set in .env. Falling back to local storage.\x1b[0m\n');
      throw new Error(
        'MONGODB_URI is not defined in environment variables. Please add MONGODB_URI to .env'
      );
    }
  }

  const connectedClient = await clientPromise;
  return connectedClient.db(process.env.MONGODB_DB || dbName);
}

/**
 * Check if MongoDB URI is configured
 */
export function isMongoConfigured(): boolean {
  const currentUri = process.env.MONGODB_URI || uri;
  return Boolean(currentUri && currentUri.trim().length > 0 && !currentUri.includes('<username>'));
}

/**
 * MongoDB Collection Names for Technova Studio
 */
export const MONGO_COLLECTIONS = {
  // Existing internal studio collections (Untouched)
  MEMBERS: 'studio_members',
  PROJECTS: 'studio_projects',
  INQUIRIES: 'studio_inquiries',
  ANNOUNCEMENTS: 'studio_announcements',
  SHEETS: 'studio_sheets',
  CMS: 'studio_cms', // Deprecated: preserved for backward-compatibility
  RBAC: 'studio_rbac',
  JOIN_REQUESTS: 'studio_join_requests',

  // NEW ADDITIVE PUBLIC CMS ARCHITECTURE
  CMS_SECTIONS: 'cms_sections',
  CMS_VERSIONS: 'cms_versions',
  CMS_MEDIA: 'cms_media',
  CMS_AUDIT_LOG: 'cms_audit_log',
  FEATURED_PROJECTS: 'featured_projects',

  // LEAD PIPELINE, CUSTOMER ID & TARGET TRACKING
  LEADS: 'studio_leads',
  LEAD_COLUMNS: 'studio_lead_columns',
  CUSTOMERS: 'studio_customers',
  TARGETS: 'studio_targets',
} as const;

export type MongoCollectionKey = keyof typeof MONGO_COLLECTIONS;
