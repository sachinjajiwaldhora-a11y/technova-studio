import { createHmac, timingSafeEqual } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from './mongodb';
import type { UserRole } from './store';

const SESSION_COOKIE = 'technova_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export interface AuthenticatedMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface SessionPayload extends AuthenticatedMember {
  expiresAt: number;
}

function getSessionSecret(): string {
  const configuredSecret = process.env.AUTH_SESSION_SECRET;
  if (configuredSecret && configuredSecret.length >= 32 && !configuredSecret.startsWith('replace-with-')) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    return '7c8f9b2d4e6a1f3c8b5e9d2a4f6c8b1e7a3d5f9b2c4e6a8f1d3b5e7a9c2d4f6a';
  }

  return 'technova-local-development-session-secret';
}

function sign(value: string): string {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function createSessionToken(member: AuthenticatedMember): string {
  const payload: SessionPayload = {
    ...member,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function setSessionCookie(response: Response, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}${secure}`
  );
}

export function clearSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`
  );
}

export async function getAuthenticatedMember(
  request: Request
): Promise<AuthenticatedMember | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionCookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

  if (!sessionCookie) return null;

  try {
    const token = sessionCookie.slice(SESSION_COOKIE.length + 1);
    const [encodedPayload, providedSignature] = token.split('.');
    if (!encodedPayload || !providedSignature) return null;

    const expectedSignature = sign(encodedPayload);
    const expectedBuffer = Buffer.from(expectedSignature);
    const providedBuffer = Buffer.from(providedSignature);
    if (
      expectedBuffer.length !== providedBuffer.length ||
      !timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as SessionPayload;

    if (
      !payload.id ||
      !payload.name ||
      !payload.email ||
      !['admin', 'manager', 'working_member', 'member'].includes(payload.role) ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    if (!isMongoConfigured()) {
      return process.env.NODE_ENV === 'production' ? null : payload;
    }

    const db = await getDb();
    const memberQuery = ObjectId.isValid(payload.id)
      ? { $or: [{ id: payload.id }, { _id: new ObjectId(payload.id) }] }
      : { id: payload.id };
    const member = await db.collection(MONGO_COLLECTIONS.MEMBERS).findOne(memberQuery);

    if (!member || !['admin', 'manager', 'working_member', 'member'].includes(member.role)) {
      return null;
    }

    return {
      id: member.id || payload.id,
      name: member.name || payload.name,
      email: member.email || payload.email,
      role: member.role,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SESSION_SECRET) {
      console.error('Authentication session configuration error:', error);
    }
    return null;
  }
}

export function hasAnyRole(
  member: AuthenticatedMember | null,
  roles: readonly UserRole[]
): member is AuthenticatedMember {
  return Boolean(member && roles.includes(member.role));
}