import { NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import type { StudioMember } from '@/lib/store';

export async function GET(request: Request) {
  const member = await getAuthenticatedMember(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const user: Partial<StudioMember> = {
    ...member,
    password: '',
    department: 'Fullstack Engineering',
    skills: [],
    clearanceCode: '',
    photoInitials: member.name.slice(0, 2).toUpperCase(),
    accentColor: '#dc2626',
    privateNotes: '',
    managerNotes: '',
    activeProjectIds: [],
    metrics: {
      tasksCompleted: 0,
      tasksOverdue: 0,
      avgCompletionDays: 0,
      hoursLoggedTotal: 0,
      deliveryRatePct: 100,
    },
    createdAt: '',
    lastActive: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, user });
}
