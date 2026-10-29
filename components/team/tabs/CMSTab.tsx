// FILE PATH: components/team/tabs/CMSTab.tsx
'use client';

import React from 'react';
import {
  StudioCMSConfig,
  StudioProject,
  StudioMember,
  RBACPermissions,
  STORAGE_KEYS,
  getStore,
} from '@/lib/store';
import CMSDashboard from '../cms/CMSDashboard';

interface CMSTabProps {
  perms?: RBACPermissions;
  cms?: StudioCMSConfig;
  projects?: StudioProject[];
  members?: StudioMember[];
  currentUser?: StudioMember;
  onCMSChange?: (cms: StudioCMSConfig) => void;
  onProjectsChange?: (projects: StudioProject[]) => void;
}

export default function CMSTab({
  projects = [],
  members = [],
  currentUser,
}: CMSTabProps) {
  // If currentUser is not passed as prop, retrieve active user from storage
  const activeUser =
    currentUser ||
    getStore<StudioMember | null>(STORAGE_KEYS.ACTIVE_USER, null) ||
    ({
      id: 'admin_fallback',
      name: 'Studio Architect',
      email: 'architect@technova.dev',
      password: '',
      role: 'admin',
      department: 'Fullstack Engineering',
      skills: ['Architecture'],
      clearanceCode: 'LVL-5',
      photoInitials: 'SA',
      accentColor: '#00ff66',
    } as unknown as StudioMember);

  return (
    <div className="space-y-6">
      <CMSDashboard
        currentUser={activeUser}
        studioProjects={projects}
        studioMembers={members}
      />
    </div>
  );
}
