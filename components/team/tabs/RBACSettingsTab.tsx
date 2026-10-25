// FILE PATH: components/team/tabs/RBACSettingsTab.tsx
'use client';

import React, { useState } from 'react';
import {
  RolePermissionConfig, RBACPermissions, StudioMember,
  STORAGE_KEYS, setStore, DEFAULT_ROLE_PERMISSIONS,
} from '@/lib/store';
import {
  groupPermissionsBySection, updateRolePermission,
} from '@/lib/rbac';
import { Shield, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface RBACSettingsTabProps {
  currentUser: StudioMember;
  roleConfigs: RolePermissionConfig[];
  onRoleConfigsChange: (configs: RolePermissionConfig[]) => void;
}

const ROLE_META: Record<string, { label: string; color: string; border: string }> = {
  manager: { label: 'MANAGER / TECH LEAD', color: 'text-violet-400', border: 'border-violet-500/40' },
  working_member: { label: 'WORKING MEMBER', color: 'text-cyan-400', border: 'border-cyan-500/40' },
  member: { label: 'NEW MEMBER (RESTRICTED)', color: 'text-emerald-400', border: 'border-emerald-500/40' },
};

export default function RBACSettingsTab({
  currentUser, roleConfigs, onRoleConfigsChange,
}: RBACSettingsTabProps) {
  const [expandedRoles, setExpandedRoles] = useState<string[]>(['member']);
  const [expandedSections, setExpandedSections] = useState<Record<string, string[]>>({});

  function save(updated: RolePermissionConfig[]) {
    setStore(STORAGE_KEYS.RBAC, updated);
    onRoleConfigsChange(updated);
  }

  function toggle(roleId: string, permKey: keyof RBACPermissions, value: boolean) {
    const updated = updateRolePermission(roleId, permKey, value, currentUser.email);
    const merged = roleConfigs.map((rc) => {
      const found = updated.find((u) => u.roleId === rc.roleId);
      return found || rc;
    });
    save(merged);
  }

  function toggleAll(roleId: string, value: boolean) {
    const updated = roleConfigs.map((rc) => {
      if (rc.roleId !== roleId) return rc;
      const allPerms = Object.fromEntries(
        Object.keys(rc.permissions).map((k) => [k, value])
      ) as unknown as RBACPermissions;
      return { ...rc, permissions: allPerms, lastUpdatedBy: currentUser.email, lastUpdatedAt: new Date().toISOString() };
    });
    save(updated);
  }

  function toggleRoleExpand(roleId: string) {
    setExpandedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  }

  function toggleSectionExpand(roleId: string, section: string) {
    setExpandedSections((prev) => {
      const roleSections = prev[roleId] || [];
      return {
        ...prev,
        [roleId]: roleSections.includes(section)
          ? roleSections.filter((s) => s !== section)
          : [...roleSections, section],
      };
    });
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">ACCESS CONTROL</p>
        <h2 className="text-2xl font-extrabold tracking-tight uppercase">RBAC PERMISSION SETTINGS</h2>
        <p className="mt-1 text-sm text-zinc-400 font-mono">
          Fine-grained access control. Admin always has full access. Toggle permissions per role below.
        </p>
      </div>

      {/* Admin Note */}
      <div className="mb-6 border border-red-500/30 bg-red-950/10 p-4 flex items-start space-x-3">
        <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-[10px] text-red-400 uppercase font-bold">ADMIN CLEARANCE NOTICE</p>
          <p className="font-mono text-[10px] text-zinc-400 mt-0.5">
            Admin role always has full access — unaffected by these toggles.
            All permissions start ON by default. Turn OFF to restrict a role.
          </p>
        </div>
      </div>

      {/* Role Permission Panels */}
      <div className="space-y-4">
        {roleConfigs.map((config) => {
          const meta = ROLE_META[config.roleId];
          if (!meta) return null;
          const isExpanded = expandedRoles.includes(config.roleId);
          const grouped = groupPermissionsBySection(config.permissions);
          const enabledCount = Object.values(config.permissions).filter(Boolean).length;
          const totalCount = Object.keys(config.permissions).length;

          return (
            <div key={config.roleId} className={`border ${meta.border} bg-[#060606] hud-clip overflow-hidden`}>
              {/* Role Header */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggleRoleExpand(config.roleId)}
              >
                <div className="flex items-center space-x-3">
                  <Shield className={`w-4 h-4 ${meta.color}`} />
                  <div>
                    <p className={`font-mono text-xs font-bold ${meta.color}`}>{meta.label}</p>
                    <p className="font-mono text-[8px] text-zinc-500">
                      {enabledCount}/{totalCount} permissions enabled
                      {config.lastUpdatedBy !== 'system' && ` · updated by ${config.lastUpdatedBy}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-20 h-1.5 bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full transition-all ${enabledCount === totalCount ? 'bg-emerald-500' : enabledCount === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${(enabledCount / totalCount) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-zinc-500">{Math.round((enabledCount / totalCount) * 100)}%</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleAll(config.roleId, true); }}
                    className="font-mono text-[8px] border border-emerald-500/40 bg-emerald-950/20 px-2.5 py-1.5 text-emerald-400 hover:bg-emerald-600/20 transition-colors"
                  >
                    ALL ON
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleAll(config.roleId, false); }}
                    className="font-mono text-[8px] border border-red-500/40 bg-red-950/20 px-2.5 py-1.5 text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    ALL OFF
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                </div>
              </div>

              {/* Permission Sections */}
              {isExpanded && (
                <div className="border-t border-white/8 divide-y divide-white/5">
                  {Object.entries(grouped).map(([section, perms]) => {
                    const sectionExpanded = (expandedSections[config.roleId] || []).includes(section);
                    const sectionEnabled = perms.filter((p) => p.value).length;

                    return (
                      <div key={section}>
                        <button
                          onClick={() => toggleSectionExpand(config.roleId, section)}
                          className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-[9px] tracking-widest text-zinc-300 uppercase">{section}</span>
                            <span className={`font-mono text-[8px] px-1.5 py-0.5 border ${sectionEnabled === perms.length ? 'border-emerald-500/40 text-emerald-400' : sectionEnabled === 0 ? 'border-red-500/40 text-red-400' : 'border-amber-500/40 text-amber-400'}`}>
                              {sectionEnabled}/{perms.length}
                            </span>
                          </div>
                          {sectionExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />}
                        </button>

                        {sectionExpanded && (
                          <div className="px-5 pb-4 space-y-2 bg-[#040404]">
                            {perms.map(({ key, label, value }) => (
                              <div
                                key={key}
                                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                              >
                                <span className={`text-sm ${value ? 'text-zinc-200' : 'text-zinc-600'}`}>{label}</span>
                                <button
                                  onClick={() => toggle(config.roleId, key, !value)}
                                  className={`relative w-12 h-6 rounded-full transition-all shrink-0 ${value ? 'bg-emerald-600' : 'bg-zinc-700'}`}
                                >
                                  <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${value ? 'left-7' : 'left-1'}`}
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset to Defaults */}
      <div className="mt-6 border border-white/8 p-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-zinc-300">RESET ALL PERMISSIONS TO DEFAULT (All ON)</p>
          <p className="font-mono text-[9px] text-zinc-600 mt-0.5">This will re-enable every permission for all roles.</p>
        </div>
        <button
          onClick={() => save(DEFAULT_ROLE_PERMISSIONS)}
          className="flex items-center space-x-2 border border-white/15 px-4 py-2 font-mono text-[9px] text-zinc-400 hover:border-red-500 hover:text-white uppercase transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>
    </div>
  );
}
