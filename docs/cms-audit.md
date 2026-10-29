# Phase 0 Audit: Public CMS & Content Architecture

## 1. Existing Public CMS Audit
- **UI Files:**
  - `components/team/tabs/CMSTab.tsx`: Old 3-tab interface (PORTFOLIO, ABOUT, BOOKING) managing `StudioCMSConfig`.
  - `components/team/DashboardShell.tsx`: Navigation item `CMS` (requires `canManagePortfolioCMS` or `canManageAboutUs`).
  - `app/team/page.tsx`: Passes `cms` state to `CMSTab` and persists via `setStore(STORAGE_KEYS.CMS, updated)`.
- **API Routes:**
  - `app/api/data/[collection]/route.ts`: Manages slug `cms`, reading/writing a single document to MongoDB collection `studio_cms`.
- **Database Table/Collection:**
  - MongoDB collection `studio_cms` (deprecated in this migration, retained for safety).
  - LocalStorage key `tnova_cms`.
- **How Public Homepage Currently Reads Content:**
  - `app/page.tsx` reads `getStore<StudioCMSConfig>(STORAGE_KEYS.CMS, SEED_CMS)`.
  - Content sections currently mix CMS data (`aboutUs`, `portfolioShowcase`, `bookingSettings`) with static arrays (`CLIENTS`, `SERVICES`, `STAGES`, `TESTIMONIALS`).

## 2. Completed Projects in Team Portal
- **Location:** MongoDB collection `studio_projects` / LocalStorage `tnova_projects`.
- **Type Interface:** `StudioProject` defined in `lib/store.ts`.
- **Status Filter:** `project.status === 'COMPLETED'`.
- **Available Fields:**
  - `id`: Unique identifier (e.g., `prj-001`, `prj-003`).
  - `title`: e.g. "Aetherius Quantum — WebGL Telemetry Engine".
  - `description`: Detailed technical narrative.
  - `type`: `DEV_BUILD` | `CLIENT_COMMISSION` | `LEAD_GEN` | `RESEARCH` | `INTERNAL`.
  - `tags`: Array of string keywords (e.g. `['WebGL', 'GLSL', 'Client']`).
  - `liveUrl`: Deployment preview URL.
  - `repoUrl` / `figmaUrl`: Source code and design links.
  - `milestones`: Completed deliverables list.
  - Internal Protected Fields (MUST NEVER BE LEAKED TO PUBLIC):
    - `clientInfo.budget`, `clientInfo.expectedRevenue`
    - `managerNotes`, `comments`, `hourLogs`
    - `assignedMemberIds`, `createdBy`

## 3. Homepage Content Mapping

| Section | Current Data Source | Target CMS Model Section | Status & Target Source |
| :--- | :--- | :--- | :--- |
| **1. Hero** | Partial CMS (`heroTagline`, `subTagline`), hardcoded badge | `cms_sections.hero` | Dynamic via New CMS with badge, CTAs, highlight tokens |
| **2. Trust Strip** | Hardcoded array in `TrustStrip.tsx` | `cms_sections.trust_strip` | Dynamic via New CMS (reorderable client cards & logos) |
| **3. Featured Work** | CMS `portfolioShowcase` + hardcoded `CASE_STUDY_METAS` | `featured_projects` + `cms_sections.featured_work` | Relational bridge to completed projects with safe overrides |
| **4. Services** | Hardcoded array in `ServicesSection.tsx` | `cms_sections.services` | Dynamic via New CMS (4+ cards, deliverables, icons) |
| **5. Process** | Hardcoded array in `ProcessSection.tsx` | `cms_sections.process` | Dynamic via New CMS (5 reorderable sprint steps) |
| **6. Stats** | CMS `aboutUs.stats` | `cms_sections.stats` | Dynamic via New CMS with auto-count option from DB |
| **7. Testimonials** | Hardcoded array in `TestimonialsSection.tsx` | `cms_sections.testimonials` | Dynamic via New CMS (ratings, author, verification badge) |
| **8. About / Team** | CMS `aboutUs` | `cms_sections.about` | Dynamic via New CMS with safe public team member exposure |
| **9. Architect Intake** | Hardcoded copy in `ArchitectSection.tsx` | `cms_sections.architect` | Dynamic via New CMS (copy, benefits, status toggle) |
| **10. CTA Banner & Contacts**| Hardcoded in `CtaBannerSection.tsx` | `cms_sections.contact` | Single source of truth for email, phone, WhatsApp, location |
| **11. Forms Config** | CMS `bookingSettings` | `cms_sections.forms` | Dynamic via New CMS (scopes, budget tiers, slots, platforms) |
| **12. Footer & Socials** | Hardcoded in `Footer.tsx` | `cms_sections.footer` | Dynamic via New CMS (quick links, handles, copyright) |
| **13. SEO & Settings** | Static metadata in `app/layout.tsx` | `cms_sections.seo` | Dynamic metadata and announcement bar toggle |
| **14. Theme Default** | Hardcoded default `dark-tech` | `cms_sections.theme_default` | Dynamic default theme setting for new visitors |
| **15. AI Agent Settings**| Hardcoded `PREDEFINED_QA` in `RoboticAgent.tsx` | `cms_sections.ai_agent` | Dynamic greeting, suggested FAQ chips, toggle |

---

## 4. Migration Plan

1. **Phase 1: DB Schema & Data Layer**
   - Add new MongoDB collection constants in `lib/mongodb.ts`.
   - Create typed schema interfaces in `lib/cms-types.ts`.
   - Build unified typed data access layer in `lib/cms.ts` with complete seed defaults for all 15 sections.
   - Build server API endpoints under `app/api/cms/*` with server-side authorization checks.
2. **Phase 2: Complete CMS Admin UI**
   - Build modern multi-section CMS sidebar in `components/team/cms/`.
   - Create editor forms for all 15 sections.
   - Implement Draft / Publish workflow with version history (last 10 snapshots) and audit log.
   - Integrate side-by-side live preview in all 4 public themes.
   - Replace old `CMSTab.tsx` with the new Public CMS engine.
3. **Phase 3: Completed Projects -> Featured Connection**
   - Create `featured_projects` mapping store and bridge API.
   - Allow admin to select from `COMPLETED` projects in `studio_projects`.
   - Strip internal financials/notes and expose only safe public fields.
4. **Phase 4: Public Homepage Integration**
   - Update `app/page.tsx` and all section components to read from `getSiteContent()`.
   - Ensure all contact triggers (WhatsApp, Call, Email, Schedule) read from the central contact CMS section.
5. **Phase 5: Team Portal Theming**
   - Implement 3 portal themes (Dark Tech, Minimal Clean, Bold Gradient) in `components/team/`.
   - Add theme switcher in the portal header with persistence and WCAG AA contrast check.
6. **Phase 6 & 7: Verification & Report**
   - Run typecheck, build, test endpoints, verify permissions, and produce `/docs/cms-report.md`.
