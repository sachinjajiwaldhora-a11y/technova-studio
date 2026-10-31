# 🍃 Technova Studio // MongoDB Integration & Database Architecture Guide

This guide details the complete **MongoDB Atlas** setup, collection schemas, connection pooling, and operations for Technova Studio.

---

## ⚡ Architecture Overview

1. **Native MongoDB Driver (`mongodb` v7.7):** Singleton connection pooling configured for Next.js App Router and serverless functions (`lib/mongodb.ts`).
2. **Cryptographic Authentication:**
   - Password hashing with Node.js native `crypto.scrypt` and cryptographic salt (`lib/password.ts`).
   - Secure HttpOnly signed session cookies (`technova_session`) verified via `lib/auth.ts`.
3. **Unified REST API Endpoint (`app/api/data/[collection]/route.ts`):**
   - Supports CRUD operations across all collections with permission checks and sanitization.
   - Public intake endpoints for `inquiries` and `join_requests` with built-in deduplication guards.
4. **Real-time Live Sync Radar:**
   - Front-end synchronizes with MongoDB cloud collections every 6 seconds and on window focus.
5. **Zero Front-end Interruption:**
   - Client UI, state, and animations remain 100% resilient with local fallback handling.

---

## 🗄️ MongoDB Collections

The database `technova_studio` consists of the following dedicated collections:

| Collection Name | Purpose & Contents |
| :--- | :--- |
| **`studio_members`** | Team operatives, hashed passwords, clearance levels (`LVL-01` to `LVL-09`), roles, initials, and performance metrics. |
| **`studio_projects`** | Engineering builds, milestone arrays, customer ID links, deliverables, and progress percentages. |
| **`studio_inquiries`** | Inbound project briefs, discovery call bookings, session tracking codes (`NV-INQ-...`, `NV-CALL-...`). |
| **`studio_leads`** | Sales pipeline entries, stages (`NEW`, `CONTACTED`, `FOLLOW_UP`, `INTERESTED`, `DEAL_WON`, `LOST`), deal values, and notes. |
| **`studio_lead_columns`** | Dynamic CRM Kanban column order and configurations. |
| **`studio_targets`** | Monthly and quarterly target metrics (revenue, closed deals, deliveries). |
| **`studio_join_requests`**| Talent candidacy dossiers, department, skills, statement, and onboarding clearance status (`PENDING`, `APPROVED`, `REJECTED`). |
| **`studio_announcements`**| Internal bulletins, categories (`IMPORTANT`, `MEETING`, `POLICY`, `GENERAL`), author info, and pinned state. |
| **`studio_sheets`** | Custom structured data spreadsheets and table columns. |
| **`cms_sections`** | Modular CMS section configurations (Hero, About, Services, Featured Work, etc.). |
| **`cms_versions`** | Historic snapshot records for one-click CMS version rollbacks. |
| **`cms_audit_log`** | Comprehensive audit trail of editorial CMS changes. |

---

## 🚀 Environment Configuration

Add the following to your `.env.local` (for local development) or Vercel Environment Variables (for production):

```env
# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://sachinbishoi:hn%40hYNQX%40Em9AcT@technovastudio.f6ejzkq.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=technova_studio

# Secret Key for Signing Authentication Session Cookies (min 32 characters)
AUTH_SESSION_SECRET=7c8f9b2d4e6a1f3c8b5e9d2a4f6c8b1e7a3d5f9b2c4e6a8f1d3b5e7a9c2d4f6a

# Optional Webhook Secret for External Leads Ingestion
LEADS_WEBHOOK_SECRET=technova-webhook-secret-token-2026

# Site Base URL
NEXT_PUBLIC_SITE_URL=https://technova-studio-roan.vercel.app
```

---

## 🛠️ CLI Database Seeding

Run these scripts from your terminal anytime to populate or refresh collections:

```bash
# 1. Seed Core Studio Collections (Members, Projects, Inquiries, Leads, Announcements)
npm run seed:mongo

# 2. Seed Public CMS Sections & Default Content
npm run seed:cms
```

Alternatively, you can trigger seeding via the HTTP endpoint when running locally:
```
http://localhost:3000/api/seed
```

---

## 🔑 Default Admin Clearance Accounts

After seeding, the database contains pre-configured executive clearance accounts:

* **Executive SuperAdmin:**
  - **Email:** `sachinjajiwaldhora@gmail.com`
  - **Password:** `NOVA-SACHIN-2025`
  - **Clearance:** `LVL-09-OMEGA` (Full Administrative Access)

* **Co-Admin / Operations:**
  - **Email:** `anujb2296@gmail.com`
  - **Password:** `NOVA-ANUJ-2025`
  - **Clearance:** `LVL-09-OMEGA` (Full Administrative Access)

Log in directly at: [https://technova-studio-roan.vercel.app/login](https://technova-studio-roan.vercel.app/login) (or `http://localhost:3000/login`).
