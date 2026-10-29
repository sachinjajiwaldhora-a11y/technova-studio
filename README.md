# TECHNOVA STUDIO ⚡

> **Beyond Digital Engineering**  
> Technical architecture, interactive studio experiences, and an internal operations dashboard.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Optional_Persistence-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Executive Overview

**Technova Studio** is a Next.js web platform combining a client-facing studio website with an internal operations and CMS dashboard.

Designed for boutique engineering studios, high-tech agencies, and research teams, it provides client acquisition funnels, transparent client project telemetry tracking, dynamic live CMS controls, and granular Role-Based Access Control (RBAC).

---

## 🚀 Key Modules & Capabilities

### 1. 🌌 Public Studio Experience (`/`)
* **Cybernetic HUD Design System:** Deep-space dark mode, high-contrast red accent palette, custom cursor physics, and terminal bootloader sequence (`BootSequence.tsx`).
* **Animated Studio Interface:** Custom CSS/SVG visuals, page transitions, and interactive navigation.
* **Autonomous Robotic Guide (`RoboticAgent.tsx`):** Floating interactive studio assistant providing system status and interactive navigation guidance.
* **Interactive Portfolio Showcase:** Live showcase of studio engineering builds with live sandbox previews, technical tags, and filter states.
* **Client Scoping & Call Booking Engine (`BookingModal.tsx`):**
  * **Mode A (Project Brief):** Detailed scope specification, budget tiering, and milestone delivery preferences.
  * **Mode B (Discovery Call):** Schedule technical consultations with calendar slot reservation and platform selection (Google Meet, Discord, Zoom).
  * Automatically issues a unique tracking hash (e.g. `NV-INQ-1042`).
* **Onboarding & Recruitment Gateway (`JoinUsModal.tsx`):** Structured recruitment intake with GitHub, portfolio validation, and skill verification.

---

### 2. 🛰️ Client Transparency & Project Tracker (`/track`)
* Clients can enter their project tracking hash (e.g. `NV-INQ-1042`) at any time without needing an account.
* **Live Milestones:** Shows real-time progression from Scoping $\rightarrow$ Active Development $\rightarrow$ Code Review $\rightarrow$ Deployment.
* **Project Telemetry:** Assigned lead engineers, target completion dates, expected deliverables, and direct team contacts.

---

### 3. 🛡️ Internal Operations & Team Command Center (`/team`)
Protected by a signed, HttpOnly session issued at `/login`, the internal portal offers 9 control centers:

| Module | Features & Capabilities |
| :--- | :--- |
| **📊 Mission Overview** | Real-time studio stats, active project pipeline counter, revenue metrics, pending leads, and team capacity. |
| **📁 Project Pipelines** | Kanban & list views, milestone progression tracking, live hours logging, git repos, Figma links, and progress algorithms. |
| **💼 Inquiries & CRM** | Complete intake funnel, deal conversion to active projects, budget tracking, and status pipeline. |
| **👥 Team Dossiers** | Member directory, clearance levels, skill tags, performance metrics, and private manager feedback notes. |
| **🔐 Dynamic RBAC Engine** | Role-Based Access Control matrix. Admins/Managers can toggle 30+ permissions across roles in real-time. |
| **📝 Live Portfolio CMS** | Edit showcase projects, "About Us" manifesto, metrics, and booking parameters directly from the browser without code changes. |
| **📈 Analytics Engine** | Financial forecasting, workload distribution charts, and project delivery velocity. |
| **📢 Studio Bulletins** | Internal bulletin system with category badges (Important, Meeting, Policy) and priority pinning. |
| **📑 Custom Data Sheets** | Integrated spreadsheet engine supporting custom schema creation, column addition, and inline data editing. |

---

## ⚡ Tech Stack Architecture

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Runtime / Language:** React 19 + TypeScript 5
* **Motion & Visual Effects:** GSAP, CSS/SVG effects, and optional embedded project previews
* **Styling & Design System:** Tailwind CSS v4, `@tailwindcss/postcss`, and custom CSS theme tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **Data Storage / Persistence:** Browser `localStorage` supports the zero-setup demo; MongoDB-backed API routes persist CMS content, inquiries, projects, announcements, and sheets when configured. Supabase files are legacy scaffolding and are not the active application persistence adapter.

The public tracker queries MongoDB by tracking code when configured and falls back to local demo data otherwise. Some portal modules (including lead/customer/target records and portions of team/RBAC state) still use browser-local storage; use MongoDB-backed collections for shared operational data.

---

## 🛠️ Getting Started (Local Development)

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js**: `v18.17+` (v20+ recommended)
* **npm** or **pnpm** or **yarn**

### 2. Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/sachinjajiwaldhora-a11y/technova-studio.git

# Enter the project directory
cd technova-studio

# Install dependencies
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

> **Note:** The project runs immediately with comprehensive seed data in **LocalStorage fallback mode**. You do not need any database credentials to explore the full platform.

---

## 🔑 Demo Access & Clearance Credentials

To test the internal command portal, navigate to `/login` or click **"PORTAL ENTRY"** in the navigation HUD. Use any of the pre-configured credentials below:

| Role | Email | Password | Clearance Level |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `sachinjajiwaldhora@gmail.com` | `NOVA-SACHIN-2025` | `LVL-09-OMEGA` (Full Root Access) |
| **Co-Admin / Ops** | `anujb2296@gmail.com` | `NOVA-ANUJ-2025` | `LVL-09-OMEGA` (Full Root Access) |
| **Tech Lead / Manager** | `manager@technovastudio.dev` | `NOVA-MGR-KEY` | `LVL-07-SIGMA` (Team & Leads Management) |
| **Working Member** | `core@technovastudio.dev` | `NOVA-CORE-KEY` | `LVL-05-ALPHA` (Assigned Projects & Hours) |
| **Restricted Member** | `recruit@technovastudio.dev` | `NOVA-INIT-KEY` | `LVL-01-RESTRICTED` (Limited Viewer) |

*You can also test the Client Tracker using tracking ID:* `NV-INQ-1042`.

---

## 🍃 MongoDB Setup (Optional)

To persist supported application flows across users:

1. Configure a MongoDB database (Atlas or self-hosted).
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI` and `MONGODB_DB`.
3. Run `npm run seed:mongo` to populate the internal collections.
4. Run `npm run seed:cms` or sign in as an admin and initialize the CMS sections.
5. Restart the dev server and check `/api/health`.

```bash
Copy-Item .env.example .env.local
```

`supabase_schema.sql` and the Supabase client are retained for legacy/reference use; configuring Supabase alone does not activate cloud synchronization in the current app.

LocalStorage-only demo mode is intended for local development, not as a shared production database.

---

## 📂 Project Directory Structure

```plaintext
my-studio-website/
├── app/
│   ├── globals.css              # Cyberpunk HUD theme, scanlines, and typography tokens
│   ├── layout.tsx               # Root layout, HTML wrapper & custom cursor
│   ├── page.tsx                 # Public Studio homepage with WebGL & dynamic sections
│   ├── login/
│   │   └── page.tsx             # Team clearance authentication gateway
│   ├── team/
│   │   └── page.tsx             # Master Operations Command Dashboard
│   └── track/
│       └── page.tsx             # Client project tracking portal
├── components/
│   ├── entry/
│   │   └── BootSequence.tsx     # Futuristic terminal bootloader
│   ├── modals/
│   │   ├── BookingModal.tsx     # Project brief scoping & call booking
│   │   ├── JoinUsModal.tsx      # Team recruitment modal
│   │   └── StatusTrackerModal.tsx # Client tracking code lookup
│   ├── navigation/
│   │   └── FloatingHUD.tsx      # Futuristic glassmorphism navigation dock
│   ├── team/
│   │   ├── DashboardShell.tsx   # Team dashboard navigation & header telemetry
│   │   └── tabs/                # 9 dashboard modules (Analytics, CMS, RBAC, etc.)
│   └── ui/
│       ├── CustomCursor.tsx     # Interactive dot & trailing ring cursor
│       └── RoboticAgent.tsx     # Interactive floating 3D AI assistant
├── lib/
│   ├── rbac.ts                  # Dynamic permission evaluation engine
│   ├── store.ts                 # State management, data schemas & mock seed state
│   └── supabase.ts              # Supabase client connector
├── supabase_schema.sql          # Cloud PostgreSQL schema, tables & RLS policies
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies & scripts
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🛡️ Role-Based Access Control (RBAC) Details

Technova Studio implements a live permission engine (`lib/rbac.ts`). Permissions include:
* **Projects:** `canViewAllProjects`, `canCreateProject`, `canEditAnyProject`, `canDeleteProject`, `canAssignMembers`, `canUpdateProjectStatus`, `canConvertInquiryToProject`, `canViewClientFinancials`
* **Execution:** `canCreateMilestone`, `canCompleteMilestone`, `canLogHours`, `canAddProjectLinks`
* **Team:** `canViewAllMembers`, `canViewMemberDossier`, `canWriteManagerNotes`, `canEditMemberRoles`, `canToggleMemberPermissions`
* **CMS & Settings:** `canManagePortfolioCMS`, `canManageAboutUs`, `canManageBookingSettings`
* **Data:** `canViewDataSheets`, `canEditDataSheets`, `canCreateDataSheets`

Admins can adjust permissions for any non-admin role live from the **RBAC Settings** tab, and changes take effect immediately across all client sessions.

---

## 🚢 Production Deployment

### Deploy to Vercel

The fastest way to deploy Technova Studio is using the [Vercel Platform](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Configure `MONGODB_URI`, `MONGODB_DB`, `AUTH_SESSION_SECRET` (unique random value, at least 32 characters), and `NEXT_PUBLIC_SITE_URL` in the deployment environment. If external lead webhooks are used, also set `LEADS_WEBHOOK_SECRET`.
4. Seed MongoDB from a trusted environment. Do not rely on browser-local demo state for production data.
5. Click **Deploy**, then verify login, CMS draft/publish/history, public inquiry submission, and tracking against the deployed database.

Production team login requires MongoDB and a configured session secret; the local demo login fallback is disabled in production. The team session is stored in a signed HttpOnly cookie. Rotate any seeded credentials before using the portal for real operations.

---

## 📜 License

This project is proprietary and maintained by the **Technova Studio Core Architecture Team**.  
All rights reserved.
