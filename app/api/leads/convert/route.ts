// FILE PATH: app/api/leads/convert/route.ts
// TECHNOVA STUDIO // CONVERT LEAD TO PROJECT & CUSTOMER ID PROVISIONING

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import {
  StudioLead, StudioProject, StudioCustomer, generateCustomerId,
} from '@/lib/store';
import { getAuthenticatedMember, hasAnyRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const member = await getAuthenticatedMember(request);
    if (!hasAnyRole(member, ['admin', 'manager'])) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: member ? 403 : 401 });
    }
    const authorId = member.id;
    const authorName = member.name;
    const body = await request.json();

    const { leadId, projectTitle, managerId, assignedMemberIds, dueDate, estimatedHours, priority, type } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'leadId is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (!isMongoConfigured()) {
      // In-memory / localStorage simulation response
      const customerId = generateCustomerId(1);
      const prjId = `prj-${Date.now()}`;
      return NextResponse.json({
        success: true,
        customerId,
        projectId: prjId,
        fallback: true,
        message: 'Lead converted in fallback mode.',
      });
    }

    const db = await getDb();
    const leadsCol = db.collection(MONGO_COLLECTIONS.LEADS);
    const customersCol = db.collection(MONGO_COLLECTIONS.CUSTOMERS);
    const projectsCol = db.collection(MONGO_COLLECTIONS.PROJECTS);

    // 1. Fetch lead record
    const lead = (await leadsCol.findOne({ id: leadId })) as unknown as StudioLead;
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // 2. Provision Customer ID (or reuse if already has one)
    let customerId = lead.customerId;
    if (!customerId) {
      const currentYear = new Date().getFullYear();
      const prefix = `CUST-${currentYear}-`;
      const latestCust = await customersCol
        .find({ id: { $regex: `^${prefix}` } })
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      let nextSeq = 1;
      if (latestCust.length > 0 && latestCust[0].id) {
        const parts = latestCust[0].id.split('-');
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed)) {
          nextSeq = parsed + 1;
        }
      } else {
        const custCount = await customersCol.countDocuments({});
        nextSeq = custCount + 1;
      }
      customerId = `${prefix}${String(nextSeq).padStart(3, '0')}`;
    }

    const prjId = `prj-${Date.now()}`;
    const trackingCode = `TRK-${customerId}`;

    // 3. Upsert Studio Customer
    await customersCol.updateOne(
      { id: customerId },
      {
        $setOnInsert: {
          id: customerId,
          firstLeadId: lead.id,
          createdAt: now,
        },
        $set: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          company: lead.company || 'Private Enterprise Client',
          status: 'ACTIVE_CLIENT',
          updatedAt: now,
        },
        $addToSet: { projectIds: prjId },
        $inc: { totalLifetimeValue: lead.value || 0 },
      },
      { upsert: true }
    );

    // 4. Create Active Studio Project
    const newProject: StudioProject = {
      id: prjId,
      title: projectTitle || `${lead.company || lead.name} Flagship Build`,
      description: `Converted from Lead ${lead.id} (${lead.source}). Notes: ${lead.notes || 'Initiated from dedicated Leads pipeline.'}`,
      source: 'CLIENT_INQUIRY',
      type: type || 'DEV_BUILD',
      status: 'SCOPING',
      priority: priority || (lead.value && lead.value > 50000 ? 'CRITICAL' : 'HIGH'),
      trackingCode,
      customerId,
      clientInfo: {
        clientName: lead.name,
        company: lead.company || '',
        contact: lead.email,
        budget: lead.value ? `$${lead.value.toLocaleString()}` : '$50,000+',
        expectedRevenue: lead.value || 50000,
        followUpDate: dueDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        leadSource: lead.source,
        trackingCode,
        customerId,
      },
      assignedMemberIds: assignedMemberIds && assignedMemberIds.length > 0 ? assignedMemberIds : [lead.assignedMemberId || authorId],
      managerId: managerId || authorId,
      createdBy: authorId,
      startDate: now.split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      estimatedHours: parseInt(estimatedHours) || 120,
      actualHours: 0,
      resourceLinks: [],
      milestones: [
        { id: `ms-${Date.now()}-1`, title: 'Discovery & System Specifications Alignment', completed: false, createdAt: now },
        { id: `ms-${Date.now()}-2`, title: 'Core Engineering & Spatial Architecture Pass', completed: false, createdAt: now },
        { id: `ms-${Date.now()}-3`, title: 'Final Production Deployment & Client Sign-off', completed: false, createdAt: now },
      ],
      comments: [
        {
          id: `cmt-${Date.now()}`,
          authorId,
          authorName,
          text: `Project instantiated via Lead Conversion. Customer ID: ${customerId} linked.`,
          createdAt: now,
        },
      ],
      hourLogs: [],
      tags: ['Converted Lead', 'Active Pipeline', lead.source],
      createdAt: now,
      updatedAt: now,
    };

    await projectsCol.insertOne(newProject as any);

    // 5. Update Lead Status to DEAL_WON with Customer ID
    await leadsCol.updateOne(
      { id: leadId },
      {
        $set: {
          status: 'DEAL_WON',
          customerId,
          convertedProjectId: prjId,
          convertedAt: now,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      customerId,
      project: newProject,
      leadId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
