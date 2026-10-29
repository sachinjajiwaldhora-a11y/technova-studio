import { NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import type { ClientInquiry, StudioProject } from '@/lib/store';

function publicInquiry(inquiry: Record<string, any>): Partial<ClientInquiry> {
  return {
    id: inquiry.id,
    trackingCode: inquiry.trackingCode,
    kind: inquiry.kind,
    clientName: 'Client',
    company: 'Confidential Client',
    email: '',
    title: inquiry.title,
    scope: inquiry.scope,
    budget: 'Not shared',
    submittedAt: inquiry.submittedAt,
    preferredCallDate: inquiry.preferredCallDate,
    status: inquiry.status,
  };
}

function publicProject(project: Record<string, any>): Partial<StudioProject> {
  return {
    id: project.id || project._id?.toString(),
    title: project.title,
    description: project.description || '',
    source: 'CLIENT_INQUIRY',
    type: project.type || 'CLIENT_COMMISSION',
    status: project.status,
    priority: 'NOMINAL',
    trackingCode: project.trackingCode || project.clientInfo?.trackingCode,
    assignedMemberIds: [],
    managerId: '',
    createdBy: '',
    startDate: '',
    dueDate: project.dueDate || '',
    estimatedHours: 0,
    actualHours: 0,
    resourceLinks: [],
    milestones: (project.milestones || []).map((milestone: Record<string, any>) => ({
      id: milestone.id,
      title: milestone.title,
      completed: Boolean(milestone.completed),
      createdAt: milestone.createdAt || '',
    })),
    comments: [],
    hourLogs: [],
    tags: [],
    liveUrl: project.liveUrl,
    createdAt: '',
    updatedAt: '',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingCode = searchParams.get('code')?.trim().toUpperCase();
  if (!trackingCode || trackingCode.length > 100) {
    return NextResponse.json({ success: false, error: 'A valid tracking code is required' }, { status: 400 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({
      success: true,
      fallback: true,
      inquiry: null,
      project: null,
    });
  }

  try {
    const db = await getDb();
    const inquiries = db.collection(MONGO_COLLECTIONS.INQUIRIES);
    const projects = db.collection(MONGO_COLLECTIONS.PROJECTS);
    const inquiry = await inquiries.findOne({ trackingCode });
    let project: Record<string, any> | null = null;

    if (inquiry?.convertedToProjectId) {
      project = await projects.findOne({ id: inquiry.convertedToProjectId });
    }

    if (!project) {
      project = await projects.findOne({
        $or: [
          { trackingCode },
          { 'clientInfo.trackingCode': trackingCode },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      inquiry: inquiry ? publicInquiry(inquiry) : null,
      project: project ? publicProject(project) : null,
    });
  } catch (error) {
    console.error('Client tracking lookup failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to retrieve tracking status right now.' },
      { status: 503 }
    );
  }
}
