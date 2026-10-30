// FILE PATH: app/team/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  StudioMember, StudioProject, ClientInquiry, StudioAnnouncement,
  CustomSheet, StudioCMSConfig, RolePermissionConfig,
  StudioLead, LeadColumn, StudioCustomer, StudioTarget,
  DEFAULT_LEAD_COLUMNS, SEED_LEADS, SEED_CUSTOMERS, DEFAULT_TARGETS,
  STORAGE_KEYS, getStore, setStore, initStore,
  SEED_MEMBERS, SEED_PROJECTS, SEED_INQUIRIES,
  SEED_ANNOUNCEMENTS, SEED_SHEETS, SEED_CMS,
  DEFAULT_ROLE_PERMISSIONS, JoinRequest, SEED_JOIN_REQUESTS,
} from '@/lib/store';
import { getPermissions } from '@/lib/rbac';
import { deleteFromMongo, fetchFromMongo, saveToMongo } from '@/lib/mongodb-client';
import { PortalThemeProvider } from '@/lib/portal-theme';
import DashboardShell, { DashboardTab } from '@/components/team/DashboardShell';
import OverviewTab from '@/components/team/tabs/OverviewTab';
import ProjectsTab from '@/components/team/tabs/ProjectsTab';
import LeadsTab from '@/components/team/tabs/LeadsTab';
import InquiriesTab from '@/components/team/tabs/InquiriesTab';
import TeamTab from '@/components/team/tabs/TeamTab';
import AnalyticsTab from '@/components/team/tabs/AnalyticsTab';
import AnnouncementsTab from '@/components/team/tabs/AnnouncementsTab';
import CMSTab from '@/components/team/tabs/CMSTab';
import RBACSettingsTab from '@/components/team/tabs/RBACSettingsTab';

const allowDemoFallback = process.env.NODE_ENV !== 'production';

export default function TeamDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<StudioMember | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('OVERVIEW');

  const [members, setMembers] = useState<StudioMember[]>([]);
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [leads, setLeads] = useState<StudioLead[]>([]);
  const [leadColumns, setLeadColumns] = useState<LeadColumn[]>(DEFAULT_LEAD_COLUMNS);
  const [customers, setCustomers] = useState<StudioCustomer[]>([]);
  const [targets, setTargets] = useState<StudioTarget[]>(DEFAULT_TARGETS);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [announcements, setAnnouncements] = useState<StudioAnnouncement[]>([]);
  const [sheets, setSheets] = useState<CustomSheet[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [cms, setCms] = useState<StudioCMSConfig>(SEED_CMS);
  const [roleConfigs, setRoleConfigs] = useState<RolePermissionConfig[]>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    let active = true;

    async function initializeDashboard() {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          router.replace('/login');
          return;
        }

        const { user } = await response.json();
        if (!active || !user) return;

        initStore();
        setStore(STORAGE_KEYS.ACTIVE_USER, user);
        setCurrentUser(user);
        const [
          remoteProjects,
          remoteInquiries,
          remoteAnnouncements,
          remoteSheets,
          remoteMembers,
          remoteCustomers,
          remoteJoinRequests,
        ] = await Promise.all([
          fetchFromMongo<StudioProject>('projects'),
          fetchFromMongo<ClientInquiry>('inquiries'),
          fetchFromMongo<StudioAnnouncement>('announcements'),
          fetchFromMongo<CustomSheet>('sheets'),
          fetchFromMongo<StudioMember>('members'),
          fetchFromMongo<StudioCustomer>('customers'),
          fetchFromMongo<JoinRequest>('join_requests'),
        ]);

        let remoteLeads: StudioLead[] | null = null;
        let remoteColumns: LeadColumn[] | null = null;
        try {
          const leadsRes = await fetch('/api/leads');
          if (leadsRes.ok) {
            const leadsJson = await leadsRes.json();
            if (leadsJson.success && Array.isArray(leadsJson.leads)) {
              remoteLeads = leadsJson.leads;
            }
            if (leadsJson.success && Array.isArray(leadsJson.columns)) {
              remoteColumns = leadsJson.columns;
            }
          }
        } catch {
          // fallback handled
        }

        let remoteTargets: StudioTarget[] | null = null;
        try {
          const targetsRes = await fetch('/api/targets');
          if (targetsRes.ok) {
            const targetsJson = await targetsRes.json();
            if (targetsJson.success && Array.isArray(targetsJson.targets)) {
              remoteTargets = targetsJson.targets;
            }
          }
        } catch {
          // fallback handled
        }

        if (!active) return;

        const initialMembers = remoteMembers !== null && remoteMembers.length > 0
          ? remoteMembers
          : getStore(STORAGE_KEYS.MEMBERS, allowDemoFallback ? SEED_MEMBERS : []);
        const initialProjects = remoteProjects !== null
          ? remoteProjects
          : getStore(STORAGE_KEYS.PROJECTS, allowDemoFallback ? SEED_PROJECTS : []);
        const initialInquiries = remoteInquiries !== null
          ? remoteInquiries
          : getStore(STORAGE_KEYS.INQUIRIES, allowDemoFallback ? SEED_INQUIRIES : []);
        const initialAnnouncements = remoteAnnouncements !== null
          ? remoteAnnouncements
          : getStore(STORAGE_KEYS.ANNOUNCEMENTS, allowDemoFallback ? SEED_ANNOUNCEMENTS : []);
        const initialSheets = remoteSheets !== null
          ? remoteSheets
          : getStore(STORAGE_KEYS.SHEETS, allowDemoFallback ? SEED_SHEETS : []);
        const initialJoinRequests = remoteJoinRequests !== null
          ? remoteJoinRequests
          : getStore(STORAGE_KEYS.JOIN_REQUESTS, allowDemoFallback ? SEED_JOIN_REQUESTS : []);
        const initialLeads = remoteLeads !== null
          ? remoteLeads
          : getStore(STORAGE_KEYS.LEADS, allowDemoFallback ? SEED_LEADS : []);
        const initialColumns = remoteColumns !== null
          ? remoteColumns
          : getStore(STORAGE_KEYS.LEAD_COLUMNS, DEFAULT_LEAD_COLUMNS);
        const initialCustomers = remoteCustomers !== null
          ? remoteCustomers
          : getStore(STORAGE_KEYS.CUSTOMERS, allowDemoFallback ? SEED_CUSTOMERS : []);
        const initialTargets = remoteTargets !== null
          ? remoteTargets
          : getStore(STORAGE_KEYS.TARGETS, allowDemoFallback ? DEFAULT_TARGETS : []);

        setMembers(initialMembers);
        setProjects(initialProjects);
        setLeads(initialLeads);
        setLeadColumns(initialColumns);
        setCustomers(initialCustomers);
        setTargets(initialTargets);
        setInquiries(initialInquiries);
        setAnnouncements(initialAnnouncements);
        setSheets(initialSheets);
        setJoinRequests(initialJoinRequests);
        if (remoteProjects !== null) setStore(STORAGE_KEYS.PROJECTS, remoteProjects);
        if (remoteInquiries !== null) setStore(STORAGE_KEYS.INQUIRIES, remoteInquiries);
        if (remoteAnnouncements !== null) setStore(STORAGE_KEYS.ANNOUNCEMENTS, remoteAnnouncements);
        if (remoteSheets !== null) setStore(STORAGE_KEYS.SHEETS, remoteSheets);
        if (remoteJoinRequests !== null) setStore(STORAGE_KEYS.JOIN_REQUESTS, remoteJoinRequests);
        if (remoteMembers !== null && remoteMembers.length > 0) setStore(STORAGE_KEYS.MEMBERS, remoteMembers);
        if (remoteLeads !== null) setStore(STORAGE_KEYS.LEADS, remoteLeads);
        if (remoteColumns !== null) setStore(STORAGE_KEYS.LEAD_COLUMNS, remoteColumns);
        if (remoteCustomers !== null) setStore(STORAGE_KEYS.CUSTOMERS, remoteCustomers);
        if (remoteTargets !== null) setStore(STORAGE_KEYS.TARGETS, remoteTargets);
        setCms(getStore(STORAGE_KEYS.CMS, SEED_CMS));
        setRoleConfigs(getStore(STORAGE_KEYS.RBAC, DEFAULT_ROLE_PERMISSIONS));
        setMounted(true);
      } catch {
        router.replace('/login');
      }
    }

    void initializeDashboard();
    return () => {
      active = false;
    };
  }, [router]);

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-xs text-zinc-500 tracking-widest">INITIALIZING CONSOLE...</p>
        </div>
      </div>
    );
  }

  const perms = getPermissions(currentUser.role);
  const unreadAnnCount = announcements.filter((a) => !a.readBy.includes(currentUser.id)).length;

  function syncRemoteCollection<T extends { id: string }>(
    collection: string,
    previous: T[],
    next: T[]
  ) {
    const previousById = new Map(previous.map((item) => [item.id, item]));
    const nextById = new Map(next.map((item) => [item.id, item]));

    for (const item of next) {
      if (JSON.stringify(previousById.get(item.id)) === JSON.stringify(item)) continue;
      const method = collection === 'inquiries' ? 'PUT' : 'POST';
      void saveToMongo(collection, item, method).then((saved) => {
        if (!saved) console.error(`Failed to persist ${collection} record ${item.id}.`);
      });
    }

    for (const item of previous) {
      if (!nextById.has(item.id)) {
        void deleteFromMongo(collection, item.id).then((deleted) => {
          if (!deleted) console.error(`Failed to delete ${collection} record ${item.id}.`);
        });
      }
    }
  }

  function handleProjectsChange(next: StudioProject[]) {
    syncRemoteCollection('projects', projects, next);
    setProjects(next);
    setStore(STORAGE_KEYS.PROJECTS, next);
  }

  function handleInquiriesChange(next: ClientInquiry[]) {
    syncRemoteCollection('inquiries', inquiries, next);
    setInquiries(next);
    setStore(STORAGE_KEYS.INQUIRIES, next);
  }

  function handleAnnouncementsChange(next: StudioAnnouncement[]) {
    syncRemoteCollection('announcements', announcements, next);
    setAnnouncements(next);
    setStore(STORAGE_KEYS.ANNOUNCEMENTS, next);
  }

  function handleSheetsChange(next: CustomSheet[]) {
    syncRemoteCollection('sheets', sheets, next);
    setSheets(next);
    setStore(STORAGE_KEYS.SHEETS, next);
  }

  function handleLeadsChange(next: StudioLead[]) {
    syncRemoteCollection('leads', leads, next);
    setLeads(next);
    setStore(STORAGE_KEYS.LEADS, next);
  }

  function handleCustomersChange(next: StudioCustomer[]) {
    syncRemoteCollection('customers', customers, next);
    setCustomers(next);
    setStore(STORAGE_KEYS.CUSTOMERS, next);
  }

  function handleTargetsChange(next: StudioTarget[]) {
    setTargets(next);
    setStore(STORAGE_KEYS.TARGETS, next);
    void fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targets: next }),
    });
  }

  function handleColumnsChange(next: LeadColumn[]) {
    setLeadColumns(next);
    setStore(STORAGE_KEYS.LEAD_COLUMNS, next);
    void fetch('/api/leads/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columns: next }),
    });
  }

  function handleMembersChange(next: StudioMember[]) {
    syncRemoteCollection('members', members, next);
    setMembers(next);
    setStore(STORAGE_KEYS.MEMBERS, next);
  }

  function handleJoinRequestsChange(next: JoinRequest[]) {
    syncRemoteCollection('join_requests', joinRequests, next);
    setJoinRequests(next);
    setStore(STORAGE_KEYS.JOIN_REQUESTS, next);
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      router.push('/login');
    }
  }

  function renderTab() {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <OverviewTab
            currentUser={currentUser!}
            perms={perms}
            projects={projects}
            inquiries={inquiries}
            members={members}
            announcements={announcements}
            leads={leads}
            targets={targets}
            onTargetsChange={handleTargetsChange}
            onTabChange={(tab) => setActiveTab(tab as DashboardTab)}
          />
        );
      case 'PROJECTS':
        return (
          <ProjectsTab
            currentUser={currentUser!}
            perms={perms}
            projects={projects}
            members={members}
            onProjectsChange={handleProjectsChange}
          />
        );
      case 'LEADS':
        return (
          <LeadsTab
            currentUser={currentUser!}
            perms={perms}
            members={members}
            projects={projects}
            leads={leads}
            columns={leadColumns}
            customers={customers}
            onLeadsChange={handleLeadsChange}
            onColumnsChange={handleColumnsChange}
            onProjectsChange={handleProjectsChange}
            onCustomersChange={handleCustomersChange}
          />
        );
      case 'INQUIRIES':
        return (
          <InquiriesTab
            currentUser={currentUser!}
            perms={perms}
            inquiries={inquiries}
            members={members}
            projects={projects}
            onInquiriesChange={handleInquiriesChange}
            onProjectsChange={handleProjectsChange}
          />
        );
      case 'TEAM':
        return (
          <TeamTab
            currentUser={currentUser!}
            perms={perms}
            members={members}
            joinRequests={joinRequests}
            onMembersChange={handleMembersChange}
            onJoinRequestsChange={handleJoinRequestsChange}
          />
        );
      case 'ANALYTICS':
        return (
          <AnalyticsTab
            currentUser={currentUser!}
            perms={perms}
            projects={projects}
            inquiries={inquiries}
            members={members}
            leads={leads}
            customers={customers}
          />
        );
      case 'ANNOUNCEMENTS':
        return (
          <AnnouncementsTab
            currentUser={currentUser!}
            perms={perms}
            announcements={announcements}
            onAnnouncementsChange={handleAnnouncementsChange}
          />
        );
      case 'CMS':
        return (
          <CMSTab
            currentUser={currentUser!}
            perms={perms}
            cms={cms}
            projects={projects}
            members={members}
            onCMSChange={setCms}
            onProjectsChange={handleProjectsChange}
          />
        );
      case 'RBAC_SETTINGS':
        return (
          <RBACSettingsTab
            currentUser={currentUser!}
            roleConfigs={roleConfigs}
            onRoleConfigsChange={setRoleConfigs}
          />
        );
      default:
        return null;
    }
  }

  return (
    <PortalThemeProvider>
      <DashboardShell
        currentUser={currentUser!}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        onGoHome={() => router.push('/')}
        unreadCount={unreadAnnCount}
      >
        {renderTab()}
      </DashboardShell>
    </PortalThemeProvider>
  );
}