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
  DEFAULT_ROLE_PERMISSIONS,
} from '@/lib/store';
import { getPermissions } from '@/lib/rbac';
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
  const [cms, setCms] = useState<StudioCMSConfig>(SEED_CMS);
  const [roleConfigs, setRoleConfigs] = useState<RolePermissionConfig[]>(DEFAULT_ROLE_PERMISSIONS);

  useEffect(() => {
    // Initialize store on first run
    initStore();

    // Check active session
    const activeUser = getStore<StudioMember | null>(STORAGE_KEYS.ACTIVE_USER, null);
    if (!activeUser) {
      router.push('/login');
      return;
    }

    // Hydrate all data from localStorage
    setCurrentUser(activeUser);
    setMembers(getStore(STORAGE_KEYS.MEMBERS, SEED_MEMBERS));
    setProjects(getStore(STORAGE_KEYS.PROJECTS, SEED_PROJECTS));
    setLeads(getStore(STORAGE_KEYS.LEADS, SEED_LEADS));
    setLeadColumns(getStore(STORAGE_KEYS.LEAD_COLUMNS, DEFAULT_LEAD_COLUMNS));
    setCustomers(getStore(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS));
    setTargets(getStore(STORAGE_KEYS.TARGETS, DEFAULT_TARGETS));
    setInquiries(getStore(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES));
    setAnnouncements(getStore(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS));
    setSheets(getStore(STORAGE_KEYS.SHEETS, SEED_SHEETS));
    setCms(getStore(STORAGE_KEYS.CMS, SEED_CMS));
    setRoleConfigs(getStore(STORAGE_KEYS.RBAC, DEFAULT_ROLE_PERMISSIONS));
    setMounted(true);
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

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    router.push('/login');
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
            onTargetsChange={setTargets}
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
            onProjectsChange={setProjects}
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
            onLeadsChange={setLeads}
            onColumnsChange={setLeadColumns}
            onProjectsChange={setProjects}
            onCustomersChange={setCustomers}
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
            onInquiriesChange={setInquiries}
            onProjectsChange={setProjects}
          />
        );
      case 'TEAM':
        return (
          <TeamTab
            currentUser={currentUser!}
            perms={perms}
            members={members}
            onMembersChange={setMembers}
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
          />
        );
      case 'ANNOUNCEMENTS':
        return (
          <AnnouncementsTab
            currentUser={currentUser!}
            perms={perms}
            announcements={announcements}
            onAnnouncementsChange={setAnnouncements}
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
            onProjectsChange={setProjects}
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