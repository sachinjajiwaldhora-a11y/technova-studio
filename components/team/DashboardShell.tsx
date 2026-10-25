// FILE PATH: components/team/DashboardShell.tsx
'use client';

import React from 'react';
import { StudioMember, UserRole } from '@/lib/store';
import { getPermissions } from '@/lib/rbac';
import {
  LayoutDashboard, Briefcase, Users, BarChart3, Megaphone,
  Globe, Database, Settings, LogOut, Home, Shield, ChevronRight,
} from 'lucide-react';

export type DashboardTab =
  | 'OVERVIEW'
  | 'PROJECTS'
  | 'INQUIRIES'
  | 'TEAM'
  | 'ANALYTICS'
  | 'ANNOUNCEMENTS'
  | 'CMS'
  | 'RBAC_SETTINGS';

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
  { id: 'INQUIRIES',     label: 'INQUIRIES',    sublabel: '03 // CLIENT PIPELINE', icon: Globe,
    requirePerm: (p) => p.canViewAllInquiries || p.canCreateInquiry },
  { id: 'TEAM',          label: 'TEAM',         sublabel: '04 // STUDIO ROSTER',   icon: Users,
    requirePerm: (p) => p.canViewAllMembers },
  { id: 'ANALYTICS',    label: 'ANALYTICS',    sublabel: '05 // TELEMETRY DATA',  icon: BarChart3,
    requirePerm: (p) => p.canViewAnalytics },
  { id: 'ANNOUNCEMENTS',label: 'DISPATCH',     sublabel: '06 // STUDIO NOTICES',  icon: Megaphone },
  { id: 'CMS',           label: 'PUBLIC CMS',   sublabel: '07 // WEBSITE MATRIX',  icon: Globe,
    requirePerm: (p) => p.canManagePortfolioCMS || p.canManageAboutUs, adminOnly: false },
  { id: 'RBAC_SETTINGS', label: 'ACCESS CTRL', sublabel: '08 // RBAC SETTINGS',   icon: Settings,
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
}

export default function DashboardShell({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onGoHome,
  children,
  unreadCount = 0,
}: DashboardShellProps) {
  const perms = getPermissions(currentUser.role);

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
    <div className="flex min-h-screen bg-[#030303] text-white">
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/8 bg-[#050505] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 border border-red-500/60 bg-red-950/40 flex items-center justify-center hud-clip">
              <Shield className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] text-white font-bold">TECHNOVA</p>
              <p className="font-mono text-[7px] tracking-[0.18em] text-zinc-500">COMMAND CONSOLE</p>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="px-4 py-4 border-b border-white/8">
          <div className="flex items-center space-x-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: currentUser.accentColor }}
            >
              {currentUser.photoInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <span className={`inline-block mt-0.5 font-mono text-[8px] tracking-widest border px-1.5 py-0.5 ${roleColors[currentUser.role]}`}>
                {roleLabel[currentUser.role]}
              </span>
            </div>
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#050505] border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="font-mono text-xs tracking-widest text-white font-bold">TECHNOVA CONSOLE</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onGoHome} className="p-1.5 text-zinc-400 hover:text-white">
            <Home className="w-4 h-4" />
          </button>
          <button onClick={onLogout} className="p-1.5 text-zinc-400 hover:text-red-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-white/8 flex overflow-x-auto">
        {visibleTabs.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center py-2.5 px-1 min-w-[60px] transition-colors ${
                isActive ? 'text-red-500' : 'text-zinc-500'
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
