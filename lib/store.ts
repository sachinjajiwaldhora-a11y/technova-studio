// FILE PATH: lib/store.ts
// TECHNOVA STUDIO // COMPLETE DATA STORE & SCHEMA

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'working_member' | 'member';
export type Department = 'WebGL & Graphics' | 'Fullstack Engineering' | 'AI & Systems' | 'Growth & Sales' | 'UI/UX Design' | 'Management';
export type ProjectType = 'LEAD_GEN' | 'RESEARCH' | 'DEV_BUILD' | 'CLIENT_COMMISSION' | 'INTERNAL';
export type ProjectStatus = 'INQUIRY' | 'SCOPING' | 'ACTIVE' | 'REVIEW' | 'COMPLETED' | 'ARCHIVED';
export type Priority = 'CRITICAL' | 'HIGH' | 'NOMINAL';
export type InquiryStatus = 'NEW_INQUIRY' | 'CALL_SCHEDULED' | 'PROPOSAL_SENT' | 'LOCKED_DEAL' | 'LOST';
export type AnnouncementCategory = 'IMPORTANT' | 'MEETING' | 'POLICY' | 'GENERAL';

// ─── RBAC Permissions ───────────────────────────────────────────────────────

export interface RBACPermissions {
  // Project Permissions
  canViewAllProjects: boolean;
  canViewOwnProjects: boolean;
  canCreateProject: boolean;
  canEditAnyProject: boolean;
  canEditOwnProject: boolean;
  canDeleteProject: boolean;
  canAssignMembers: boolean;
  canUpdateProjectStatus: boolean;
  canConvertInquiryToProject: boolean;
  canViewClientFinancials: boolean;

  // Task/Milestone Permissions
  canCreateMilestone: boolean;
  canCompleteMilestone: boolean;
  canLogHours: boolean;
  canAddProjectLinks: boolean;
  canAddComments: boolean;

  // Team/Member Permissions
  canViewAllMembers: boolean;
  canViewMemberDossier: boolean;
  canWriteManagerNotes: boolean;
  canReadManagerNotes: boolean;
  canEditMemberRoles: boolean;
  canOnboardMembers: boolean;
  canChangePasswords: boolean;
  canToggleMemberPermissions: boolean;

  // Inquiry/Lead Permissions
  canViewAllInquiries: boolean;
  canCreateInquiry: boolean;
  canUpdateInquiryStatus: boolean;
  canViewLeadFinancials: boolean;

  // Analytics Permissions
  canViewAnalytics: boolean;
  canViewRevenueMetrics: boolean;
  canViewTeamMetrics: boolean;

  // Announcements Permissions
  canPostAnnouncements: boolean;
  canPinAnnouncements: boolean;

  // CMS / Public Website Permissions
  canManagePortfolioCMS: boolean;
  canManageAboutUs: boolean;
  canManageBookingSettings: boolean;

  // Data Sheets Permissions
  canViewDataSheets: boolean;
  canEditDataSheets: boolean;
  canCreateDataSheets: boolean;
}

// ─── Role Permission Config ──────────────────────────────────────────────────

export interface RolePermissionConfig {
  roleId: string; // 'member' | 'working_member' | 'manager'
  label: string;
  permissions: RBACPermissions;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

// ─── Studio Member ───────────────────────────────────────────────────────────

export interface StudioMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: Department;
  skills: string[];
  clearanceCode: string;
  photoInitials: string;
  accentColor: string;
  privateNotes: string;
  managerNotes: string;
  activeProjectIds: string[];
  metrics: {
    tasksCompleted: number;
    tasksOverdue: number;
    avgCompletionDays: number;
    hoursLoggedTotal: number;
    deliveryRatePct: number;
  };
  createdAt: string;
  lastActive: string;
}

// ─── Studio Project ──────────────────────────────────────────────────────────

export interface ResourceLink {
  id: string;
  label: string;
  url: string;
  type: 'sheet' | 'doc' | 'live_demo' | 'repo' | 'figma' | 'other';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface HourLog {
  id: string;
  memberId: string;
  memberName: string;
  hours: number;
  description: string;
  date: string;
}

export interface StudioProject {
  id: string;
  title: string;
  description: string;
  source: 'CLIENT_INQUIRY' | 'INTERNAL_TEAM';
  type: ProjectType;
  status: ProjectStatus;
  priority: Priority;
  trackingCode?: string;
  clientInfo?: {
    clientName: string;
    company: string;
    contact: string;
    budget: string;
    expectedRevenue: number;
    followUpDate: string;
    leadSource: string;
    trackingCode?: string;
  };
  assignedMemberIds: string[];
  managerId: string;
  createdBy: string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  resourceLinks: ResourceLink[];
  milestones: Milestone[];
  comments: ProjectComment[];
  hourLogs: HourLog[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  figmaUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function getProjectProgress(project: StudioProject): number {
  if (project.status === 'COMPLETED' || project.status === 'ARCHIVED') {
    return 100;
  }

  // Base progress based on pipeline status
  const statusBase: Record<ProjectStatus, number> = {
    INQUIRY: 15,
    SCOPING: 35,
    ACTIVE: 65,
    REVIEW: 88,
    COMPLETED: 100,
    ARCHIVED: 100,
  };

  const base = statusBase[project.status] ?? 20;

  // If milestones exist, blend milestone completion into the status range
  if (project.milestones && project.milestones.length > 0) {
    const doneCount = project.milestones.filter((m) => m.completed).length;
    const ratio = doneCount / project.milestones.length;

    if (project.status === 'ACTIVE') {
      return Math.round(50 + ratio * 30);
    } else if (project.status === 'SCOPING') {
      return Math.round(25 + ratio * 20);
    } else if (project.status === 'REVIEW') {
      return Math.round(85 + ratio * 10);
    }
  }

  return base;
}

// ─── Client Inquiry ──────────────────────────────────────────────────────────

export type InquiryKind = 'PROJECT_INQUIRY' | 'CALL_BOOKING';

export interface ClientInquiry {
  id: string;
  trackingCode?: string;
  kind?: InquiryKind;
  clientName: string;
  company: string;
  email: string;
  phone?: string;
  title?: string;
  scope: string;
  description?: string;
  budget: string;
  timeline?: string;
  callTimeSlot?: string;
  meetingPlatform?: string;
  expectedRevenue: number;
  leadSource: 'WEBSITE_HUD' | 'REFERRAL' | 'COLD_OUTREACH' | 'DIRECT';
  preferredCallDate: string;
  status: InquiryStatus;
  assignedSalesId: string;
  dealNotes: string;
  convertedToProjectId?: string;
  submittedAt: string;
  followUpDate: string;
}

export type StudioLead = ClientInquiry;

// ─── Join / Onboarding Request ───────────────────────────────────────────────

export interface JoinRequest {
  id: string;
  fullName: string;
  email: string;
  portfolioUrl: string;
  githubUrl?: string;
  department: Department;
  skills: string[];
  statement: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// ─── Announcement ────────────────────────────────────────────────────────────

export interface StudioAnnouncement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorId: string;
  authorName: string;
  pinned: boolean;
  readBy: string[];
  createdAt: string;
}

// ─── Data Sheet ──────────────────────────────────────────────────────────────

export interface CustomSheet {
  id: string;
  name: string;
  columns: string[];
  rows: Record<string, string>[];
  createdBy: string;
  createdAt: string;
}

// ─── CMS Config ──────────────────────────────────────────────────────────────

export interface PortfolioShowcaseItem {
  id: string;
  code: string;
  title: string;
  category: string;
  metrics: string;
  description: string;
  liveUrl: string;
  repoUrl?: string;
  featured: boolean;
  tags: string[];
  thumbnailColor: string;
}

export interface StudioCMSConfig {
  aboutUs: {
    heroTagline: string;
    subTagline: string;
    manifesto: string;
    vision: string;
    methodology: string;
    securityGuarantee: string;
    foundedYear: string;
    location: string;
    stats: { label: string; value: string }[];
    teamHighlight: string;
    contactEmail: string;
  };
  portfolioShowcase: PortfolioShowcaseItem[];
  bookingSettings: {
    enabled: boolean;
    calendarLink: string;
    responseTime: string;
    minimumBudget: string;
    availableScopes: string[];
    availableBudgetRanges: string[];
    availableCallSlots: string[];
    callMeetingPlatforms: string[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT RBAC PERMISSIONS (All ON by default, manager can toggle)
// ─────────────────────────────────────────────────────────────────────────────

const ALL_ON: RBACPermissions = {
  canViewAllProjects: true,
  canViewOwnProjects: true,
  canCreateProject: true,
  canEditAnyProject: true,
  canEditOwnProject: true,
  canDeleteProject: true,
  canAssignMembers: true,
  canUpdateProjectStatus: true,
  canConvertInquiryToProject: true,
  canViewClientFinancials: true,
  canCreateMilestone: true,
  canCompleteMilestone: true,
  canLogHours: true,
  canAddProjectLinks: true,
  canAddComments: true,
  canViewAllMembers: true,
  canViewMemberDossier: true,
  canWriteManagerNotes: true,
  canReadManagerNotes: true,
  canEditMemberRoles: true,
  canOnboardMembers: true,
  canChangePasswords: true,
  canToggleMemberPermissions: true,
  canViewAllInquiries: true,
  canCreateInquiry: true,
  canUpdateInquiryStatus: true,
  canViewLeadFinancials: true,
  canViewAnalytics: true,
  canViewRevenueMetrics: true,
  canViewTeamMetrics: true,
  canPostAnnouncements: true,
  canPinAnnouncements: true,
  canManagePortfolioCMS: true,
  canManageAboutUs: true,
  canManageBookingSettings: true,
  canViewDataSheets: true,
  canEditDataSheets: true,
  canCreateDataSheets: true,
};

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionConfig[] = [
  {
    roleId: 'manager',
    label: 'Manager / Tech Lead',
    permissions: { ...ALL_ON },
    lastUpdatedBy: 'system',
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    roleId: 'working_member',
    label: 'Working Member',
    permissions: { ...ALL_ON },
    lastUpdatedBy: 'system',
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    roleId: 'member',
    label: 'New Member (Restricted)',
    permissions: { ...ALL_ON },
    lastUpdatedBy: 'system',
    lastUpdatedAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────

export const SEED_MEMBERS: StudioMember[] = [
  {
    id: 'usr-01',
    name: 'Sachin (Admin)',
    email: 'sachinjajiwaldhora@gmail.com',
    password: 'NOVA-SACHIN-2025',
    role: 'admin',
    department: 'Management',
    skills: ['Executive Command', 'WebGL', 'Architecture', 'Strategy', 'Next.js'],
    clearanceCode: 'LVL-09-OMEGA',
    photoInitials: 'SJ',
    accentColor: '#dc2626',
    privateNotes: 'Main Studio Admin & Executive Lead.',
    managerNotes: '',
    activeProjectIds: ['prj-001', 'prj-003'],
    metrics: { tasksCompleted: 48, tasksOverdue: 0, avgCompletionDays: 2.2, hoursLoggedTotal: 410, deliveryRatePct: 98 },
    createdAt: '2025-01-01',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr-01b',
    name: 'Anuj (Admin)',
    email: 'anujb2296@gmail.com',
    password: 'NOVA-ANUJ-2025',
    role: 'admin',
    department: 'Management',
    skills: ['Operations', 'System Architecture', 'High-End Tech', 'Team Strategy'],
    clearanceCode: 'LVL-09-OMEGA',
    photoInitials: 'AB',
    accentColor: '#ef4444',
    privateNotes: 'Studio Co-Admin & Operations Director.',
    managerNotes: '',
    activeProjectIds: ['prj-001', 'prj-002'],
    metrics: { tasksCompleted: 42, tasksOverdue: 0, avgCompletionDays: 2.5, hoursLoggedTotal: 385, deliveryRatePct: 97 },
    createdAt: '2025-01-01',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr-02',
    name: 'Riya Sharma',
    email: 'manager@technovastudio.dev',
    password: 'NOVA-MGR-KEY',
    role: 'manager',
    department: 'Fullstack Engineering',
    skills: ['React', 'Three.js', 'Node.js', 'System Design', 'Rust WASM'],
    clearanceCode: 'LVL-07-SIGMA',
    photoInitials: 'RS',
    accentColor: '#7c3aed',
    privateNotes: '',
    managerNotes: '',
    activeProjectIds: ['prj-001', 'prj-002'],
    metrics: { tasksCompleted: 28, tasksOverdue: 1, avgCompletionDays: 3.2, hoursLoggedTotal: 284, deliveryRatePct: 97 },
    createdAt: '2025-01-15',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr-03',
    name: 'Dev Malhotra',
    email: 'core@technovastudio.dev',
    password: 'NOVA-CORE-KEY',
    role: 'working_member',
    department: 'WebGL & Graphics',
    skills: ['GLSL', 'WebGL', 'Three.js', 'Shader Writing', 'Canvas API'],
    clearanceCode: 'LVL-05-ALPHA',
    photoInitials: 'DM',
    accentColor: '#0891b2',
    privateNotes: 'Working on Q1 shader optimization. Need to check render pipeline for mobile.',
    managerNotes: '',
    activeProjectIds: ['prj-001'],
    metrics: { tasksCompleted: 19, tasksOverdue: 0, avgCompletionDays: 2.1, hoursLoggedTotal: 198, deliveryRatePct: 100 },
    createdAt: '2025-02-01',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr-04',
    name: 'Priya Nair',
    email: 'recruit@technovastudio.dev',
    password: 'NOVA-INIT-KEY',
    role: 'member',
    department: 'Growth & Sales',
    skills: ['Lead Generation', 'Cold Outreach', 'Market Research', 'CRM'],
    clearanceCode: 'LVL-01-RESTRICTED',
    photoInitials: 'PN',
    accentColor: '#059669',
    privateNotes: '',
    managerNotes: '',
    activeProjectIds: ['prj-002'],
    metrics: { tasksCompleted: 6, tasksOverdue: 1, avgCompletionDays: 4.0, hoursLoggedTotal: 52, deliveryRatePct: 86 },
    createdAt: '2025-02-18',
    lastActive: new Date().toISOString(),
  },
];

export const SEED_PROJECTS: StudioProject[] = [
  {
    id: 'prj-001',
    title: 'Aetherius Quantum — WebGL Telemetry Engine',
    description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport. Client requires 120 FPS locked on high-end displays.',
    source: 'CLIENT_INQUIRY',
    type: 'DEV_BUILD',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    trackingCode: 'NV-INQ-1042',
    clientInfo: {
      clientName: 'Vikramaditya Rao',
      company: 'Aetherius Quantum Systems',
      contact: 'v.rao@aetherius.io',
      trackingCode: 'NV-INQ-1042',
      budget: '$45,000',
      expectedRevenue: 45000,
      followUpDate: '2025-04-01',
      leadSource: 'REFERRAL',
    },
    assignedMemberIds: ['usr-02', 'usr-03'],
    managerId: 'usr-02',
    createdBy: 'usr-01',
    startDate: '2025-02-15',
    dueDate: '2025-04-30',
    estimatedHours: 320,
    actualHours: 148,
    resourceLinks: [
      { id: 'lnk-01', label: 'Figma Wireframes', url: 'https://figma.com/file/demo', type: 'figma' },
      { id: 'lnk-02', label: 'GitHub Repo', url: 'https://github.com/technovastudio/aetherius-gl', type: 'repo' },
      { id: 'lnk-03', label: 'Staging Deploy', url: 'https://aetherius-staging.vercel.app', type: 'live_demo' },
    ],
    milestones: [
      { id: 'ms-01', title: 'Core WebGL Canvas Setup', completed: true, createdAt: '2025-02-16' },
      { id: 'ms-02', title: 'Particle System Architecture', completed: true, createdAt: '2025-02-20' },
      { id: 'ms-03', title: 'GLSL Shader Optimization Pass', completed: false, createdAt: '2025-03-01' },
      { id: 'ms-04', title: 'Client Review & QA', completed: false, createdAt: '2025-04-10' },
      { id: 'ms-05', title: 'Production Deployment', completed: false, createdAt: '2025-04-28' },
    ],
    comments: [
      { id: 'cmt-01', authorId: 'usr-02', authorName: 'Riya Sharma', text: 'Initial WebGL canvas is rendering at 118 FPS on M2. Need to optimize for Windows GPU.', createdAt: '2025-02-25T10:30:00Z' },
      { id: 'cmt-02', authorId: 'usr-03', authorName: 'Dev Malhotra', text: 'Found bottleneck in fragment shader — switching to instanced rendering. ETA 2 days.', createdAt: '2025-03-02T14:15:00Z' },
    ],
    hourLogs: [
      { id: 'hl-01', memberId: 'usr-03', memberName: 'Dev Malhotra', hours: 48, description: 'Core WebGL setup + particle system', date: '2025-02-20' },
      { id: 'hl-02', memberId: 'usr-02', memberName: 'Riya Sharma', hours: 100, description: 'Architecture, client calls, code review', date: '2025-03-01' },
    ],
    tags: ['WebGL', 'GLSL', 'Client', 'High-Priority'],
    liveUrl: 'https://aetherius-staging.vercel.app',
    repoUrl: 'https://github.com/technovastudio/aetherius-gl',
    createdAt: '2025-02-14T09:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prj-002',
    title: 'Q2 Lead Generation — FinTech & Defense AI Verticals',
    description: 'Systematic outreach campaign targeting 200+ FinTech startups and Defense AI companies in US & EU markets. Building contact database and sequenced cold email strategy.',
    source: 'INTERNAL_TEAM',
    type: 'LEAD_GEN',
    status: 'ACTIVE',
    priority: 'HIGH',
    assignedMemberIds: ['usr-04'],
    managerId: 'usr-02',
    createdBy: 'usr-02',
    startDate: '2025-03-01',
    dueDate: '2025-04-15',
    estimatedHours: 80,
    actualHours: 22,
    resourceLinks: [
      { id: 'lnk-04', label: 'Target Companies Sheet', url: 'https://docs.google.com/spreadsheets/d/demo', type: 'sheet' },
      { id: 'lnk-05', label: 'Outreach Email Templates', url: 'https://docs.google.com/document/d/demo', type: 'doc' },
    ],
    milestones: [
      { id: 'ms-06', title: 'Compile 200 Target Companies', completed: true, createdAt: '2025-03-02' },
      { id: 'ms-07', title: 'Write 5 Email Template Variants', completed: false, createdAt: '2025-03-10' },
      { id: 'ms-08', title: 'Launch Sequence — Batch 1 (100 contacts)', completed: false, createdAt: '2025-03-20' },
    ],
    comments: [],
    hourLogs: [
      { id: 'hl-03', memberId: 'usr-04', memberName: 'Priya Nair', hours: 22, description: 'Research + initial target list compilation', date: '2025-03-05' },
    ],
    tags: ['Lead Gen', 'Sales', 'Internal', 'FinTech'],
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prj-003',
    title: 'Krypton Defense AI — Spatial Command Interface',
    description: 'Real-Time Spatial Command Interface for defense analytics. Institutional-grade UI with zero-knowledge auth and hardware-accelerated micro-interactions.',
    source: 'CLIENT_INQUIRY',
    type: 'CLIENT_COMMISSION',
    status: 'COMPLETED',
    priority: 'HIGH',
    clientInfo: {
      clientName: 'Elena Rostova',
      company: 'Krypton Defense AI',
      contact: 'e.rostova@krypton.ai',
      budget: '$80,000',
      expectedRevenue: 80000,
      followUpDate: '2025-02-01',
      leadSource: 'COLD_OUTREACH',
    },
    assignedMemberIds: ['usr-01', 'usr-02'],
    managerId: 'usr-01',
    createdBy: 'usr-01',
    startDate: '2025-01-05',
    dueDate: '2025-03-01',
    estimatedHours: 500,
    actualHours: 487,
    resourceLinks: [
      { id: 'lnk-06', label: 'Live Production', url: 'https://krypton-defense.io', type: 'live_demo' },
    ],
    milestones: [
      { id: 'ms-09', title: 'Auth System (Zero-Knowledge)', completed: true, createdAt: '2025-01-08' },
      { id: 'ms-10', title: 'Spatial UI Core', completed: true, createdAt: '2025-01-20' },
      { id: 'ms-11', title: 'Hardware Acceleration + QA', completed: true, createdAt: '2025-02-15' },
      { id: 'ms-12', title: 'Production Launch', completed: true, createdAt: '2025-03-01' },
    ],
    comments: [],
    hourLogs: [],
    tags: ['Defense', 'AI', 'Client', 'Completed'],
    liveUrl: 'https://krypton-defense.io',
    createdAt: '2025-01-04T09:00:00Z',
    updatedAt: '2025-03-01T17:00:00Z',
  },
];

export const SEED_INQUIRIES: ClientInquiry[] = [
  {
    id: 'inq-001',
    trackingCode: 'NV-INQ-1042',
    clientName: 'Siddharth Mehra',
    company: 'NovaPulse Analytics',
    email: 'sid@novapulse.io',
    phone: '+91 98100 45567',
    scope: 'AI-driven real-time data visualization dashboard with WebGL animations',
    budget: '$35,000',
    expectedRevenue: 35000,
    leadSource: 'WEBSITE_HUD',
    preferredCallDate: '2025-04-05',
    status: 'NEW_INQUIRY',
    assignedSalesId: 'usr-04',
    dealNotes: 'Founder reached via booking form. Mentioned urgency — Q2 board demo.',
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    followUpDate: '2025-04-02',
  },
  {
    id: 'inq-002',
    trackingCode: 'NV-CALL-2098',
    clientName: 'Natasha Voronova',
    company: 'Vertex Capital Partners',
    email: 'n.voronova@vertexcap.com',
    phone: '+44 7700 900456',
    scope: 'Full brand identity redesign + interactive investor portal',
    budget: '$60,000',
    expectedRevenue: 60000,
    leadSource: 'REFERRAL',
    preferredCallDate: '2025-04-08',
    status: 'CALL_SCHEDULED',
    assignedSalesId: 'usr-02',
    dealNotes: 'Referred by Elena Rostova (Krypton client). High intent. Call confirmed April 8.',
    submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    followUpDate: '2025-04-08',
  },
];

export const INITIAL_LEADS = SEED_INQUIRIES;

export const SEED_ANNOUNCEMENTS: StudioAnnouncement[] = [
  {
    id: 'ann-001',
    title: 'SPRINT CALL — FRIDAY 6PM IST',
    content: 'Weekly sprint sync mandatory for all active members. Agenda: Aetherius project milestone review + Q2 lead gen targets. Google Meet link: meet.google.com/nova-sprint-01',
    category: 'MEETING',
    authorId: 'usr-01',
    authorName: 'Aryan Kapoor',
    pinned: true,
    readBy: ['usr-01', 'usr-02'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'ann-002',
    title: 'IP PROTECTION POLICY UPDATED',
    content: 'All client code, assets, and system architecture documents are under strict NDA. Do not share project details, staging links, or credentials on any public platform including GitHub public repos. Violations will result in immediate clearance revocation.',
    category: 'POLICY',
    authorId: 'usr-01',
    authorName: 'Aryan Kapoor',
    pinned: true,
    readBy: ['usr-01'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'ann-003',
    title: 'New tooling: GitHub Copilot seats available',
    content: 'We\'ve purchased 3 GitHub Copilot seats for core devs. DM Admin to get your seat assigned. Priority to active build projects.',
    category: 'GENERAL',
    authorId: 'usr-02',
    authorName: 'Riya Sharma',
    pinned: false,
    readBy: ['usr-02'],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export const SEED_SHEETS: CustomSheet[] = [
  {
    id: 'sht-01',
    name: 'Q1_SERVER_TELEMETRY',
    columns: ['NODE_ID', 'REGION', 'LATENCY', 'GPU_LOAD', 'OWNER'],
    rows: [
      { NODE_ID: 'NOVA-MUM-01', REGION: 'AP-SOUTH', LATENCY: '11ms', GPU_LOAD: '42%', OWNER: 'core@technovastudio.dev' },
      { NODE_ID: 'NOVA-FRA-02', REGION: 'EU-CENTRAL', LATENCY: '28ms', GPU_LOAD: '67%', OWNER: 'admin@technovastudio.dev' },
      { NODE_ID: 'NOVA-NY-03', REGION: 'US-EAST', LATENCY: '19ms', GPU_LOAD: '55%', OWNER: 'manager@technovastudio.dev' },
    ],
    createdBy: 'usr-01',
    createdAt: '2025-01-15',
  },
  {
    id: 'sht-02',
    name: 'LEAD_GEN_TRACKER',
    columns: ['COMPANY', 'CONTACT', 'EMAIL', 'STATUS', 'LAST_TOUCH', 'NOTES'],
    rows: [
      { COMPANY: 'Zenith AI Labs', CONTACT: 'Priya K.', EMAIL: 'priya@zenithai.com', STATUS: 'CONTACTED', LAST_TOUCH: '2025-03-10', NOTES: 'Sent intro email. Awaiting reply.' },
      { COMPANY: 'QuantumLeap SaaS', CONTACT: 'Arjun V.', EMAIL: 'arjun@quantumleap.io', STATUS: 'REPLIED', LAST_TOUCH: '2025-03-12', NOTES: 'Positive response. Scheduling call.' },
    ],
    createdBy: 'usr-02',
    createdAt: '2025-03-01',
  },
];

export const SEED_CMS: StudioCMSConfig = {
  aboutUs: {
    heroTagline: 'WE BUILD BEYOND DIGITAL',
    subTagline: 'An elite collective of systems architects and creative technologists.',
    manifesto: 'Technova Studio is not an agency. We are an engineering collective — a unit of high-caliber architects who craft digital experiences that defy conventional browser limits. Every project is custom-engineered from raw shaders, low-level state machines, and precision UI/UX.',
    vision: 'Pioneering zero-latency spatial web experiences and mission-critical digital interfaces for visionary enterprises worldwide.',
    methodology: 'Bespoke GLSL shaders, strict TypeScript type systems, zero-knowledge security, and verified 120 FPS performance standards.',
    securityGuarantee: 'Enterprise NDA enforced on day zero. Zero data leakage, isolated client staging environments, and dedicated engineering clearance.',
    foundedYear: '2024',
    location: 'Remote-First // Global Operations',
    stats: [
      { label: 'FPS Locked', value: '120' },
      { label: 'Projects Shipped', value: '12+' },
      { label: 'Uptime', value: '99.99%' },
      { label: 'Countries', value: '8+' },
    ],
    teamHighlight: 'From WebGL shaders to zero-knowledge auth systems — our team handles the impossible.',
    contactEmail: 'ops@technovastudio.dev',
  },
  portfolioShowcase: [
    {
      id: 'port-01',
      code: 'PRJ // HYPERION-GL',
      title: 'AETHERIUS QUANTUM TELEMETRY',
      category: 'CUSTOM GLSL SHADERS / NEXT.JS / RUST WASM',
      metrics: '120 FPS LOCKED // 1.4M PARTICLES',
      description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport.',
      liveUrl: 'https://aetherius-staging.vercel.app',
      featured: true,
      tags: ['WebGL', 'GLSL', 'Real-Time'],
      thumbnailColor: '#dc2626',
    },
    {
      id: 'port-02',
      code: 'PRJ // KRYPTON-OS',
      title: 'OBSIDIAN FINTECH KERNEL',
      category: 'ZERO-KNOWLEDGE AUTH / SPATIAL UI',
      metrics: '0.02s EXECUTION // INSTITUTIONAL GRADE',
      description: 'Algorithmic liquidity visualization engine engineered with bespoke geometric wireframes and hardware-accelerated micro-interactions.',
      liveUrl: 'https://krypton-defense.io',
      featured: true,
      tags: ['Auth', 'FinTech', 'Spatial UI'],
      thumbnailColor: '#7c3aed',
    },
    {
      id: 'port-03',
      code: 'PRJ // NEURAL-SYNTH',
      title: 'VORTEX AI COMPUTE ENGINE',
      category: 'THREE.JS / DISTRIBUTED NODE GRAPH',
      metrics: '99.99% UPTIME // ENTERPRISE FLEX',
      description: 'Interactive 3D neural topology mapper allowing engineers to inspect live tensor weights in real-time 3D space.',
      liveUrl: 'https://vortex-ai-demo.vercel.app',
      featured: false,
      tags: ['AI', 'Three.js', 'Enterprise'],
      thumbnailColor: '#0891b2',
    },
  ],
  bookingSettings: {
    enabled: true,
    calendarLink: '',
    responseTime: '< 24 hours',
    minimumBudget: '$15,000',
    availableScopes: [
      'IMPOSSIBLE WEBGL / 3D PLATFORM',
      'CUSTOM AI & DISTRIBUTED SYSTEM',
      'HIGH-END BRAND & INTERACTION DESIGN',
      'FULLSTACK PRODUCT ENGINEERING',
    ],
    availableBudgetRanges: [
      '$15,000 - $30,000',
      '$30,000 - $60,000',
      '$60,000 - $120,000',
      '$120,000+ Enterprise',
    ],
    availableCallSlots: [
      '10:00 - 10:45 AM IST',
      '02:00 - 02:45 PM IST',
      '05:00 - 05:45 PM IST',
      '09:00 - 09:45 PM IST (US East / EU Friendly)',
    ],
    callMeetingPlatforms: [
      'Google Meet (Secure Link)',
      'Zoom Enterprise',
      'Direct Encrypted Audio Call',
    ],
  },
};

export const SEED_JOIN_REQUESTS: JoinRequest[] = [
  {
    id: 'join-001',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@graphicslab.io',
    portfolioUrl: 'https://ananya-glsl.art',
    githubUrl: 'https://github.com/ananya-gl',
    department: 'WebGL & Graphics',
    skills: ['Three.js', 'GLSL', 'Compute Shaders', 'WebGPU'],
    statement: 'I specialize in real-time fluid simulation and physics in browser viewports. I want to build world-class digital monuments with Technova Studio.',
    submittedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'PENDING',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  MEMBERS: 'tnova_members',
  PROJECTS: 'tnova_projects',
  INQUIRIES: 'tnova_inquiries',
  ANNOUNCEMENTS: 'tnova_announcements',
  SHEETS: 'tnova_sheets',
  CMS: 'tnova_cms',
  RBAC: 'tnova_rbac',
  ACTIVE_USER: 'tnova_active_user',
  CLIENT_SESSION: 'tnova_client_session',
  JOIN_REQUESTS: 'tnova_join_requests',
};

export function getStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setStore<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function initStore(): void {
  if (typeof window === 'undefined') return;
  const currentMembers = getStore<StudioMember[]>(STORAGE_KEYS.MEMBERS, []);
  const hasSachin = currentMembers.some((m) => m.email.toLowerCase() === 'sachinjajiwaldhora@gmail.com');
  const hasAnuj = currentMembers.some((m) => m.email.toLowerCase() === 'anujb2296@gmail.com');

  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS) || !hasSachin || !hasAnuj) {
    const merged = [...SEED_MEMBERS];
    for (const m of currentMembers) {
      if (!merged.some((x) => x.email.toLowerCase() === m.email.toLowerCase())) {
        merged.push(m);
      }
    }
    setStore(STORAGE_KEYS.MEMBERS, merged);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) setStore(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) setStore(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) setStore(STORAGE_KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
  if (!localStorage.getItem(STORAGE_KEYS.SHEETS)) setStore(STORAGE_KEYS.SHEETS, SEED_SHEETS);
  if (!localStorage.getItem(STORAGE_KEYS.CMS)) setStore(STORAGE_KEYS.CMS, SEED_CMS);
  if (!localStorage.getItem(STORAGE_KEYS.RBAC)) setStore(STORAGE_KEYS.RBAC, DEFAULT_ROLE_PERMISSIONS);
  if (!localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS)) setStore(STORAGE_KEYS.JOIN_REQUESTS, SEED_JOIN_REQUESTS);
}
