import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const HASH_SCHEME = 'scrypt-v1';
const SALT_BYTES = 16;
const KEY_BYTES = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_BYTES, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await deriveKey(password, salt);
  return `${HASH_SCHEME}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password: string, storedValue: string): Promise<boolean> {
  const [scheme, encodedSalt, encodedKey] = storedValue.split('$');
  if (scheme === HASH_SCHEME && encodedSalt && encodedKey) {
    const salt = Buffer.from(encodedSalt, 'base64url');
    const expectedKey = Buffer.from(encodedKey, 'base64url');
    if (salt.length !== SALT_BYTES || expectedKey.length !== KEY_BYTES) return false;

    const actualKey = await deriveKey(password, salt);
    return timingSafeEqual(actualKey, expectedKey);
  }

  const provided = Buffer.from(password);
  const legacy = Buffer.from(storedValue);
  return provided.length === legacy.length && timingSafeEqual(provided, legacy);
}

export function isPasswordHash(value: string): boolean {
  return value.startsWith(`${HASH_SCHEME}$`);
}
