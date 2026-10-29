# Dedicated Lead Management, Customer ID & Target Tracking Architecture

## Overview
This document specifies the architecture, data models, API contracts, and lifecycle workflows implemented on branch `workflow-update` for Technova Studio.

---

## 1. Dedicated Lead Management System (Lead Pipeline)
The Leads system is distinct from the public website project inquiries (`ClientInquiry` in `InquiriesTab`). While website inquiries are incoming prospect messages from the public contact forms, the Leads Pipeline (`StudioLead` in `LeadsTab`) is an active sales pipeline sheet.

### Dynamic Sheet & Custom Columns
Instead of a rigid CSV or SQL structure, the leads pipeline is modeled as an agile custom spreadsheet:
- **Columns Model (`LeadColumn`)**:
  - `id`: Unique column identifier
  - `label`: Header label
  - `type`: `text` | `number` | `select` | `date` | `url` | `badge`
  - `options`: Select dropdown choices
  - `isSystem`: System columns (`title`, `company`, `contactName`, `email`, `estimatedValue`, `source`, `status`, `assignedTo`) cannot be deleted, but can be rearranged.
  - `visible`: Toggle column visibility
  - `width`: Dynamic column pixel width
- **Custom Field Values**: Dynamic column values are stored flexibly in `lead.customFields[columnId]` without requiring DB schema migrations.

### Multi-Source Support
Leads can be ingested from:
- `WEBSITE`: Converted or synced from web inquiries
- `MANUAL`: Created directly by managers in the Team Portal
- `WEBHOOK`: Ingested via `/api/leads/webhook` from Zapier, Make, n8n, or landing pages
- `META_ADS`: Ingested from Facebook / Instagram Lead Ads
- `GOOGLE_ADS`: Ingested from Google Ads lead forms
- `LINKEDIN`: Ingested from LinkedIn Lead Gen forms
- `REFERRAL` & `PARTNER`: Organic partner referrals

---

## 2. Lead Lifecycle & Assignment Tracking
Each lead has an assigned specialist (`lead.assignedTo`) and a defined lifecycle status:

| Status | Code | Meaning |
|---|---|---|
| New | `NEW` | Fresh lead ingested, awaiting qualification |
| Contacted | `CONTACTED` | First outreach initiated by assigned team member |
| Follow-up | `FOLLOW_UP` | In active correspondence / demo scheduled |
| Interested | `INTERESTED` | Scope validated, proposal under evaluation |
| Deal Won | `DEAL_WON` | Agreement confirmed / ready for project onboarding |
| Lost | `LOST` | Opportunity closed without conversion |

### Deal Conversion to Project & Main Pipeline
When a lead is marked `DEAL_WON` (or via the **Convert to Project** action button in the Leads table / dossier):
1. Calls `/api/leads/convert`.
2. Generates a unique **Customer ID** (`CUST-YYYY-XXX`).
3. Upserts the customer into the `studio_customers` collection.
4. Generates an active project record in `studio_projects` linked to the Customer ID and lead details.
5. Issues a client tracking code formatted as `TRK-CUST-YYYY-XXX`.
6. Sets `lead.convertedProjectId` and `lead.customerId`.

---

## 3. Customer ID System
- **Format**: `CUST-YYYY-XXX` (e.g. `CUST-2026-001`, `CUST-2026-002`).
- **Generation Logic**: Evaluates the highest existing sequence number for the current calendar year across leads, customers, and projects, incrementing safely with zero-padding.
- **Cross-System Association**:
  - `StudioCustomer.id`: `CUST-YYYY-XXX`
  - `StudioLead.customerId`: `CUST-YYYY-XXX`
  - `StudioProject.customerId`: `CUST-YYYY-XXX`
  - `StudioProject.clientInfo.customerId`: `CUST-YYYY-XXX`
  - `StudioProject.trackingCode`: `TRK-CUST-YYYY-XXX`

---

## 4. Overview Dashboard Target Tracking & Velocity
An interactive widget on `OverviewTab.tsx` tracks sales and delivery goals in real-time.

### Target Types:
1. `REVENUE`: Monthly gross sales pipeline & won deals.
2. `DEALS_WON`: Closed-won sales deals and locked project contracts.
3. `LEADS_CONTACTED`: Leads progressed beyond `NEW` status.
4. `PROJECTS_DELIVERED`: Studio projects completed with 100% delivery.

### Real-Time Auto-Sync Calculation:
- **Won Revenue**: $\sum \text{Lead.estimatedValue } (\text{status} = \text{DEAL\_WON}) + \sum \text{Inquiry.expectedRevenue } (\text{status} = \text{LOCKED\_DEAL})$.
- **Deals Won Count**: Count of leads with `DEAL_WON` + inquiries with `LOCKED_DEAL`.
- **Leads Contacted Count**: Count of leads where status $\in \{\text{CONTACTED}, \text{FOLLOW\_UP}, \text{INTERESTED}, \text{DEAL\_WON}\}$.
- **Projects Delivered Count**: Count of projects where status = `COMPLETED`.

Admins can configure target thresholds directly via the **Configure Targets** modal, persisting to `/api/targets` and `studio_targets`.

---

## 5. RBAC & Access Control
Extended `RBACPermissions` with 5 granular sales & goal permissions:
- `canViewLeads`: View the dedicated Leads pipeline tab and lead records.
- `canManageLeads`: Create, edit, and delete leads, manage custom columns.
- `canAssignLeads`: Assign leads to specific team members.
- `canConvertLeads`: Convert `DEAL_WON` leads into active projects and generate Customer IDs.
- `canManageTargets`: Edit and configure studio revenue/deal target goals.

Enforced across:
- Navigation items in `DashboardShell.tsx`
- Action buttons & controls in `LeadsTab.tsx` and `OverviewTab.tsx`
- Server-side API validation in `app/api/leads/**` and `app/api/targets/**`.
