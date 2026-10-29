// FILE PATH: app/api/auth/login/route.ts
// TECHNOVA STUDIO // MONGODB AUTHENTICATION ENDPOINT

import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { SEED_MEMBERS, StudioMember } from '@/lib/store';
import { createSessionToken, setSessionCookie } from '@/lib/auth';
import { hashPassword, isPasswordHash, verifyPassword } from '@/lib/password';

function toSafeProfile(member: Record<string, any>): StudioMember {
  const name = member.name || 'Studio Member';
  const role = ['admin', 'manager', 'working_member', 'member'].includes(member.role)
    ? member.role
    : 'member';
  const id = member.id || member._id?.toString();
  if (!id || !member.email) {
    throw new Error('Member record is missing required identity fields.');
  }
  return {
    id,
    name,
    email: member.email,
    password: '',
    role,
    department: member.department || 'Fullstack Engineering',
    skills: member.skills || [],
    clearanceCode: member.clearanceCode || member.clearance_code || 'LVL-05',
    photoInitials: member.photoInitials || member.photo_initials || name.slice(0, 2).toUpperCase(),
    accentColor: member.accentColor || member.accent_color || '#dc2626',
    privateNotes: '',
    managerNotes: '',
    activeProjectIds: member.activeProjectIds || member.active_project_ids || [],
    metrics: member.metrics || {
      tasksCompleted: 0,
      tasksOverdue: 0,
      avgCompletionDays: 0,
      hoursLoggedTotal: 0,
      deliveryRatePct: 100,
    },
    createdAt: member.createdAt || member.created_at || new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let member: Record<string, any> | null = null;

    if (!isMongoConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Database authentication is not configured.' },
          { status: 503 }
        );
      }
      member = SEED_MEMBERS.find(
        (candidate) =>
          candidate.email.toLowerCase() === email.toLowerCase() &&
          candidate.password === password
      ) || null;
    } else {
      const db = await getDb();
      const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      member = await db.collection(MONGO_COLLECTIONS.MEMBERS).findOne({
        email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') },
      });

      if (member) {
        const storedPassword = member.passwordHash || member.password;
        const passwordMatches = typeof storedPassword === 'string'
          ? await verifyPassword(password, storedPassword)
          : false;
        if (!passwordMatches) member = null;
        else {
          const setValues: Record<string, unknown> = {
            lastActive: new Date().toISOString(),
          };
          if (!isPasswordHash(storedPassword)) {
            setValues.passwordHash = await hashPassword(password);
          }
          await db.collection(MONGO_COLLECTIONS.MEMBERS).updateOne({ _id: member._id }, {
            $set: setValues,
            $unset: { password: '' },
          });
        }
      }
    }

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'ACCESS DENIED // INVALID CREDENTIALS OR CLEARANCE KEY' },
        { status: 401 }
      );
    }

    const userProfile = toSafeProfile(member);
    const token = createSessionToken({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
    });
    const response = NextResponse.json({
      success: true,
      user: userProfile,
    });
    setSessionCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('MongoDB Auth Error:', error);
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error.message || 'Database error occurred',
      },
      { status: 500 }
    );
  }
}
