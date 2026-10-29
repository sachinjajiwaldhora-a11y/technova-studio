// FILE PATH: app/api/auth/login/route.ts
// TECHNOVA STUDIO // MONGODB AUTHENTICATION ENDPOINT

import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { StudioMember } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // If MongoDB is not configured, inform client so it can seamlessly fallback
    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          success: false,
          fallback: true,
          message: 'MongoDB is not configured. Falling back to local store.',
        },
        { status: 200 }
      );
    }

    const db = await getDb();
    const membersCollection = db.collection(MONGO_COLLECTIONS.MEMBERS);

    // Case-insensitive email query
    const member = await membersCollection.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
      password: password,
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'ACCESS DENIED // INVALID CREDENTIALS OR CLEARANCE KEY' },
        { status: 401 }
      );
    }

    // Format member data to match StudioMember interface
    const userProfile: StudioMember = {
      id: member.id || member._id.toString(),
      name: member.name,
      email: member.email,
      password: member.password,
      role: member.role || 'member',
      department: member.department || 'Fullstack Engineering',
      skills: member.skills || [],
      clearanceCode: member.clearanceCode || member.clearance_code || 'LVL-05',
      photoInitials: member.photoInitials || member.photo_initials || member.name.slice(0, 2).toUpperCase(),
      accentColor: member.accentColor || member.accent_color || '#dc2626',
      privateNotes: member.privateNotes || member.private_notes || '',
      managerNotes: member.managerNotes || member.manager_notes || '',
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

    // Update lastActive timestamp in background
    membersCollection.updateOne(
      { _id: member._id },
      { $set: { lastActive: new Date().toISOString() } }
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
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
