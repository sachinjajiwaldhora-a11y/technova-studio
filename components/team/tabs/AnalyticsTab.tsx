// FILE PATH: components/team/tabs/AnalyticsTab.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  StudioMember, StudioProject, ClientInquiry, StudioLead, StudioCustomer, RBACPermissions,
} from '@/lib/store';
import {
  TrendingUp, Users, Briefcase, DollarSign, Clock,
  CheckCircle2, AlertTriangle, BarChart3, Target, Zap,
  RefreshCw, Database, Award, ArrowUpRight, Check,
} from 'lucide-react';

interface AnalyticsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  projects: StudioProject[];
  inquiries: ClientInquiry[];
  members: StudioMember[];
  leads?: StudioLead[];
  customers?: StudioCustomer[];
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-zinc-800 overflow-hidden rounded-full">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsTab({
  currentUser,
  perms,
  projects,
  inquiries,
  members,
  leads = [],
  customers = [],
}: AnalyticsTabProps) {
  const [remoteTelemetry, setRemoteTelemetry] = useState<any | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function fetchTelemetry() {
    setLoadingRemote(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.telemetry) {
          setRemoteTelemetry(json.telemetry);
          setLastSynced(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } else {
        setSyncError('Could not sync with MongoDB telemetry server.');
      }
    } catch {
      setSyncError('Network offline, using local state.');
    } finally {
      setLoadingRemote(false);
    }
  }

  useEffect(() => {
    void fetchTelemetry();
  }, []);

  const stats = useMemo(() => {
    const safeProjects = (Array.isArray(projects) ? projects : []).filter(Boolean);
    const safeInquiries = (Array.isArray(inquiries) ? inquiries : []).filter(Boolean);
    const safeMembers = (Array.isArray(members) ? members : []).filter(Boolean);
    const safeLeads = (Array.isArray(leads) ? leads : []).filter(Boolean);
    const safeCustomers = (Array.isArray(customers) ? customers : []).filter(Boolean);

    const activeProjects = safeProjects.filter((p) => p.status === 'ACTIVE');
    const completedProjects = safeProjects.filter((p) => p.status === 'COMPLETED');
    const inReview = safeProjects.filter((p) => p.status === 'REVIEW');

    const totalMilestones = safeProjects
      .flatMap((project) => (Array.isArray(project.milestones) ? project.milestones : []))
      .filter(Boolean);
    const doneMilestones = totalMilestones.filter((milestone) => milestone.completed);
    const milestoneCompletionPct =
      totalMilestones.length > 0
        ? Math.round((doneMilestones.length / totalMilestones.length) * 100)
        : 0;

    const totalHours = safeProjects.reduce((sum, project) => sum + (Number(project.actualHours) || 0), 0);
    const estimatedHours = safeProjects.reduce((sum, project) => sum + (Number(project.estimatedHours) || 0), 0);

    // Revenue calculations (inclusive of Leads, Inquiries and Completed Projects)
    const wonLeadsRev = safeLeads
      .filter((l) => l.status === 'DEAL_WON')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    const openLeadsPipeline = safeLeads
      .filter((l) => l.status !== 'DEAL_WON' && l.status !== 'LOST')
      .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

    const inqPipelineRev = safeInquiries
      .filter((inquiry) => inquiry.status !== 'LOST')
      .reduce((sum, inquiry) => sum + (Number(inquiry.expectedRevenue) || 0), 0);

    const closedInquiryRev = safeInquiries
      .filter((i) => i.status === 'LOCKED_DEAL')
      .reduce((s, i) => s + (Number(i.expectedRevenue) || 0), 0);

    const closedProjectRev = safeProjects
      .filter((p) => p.status === 'COMPLETED')
      .reduce((s, p) => s + (p.clientInfo?.expectedRevenue || 0), 0);

    const pipelineRevenue =
      remoteTelemetry?.revenue?.pipelineRevenue ?? (wonLeadsRev + openLeadsPipeline + inqPipelineRev);
    const closedRevenue =
      remoteTelemetry?.revenue?.closedRevenue ?? (wonLeadsRev + closedInquiryRev + closedProjectRev);

    // Conversion rate
    const totalWon =
      safeLeads.filter((l) => l.status === 'DEAL_WON').length +
      safeInquiries.filter((i) => i.status === 'LOCKED_DEAL').length;
    const totalOpportunities = safeLeads.length + safeInquiries.length;
    const conversionRate =
      totalOpportunities > 0 ? Math.round((totalWon / totalOpportunities) * 100) : 0;

    // Lead Funnel
    const leadFunnel: Record<string, number> = {
      NEW: safeLeads.filter((l) => l.status === 'NEW').length,
      CONTACTED: safeLeads.filter((l) => l.status === 'CONTACTED').length,
      FOLLOW_UP: safeLeads.filter((l) => l.status === 'FOLLOW_UP').length,
      INTERESTED: safeLeads.filter((l) => l.status === 'INTERESTED').length,
      DEAL_WON: safeLeads.filter((l) => l.status === 'DEAL_WON').length,
      LOST: safeLeads.filter((l) => l.status === 'LOST').length,
    };

    // Customer Telemetry
    const totalCustomers = safeCustomers.length;
    const customerTotalValue = safeCustomers.reduce((sum, c) => sum + (Number(c.totalLifetimeValue) || 0), 0);
    const avgCustomerDeal = totalCustomers > 0 ? Math.round(customerTotalValue / totalCustomers) : 0;

    const avgDelivery =
      safeMembers.reduce((sum, member) => sum + (Number(member.metrics?.deliveryRatePct) || 0), 0) /
      (safeMembers.length || 1);

    const projectsByType = safeProjects.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const inquiryByStatus = safeInquiries.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      inReview: inReview.length,
      totalProjects: safeProjects.length,
      totalInquiries: safeInquiries.length,
      totalLeads: safeLeads.length,
      milestoneCompletionPct,
      doneMilestones: doneMilestones.length,
      totalMilestones: totalMilestones.length,
      totalHours,
      estimatedHours,
      pipelineRevenue,
      closedRevenue,
      wonLeadsRev,
      conversionRate,
      avgDelivery: Math.round(avgDelivery),
      projectsByType,
      inquiryByStatus,
      leadFunnel,
      totalCustomers,
      customerTotalValue,
      avgCustomerDeal,
    };
  }, [projects, inquiries, members, leads, customers, remoteTelemetry]);

  // Dynamic Leaderboard: Compute real hours from project hourLogs + completed milestones
  const topPerformers = useMemo(() => {
    const allHourLogs = (Array.isArray(projects) ? projects : []).flatMap((p) => p?.hourLogs || []);
    return (Array.isArray(members) ? members : [])
      .filter((m): m is StudioMember => Boolean(m))
      .map((m) => {
        const memberLogs = allHourLogs.filter((l) => l.memberId === m.id || (m.name && l.memberName === m.name));
        const realHours = memberLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
        const assignedProjects = (Array.isArray(projects) ? projects : []).filter(
          (p) => (p?.assignedMemberIds || []).includes(m.id) || p?.managerId === m.id
        );
        const completedMilestones = assignedProjects.flatMap((p) =>
          (p?.milestones || []).filter((ms) => ms.completed)
        ).length;

        const tasksCompleted = Math.max(completedMilestones, Number(m.metrics?.tasksCompleted) || 0);
        const hoursLogged = Math.max(realHours, Number(m.metrics?.hoursLoggedTotal) || 0);

        return {
          ...m,
          tasksCompleted,
          hoursLogged,
          deliveryRate: m.metrics?.deliveryRatePct || 100,
        };
      })
      .sort((a, b) => b.tasksCompleted - a.tasksCompleted || b.hoursLogged - a.hoursLogged)
      .slice(0, 6);
  }, [members, projects]);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header & Live Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">
            LIVE TELEMETRY // TECHNOVA CLOUD DATABASE
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">STUDIO ANALYTICS</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 font-mono text-[9px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3 h-3 text-emerald-400" />
            <span>MONGO BACKEND CONNECTED {lastSynced ? `(${lastSynced})` : ''}</span>
          </div>

          <button
            onClick={() => void fetchTelemetry()}
            disabled={loadingRemote}
            className="border border-white/10 bg-white/5 hover:border-red-500 hover:text-white px-3 py-1.5 font-mono text-[9px] text-zinc-300 flex items-center gap-1.5 transition-colors"
            title="Refresh analytics from MongoDB"
          >
            <RefreshCw className={`w-3 h-3 ${loadingRemote ? 'animate-spin text-red-400' : ''}`} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {syncError && (
        <div className="border border-amber-500/30 bg-amber-950/20 px-4 py-2 font-mono text-xs text-amber-300">
          ⚠️ {syncError}
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE PROJECTS', value: stats.activeProjects, icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-500/30' },
          { label: 'COMPLETED BUILDS', value: stats.completedProjects, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/30' },
          { label: 'MILESTONE COMPLETION', value: `${stats.milestoneCompletionPct}%`, icon: Target, color: 'text-violet-400', bg: 'bg-violet-950/20 border-violet-500/30' },
          { label: 'DEAL CONVERSION', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-500/30' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`border ${bg} p-5 hud-clip`}>
            <Icon className={`w-4 h-4 ${color} mb-3`} />
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="font-mono text-[8px] text-zinc-500 tracking-widest mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Telemetry & Customer Accounts */}
      {perms.canViewRevenueMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Telemetry */}
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">REVENUE TELEMETRY</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">TOTAL PIPELINE VALUE</span>
                  <span className="text-emerald-400 font-bold">${stats.pipelineRevenue.toLocaleString()}</span>
                </div>
                <MiniBar value={stats.pipelineRevenue} max={stats.pipelineRevenue + stats.closedRevenue || 1} color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">CLOSED / WON REVENUE</span>
                  <span className="text-cyan-400 font-bold">${stats.closedRevenue.toLocaleString()}</span>
                </div>
                <MiniBar value={stats.closedRevenue} max={stats.pipelineRevenue + stats.closedRevenue || 1} color="bg-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[9px] mb-1.5">
                  <span className="text-zinc-400">WON LEADS EARNINGS</span>
                  <span className="text-amber-400 font-bold">${stats.wonLeadsRev.toLocaleString()}</span>
                </div>
                <MiniBar value={stats.wonLeadsRev} max={stats.closedRevenue || 1} color="bg-amber-500" />
              </div>
            </div>
          </div>

          {/* CRM Leads Funnel */}
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-red-400" />
                <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">CRM LEADS FUNNEL</p>
              </div>
              <span className="font-mono text-[9px] text-zinc-500">{stats.totalLeads} LEADS</span>
            </div>
            <div className="space-y-2.5">
              {[
                { stage: 'NEW', count: stats.leadFunnel.NEW, color: 'bg-cyan-500' },
                { stage: 'CONTACTED', count: stats.leadFunnel.CONTACTED, color: 'bg-blue-500' },
                { stage: 'FOLLOW UP', count: stats.leadFunnel.FOLLOW_UP, color: 'bg-amber-500' },
                { stage: 'INTERESTED', count: stats.leadFunnel.INTERESTED, color: 'bg-violet-500' },
                { stage: 'DEAL WON', count: stats.leadFunnel.DEAL_WON, color: 'bg-emerald-500' },
                { stage: 'LOST', count: stats.leadFunnel.LOST, color: 'bg-zinc-600' },
              ].map(({ stage, count, color }) => {
                const pct = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
                return (
                  <div key={stage}>
                    <div className="flex justify-between font-mono text-[9px] mb-1">
                      <span className="text-zinc-400">{stage}</span>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <MiniBar value={pct} max={100} color={color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Accounts & Projects Breakdown */}
          <div className="border border-white/10 bg-[#060606] p-5 hud-clip flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-4 h-4 text-violet-400" />
                <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">CUSTOMER TELEMETRY</p>
              </div>
              <div className="space-y-3 font-mono">
                <div className="border border-white/8 bg-white/[0.02] p-3 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400">TOTAL ACCOUNTS</span>
                  <span className="text-lg font-bold text-violet-400">{stats.totalCustomers}</span>
                </div>
                <div className="border border-white/8 bg-white/[0.02] p-3 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400">LIFETIME VALUE</span>
                  <span className="text-lg font-bold text-emerald-400">${stats.customerTotalValue.toLocaleString()}</span>
                </div>
                <div className="border border-white/8 bg-white/[0.02] p-3 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400">AVG DEAL SIZE</span>
                  <span className="text-lg font-bold text-cyan-400">${stats.avgCustomerDeal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/8 flex justify-between font-mono text-[9px] text-zinc-500">
              <span>SYNCED WITH MONGODB</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Hours Telemetry */}
      <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
        <div className="flex items-center space-x-2 mb-5">
          <Clock className="w-4 h-4 text-cyan-400" />
          <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">HOURS & WORKLOAD TELEMETRY</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-cyan-400">{stats.totalHours}</p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">TOTAL ACTUAL HOURS LOGGED</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-violet-400">{stats.estimatedHours}</p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">TOTAL ESTIMATED HOURS</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-amber-400">
              {stats.estimatedHours > 0 ? Math.round((stats.totalHours / stats.estimatedHours) * 100) : 0}%
            </p>
            <p className="font-mono text-[8px] text-zinc-500 mt-1">UTILIZATION VELOCITY</p>
          </div>
        </div>
        <div className="mt-5">
          <MiniBar value={stats.totalHours} max={stats.estimatedHours || 1} color="bg-gradient-to-r from-cyan-500 to-violet-500" />
        </div>
      </div>

      {/* Dynamic Team Performance Leaderboard */}
      {perms.canViewTeamMetrics && (
        <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-violet-400" />
              <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">
                DYNAMIC TEAM PERFORMANCE LEADERBOARD
              </p>
            </div>
            <span className="font-mono text-[9px] text-zinc-500">CALCULATED FROM ACTIVE PROJECT LOGS</span>
          </div>
          <div className="space-y-3">
            {topPerformers.map((m, idx) => (
              <div key={m.id} className="flex items-center space-x-4 border border-white/8 bg-white/[0.02] p-3.5 hover:border-white/20 transition-all">
                <span className={`font-mono text-xs font-bold w-5 shrink-0 ${idx === 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 border border-white/15"
                  style={{ background: m.accentColor }}
                >
                  {m.photoInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-white truncate">{m.name}</p>
                    <span className="font-mono text-[8px] px-1.5 py-0.2 border border-white/10 bg-white/5 text-zinc-400">
                      {m.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-[8px] text-zinc-500">{m.department}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-mono text-xs text-emerald-400 font-bold">{m.tasksCompleted}</p>
                    <p className="font-mono text-[7px] text-zinc-600">TASKS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs text-cyan-400 font-bold">{m.hoursLogged}h</p>
                    <p className="font-mono text-[7px] text-zinc-600">HOURS</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs text-violet-400 font-bold">{m.deliveryRate}%</p>
                    <p className="font-mono text-[7px] text-zinc-600">DELIVERY</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone Velocity */}
      <div className="border border-white/10 bg-[#060606] p-5 hud-clip">
        <div className="flex items-center space-x-2 mb-5">
          <Zap className="w-4 h-4 text-amber-400" />
          <p className="font-mono text-[10px] tracking-widest text-white uppercase font-bold">MILESTONE VELOCITY</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL MILESTONES', value: stats.totalMilestones, color: 'text-white' },
            { label: 'COMPLETED', value: stats.doneMilestones, color: 'text-emerald-400' },
            { label: 'PENDING', value: stats.totalMilestones - stats.doneMilestones, color: 'text-amber-400' },
            { label: 'COMPLETION %', value: `${stats.milestoneCompletionPct}%`, color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="font-mono text-[8px] text-zinc-500 tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <MiniBar value={stats.milestoneCompletionPct} max={100} color="bg-gradient-to-r from-amber-500 to-violet-500" />
        </div>
      </div>
    </div>
  );
}
