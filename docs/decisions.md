# Architecture & Implementation Decisions

## Decision 1: Additive CMS Database Architecture
- **Decision:** Retain `studio_cms` as deprecated without dropping it. Introduce 5 new specialized MongoDB collections:
  1. `cms_sections` (Draft & published content per section)
  2. `cms_versions` (Historical snapshots for rollback, up to 10 versions per section)
  3. `cms_media` (Uploaded media assets metadata, alt text, dimensions, size)
  4. `cms_audit_log` (Timestamped actions tracking author, section, action type)
  5. `featured_projects` (Relational bridge mapping `studio_projects` to public display overrides)
- **Rationale:** Strictly complies with zero-downtime, non-destructive migration rules. If anything fails, the fallback layer seamlessly defaults to seed data.

## Decision 2: Unified Typed Data Access Layer (`lib/cms.ts`)
- **Decision:** Create a centralized `getSiteContent<T>(sectionKey)` function that supports synchronous fallback from local cache/seed defaults and asynchronous server/database sync.
- **Rationale:** Ensures zero layout shift (CLS), zero hydration mismatches in Next.js React 19, and full offline resilience.

## Decision 3: Server-Side CMS Authorization
- **Decision:** Every write endpoint (`POST`, `PUT`, `DELETE` under `/api/cms/*`) requires server-side validation of member role (`admin` or clearance with `canManagePortfolioCMS`) verifying user existence in `studio_members`.
- **Rationale:** Protects against unauthorized public mutations while keeping internal Team Management auth intact.

## Decision 4: Safe Public Exposure of Completed Projects
- **Decision:** Completed projects selected for the homepage or `/work` will only expose sanitized public fields (`title`, `tagline`, `category`, `tags`, `problem`, `solution`, `techStack`, `metrics`, `coverImage`, `liveUrl`, `allowIframe`). Internal fields (`clientInfo.budget`, `expectedRevenue`, `dealNotes`, `managerNotes`, `actualHours`) are completely stripped before reaching public consumers.
- **Rationale:** Safeguards enterprise client NDAs and proprietary financials.

## Decision 5: Team Portal Multi-Theming
- **Decision:** Introduce a portal theme context `lib/portal-theme.tsx` supporting the 3 mandatory themes (Dark Tech, Minimal Clean, Bold Gradient). Themes apply via `data-portal-theme` on the dashboard container, utilizing CSS tokens without altering portal business logic.
- **Rationale:** Preserves 100% of internal operations while delivering visual coherence.
