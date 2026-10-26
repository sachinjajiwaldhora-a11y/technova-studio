# TECHNOVA STUDIO ⚡

> **Beyond Digital Engineering**  
> Elite Technical Architecture, Real-time WebGL Systems & Cybernetic Internal Command Dashboard.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_R3F-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase Ready](https://img.shields.io/badge/Supabase-PostgreSQL_Ready-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🌟 Executive Overview

**Technova Studio** is an ultra-modern, high-performance web platform combining a cutting-edge **Client-Facing WebGL Experience** with an internal **Enterprise Operations & Team Command Center (ERP / CMS / CRM)**. 

Designed for boutique engineering studios, high-tech agencies, and research teams, it provides client acquisition funnels, transparent client project telemetry tracking, dynamic live CMS controls, and granular Role-Based Access Control (RBAC).

---

## 🚀 Key Modules & Capabilities

### 1. 🌌 Public Studio Experience (`/`)
* **Cybernetic HUD Design System:** Deep-space dark mode, high-contrast red accent palette, custom cursor physics, and terminal bootloader sequence (`BootSequence.tsx`).
* **Real-time 3D Scene (`Scene3D.tsx`):** Powered by Three.js & `@react-three/fiber` with custom GLSL shaders, particle constellations, and interactive depth reaction.
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
Protected behind a military-grade clearance login gateway (`/login`), the internal portal offers 9 unified control centers:

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
* **3D Graphics & Canvas:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Styling & Design System:** Tailwind CSS v4, `@tailwindcss/postcss`, Framer Motion, Lenis Smooth Scroll
* **Icons:** [Lucide React](https://lucide.dev/)
* **Data Storage / Persistence:**
  * **Dual Engine Architecture:**
    1. **Zero-Config LocalStorage Mode:** Runs out-of-the-box with pre-seeded demo state. No setup required.
    2. **Supabase Cloud Mode:** Fully configured PostgreSQL database schema with Row Level Security (RLS) support.

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

## 🌐 Supabase Cloud Database Setup (Optional)

If you wish to synchronize data across multiple users or connect a persistent cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open the file `supabase_schema.sql` in this repo, copy its contents, and run it in the SQL Editor.
4. Create a `.env.local` file by copying `.env.example`:

```bash
cp .env.example .env.local
```

5. Fill in your Supabase project credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

6. Restart your dev server (`npm run dev`). The application will automatically detect Supabase and route reads/writes to your cloud database.

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
│   ├── canvas/
│   │   ├── Scene3D.tsx          # Three.js 3D viewport & particle constellation
│   │   └── Shaders.tsx          # Custom WebGL fragment/vertex shaders
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
3. If using Supabase, add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4. Click **Deploy**.

---

## 📜 License

This project is proprietary and maintained by the **Technova Studio Core Architecture Team**.  
All rights reserved.
