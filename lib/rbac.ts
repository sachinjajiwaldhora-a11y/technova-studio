// FILE PATH: lib/rbac.ts
// TECHNOVA STUDIO // RBAC PERMISSION ENGINE

import {
  UserRole,
  RBACPermissions,
  RolePermissionConfig,
  DEFAULT_ROLE_PERMISSIONS,
  STORAGE_KEYS,
  getStore,
} from './store';

// Admin always has full access — never stored in toggles
const ADMIN_PERMISSIONS: RBACPermissions = {
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
  canViewLeads: true,
  canManageLeads: true,
  canAssignLeads: true,
  canConvertLeads: true,
  canManageTargets: true,
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

/**
 * Get the live permissions for a given role.
 * Admin always gets full access.
 * Other roles read from localStorage (manager-configured).
 */
export function getPermissions(role: UserRole): RBACPermissions {
  if (role === 'admin') return ADMIN_PERMISSIONS;

  const configs: RolePermissionConfig[] = getStore(
    STORAGE_KEYS.RBAC,
    DEFAULT_ROLE_PERMISSIONS
  );

  const roleId = role; // 'manager' | 'working_member' | 'member'
  const found = configs.find((c) => c.roleId === roleId);
  return found ? found.permissions : ADMIN_PERMISSIONS;
}

/**
 * Update a single permission toggle for a role.
 * Only admins/managers should call this.
 */
export function updateRolePermission(
  roleId: string,
  permKey: keyof RBACPermissions,
  value: boolean,
  updatedBy: string
): RolePermissionConfig[] {
  const configs: RolePermissionConfig[] = getStore(
    STORAGE_KEYS.RBAC,
    DEFAULT_ROLE_PERMISSIONS
  );

  const updated = configs.map((c) => {
    if (c.roleId === roleId) {
      return {
        ...c,
        permissions: { ...c.permissions, [permKey]: value },
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date().toISOString(),
      };
    }
    return c;
  });

  return updated;
}

/**
 * Get all role configs (for the RBAC settings panel)
 */
export function getAllRoleConfigs(): RolePermissionConfig[] {
  return getStore(STORAGE_KEYS.RBAC, DEFAULT_ROLE_PERMISSIONS);
}

// Friendly labels for all permission keys in the UI
export const PERMISSION_LABELS: Record<keyof RBACPermissions, { label: string; section: string }> = {
  canViewAllProjects:         { label: 'View All Projects', section: 'Projects' },
  canViewOwnProjects:         { label: 'View Own Projects', section: 'Projects' },
  canCreateProject:           { label: 'Create New Projects', section: 'Projects' },
  canEditAnyProject:          { label: 'Edit Any Project', section: 'Projects' },
  canEditOwnProject:          { label: 'Edit Own Projects', section: 'Projects' },
  canDeleteProject:           { label: 'Delete Projects', section: 'Projects' },
  canAssignMembers:           { label: 'Assign Members to Projects', section: 'Projects' },
  canUpdateProjectStatus:     { label: 'Update Project Status', section: 'Projects' },
  canConvertInquiryToProject: { label: 'Convert Inquiry → Active Project', section: 'Projects' },
  canViewClientFinancials:    { label: 'View Client Budget & Revenue', section: 'Projects' },
  canCreateMilestone:         { label: 'Create Milestones', section: 'Tasks & Milestones' },
  canCompleteMilestone:       { label: 'Mark Milestones Complete', section: 'Tasks & Milestones' },
  canLogHours:                { label: 'Log Working Hours', section: 'Tasks & Milestones' },
  canAddProjectLinks:         { label: 'Add Resource Links (Sheet, Docs, Repo)', section: 'Tasks & Milestones' },
  canAddComments:             { label: 'Post Project Comments', section: 'Tasks & Milestones' },
  canViewAllMembers:          { label: 'View Full Team Roster', section: 'Team' },
  canViewMemberDossier:       { label: 'View Member Dossier & Metrics', section: 'Team' },
  canWriteManagerNotes:       { label: 'Write Confidential Manager Notes', section: 'Team' },
  canReadManagerNotes:        { label: 'Read Confidential Manager Notes', section: 'Team' },
  canEditMemberRoles:         { label: 'Edit Member Roles', section: 'Team' },
  canOnboardMembers:          { label: 'Onboard New Members', section: 'Team' },
  canChangePasswords:         { label: 'Reset Member Passwords', section: 'Team' },
  canToggleMemberPermissions: { label: 'Manage RBAC Permissions', section: 'Team' },
  canViewAllInquiries:        { label: 'View All Client Inquiries', section: 'Inquiries & Proposals' },
  canCreateInquiry:           { label: 'Log New Inquiries', section: 'Inquiries & Proposals' },
  canUpdateInquiryStatus:     { label: 'Update Inquiry Status', section: 'Inquiries & Proposals' },
  canViewLeadFinancials:      { label: 'View Inquiry Financial Data', section: 'Inquiries & Proposals' },
  canViewLeads:               { label: 'View Dedicated Leads Pipeline', section: 'Leads & Targets' },
  canManageLeads:             { label: 'Create/Edit Leads & Custom Columns', section: 'Leads & Targets' },
  canAssignLeads:             { label: 'Assign Leads to Specialists', section: 'Leads & Targets' },
  canConvertLeads:            { label: 'Convert Leads to Active Projects', section: 'Leads & Targets' },
  canManageTargets:           { label: 'Configure Studio Target Thresholds', section: 'Leads & Targets' },
  canViewAnalytics:           { label: 'View Analytics Dashboard', section: 'Analytics' },
  canViewRevenueMetrics:      { label: 'View Revenue & Financial KPIs', section: 'Analytics' },
  canViewTeamMetrics:         { label: 'View Team Performance Metrics', section: 'Analytics' },
  canPostAnnouncements:       { label: 'Post Announcements', section: 'Announcements' },
  canPinAnnouncements:        { label: 'Pin Announcements', section: 'Announcements' },
  canManagePortfolioCMS:      { label: 'Manage Portfolio Showcase', section: 'CMS & Website' },
  canManageAboutUs:           { label: 'Edit About Us & Studio Info', section: 'CMS & Website' },
  canManageBookingSettings:   { label: 'Manage Booking & Inquiry Settings', section: 'CMS & Website' },
  canViewDataSheets:          { label: 'View Data Sheets', section: 'Data Sheets' },
  canEditDataSheets:          { label: 'Edit & Add Rows to Sheets', section: 'Data Sheets' },
  canCreateDataSheets:        { label: 'Create New Data Sheets', section: 'Data Sheets' },
};

// Group permission keys by section
export function groupPermissionsBySection(
  permissions: RBACPermissions
): Record<string, { key: keyof RBACPermissions; label: string; value: boolean }[]> {
  const result: Record<string, { key: keyof RBACPermissions; label: string; value: boolean }[]> = {};

  (Object.keys(permissions) as (keyof RBACPermissions)[]).forEach((key) => {
    const meta = PERMISSION_LABELS[key];
    if (!result[meta.section]) result[meta.section] = [];
    result[meta.section].push({ key, label: meta.label, value: permissions[key] });
  });

  return result;
}
