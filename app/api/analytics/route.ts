// FILE PATH: app/api/analytics/route.ts
// TECHNOVA STUDIO // REAL-TIME MONGODB AGGREGATED ANALYTICS TELEMETRY API

import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured, MONGO_COLLECTIONS } from '@/lib/mongodb';
import { getAuthenticatedMember } from '@/lib/auth';
import type {
  StudioMember,
  StudioProject,
  ClientInquiry,
  StudioLead,
  StudioCustomer,
  StudioTarget,
} from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const authenticated = await getAuthenticatedMember(request);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        source: 'fallback',
        syncedAt: new Date().toISOString(),
        message: 'MongoDB is offline or not configured',
      });
    }

    const db = await getDb();

    // Query all core collections in parallel
    const [rawLeads, rawProjects, rawInquiries, rawMembers, rawCustomers, rawTargets] =
      await Promise.all([
        db.collection(MONGO_COLLECTIONS.LEADS).find({}).toArray(),
        db.collection(MONGO_COLLECTIONS.PROJECTS).find({}).toArray(),
        db.collection(MONGO_COLLECTIONS.INQUIRIES).find({}).toArray(),
        db.collection(MONGO_COLLECTIONS.MEMBERS).find({}).toArray(),
        db.collection(MONGO_COLLECTIONS.CUSTOMERS).find({}).toArray(),
        db.collection(MONGO_COLLECTIONS.TARGETS).find({}).toArray(),
      ]);

    const leads = rawLeads as unknown as StudioLead[];
    const projects = rawProjects as unknown as StudioProject[];
    const inquiries = rawInquiries as unknown as ClientInquiry[];
    const members = rawMembers as unknown as StudioMember[];
    const customers = rawCustomers as unknown as StudioCustomer[];
    const targets = rawTargets as unknown as StudioTarget[];

    // ─── 1. Revenue & Pipeline Telemetry ────────────────────────────────────────
    const wonLeadsRev = leads
      .filter((l) => l.status === 'DEAL_WON')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    const openLeadsPipeline = leads
      .filter((l) => l.status !== 'DEAL_WON' && l.status !== 'LOST')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    const inquiryPipeline = inquiries
      .filter((i) => i.status !== 'LOST')
      .reduce((sum, i) => sum + (Number(i.expectedRevenue) || 0), 0);

    const closedInquiryRev = inquiries
      .filter((i) => i.status === 'LOCKED_DEAL')
      .reduce((sum, i) => sum + (Number(i.expectedRevenue) || 0), 0);

    const completedProjectsRev = projects
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + (Number(p.clientInfo?.expectedRevenue) || 0), 0);

    const totalPipelineRevenue = wonLeadsRev + openLeadsPipeline + inquiryPipeline;
    const totalClosedRevenue = wonLeadsRev + closedInquiryRev + completedProjectsRev;

    const dealsWonCount =
      leads.filter((l) => l.status === 'DEAL_WON').length +
      inquiries.filter((i) => i.status === 'LOCKED_DEAL').length;

    const totalOpportunities = leads.length + inquiries.length;
    const dealConversionRate =
      totalOpportunities > 0 ? Math.round((dealsWonCount / totalOpportunities) * 100) : 0;

    // ─── 2. Engineering & Projects Telemetry ────────────────────────────────────
    const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
    const inReviewProjects = projects.filter((p) => p.status === 'REVIEW').length;
    const scopingProjects = projects.filter((p) => p.status === 'SCOPING').length;

    const projectsByType = projects.reduce((acc, p) => {
      const type = p.type || 'DEV_BUILD';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allMilestones = projects.flatMap((p) => (Array.isArray(p.milestones) ? p.milestones : []));
    const doneMilestones = allMilestones.filter((m) => m.completed).length;
    const milestoneCompletionPct =
      allMilestones.length > 0 ? Math.round((doneMilestones / allMilestones.length) * 100) : 0;

    const allHourLogs = projects.flatMap((p) => (Array.isArray(p.hourLogs) ? p.hourLogs : []));
    const totalHoursLogged = projects.reduce(
      (sum, p) => sum + (Number(p.actualHours) || 0),
      0
    );
    const totalEstimatedHours = projects.reduce(
      (sum, p) => sum + (Number(p.estimatedHours) || 0),
      0
    );
    const hoursUtilizationRate =
      totalEstimatedHours > 0 ? Math.round((totalHoursLogged / totalEstimatedHours) * 100) : 0;

    // ─── 3. CRM & Lead Funnel Breakdown ────────────────────────────────────────
    const leadFunnel: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      FOLLOW_UP: 0,
      INTERESTED: 0,
      PROPOSAL_SENT: 0,
      NEGOTIATION: 0,
      DEAL_WON: 0,
      LOST: 0,
    };
    for (const lead of leads) {
      const status = lead.status || 'NEW';
      leadFunnel[status] = (leadFunnel[status] || 0) + 1;
    }

    const inquiryByStatus = inquiries.reduce((acc, i) => {
      const status = i.status || 'NEW_INQUIRY';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // ─── 4. Customer Accounts Telemetry ─────────────────────────────────────────
    const totalCustomers = customers.length;
    const customerTotalValue = customers.reduce(
      (sum, c) => sum + (Number(c.totalLifetimeValue) || 0),
      0
    );
    const averageCustomerDeal =
      totalCustomers > 0 ? Math.round(customerTotalValue / totalCustomers) : 0;

    // ─── 5. Dynamic Team Performance Leaderboard ────────────────────────────────
    const memberLeaderboard = members.map((m) => {
      // Find real logged hours for this member across all projects
      const memberHourLogs = allHourLogs.filter(
        (l) => l.memberId === m.id || (m.name && l.memberName === m.name)
      );
      const realHours = memberHourLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
      const displayHours = Math.max(realHours, Number(m.metrics?.hoursLoggedTotal) || 0);

      // Find assigned projects and completed milestones
      const assignedProjects = projects.filter(
        (p) => (p.assignedMemberIds || []).includes(m.id) || p.managerId === m.id
      );
      const memberCompletedMilestones = assignedProjects.flatMap((p) =>
        (p.milestones || []).filter((ms) => ms.completed)
      ).length;

      const tasksCompleted = Math.max(
        memberCompletedMilestones,
        Number(m.metrics?.tasksCompleted) || 0
      );

      return {
        id: m.id,
        name: m.name,
        department: m.department,
        role: m.role,
        accentColor: m.accentColor || '#dc2626',
        photoInitials: m.photoInitials || (m.name ? m.name.slice(0, 2).toUpperCase() : 'OP'),
        tasksCompleted,
        hoursLoggedTotal: displayHours,
        deliveryRatePct: m.metrics?.deliveryRatePct || 100,
        tasksOverdue: m.metrics?.tasksOverdue || 0,
        assignedProjectsCount: assignedProjects.length,
      };
    }).sort((a, b) => b.tasksCompleted - a.tasksCompleted || b.hoursLoggedTotal - a.hoursLoggedTotal);

    const avgDelivery =
      memberLeaderboard.length > 0
        ? Math.round(
            memberLeaderboard.reduce((sum, m) => sum + m.deliveryRatePct, 0) /
              memberLeaderboard.length
          )
        : 100;

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      syncedAt: new Date().toISOString(),
      telemetry: {
        revenue: {
          pipelineRevenue: totalPipelineRevenue,
          closedRevenue: totalClosedRevenue,
          wonLeadsRevenue: wonLeadsRev,
          openLeadsPipeline,
          inquiryPipeline,
          dealsWonCount,
          dealConversionRate,
        },
        engineering: {
          totalProjects: projects.length,
          activeProjects,
          completedProjects,
          inReviewProjects,
          scopingProjects,
          projectsByType,
          totalMilestones: allMilestones.length,
          completedMilestones: doneMilestones,
          milestoneCompletionPct,
          totalHoursLogged,
          totalEstimatedHours,
          hoursUtilizationRate,
        },
        crm: {
          totalLeads: leads.length,
          leadFunnel,
          inquiryByStatus,
          totalInquiries: inquiries.length,
        },
        customers: {
          totalCustomers,
          customerTotalValue,
          averageCustomerDeal,
        },
        team: {
          totalMembers: members.length,
          avgDelivery,
          leaderboard: memberLeaderboard,
        },
      },
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
