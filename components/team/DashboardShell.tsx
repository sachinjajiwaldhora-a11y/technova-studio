// FILE PATH: components/team/DashboardShell.tsx
'use client';

import React from 'react';
import { StudioMember, UserRole } from '@/lib/store';
import { getPermissions } from '@/lib/rbac';
import { usePortalTheme, PortalTheme } from '@/lib/portal-theme';
import {
  LayoutDashboard, Briefcase, Users, BarChart3, Megaphone,
  Globe, Database, Settings, LogOut, Home, Shield, ChevronRight, Palette, UserPlus, RefreshCw,
} from 'lucide-react';

export type DashboardTab =
  | 'OVERVIEW'
  | 'PROJECTS'
  | 'LEADS'
  | 'INQUIRIES'
  | 'TEAM'
  | 'ANALYTICS'
  | 'ANNOUNCEMENTS'
  | 'CMS'
  | 'RBAC_SETTINGS';

export interface SyncInfo {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  onRefresh: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  requirePerm?: (perms: ReturnType<typeof getPermissions>) => boolean;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'OVERVIEW',      label: 'OVERVIEW',     sublabel: '01 // COMMAND CENTER',  icon: LayoutDashboard },
  { id: 'PROJECTS',      label: 'PROJECTS',     sublabel: '02 // ENGINEERING HUB', icon: Briefcase },
  { id: 'LEADS',         label: 'LEADS',        sublabel: '03 // SALES PIPELINE',   icon: UserPlus,
    requirePerm: (p) => p.canViewLeads },
  { id: 'INQUIRIES',     label: 'INQUIRIES',    sublabel: '04 // CLIENT PIPELINE', icon: Globe,
    requirePerm: (p) => p.canViewAllInquiries || p.canCreateInquiry },
  { id: 'TEAM',          label: 'TEAM',         sublabel: '05 // STUDIO ROSTER',   icon: Users,
    requirePerm: (p) => p.canViewAllMembers },
  { id: 'ANALYTICS',    label: 'ANALYTICS',    sublabel: '06 // TELEMETRY DATA',  icon: BarChart3,
    requirePerm: (p) => p.canViewAnalytics },
  { id: 'ANNOUNCEMENTS',label: 'DISPATCH',     sublabel: '07 // STUDIO NOTICES',  icon: Megaphone },
  { id: 'CMS',           label: 'PUBLIC CMS',   sublabel: '08 // WEBSITE MATRIX',  icon: Globe,
    requirePerm: (p) => p.canManagePortfolioCMS || p.canManageAboutUs, adminOnly: false },
  { id: 'RBAC_SETTINGS', label: 'ACCESS CTRL', sublabel: '09 // RBAC SETTINGS',   icon: Settings,
    requirePerm: (p) => p.canToggleMemberPermissions },
];

interface DashboardShellProps {
  currentUser: StudioMember;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  onGoHome: () => void;
  children: React.ReactNode;
  unreadCount?: number;
  syncInfo?: SyncInfo;
}

export default function DashboardShell({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onGoHome,
  children,
  unreadCount = 0,
  syncInfo,
}: DashboardShellProps) {
  const perms = getPermissions(currentUser.role);
  const { theme, setTheme, cycleTheme } = usePortalTheme();

  const visibleTabs = NAV_ITEMS.filter((item) => {
    if (item.requirePerm && !item.requirePerm(perms)) return false;
    return true;
  });

  const roleColors: Record<UserRole, string> = {
    admin: 'text-red-400 border-red-500/50 bg-red-950/30',
    manager: 'text-violet-400 border-violet-500/50 bg-violet-950/30',
    working_member: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
    member: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30',
  };

  const roleLabel: Record<UserRole, string> = {
    admin: 'ADMIN',
    manager: 'MANAGER',
    working_member: 'WORKING MEMBER',
    member: 'MEMBER',
  };

  return (
    <div
      className="flex min-h-screen portal-theme-wrapper transition-colors duration-200"
      data-portal-theme={theme}
    >
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 border-r portal-sidebar shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b portal-border">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 border border-[var(--portal-accent-border,rgba(239,68,68,0.6))] bg-[var(--portal-accent-bg,rgba(239,68,68,0.1))] flex items-center justify-center hud-clip">
              <Shield className="w-3.5 h-3.5 text-[var(--portal-accent,#ef4444)]" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] text-[var(--portal-text,#fff)] font-bold">TECHNOVA</p>
              <p className="font-mono text-[7px] tracking-[0.18em] text-[var(--portal-text-muted,#71717a)]">COMMAND CONSOLE</p>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="px-4 py-4 border-b portal-border">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: currentUser.accentColor }}
            >
              {currentUser.photoInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--portal-text,#fff)] truncate">{currentUser.name}</p>
              <span className={`inline-block mt-0.5 font-mono text-[8px] tracking-widest border px-1.5 py-0.5 ${roleColors[currentUser.role]}`}>
                {roleLabel[currentUser.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Cloud Sync Radar Indicator */}
        {syncInfo && (
          <div className="mx-3 my-2 px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${syncInfo.isSyncing ? 'animate-ping' : 'animate-pulse'}`} />
              <div>
                <p className="font-mono text-[8px] tracking-wider text-emerald-400 font-bold uppercase">
                  {syncInfo.isSyncing ? 'FETCHING UPDATES...' : 'LIVE SYNC ACTIVE'}
                </p>
                <p className="font-mono text-[7px] text-zinc-400">
                  {syncInfo.lastSyncTime ? `Synced: ${syncInfo.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Cloud Polling (6s)'}
                </p>
              </div>
            </div>
            <button
              onClick={syncInfo.onRefresh}
              disabled={syncInfo.isSyncing}
              title="Force sync now"
              className="p-1 text-emerald-400 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncInfo.isSyncing ? 'animate-spin text-emerald-300' : ''}`} />
            </button>
          </div>
        )}

        {/* Portal Theme Switcher (3 Themes: Dark Tech, Pro Dark, Pro Light) */}
        <div className="px-4 py-3 border-b portal-border space-y-1.5 bg-[var(--portal-surface-sunken,rgba(0,0,0,0.2))]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--portal-text-muted,#71717a)] font-bold flex items-center gap-1">
              <Palette className="w-2.5 h-2.5 text-[var(--portal-accent,#ef4444)]" />
              PORTAL THEME
            </span>
            <span className="font-mono text-[8px] text-[var(--portal-accent,#ef4444)] uppercase font-semibold">
              {theme === 'dark-tech' ? 'DARK TECH' : theme === 'pro-dark' ? 'PRO DARK' : 'PRO LIGHT'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded border portal-border bg-[var(--portal-surface,rgba(0,0,0,0.3))]">
            {(['dark-tech', 'pro-dark', 'pro-light'] as PortalTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`font-mono text-[8px] py-1 rounded uppercase tracking-wider transition-all ${
                  theme === t
                    ? 'bg-[var(--portal-accent,#ef4444)] text-[var(--portal-accent-contrast,#ffffff)] font-bold shadow-sm'
                    : 'text-[var(--portal-text-muted,#71717a)] hover:text-[var(--portal-text,#ffffff)]'
                }`}
              >
                {t === 'dark-tech' ? 'TECH' : t === 'pro-dark' ? 'DARK' : 'LIGHT'}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left transition-all group ${
                  isActive
                    ? 'bg-red-600/20 border border-red-500/50 text-white'
                    : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] tracking-[0.18em] font-bold truncate">{item.label}</p>
                  <p className="font-mono text-[7px] text-zinc-500 truncate">{item.sublabel}</p>
                </div>
                {item.id === 'ANNOUNCEMENTS' && unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[8px] flex items-center justify-center font-bold shrink-0">
                    {unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3 h-3 text-red-500 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="px-3 pb-5 pt-3 border-t border-white/8 space-y-1">
          <button
            onClick={onGoHome}
            className="w-full flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] tracking-widest">HOME MATRIX</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] tracking-widest">TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP NAV ───────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--portal-sidebar,#050505)] border-b portal-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[var(--portal-accent,#ef4444)]" />
          <span className="font-mono text-xs tracking-widest text-[var(--portal-text,#ffffff)] font-bold">TECHNOVA CONSOLE</span>
        </div>
        <div className="flex items-center space-x-2">
          {syncInfo && (
            <button
              onClick={syncInfo.onRefresh}
              disabled={syncInfo.isSyncing}
              className="p-1.5 text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono text-[9px]"
              title="Live Cloud Sync Active"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncInfo.isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            type="button"
            onClick={cycleTheme}
            title="Cycle Portal Theme"
            className="p-1.5 text-[var(--portal-text-muted,#a1a1aa)] hover:text-[var(--portal-text,#ffffff)] flex items-center gap-1 font-mono text-[9px] uppercase"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--portal-accent,#ef4444)]" />
            <span className="hidden sm:inline">{theme}</span>
          </button>
          <button onClick={onGoHome} className="p-1.5 text-[var(--portal-text-muted,#a1a1aa)] hover:text-[var(--portal-text,#ffffff)]">
            <Home className="w-4 h-4" />
          </button>
          <button onClick={onLogout} className="p-1.5 text-[var(--portal-text-muted,#a1a1aa)] hover:text-[var(--portal-accent,#ef4444)]">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--portal-sidebar,#050505)] border-t portal-border flex overflow-x-auto">
        {visibleTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center py-2.5 px-1 min-w-[60px] transition-colors ${
                isActive ? 'text-[var(--portal-accent,#ef4444)]' : 'text-[var(--portal-text-muted,#71717a)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-mono text-[7px] tracking-wider mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-x-hidden md:pt-0 pt-14 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
