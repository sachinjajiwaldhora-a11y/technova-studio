// FILE PATH: lib/mongodb-client.ts
// TECHNOVA STUDIO // FRONTEND CLIENT ADAPTER FOR MONGODB API

import { getStore, setStore } from './store';

/**
 * Fetch data from MongoDB via the Next.js API route.
 * Returns null if MongoDB is not reachable or fallback is enabled.
 */
export async function fetchFromMongo<T>(collection: string): Promise<T[] | null> {
  try {
    const res = await fetch(`/api/data/${collection}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data as T[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save or update a single document in MongoDB via API.
 */
export async function saveToMongo<T extends { id?: string }>(
  collection: string,
  item: T,
  method: 'POST' | 'PUT' = 'POST'
): Promise<boolean> {
  try {
    const res = await fetch(`/api/data/${collection}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Delete a document from MongoDB by ID via API.
 */
export async function deleteFromMongo(collection: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/data/${collection}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Utility to sync MongoDB data into LocalStorage cache for instant zero-latency UI rendering.
 */
export async function syncMongoToLocalCache<T>(
  collection: string,
  storageKey: string,
  fallback: T[]
): Promise<T[]> {
  const remoteData = await fetchFromMongo<T>(collection);
  if (remoteData && remoteData.length > 0) {
    setStore(storageKey, remoteData);
    return remoteData;
  }
  return getStore(storageKey, fallback);
}
