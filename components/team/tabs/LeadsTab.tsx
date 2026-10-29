// FILE PATH: components/team/tabs/LeadsTab.tsx
// TECHNOVA STUDIO // DEDICATED LEADS PIPELINE & DYNAMIC SHEET MANAGEMENT
'use client';

import React, { useState, useEffect } from 'react';
import {
  StudioLead, LeadColumn, LeadStatus, LeadSource, StudioMember,
  StudioProject, StudioCustomer, RBACPermissions, DEFAULT_LEAD_COLUMNS,
  STORAGE_KEYS, setStore, getStore, generateCustomerId,
} from '@/lib/store';
import {
  UserPlus, Search, Filter, Plus, Columns, CheckCircle2,
  AlertCircle, ArrowRight, DollarSign, Calendar, Mail, Phone,
  Building2, User, Globe, Link as LinkIcon, Trash2, Edit3,
  ExternalLink, Sparkles, RefreshCw, ChevronDown, Check, X,
  Shield, Code2, Copy, Rocket, Eye, UploadCloud, FileSpreadsheet,
  FileText, File,
} from 'lucide-react';

interface LeadsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  members: StudioMember[];
  projects: StudioProject[];
  leads: StudioLead[];
  columns: LeadColumn[];
  customers: StudioCustomer[];
  onLeadsChange: (leads: StudioLead[]) => void;
  onColumnsChange: (columns: LeadColumn[]) => void;
  onProjectsChange: (projects: StudioProject[]) => void;
  onCustomersChange: (customers: StudioCustomer[]) => void;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; border: string }> = {
  NEW: { label: 'NEW', bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-500/40' },
  CONTACTED: { label: 'CONTACTED', bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-500/40' },
  FOLLOW_UP: { label: 'FOLLOW UP', bg: 'bg-violet-950/40', text: 'text-violet-400', border: 'border-violet-500/40' },
  INTERESTED: { label: 'INTERESTED', bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-500/40' },
  DEAL_WON: { label: 'DEAL WON', bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  LOST: { label: 'LOST', bg: 'bg-zinc-900/40', text: 'text-zinc-500', border: 'border-zinc-700/40' },
};

const SOURCE_BADGES: Record<LeadSource, { label: string; color: string }> = {
  WEBSITE: { label: 'WEBSITE', color: 'text-emerald-400 border-emerald-500/30' },
  MANUAL: { label: 'MANUAL', color: 'text-cyan-400 border-cyan-500/30' },
  WEBHOOK: { label: 'WEBHOOK', color: 'text-violet-400 border-violet-500/30' },
  META_ADS: { label: 'META ADS', color: 'text-blue-400 border-blue-500/30' },
  GOOGLE_ADS: { label: 'GOOGLE ADS', color: 'text-amber-400 border-amber-500/30' },
  REFERRAL: { label: 'REFERRAL', color: 'text-pink-400 border-pink-500/30' },
  OUTREACH: { label: 'OUTREACH', color: 'text-orange-400 border-orange-500/30' },
};

export default function LeadsTab({
  currentUser,
  perms,
  members,
  projects,
  leads,
  columns,
  customers,
  onLeadsChange,
  onColumnsChange,
  onProjectsChange,
  onCustomersChange,
}: LeadsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'ALL'>('ALL');
  const [assignedFilter, setAssignedFilter] = useState<string>('ALL');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState<StudioLead | null>(null);
  const [columnsModalOpen, setColumnsModalOpen] = useState(false);
  const [webhookModalOpen, setWebhookModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<StudioLead | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // File Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count: number;
    detectedType: string;
    warnings?: string[];
    leads?: StudioLead[];
  } | null>(null);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    value: '50000',
    source: 'MANUAL' as LeadSource,
    sourceDetails: '',
    assignedMemberId: currentUser.id,
    notes: '',
    customFields: {} as Record<string, any>,
  });

  // Conversion Form State
  const [convertForm, setConvertForm] = useState({
    title: '',
    managerId: currentUser.id,
    assignedMemberIds: [currentUser.id],
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    estimatedHours: '120',
    priority: 'HIGH' as StudioProject['priority'],
    type: 'DEV_BUILD' as StudioProject['type'],
  });

  // New Column Form State
  const [newColumnForm, setNewColumnForm] = useState({
    label: '',
    type: 'text' as LeadColumn['type'],
    options: '',
  });

  // Filtered Leads list
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) return false;
    if (assignedFilter !== 'ALL' && lead.assignedMemberId !== assignedFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchCompany = lead.company?.toLowerCase().includes(q);
      const matchCustId = lead.customerId?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCompany && !matchCustId) return false;
    }
    return true;
  });

  // Status counters
  const wonCount = leads.filter((l) => l.status === 'DEAL_WON').length;
  const activeLeadsCount = leads.filter((l) => l.status !== 'DEAL_WON' && l.status !== 'LOST').length;
  const pipelineValue = leads
    .filter((l) => l.status !== 'LOST')
    .reduce((sum, l) => sum + (l.value || 0), 0);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    if (!perms.canManageLeads) return;
    const updated = leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : l
    );
    onLeadsChange(updated);
    setStore(STORAGE_KEYS.LEADS, updated);

    // Sync to backend if configured
    try {
      const target = updated.find((l) => l.id === leadId);
      if (target) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        });
      }
    } catch {
      // Local storage handled
    }
  };

  const updateLeadAssignment = async (leadId: string, memberId: string) => {
    if (!perms.canAssignLeads) return;
    const member = members.find((m) => m.id === memberId);
    const updated = leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            assignedMemberId: memberId,
            assignedMemberName: member ? member.name : '',
            updatedAt: new Date().toISOString(),
          }
        : l
    );
    onLeadsChange(updated);
    setStore(STORAGE_KEYS.LEADS, updated);

    try {
      const target = updated.find((l) => l.id === leadId);
      if (target) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        });
      }
    } catch {
      // Local storage handled
    }
  };

  const updateCellCustomField = (leadId: string, colId: string, value: any) => {
    if (!perms.canManageLeads) return;
    const updated = leads.map((l) => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        customFields: {
          ...(l.customFields || {}),
          [colId]: value,
        },
        updatedAt: new Date().toISOString(),
      };
    });
    onLeadsChange(updated);
    setStore(STORAGE_KEYS.LEADS, updated);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email) return;

    const assigned = members.find((m) => m.id === newLeadForm.assignedMemberId);
    const newLead: StudioLead = {
      id: `lead-${Date.now()}`,
      name: newLeadForm.name.trim(),
      email: newLeadForm.email.trim(),
      phone: newLeadForm.phone.trim(),
      company: newLeadForm.company.trim(),
      value: parseInt(newLeadForm.value) || 0,
      status: 'NEW',
      source: newLeadForm.source,
      sourceDetails: newLeadForm.sourceDetails || 'Manual Entry via Command Console',
      assignedMemberId: newLeadForm.assignedMemberId,
      assignedMemberName: assigned ? assigned.name : currentUser.name,
      notes: newLeadForm.notes,
      customFields: newLeadForm.customFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newLead, ...leads];
    onLeadsChange(updated);
    setStore(STORAGE_KEYS.LEADS, updated);
    setCreateModalOpen(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      value: '50000',
      source: 'MANUAL',
      sourceDetails: '',
      assignedMemberId: currentUser.id,
      notes: '',
      customFields: {},
    });

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
    } catch {
      // Local store handled
    }
  };

  const handleOpenConvertModal = (lead: StudioLead) => {
    setConvertModalLead(lead);
    setConvertForm({
      title: `${lead.company || lead.name} — Spatial Engine Platform`,
      managerId: currentUser.id,
      assignedMemberIds: lead.assignedMemberId ? [lead.assignedMemberId] : [currentUser.id],
      dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      estimatedHours: '120',
      priority: lead.value && lead.value > 50000 ? 'CRITICAL' : 'HIGH',
      type: 'DEV_BUILD',
    });
  };

  const handleExecuteConversion = async () => {
    if (!convertModalLead || !perms.canConvertLeads) return;

    const lead = convertModalLead;
    const now = new Date().toISOString();
    const customerId = lead.customerId || generateCustomerId(customers.length);
    const prjId = `prj-${Date.now()}`;
    const trackingCode = `TRK-${customerId}`;

    // 1. Create Customer
    const newCustomer: StudioCustomer = {
      id: customerId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || 'Enterprise Partner',
      firstLeadId: lead.id,
      projectIds: [prjId],
      totalLifetimeValue: lead.value || 0,
      status: 'ACTIVE_CLIENT',
      createdAt: now,
      updatedAt: now,
    };
    const updatedCustomers = [newCustomer, ...customers.filter((c) => c.id !== customerId)];
    onCustomersChange(updatedCustomers);
    setStore(STORAGE_KEYS.CUSTOMERS, updatedCustomers);

    // 2. Create Active Project
    const newProject: StudioProject = {
      id: prjId,
      title: convertForm.title || `${lead.company} Platform Build`,
      description: `Converted from Lead ${lead.id} (${lead.source}). Lead Notes: ${lead.notes || 'Pipeline conversion.'}`,
      source: 'CLIENT_INQUIRY',
      type: convertForm.type,
      status: 'SCOPING',
      priority: convertForm.priority,
      trackingCode,
      customerId,
      clientInfo: {
        clientName: lead.name,
        company: lead.company || '',
        contact: lead.email,
        budget: lead.value ? `$${lead.value.toLocaleString()}` : '$50,000+',
        expectedRevenue: lead.value || 50000,
        followUpDate: convertForm.dueDate,
        leadSource: lead.source,
        trackingCode,
        customerId,
      },
      assignedMemberIds: convertForm.assignedMemberIds,
      managerId: convertForm.managerId,
      createdBy: currentUser.id,
      startDate: now.split('T')[0],
      dueDate: convertForm.dueDate,
      estimatedHours: parseInt(convertForm.estimatedHours) || 120,
      actualHours: 0,
      resourceLinks: [],
      milestones: [
        { id: `ms-${Date.now()}-1`, title: 'Discovery & Engineering Alignment', completed: false, createdAt: now },
        { id: `ms-${Date.now()}-2`, title: 'Core WebGL Shaders & Pipeline Build', completed: false, createdAt: now },
        { id: `ms-${Date.now()}-3`, title: 'Production Staging & Client Verification', completed: false, createdAt: now },
      ],
      comments: [
        {
          id: `cmt-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          text: `Project created via Lead Conversion. Customer ID: ${customerId} linked.`,
          createdAt: now,
        },
      ],
      hourLogs: [],
      tags: ['Converted Lead', 'Active Pipeline', lead.source],
      createdAt: now,
      updatedAt: now,
    };
    const updatedProjects = [newProject, ...projects];
    onProjectsChange(updatedProjects);
    setStore(STORAGE_KEYS.PROJECTS, updatedProjects);

    // 3. Update Lead
    const updatedLeads = leads.map((l) =>
      l.id === lead.id
        ? {
            ...l,
            status: 'DEAL_WON' as LeadStatus,
            customerId,
            convertedProjectId: prjId,
            convertedAt: now,
            updatedAt: now,
          }
        : l
    );
    onLeadsChange(updatedLeads);
    setStore(STORAGE_KEYS.LEADS, updatedLeads);

    setConvertModalLead(null);

    // Sync to backend convert endpoint
    try {
      await fetch('/api/leads/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-id': currentUser.id,
          'x-author-name': currentUser.name,
        },
        body: JSON.stringify({
          leadId: lead.id,
          projectTitle: convertForm.title,
          managerId: convertForm.managerId,
          assignedMemberIds: convertForm.assignedMemberIds,
          dueDate: convertForm.dueDate,
          estimatedHours: convertForm.estimatedHours,
          priority: convertForm.priority,
          type: convertForm.type,
        }),
      });
    } catch {
      // Local fallback handled
    }
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnForm.label.trim()) return;

    const colId = `custom_${newColumnForm.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const newCol: LeadColumn = {
      id: colId,
      label: newColumnForm.label.trim(),
      type: newColumnForm.type,
      options: newColumnForm.options ? newColumnForm.options.split(',').map((o) => o.trim()) : undefined,
      isSystem: false,
      visible: true,
      order: columns.length + 1,
      width: '160px',
    };

    const updated = [...columns, newCol];
    onColumnsChange(updated);
    setStore(STORAGE_KEYS.LEAD_COLUMNS, updated);
    setNewColumnForm({ label: '', type: 'text', options: '' });
  };

  const handleDeleteColumn = (colId: string) => {
    const updated = columns.filter((c) => c.id !== colId || c.isSystem);
    onColumnsChange(updated);
    setStore(STORAGE_KEYS.LEAD_COLUMNS, updated);
  };

  const toggleColumnVisibility = (colId: string) => {
    const updated = columns.map((c) => (c.id === colId ? { ...c, visible: !c.visible } : c));
    onColumnsChange(updated);
    setStore(STORAGE_KEYS.LEAD_COLUMNS, updated);
  };

  const handleImportSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!importFile) {
      setImportError('Please select or drop a valid file (.csv, .xlsx, .xls, .pdf)');
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: {
          'x-author-id': currentUser.id,
          'x-author-name': currentUser.name,
          'x-author-role': currentUser.role,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse and import lead file');
      }

      setImportResult({
        success: true,
        message: data.message,
        count: data.count,
        detectedType: data.detectedType,
        warnings: data.warnings,
        leads: data.leads,
      });

      // Synchronize with state & local store
      if (data.leads && data.leads.length > 0) {
        const mergedLeads = [...data.leads, ...leads];
        onLeadsChange(mergedLeads);
        setStore(STORAGE_KEYS.LEADS, mergedLeads);
      }

      if (data.newColumns && data.newColumns.length > 0) {
        const mergedCols = [...columns, ...data.newColumns];
        onColumnsChange(mergedCols);
        setStore(STORAGE_KEYS.LEAD_COLUMNS, mergedCols);
      }
    } catch (err: any) {
      setImportError(err.message || 'An error occurred while uploading file');
    } finally {
      setImportLoading(false);
    }
  };

  const visibleColumns = columns.filter((c) => c.visible);

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* ─── HEADER & KPI STRIP ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-[var(--portal-accent,#ef4444)] uppercase tracking-[0.3em] font-bold">
              PIPELINE TELEMETRY
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[var(--portal-accent,#ef4444)]/10 text-[var(--portal-accent,#ef4444)] border border-[var(--portal-accent,#ef4444)]/30 font-bold">
              LIVE LEADS HUB
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--portal-text,#ffffff)] mt-1">
            LEAD MANAGEMENT SYSTEM
          </h2>
          <p className="text-xs text-[var(--portal-text-muted,#71717a)] font-mono mt-0.5">
            Incoming ad webhooks, inbound enquiries, sheet-style dynamic columns, and seamless client conversion.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {perms.canManageLeads && (
            <button
              type="button"
              onClick={() => {
                setImportModalOpen(true);
                setImportResult(null);
                setImportError(null);
                setImportFile(null);
              }}
              className="px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] text-[var(--portal-text,#ffffff)] hover:border-emerald-500 hover:text-emerald-400 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>IMPORT LEADS (CSV / EXCEL / PDF)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setWebhookModalOpen(true)}
            className="px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] text-[var(--portal-text,#ffffff)] hover:border-[var(--portal-accent,#ef4444)] flex items-center gap-1.5 transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-violet-400" />
            <span>WEBHOOK API</span>
          </button>

          <button
            type="button"
            onClick={() => setColumnsModalOpen(true)}
            className="px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] text-[var(--portal-text,#ffffff)] hover:border-[var(--portal-accent,#ef4444)] flex items-center gap-1.5 transition-all"
          >
            <Columns className="w-3.5 h-3.5 text-cyan-400" />
            <span>CUSTOM COLUMNS ({columns.length})</span>
          </button>

          {perms.canManageLeads && (
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[var(--portal-accent,#ef4444)] text-[var(--portal-accent-contrast,#ffffff)] hover:opacity-90 flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>NEW LEAD</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── QUICK METRICS STRIP ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] hud-clip">
          <p className="font-mono text-[9px] text-[var(--portal-text-muted,#71717a)] uppercase">ACTIVE PIPELINE</p>
          <p className="text-2xl font-black text-[var(--portal-text,#ffffff)] mt-1">{activeLeadsCount}</p>
          <p className="text-[10px] text-cyan-400 font-mono mt-0.5">In negotiation & outreach</p>
        </div>

        <div className="p-4 rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] hud-clip">
          <p className="font-mono text-[9px] text-[var(--portal-text-muted,#71717a)] uppercase">DEALS WON</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{wonCount}</p>
          <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] font-mono mt-0.5">Converted to projects</p>
        </div>

        <div className="p-4 rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] hud-clip">
          <p className="font-mono text-[9px] text-[var(--portal-text-muted,#71717a)] uppercase">PIPELINE VALUE</p>
          <p className="text-2xl font-black text-[var(--portal-accent,#ef4444)] mt-1">
            ${(pipelineValue / 1000).toFixed(0)}K
          </p>
          <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] font-mono mt-0.5">Estimated gross deal volume</p>
        </div>

        <div className="p-4 rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] hud-clip">
          <p className="font-mono text-[9px] text-[var(--portal-text-muted,#71717a)] uppercase">UNIQUE CLIENTS</p>
          <p className="text-2xl font-black text-violet-400 mt-1">{customers.length}</p>
          <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] font-mono mt-0.5">Assigned Customer IDs</p>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH BAR ──────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded border portal-border bg-[var(--portal-surface-sunken,rgba(0,0,0,0.15))]">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--portal-text-muted,#71717a)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company, customer ID..."
            className="w-full bg-transparent font-mono text-xs text-[var(--portal-text,#ffffff)] placeholder-[var(--portal-text-muted,#71717a)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[var(--portal-text-muted,#71717a)] text-[10px]">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[var(--portal-surface,#18181b)] border portal-border text-[var(--portal-text,#ffffff)] rounded px-2 py-1 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="FOLLOW_UP">FOLLOW UP</option>
              <option value="INTERESTED">INTERESTED</option>
              <option value="DEAL_WON">DEAL WON</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[var(--portal-text-muted,#71717a)] text-[10px]">SOURCE:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="bg-[var(--portal-surface,#18181b)] border portal-border text-[var(--portal-text,#ffffff)] rounded px-2 py-1 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL SOURCES</option>
              <option value="WEBSITE">WEBSITE</option>
              <option value="MANUAL">MANUAL</option>
              <option value="WEBHOOK">WEBHOOK</option>
              <option value="META_ADS">META ADS</option>
              <option value="GOOGLE_ADS">GOOGLE ADS</option>
              <option value="REFERRAL">REFERRAL</option>
              <option value="OUTREACH">OUTREACH</option>
            </select>
          </div>

          {/* Assigned Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[var(--portal-text-muted,#71717a)] text-[10px]">SPECIALIST:</span>
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="bg-[var(--portal-surface,#18181b)] border portal-border text-[var(--portal-text,#ffffff)] rounded px-2 py-1 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">ALL SPECIALISTS</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── DYNAMIC SPREADSHEET TABLE ─────────────────────────────────────── */}
      <div className="rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.2))] overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-xs font-mono">
            {/* Table Header */}
            <thead className="sticky top-0 z-20 bg-[var(--portal-surface-elevated,#1f1f23)] border-b portal-border text-[var(--portal-text-muted,#71717a)] font-bold text-[9px] uppercase tracking-wider select-none">
              <tr>
                <th className="p-3 w-12 text-center border-r portal-border">#</th>
                <th className="p-3 w-32 border-r portal-border">ACTIONS</th>
                {visibleColumns.map((col) => (
                  <th
                    key={col.id}
                    className="p-3 border-r portal-border whitespace-nowrap"
                    style={{ minWidth: col.width || '150px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{col.label}</span>
                      {!col.isSystem && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.id)}
                          title="Remove custom column"
                          className="hover:text-red-400 p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y portal-border text-[var(--portal-text,#ffffff)]">
              {filteredLeads.map((lead, idx) => {
                const statusMeta = STATUS_CONFIG[lead.status];
                const sourceBadge = SOURCE_BADGES[lead.source] || SOURCE_BADGES.MANUAL;
                const isWon = lead.status === 'DEAL_WON';

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-[var(--portal-surface-elevated,rgba(255,255,255,0.03))] transition-colors group"
                  >
                    {/* Index */}
                    <td className="p-3 text-center border-r portal-border text-[var(--portal-text-muted,#71717a)] font-mono text-[10px]">
                      {idx + 1}
                    </td>

                    {/* Actions Column */}
                    <td className="p-2 border-r portal-border whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {/* Convert to Project Action */}
                        {!lead.convertedProjectId ? (
                          <button
                            type="button"
                            onClick={() => handleOpenConvertModal(lead)}
                            title="Convert to Project & Provision Customer ID"
                            className="px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 text-[9px] font-mono font-bold flex items-center gap-1 uppercase tracking-wider transition-all"
                          >
                            <Rocket className="w-3 h-3" />
                            <span>CONVERT</span>
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CONVERTED</span>
                          </span>
                        )}

                        {/* View Lead Details */}
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="p-1 rounded text-[var(--portal-text-muted,#71717a)] hover:text-[var(--portal-text,#ffffff)] hover:bg-white/5"
                          title="View Lead Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Dynamic Columns Rendering */}
                    {visibleColumns.map((col) => {
                      if (col.id === 'name') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border font-bold">
                            <div className="flex flex-col">
                              <span>{lead.name}</span>
                              {lead.sourceDetails && (
                                <span className="text-[9px] text-[var(--portal-text-muted,#71717a)] font-normal truncate max-w-[170px]">
                                  {lead.sourceDetails}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      if (col.id === 'company') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border font-semibold">
                            {lead.company || '—'}
                          </td>
                        );
                      }

                      if (col.id === 'status') {
                        return (
                          <td key={col.id} className="p-2 border-r portal-border whitespace-nowrap">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`px-2 py-1 rounded text-[10px] font-mono font-bold border ${statusMeta.border} ${statusMeta.bg} ${statusMeta.text} focus:outline-none cursor-pointer`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="FOLLOW_UP">FOLLOW UP</option>
                              <option value="INTERESTED">INTERESTED</option>
                              <option value="DEAL_WON">DEAL WON</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                        );
                      }

                      if (col.id === 'source') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border whitespace-nowrap">
                            <span
                              className={`inline-block border px-1.5 py-0.5 rounded text-[8px] font-bold ${sourceBadge.color}`}
                            >
                              {sourceBadge.label}
                            </span>
                          </td>
                        );
                      }

                      if (col.id === 'value') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border font-bold text-emerald-400">
                            ${(lead.value || 0).toLocaleString()}
                          </td>
                        );
                      }

                      if (col.id === 'assignedMemberName') {
                        return (
                          <td key={col.id} className="p-2 border-r portal-border whitespace-nowrap">
                            <select
                              value={lead.assignedMemberId || ''}
                              onChange={(e) => updateLeadAssignment(lead.id, e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-zinc-700 rounded px-1.5 py-1 text-[11px] font-mono text-[var(--portal-text,#ffffff)] focus:outline-none"
                            >
                              <option value="" className="bg-[#18181b]">
                                Unassigned
                              </option>
                              {members.map((m) => (
                                <option key={m.id} value={m.id} className="bg-[#18181b]">
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      if (col.id === 'email') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border text-[var(--portal-text-muted,#71717a)]">
                            <a href={`mailto:${lead.email}`} className="hover:text-cyan-400 underline">
                              {lead.email}
                            </a>
                          </td>
                        );
                      }

                      if (col.id === 'phone') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border text-[var(--portal-text-muted,#71717a)]">
                            {lead.phone ? (
                              <a href={`tel:${lead.phone}`} className="hover:text-cyan-400">
                                {lead.phone}
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                        );
                      }

                      if (col.id === 'customerId') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border font-mono font-bold">
                            {lead.customerId ? (
                              <span className="px-2 py-0.5 rounded bg-violet-950/40 border border-violet-500/40 text-violet-400 text-[10px]">
                                {lead.customerId}
                              </span>
                            ) : (
                              <span className="text-zinc-600 font-normal">Pending Win</span>
                            )}
                          </td>
                        );
                      }

                      if (col.id === 'notes') {
                        return (
                          <td key={col.id} className="p-3 border-r portal-border text-zinc-400 max-w-xs truncate">
                            {lead.notes || '—'}
                          </td>
                        );
                      }

                      // Dynamic Custom Columns
                      const val = lead.customFields?.[col.id] ?? '';
                      return (
                        <td key={col.id} className="p-2 border-r portal-border">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => updateCellCustomField(lead.id, col.id, e.target.value)}
                            placeholder="Click to edit..."
                            className="w-full bg-transparent border border-transparent hover:border-zinc-700 focus:border-[var(--portal-accent,#ef4444)] rounded px-1.5 py-0.5 text-xs text-[var(--portal-text,#ffffff)] focus:outline-none"
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 2}
                    className="py-12 text-center text-xs font-mono text-[var(--portal-text-muted,#71717a)]"
                  >
                    NO MATCHING LEADS FOUND IN PIPELINE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL 1: CREATE LEAD ─────────────────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border portal-border bg-[var(--portal-surface-elevated,#18181b)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b portal-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[var(--portal-accent,#ef4444)]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--portal-text,#ffffff)]">
                  ADD NEW STUDIO LEAD
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Lead Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Company / Org</label>
                  <input
                    type="text"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    value={newLeadForm.value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, value: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Lead Ingestion Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as LeadSource })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    <option value="MANUAL">MANUAL ENTRY</option>
                    <option value="WEBSITE">WEBSITE FORM</option>
                    <option value="META_ADS">META / FACEBOOK ADS</option>
                    <option value="GOOGLE_ADS">GOOGLE ADS</option>
                    <option value="WEBHOOK">WEBHOOK INTEGRATION</option>
                    <option value="REFERRAL">REFERRAL</option>
                    <option value="OUTREACH">OUTREACH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase">Assigned Sales Specialist</label>
                <select
                  value={newLeadForm.assignedMemberId}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, assignedMemberId: e.target.value })}
                  className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase">Notes & Technical Scope Requirements</label>
                <textarea
                  rows={3}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Client background, target deliverables, budget expectations..."
                  className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 border portal-border rounded text-zinc-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--portal-accent,#ef4444)] text-white font-bold rounded hover:opacity-90 shadow-md"
                >
                  CREATE LEAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CONVERT LEAD TO PROJECT & CUSTOMER ID ───────────────── */}
      {convertModalLead && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border portal-border bg-[var(--portal-surface-elevated,#18181b)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b portal-border pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  CONVERT LEAD TO ACTIVE PROJECT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertModalLead(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded border border-emerald-500/30 bg-emerald-950/20 space-y-1 text-xs font-mono">
              <p className="text-emerald-400 font-bold uppercase">AUTOMATIC CUSTOMER ID PROVISIONING</p>
              <p className="text-zinc-300">
                Customer ID: <span className="font-bold text-white">{convertModalLead.customerId || generateCustomerId(customers.length)}</span>
              </p>
              <p className="text-[10px] text-zinc-400">
                This will lock the lead as DEAL WON, register the client in the Studio Customers registry, and instantiate a live project in the Engineering Hub.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase">Live Project Title *</label>
                <input
                  type="text"
                  value={convertForm.title}
                  onChange={(e) => setConvertForm({ ...convertForm, title: e.target.value })}
                  className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Engineering Lead / Manager</label>
                  <select
                    value={convertForm.managerId}
                    onChange={(e) => setConvertForm({ ...convertForm, managerId: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Project Priority Tier</label>
                  <select
                    value={convertForm.priority}
                    onChange={(e) => setConvertForm({ ...convertForm, priority: e.target.value as any })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL // TIER 1</option>
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="NOMINAL">NOMINAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Target Delivery Date</label>
                  <input
                    type="date"
                    value={convertForm.dueDate}
                    onChange={(e) => setConvertForm({ ...convertForm, dueDate: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase">Estimated Hours</label>
                  <input
                    type="number"
                    value={convertForm.estimatedHours}
                    onChange={(e) => setConvertForm({ ...convertForm, estimatedHours: e.target.value })}
                    className="w-full mt-1 bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertModalLead(null)}
                  className="px-3 py-1.5 border portal-border rounded text-zinc-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleExecuteConversion}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-500 shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>INSTANTIATE PROJECT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: MANAGE CUSTOM COLUMNS ───────────────────────────────── */}
      {columnsModalOpen && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border portal-border bg-[var(--portal-surface-elevated,#18181b)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b portal-border pb-3">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  CUSTOM LEAD COLUMNS SCHEMA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setColumnsModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing columns list */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="p-2.5 rounded border portal-border bg-[var(--portal-surface,#09090b)] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleColumnVisibility(col.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        col.visible ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'border-zinc-700'
                      }`}
                    >
                      {col.visible && <Check className="w-2.5 h-2.5" />}
                    </button>
                    <span className="font-bold text-white">{col.label}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">({col.type})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {col.isSystem ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">CORE</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.id)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Delete column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Column Form */}
            <form onSubmit={handleAddColumn} className="border-t portal-border pt-3 space-y-3 font-mono text-xs">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">+ ADD NEW DYNAMIC COLUMN</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Column Label (e.g. Industry, Priority Tier)"
                  value={newColumnForm.label}
                  onChange={(e) => setNewColumnForm({ ...newColumnForm, label: e.target.value })}
                  className="bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
                <select
                  value={newColumnForm.type}
                  onChange={(e) => setNewColumnForm({ ...newColumnForm, type: e.target.value as any })}
                  className="bg-[var(--portal-surface,#09090b)] border portal-border rounded px-2.5 py-1.5 text-white focus:outline-none"
                >
                  <option value="text">TEXT FIELD</option>
                  <option value="number">NUMBER</option>
                  <option value="currency">CURRENCY ($)</option>
                  <option value="date">DATE PICKER</option>
                  <option value="email">EMAIL</option>
                  <option value="phone">PHONE</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-500"
                >
                  APPEND COLUMN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: WEBHOOK ENDPOINT INGESTION DOCS ──────────────────────── */}
      {webhookModalOpen && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border portal-border bg-[var(--portal-surface-elevated,#18181b)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b portal-border pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-violet-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  WEBHOOK INGESTION ENGINE // AD INTEGRATIONS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWebhookModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-zinc-300">
                Connect external ad channels directly into this Leads pipeline. The endpoint auto-normalizes payloads from Zapier, Meta Ads Lead Forms, Google Ads, and custom frontends.
              </p>

              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">LIVE WEBHOOK URL:</p>
                <div className="flex items-center gap-2 p-2 rounded bg-black/60 border portal-border">
                  <code className="text-violet-400 text-[11px] flex-1 break-all select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/leads/webhook` : '/api/leads/webhook'}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/leads/webhook`);
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }
                    }}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">SAMPLE JSON PAYLOAD:</p>
                <pre className="p-3 rounded bg-black/80 border portal-border text-[10px] text-zinc-300 overflow-x-auto">
{`{
  "name": "Alex Mercer",
  "email": "alex.m@apex-compute.com",
  "phone": "+1 555-019-2834",
  "company": "Apex Compute",
  "value": 75000,
  "source": "META_ADS",
  "campaign": "Q4 Enterprise Scale",
  "notes": "Interested in WebGL dashboard commission"
}`}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setWebhookModalOpen(false)}
                  className="px-4 py-1.5 border portal-border rounded text-white hover:bg-white/5"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: LEAD DETAIL DRAWER ──────────────────────────────────── */}
      {selectedLead && (
        <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded border portal-border bg-[var(--portal-surface-elevated,#18181b)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b portal-border pb-3">
              <div>
                <p className="font-mono text-[9px] text-[var(--portal-accent,#ef4444)] uppercase tracking-widest font-bold">
                  LEAD DOSSIER // {selectedLead.id}
                </p>
                <h3 className="font-mono text-base font-bold uppercase text-white mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded border portal-border bg-black/40">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Company:</span>
                  <p className="font-bold text-white mt-0.5">{selectedLead.company || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Estimated Deal Value:</span>
                  <p className="font-bold text-emerald-400 mt-0.5">${(selectedLead.value || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Email:</span>
                  <p className="text-zinc-300 mt-0.5 truncate">{selectedLead.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Phone:</span>
                  <p className="text-zinc-300 mt-0.5">{selectedLead.phone || '—'}</p>
                </div>
              </div>

              {selectedLead.customerId && (
                <div className="p-3 rounded border border-violet-500/40 bg-violet-950/20">
                  <p className="text-[10px] text-violet-400 uppercase font-bold">LINKED CUSTOMER ID:</p>
                  <p className="font-bold text-white text-sm mt-0.5">{selectedLead.customerId}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-zinc-400 uppercase">Notes & Requirements:</span>
                <p className="p-3 mt-1 rounded border portal-border bg-black/30 text-zinc-300 whitespace-pre-wrap">
                  {selectedLead.notes || 'No notes logged.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">
                  Ingested: {new Date(selectedLead.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-1.5 border portal-border rounded text-white hover:bg-white/5"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: IMPORT LEADS (CSV / EXCEL / PDF) ───────────────────────── */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[var(--portal-bg,#0a0a0a)] border border-[var(--portal-border,#27272a)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(0,0,0,0.3))] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-widest">
                    BATCH INGESTION
                  </span>
                  <span className="font-mono text-[9px] text-[var(--portal-text-muted,#71717a)] uppercase tracking-wider">
                    AUTO-MAPPING ENGINE
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[var(--portal-text,#ffffff)] mt-1 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-400" />
                  IMPORT LEADS (CSV / EXCEL / PDF)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportResult(null);
                  setImportError(null);
                  setImportFile(null);
                }}
                className="p-1.5 rounded-lg border border-[var(--portal-border,#27272a)] text-[var(--portal-text-muted,#71717a)] hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Format Badges & Capabilities */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg border border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(255,255,255,0.02))] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    CSV SPREADSHEET
                  </div>
                  <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] mt-0.5">.csv comma / tab delimited</p>
                </div>
                <div className="p-2.5 rounded-lg border border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(255,255,255,0.02))] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    EXCEL WORKBOOK
                  </div>
                  <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] mt-0.5">.xlsx, .xls spreadsheets</p>
                </div>
                <div className="p-2.5 rounded-lg border border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(255,255,255,0.02))] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-rose-400">
                    <FileText className="w-3.5 h-3.5" />
                    PDF DOCUMENT
                  </div>
                  <p className="text-[10px] text-[var(--portal-text-muted,#71717a)] mt-0.5">Tables, dossiers & lists</p>
                </div>
              </div>

              {/* Drag and Drop Upload Zone */}
              {!importResult && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      setImportFile(e.dataTransfer.files[0]);
                      setImportError(null);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : importFile
                      ? 'border-emerald-500/60 bg-[var(--portal-surface,rgba(0,0,0,0.3))]'
                      : 'border-[var(--portal-border,#27272a)] hover:border-emerald-500/40 bg-[var(--portal-surface,rgba(0,0,0,0.2))]'
                  }`}
                >
                  <input
                    type="file"
                    id="lead-file-input"
                    accept=".csv, .xlsx, .xls, .pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImportFile(e.target.files[0]);
                        setImportError(null);
                      }
                    }}
                    className="hidden"
                  />

                  {importFile ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                        {importFile.name.endsWith('.pdf') ? (
                          <FileText className="w-6 h-6 text-rose-400" />
                        ) : (
                          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-[var(--portal-text,#ffffff)] truncate max-w-md mx-auto">
                          {importFile.name}
                        </p>
                        <p className="font-mono text-[11px] text-[var(--portal-text-muted,#71717a)] mt-0.5">
                          {(importFile.size / 1024).toFixed(1)} KB &bull;{' '}
                          {importFile.name.endsWith('.pdf')
                            ? 'PDF Document'
                            : importFile.name.endsWith('.csv')
                            ? 'CSV Data'
                            : 'Excel Spreadsheet'}
                        </p>
                      </div>
                      <label
                        htmlFor="lead-file-input"
                        className="inline-block font-mono text-[11px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Choose a different file
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="lead-file-input" className="cursor-pointer space-y-3 block">
                      <div className="w-12 h-12 rounded-xl bg-[var(--portal-surface,rgba(255,255,255,0.03))] border border-[var(--portal-border,#27272a)] text-[var(--portal-text-muted,#71717a)] flex items-center justify-center mx-auto group-hover:text-emerald-400">
                        <UploadCloud className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-[var(--portal-text,#ffffff)]">
                          Drop your leads file here, or <span className="text-emerald-400 underline">browse</span>
                        </p>
                        <p className="font-mono text-[11px] text-[var(--portal-text-muted,#71717a)] mt-1">
                          Supported extensions: .csv, .xlsx, .xls, .pdf (up to 20MB)
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              )}

              {/* Auto-Mapping Info Card */}
              <div className="p-4 rounded-lg border border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(0,0,0,0.2))] space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-[var(--portal-text,#ffffff)] uppercase">
                    Intelligent Auto-Mapping Schema
                  </span>
                </div>
                <p className="text-xs text-[var(--portal-text-muted,#71717a)] leading-relaxed">
                  The parser automatically maps incoming columns to primary fields:{' '}
                  <span className="text-zinc-300 font-mono">Name</span>,{' '}
                  <span className="text-zinc-300 font-mono">Email</span>,{' '}
                  <span className="text-zinc-300 font-mono">Phone</span>,{' '}
                  <span className="text-zinc-300 font-mono">Company</span>,{' '}
                  <span className="text-zinc-300 font-mono">Deal Value</span>,{' '}
                  <span className="text-zinc-300 font-mono">Status</span>, and{' '}
                  <span className="text-zinc-300 font-mono">Notes</span>. Any additional columns (e.g., industry, country, linkedin) are preserved and dynamically mapped into custom sheet columns.
                </p>
              </div>

              {/* Error Message */}
              {importError && (
                <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-950/20 text-rose-300 font-mono text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Success Result View */}
              {importResult && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-mono text-sm font-bold text-white uppercase">
                          IMPORT COMPLETED SUCCESSFULLY
                        </span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                        DETECTED: {importResult.detectedType}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-emerald-200">
                      {importResult.message} ({importResult.count} records loaded).
                    </p>
                    {importResult.warnings && importResult.warnings.length > 0 && (
                      <div className="pt-2 border-t border-emerald-500/20 font-mono text-[11px] text-amber-300 space-y-0.5">
                        {importResult.warnings.map((w, idx) => (
                          <div key={idx}>&bull; {w}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preview Table of Imported Leads */}
                  {importResult.leads && importResult.leads.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-[var(--portal-text-muted,#71717a)] uppercase tracking-wider">
                        EXTRACTED RECORDS PREVIEW ({importResult.leads.length} LEADS)
                      </span>
                      <div className="max-h-48 overflow-y-auto rounded border border-[var(--portal-border,#27272a)] bg-black/40">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead className="border-b border-[var(--portal-border,#27272a)] text-zinc-400 text-[10px] uppercase bg-black/60 sticky top-0">
                            <tr>
                              <th className="py-1.5 px-3">Name</th>
                              <th className="py-1.5 px-3">Email</th>
                              <th className="py-1.5 px-3">Company</th>
                              <th className="py-1.5 px-3">Value</th>
                              <th className="py-1.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--portal-border,#27272a)]/40 text-zinc-300">
                            {importResult.leads.slice(0, 10).map((l, idx) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="py-1.5 px-3 font-bold text-white truncate max-w-[120px]">{l.name}</td>
                                <td className="py-1.5 px-3 truncate max-w-[140px] text-zinc-400">{l.email || '—'}</td>
                                <td className="py-1.5 px-3 truncate max-w-[120px]">{l.company || '—'}</td>
                                <td className="py-1.5 px-3 text-emerald-400 font-bold">${(l.value || 0).toLocaleString()}</td>
                                <td className="py-1.5 px-3">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase">
                                    {l.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {importResult.leads.length > 10 && (
                        <p className="font-mono text-[10px] text-zinc-500 text-right">
                          + {importResult.leads.length - 10} more leads imported to pipeline
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--portal-border,#27272a)] bg-[var(--portal-surface,rgba(0,0,0,0.3))] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportResult(null);
                  setImportError(null);
                  setImportFile(null);
                }}
                className="px-4 py-2 border border-[var(--portal-border,#27272a)] rounded font-mono text-xs font-bold text-[var(--portal-text-muted,#71717a)] hover:text-white hover:bg-white/5 transition-colors"
              >
                {importResult ? 'CLOSE' : 'CANCEL'}
              </button>

              {importResult ? (
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportResult(null);
                    setImportError(null);
                    setImportFile(null);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>VIEW IN PIPELINE</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleImportSubmit()}
                  disabled={!importFile || importLoading}
                  className={`px-5 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                    !importFile || importLoading
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer'
                  }`}
                >
                  {importLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>PARSING & INGESTING...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>UPLOAD & PARSE LEADS</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

