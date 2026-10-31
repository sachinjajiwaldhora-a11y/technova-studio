# TECHNOVA STUDIO ⚡

> **Beyond Digital Engineering // Autonomous Studio Platform & Operations Matrix**  
> High-performance digital architecture, interactive 3D/WebGL experiences, and real-time enterprise operations management.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud_DB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Vercel Deployed](https://img.shields.io/badge/Deployment-Vercel_Edge-000000?style=for-the-badge&logo=vercel)](https://technova-studio-roan.vercel.app)

---

## 🌟 Executive Overview

**Technova Studio** is a fullstack Next.js web application engineered for boutique design engineering agencies, WebGL shader labs, and AI architecture teams. It seamlessly unifies:

1. **A Cybernetic Public Presence (`/`)**: High-contrast HUD aesthetics, interactive portfolio showcases, automated candidate recruitment, and secure client booking pipelines.
2. **Real-time Client Telemetry Portal (`/track`)**: Public, account-less sprint tracking where clients follow live milestones using unique tracking tokens.
3. **Internal Operations Command Center (`/team`)**: Secured by signed HttpOnly sessions (`scrypt` password hashing), featuring 9 operational modules for sprint management, CRM leads pipelines, candidate clearance & passkey onboarding, live CMS content management, and dynamic RBAC.

---

## 🚀 Key Modules & Capabilities

### 1. 🌌 Public Studio Experience (`/`)
* **Cybernetic HUD Design System:** Deep-space dark theme, high-contrast typography, interactive floating HUD dock, and cinematic boot sequence (`BootSequence.tsx`).
* **Interactive Portfolio Showcase:** Filterable engineering builds with sandbox previews, technical tags, and live external demo links.
* **Autonomous Robotic Guide (`RoboticAgent.tsx`):** Floating interactive studio assistant providing system status and navigation guidance.
* **Client Scoping & Call Booking Engine (`BookingModal.tsx`):**
  * **Project Brief:** Scope specification, budget tiering, and milestone delivery preferences.
  * **Discovery Call:** Direct calendar slot reservation and platform selection (Google Meet, Zoom, Secure Audio).
  * **Synchronous Lock & Backend Deduplication:** Submissions are protected by `useRef` locks and a 2-minute backend idempotency guard to eliminate duplicate requests.
  * Automatically issues a unique tracking hash (e.g., `NV-INQ-1042`).
* **Talent Recruitment Gateway (`JoinUsModal.tsx` & `ArchitectSection.tsx`):**
  * Direct intake dossier submission for shader engineers, systems architects, and UI designers.
  * Automatically registers dossiers with `status: PENDING` into MongoDB and alerts the internal team console in real-time.

---

### 2. 🛰️ Client Transparency & Project Tracker (`/track`)
* Clients enter their tracking hash (e.g., `NV-INQ-1042` or `NV-CALL-...`) without requiring an account or password.
* **Live Milestones Progression:** Real-time visual pipeline: `SCOPING` $\rightarrow$ `ACTIVE DEVELOPMENT` $\rightarrow$ `CODE REVIEW` $\rightarrow$ `DEPLOYMENT`.
* **Telemetry Data:** Shows assigned squad lead, expected delivery dates, client deliverables, and direct secure contact channels.

---

### 3. 🛡️ Master Operations Command Center (`/team`)
Protected by signed HttpOnly session cookies issued at `/login`. Features 9 high-velocity operational control modules:

| Module | Features & Capabilities |
| :--- | :--- |
| **📊 OVERVIEW** | Real-time studio KPI stat cards, velocity telemetry, quarterly milestone tracking, monthly target progress widgets, active project health bars, and studio dispatch notices. |
| **📁 PROJECTS** | Active engineering sprints, Kanban & list views, milestone progression tracking, live customer ID linking, GitHub repository references, and completion algorithms. |
| **💼 LEADS & PIPELINE** | Interactive CRM Kanban board, customizable column builder, stage tracking (`NEW`, `CONTACTED`, `FOLLOW_UP`, `INTERESTED`, `DEAL_WON`, `LOST`), CSV/Excel batch import, and deal valuation. |
| **📩 INQUIRIES** | Incoming project briefs and scheduled discovery calls. Includes deal conversion to active engineering projects with automated client credentials. |
| **👥 TEAM ROSTER** | Member directory, clearance levels (`LVL-01` to `LVL-09`), department assignments, performance metrics, and private manager notes. |
| **⚡ ONBOARDING QUEUE** | Candidate review queue. Admins can accept applicants, assign clearance roles, auto-generate secure passkeys, and immediately activate members into the live roster. |
| **📈 ANALYTICS** | Financial pipeline forecasting, revenue distribution charts, deal closure velocity, and operative workload telemetry. |
| **📢 DISPATCH** | Studio bulletin board with categorized tags (`IMPORTANT`, `MEETING`, `POLICY`, `GENERAL`) and priority announcement pinning. |
| **📝 PUBLIC CMS** | Live content management system. Edit showcase projects, "About Us" manifesto, metrics, and booking parameters directly from the browser with version rollback and audit logs. |
| **🔐 ACCESS CTRL (RBAC)**| Granular Role-Based Access Control matrix. Admins can toggle 30+ permissions across roles (`admin`, `manager`, `working_member`, `member`) with instant live propagation. |

---

## ⚡ Tech Stack Architecture

* **Framework:** [Next.js 16 (App Router with Turbopack)](https://nextjs.org/)
* **Runtime / Language:** React 19 + TypeScript 5
* **Styling & Design System:** Tailwind CSS v4, `@tailwindcss/postcss`, custom CSS design tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animations:** GSAP & GPU-accelerated CSS transitions
* **Primary Database:** [MongoDB Atlas](https://www.mongodb.com/) via official native Node.js driver (`mongodb` v7.7) with pooled connections (`lib/mongodb.ts`)
* **Security & Auth:** Signed HttpOnly session cookies (`technova_session`), Node.js `crypto.scrypt` password hashing with cryptographic salt verification (`lib/password.ts`, `lib/auth.ts`)
* **Deployment:** [Vercel](https://vercel.com/) with Edge optimization

---

## 🛠️ Getting Started (Local Development)

### 1. Prerequisites
* **Node.js**: `v18.17+` (v20+ recommended)
* **npm** or **pnpm** or **yarn**
* **MongoDB**: A MongoDB Atlas connection string (or local MongoDB running on `mongodb://127.0.0.1:27017`)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/sachinjajiwaldhora-a11y/technova-studio.git

# Enter the project directory
cd my-studio-website

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# MongoDB Atlas Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=technova_studio

# Session Security Secret (minimum 32 characters)
AUTH_SESSION_SECRET=7c8f9b2d4e6a1f3c8b5e9d2a4f6c8b1e7a3d5f9b2c4e6a8f1d3b5e7a9c2d4f6a

# Optional Webhook Secret for External Leads Integration
LEADS_WEBHOOK_SECRET=technova-webhook-secret-token-2026

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Seeding

Populate initial admin accounts, collections, and CMS records:

```bash
# Seed core collections (members, projects, inquiries, leads, announcements)
npm run seed:mongo

# Seed dynamic public CMS sections
npm run seed:cms
```

### 5. Launch Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Default Clearance Credentials

To access the internal dashboard, navigate to `/login` and use one of the pre-configured clearance accounts:

| Role | Email | Password | Clearance Level |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `sachinjajiwaldhora@gmail.com` | `NOVA-SACHIN-2025` | `LVL-09-OMEGA` (Full Root Access) |
| **Co-Admin / Ops** | `anujb2296@gmail.com` | `NOVA-ANUJ-2025` | `LVL-09-OMEGA` (Full Root Access) |
| **Tech Lead / Manager** | `manager@technovastudio.dev` | `NOVA-MGR-KEY` | `LVL-07-SIGMA` (Team & Leads Management) |
| **Working Member** | `core@technovastudio.dev` | `NOVA-CORE-KEY` | `LVL-05-ALPHA` (Assigned Sprints & Tasks) |
| **Restricted Member** | `recruit@technovastudio.dev` | `NOVA-INIT-KEY` | `LVL-01-RESTRICTED` (View Only) |

*You can also test the Client Transparency Portal (`/track`) using tracking ID:* `NV-INQ-1042`.

---

## 🍃 MongoDB Collections Reference

The application manages data within the following dedicated MongoDB collections:

* `studio_members`: Team directory, roles, hashed passwords (`scrypt`), clearance levels, and metrics.
* `studio_projects`: Active engineering builds, milestone arrays, customer ID links, and progress telemetry.
* `studio_inquiries`: Inbound project briefs, call booking schedules, and tracking tokens.
* `studio_leads`: CRM pipeline entries, contact stages, deal valuation, and assigned specialists.
* `studio_lead_columns`: Customizable Kanban column definitions and order.
* `studio_targets`: Monthly/quarterly revenue and sprint velocity target definitions.
* `studio_join_requests`: Candidate recruitment applications with department, portfolio, and review status.
* `studio_announcements`: Dispatch board notices, categories, and author metadata.
* `studio_sheets`: Custom structured data spreadsheets and table columns.
* `cms_sections`: Live CMS section definitions (Hero, About, Services, Featured Work, etc.).
* `cms_versions`: Historic version rollback snapshots for CMS edits.
* `cms_audit_log`: Audit trail recording who made edits and when.

---

## 📂 Project Directory Structure

```plaintext
my-studio-website/
├── app/
│   ├── globals.css                 # Cyberpunk HUD theme, scanlines, and typography tokens
│   ├── layout.tsx                  # Root layout, HTML wrapper & custom cursor
│   ├── page.tsx                    # Public Studio homepage with interactive dynamic sections
│   ├── login/
│   │   └── page.tsx                # Team clearance authentication gateway
│   ├── team/
│   │   ├── page.tsx                # Master Operations Command Dashboard
│   │   ├── data/page.tsx           # Standalone data matrix viewer
│   │   └── tasks/page.tsx          # Operative sprint tasks list
│   ├── track/
│   │   └── page.tsx                # Public client project tracking portal
│   └── api/
│       ├── auth/                   # Login, logout, and session verification routes
│       ├── cms/                    # Content, audit logs, featured projects, upload, versions
│       ├── data/[collection]/      # Unified MongoDB REST handler (GET, POST, PUT, DELETE)
│       ├── health/                 # Database connection health check endpoint
│       ├── leads/                  # CRM operations, import, convert, and webhooks
│       ├── seed/                   # HTTP database seed endpoints
│       ├── targets/                # Target tracking & velocity metrics
│       └── track/                  # Public client tracking lookup
├── components/
│   ├── entry/
│   │   └── BootSequence.tsx        # Futuristic terminal bootloader
│   ├── modals/
│   │   ├── BookingModal.tsx        # Project brief scoping & call booking with deduplication
│   │   ├── JoinUsModal.tsx         # Talent recruitment application modal
│   │   └── StatusTrackerModal.tsx  # Client tracking code lookup modal
│   ├── navigation/
│   │   ├── Navbar.tsx              # Public header navigation
│   │   ├── Footer.tsx              # Public footer with quick dispatch triggers
│   │   ├── FloatingHUD.tsx         # Futuristic glassmorphism navigation dock
│   │   └── CommandPalette.tsx      # Global quick-action search palette
│   ├── sections/                   # Public landing page sections (Hero, FeaturedWork, etc.)
│   ├── team/
│   │   ├── DashboardShell.tsx      # Team dashboard navigation, user badge, and live sync radar
│   │   ├── cms/                    # Live CMS Dashboard, section editors, media uploader
│   │   └── tabs/                   # 9 Command Center modules (Overview, Projects, Leads, etc.)
│   └── ui/
│       ├── CustomCursor.tsx        # Interactive trailing cursor
│       └── RoboticAgent.tsx        # Autonomous floating AI guide
├── lib/
│   ├── auth.ts                     # Session creation, JWT/HMAC cookie verification
│   ├── mongodb.ts                  # MongoDB connection pool & collection constants
│   ├── mongodb-client.ts           # Frontend client adapter for MongoDB REST calls
│   ├── password.ts                 # Cryptographic scrypt password hashing & verification
│   ├── rbac.ts                     # Dynamic permission evaluation engine
│   └── store.ts                    # Global store definitions, TypeScript schemas & defaults
├── scripts/
│   ├── seed-mongodb.mjs            # Production MongoDB seeding script
│   └── seed-cms.mjs                # Production CMS sections seeding script
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies & npm scripts
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Configure the following Environment Variables in Vercel:
   - `MONGODB_URI`: Your production MongoDB Atlas connection string.
   - `MONGODB_DB`: `technova_studio`
   - `AUTH_SESSION_SECRET`: A secure random 64-character secret string.
   - `NEXT_PUBLIC_SITE_URL`: Your live domain (e.g., `https://technova-studio-roan.vercel.app`).
4. Trigger deployment. Vercel will automatically compile the Next.js Turbopack build.
5. Verify live operations:
   - Public Website: `/`
   - Booking & Candidacy Submissions: Tested with automated deduplication
   - Live Tracking Portal: `/track`
   - Command Console Login: `/login` $\rightarrow$ `/team`

---

## 📜 License

This project is proprietary and maintained by the **Technova Studio Core Architecture Team**.  
All rights reserved.
