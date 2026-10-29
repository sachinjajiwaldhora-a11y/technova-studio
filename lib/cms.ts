// FILE PATH: lib/cms.ts
// TECHNOVA STUDIO // TYPED PUBLIC CMS DATA ACCESS LAYER & SEED DEFAULTS

import {
  CMSSectionKey, CMSSectionsPayload, CMSSectionRecord,
  CMSVersion, CMSAuditLogEntry, CMSMediaItem,
  FeaturedProjectBridge, FeaturedProjectItem,
} from './cms-types';
import { getStore, setStore } from './store';

// ─── LOCAL STORAGE KEYS ───────────────────────────────────────────────────────
export const CMS_STORAGE_KEYS = {
  DRAFT: 'tnova_cms_draft',
  PUBLISHED: 'tnova_cms_published',
  VERSIONS: 'tnova_cms_versions',
  AUDIT_LOG: 'tnova_cms_audit',
  FEATURED_BRIDGE: 'tnova_featured_bridge',
  MEDIA: 'tnova_cms_media',
};

// ─── 15 SECTIONS SEED DEFAULTS (Mirroring Public Site) ─────────────────────────
export const CMS_SEED_DEFAULTS: CMSSectionsPayload = {
  hero: {
    headlinePrefix: 'WE ENGINEER',
    highlightWords: 'FLAGSHIP DIGITAL PRODUCTS',
    headlineSuffix: 'THAT DEFY CONVENTIONS.',
    subText:
      'An elite engineering collective crafting high-performance WebGL platforms, custom AI architectures, and flagship digital products.',
    availabilityBadge: 'AVAILABLE FOR Q2 & Q3 COMMISSIONS // 120 FPS VERIFIED',
    primaryCtaLabel: 'START A PROJECT',
    primaryCtaTarget: '#book',
    secondaryCtaLabel: 'VIEW FEATURED WORK',
    secondaryCtaTarget: '#work-matrix',
  },
  trust_strip: {
    titleBadge: '// TRUSTED BY VENTURE-BACKED FOUNDERS & MISSION-CRITICAL ENTERPRISES',
    clients: [
      { id: 'cl-1', name: 'AETHERIUS QUANTUM', category: 'Orbital Telemetry', visible: true, order: 1 },
      { id: 'cl-2', name: 'KRYPTON DEFENSE', category: 'Mission Systems', visible: true, order: 2 },
      { id: 'cl-3', name: 'VORTEX COMPUTE', category: 'Distributed AI', visible: true, order: 3 },
      { id: 'cl-4', name: 'OBSIDIAN FINTECH', category: 'Algorithmic Liquidity', visible: true, order: 4 },
      { id: 'cl-5', name: 'NOVAPULSE ANALYTICS', category: 'Data Visualizations', visible: true, order: 5 },
      { id: 'cl-6', name: 'VERTEX CAPITAL', category: 'Investor Portals', visible: true, order: 6 },
    ],
  },
  featured_work: {
    badge: '// SELECTED PRODUCTIONS // VERIFIED BUILDS',
    heading: 'FEATURED WORK',
    subText: 'Live websites, embedded spatial engines, and high-frequency systems engineered by Technova Studio.',
    maxHomeItems: 4,
    projects: [
      {
        id: 'port-01',
        projectId: 'prj-001',
        code: 'PRJ // HYPERION-GL',
        title: 'AETHERIUS QUANTUM TELEMETRY',
        tagline: 'Real-time spatial command interface rendering live satellite orbital mechanics.',
        category: 'CUSTOM GLSL SHADERS / NEXT.JS / RUST WASM',
        metrics: '120 FPS LOCKED // 1.4M PARTICLES',
        description: 'Real-time spatial command interface rendering live satellite orbital mechanics directly inside a zero-latency WebGL browser viewport.',
        problem: 'Massive satellite orbital telemetry choked standard browser rendering with severe frame drops below 24 FPS.',
        solution: 'Engineered custom GLSL instanced particle shaders and a Rust WASM kernel processing 1.4M points on GPU.',
        result: '120 FPS locked // 0.02s sync latency // 85% reduced CPU memory load',
        techStack: ['WebGL', 'GLSL', 'Rust WASM', 'Next.js', 'Three.js'],
        liveUrl: 'https://aetherius-staging.vercel.app',
        repoUrl: 'https://github.com/technovastudio/aetherius-gl',
        allowIframe: true,
        featured: true,
        order: 1,
        tags: ['WebGL', 'GLSL', 'Real-Time'],
      },
      {
        id: 'port-02',
        projectId: 'prj-003',
        code: 'PRJ // KRYPTON-OS',
        title: 'OBSIDIAN FINTECH KERNEL',
        tagline: 'Algorithmic liquidity visualization engine engineered with bespoke geometric wireframes.',
        category: 'ZERO-KNOWLEDGE AUTH / SPATIAL UI',
        metrics: '0.02s EXECUTION // INSTITUTIONAL GRADE',
        description: 'Algorithmic liquidity visualization engine engineered with bespoke geometric wireframes and hardware-accelerated micro-interactions.',
        problem: 'Institutional algorithmic traders required spatial liquidity visualization with zero-knowledge clearance.',
        solution: 'Developed zero-knowledge client authentication and hardware-accelerated micro-interactions.',
        result: '0.02s execution // 99.999% uptime // 0 security vulnerabilities in 3 audits',
        techStack: ['TypeScript', 'Zero-Knowledge Proofs', 'WebSockets', 'Canvas API'],
        liveUrl: 'https://krypton-defense.io',
        allowIframe: true,
        featured: true,
        order: 2,
        tags: ['Auth', 'FinTech', 'Spatial UI'],
      },
      {
        id: 'port-03',
        code: 'PRJ // NEURAL-SYNTH',
        title: 'VORTEX AI COMPUTE ENGINE',
        tagline: 'Interactive 3D neural topology mapper allowing engineers to inspect live tensor weights.',
        category: 'THREE.JS / DISTRIBUTED NODE GRAPH',
        metrics: '99.99% UPTIME // ENTERPRISE FLEX',
        description: 'Interactive 3D neural topology mapper allowing engineers to inspect live tensor weights in real-time 3D space.',
        problem: 'Distributed tensor graphs were opaque, making multi-layer neural model inspection impossible in real time.',
        solution: 'Designed an interactive 3D neural topology mapper rendering 50,000+ live tensor nodes with interactive slicing.',
        result: '4x faster model debugging // 99.99% compute uptime // 50,000+ live nodes',
        techStack: ['Three.js', 'React', 'Node.js', 'Python API'],
        liveUrl: 'https://vortex-ai-demo.vercel.app',
        allowIframe: true,
        featured: true,
        order: 3,
        tags: ['AI', 'Three.js', 'Enterprise'],
      },
    ],
  },
  services: {
    badge: '// ENGINEERING DISCIPLINES & CAPABILITIES',
    heading: 'SERVICES ENGINEERED FOR SCALE',
    subText: 'We assemble high-impact digital systems engineered from the ground up for performance, conversion, and architectural distinction.',
    services: [
      {
        id: 'srv-1',
        num: '01',
        icon: 'Globe',
        title: 'SPATIAL WEB & 3D ARCHITECTURES',
        description: 'Immersive WebGL, Three.js, and WebGPU browser viewports locked at 120 FPS. We build digital monuments and interactive experiences that captivate investors and clients.',
        deliverables: [
          'Custom GLSL Fragment & Vertex Shaders',
          'Next.js 16 + React 19 App Pipelines',
          'Interactive 3D Product Viewers & Configs',
          'Zero Layout Shift & Lighthouse 95+ Tuning',
        ],
        visible: true,
        order: 1,
      },
      {
        id: 'srv-2',
        num: '02',
        icon: 'Smartphone',
        title: 'MOBILE & PROGRESSIVE APPS',
        description: 'High-performance cross-platform applications with native 60–120 FPS animations, offline-first syncing, and tactile micro-interactions that feel buttery smooth on iOS and Android.',
        deliverables: [
          'React Native & Flutter Native Kernels',
          'Offline-First Local Database Syncing',
          'Biometric Zero-Knowledge Auth Flows',
          'Low-Latency Push Telemetry & WebSockets',
        ],
        visible: true,
        order: 2,
      },
      {
        id: 'srv-3',
        num: '03',
        icon: 'Palette',
        title: 'UI/UX & INTERACTION DESIGN',
        description: 'Institutional-grade design systems built on rigorous typography, multi-theme design tokens, and fluid kinetic physics that position your studio light-years ahead of competitors.',
        deliverables: [
          'Comprehensive Design Token Engines',
          'Kinetic Motion Design & Micro-animations',
          'Interactive Figma Prototypes & Design Specs',
          'WCAG AA / AAA Accessibility Compliance',
        ],
        visible: true,
        order: 3,
      },
      {
        id: 'srv-4',
        num: '04',
        icon: 'Cpu',
        title: 'BACKEND, APIS & FAST-TRACK MVPS',
        description: 'Distributed cloud kernels, scalable MongoDB / PostgreSQL architectures, sub-millisecond API endpoints, and rapid MVP turnarounds ready for venture capital validation.',
        deliverables: [
          'Sub-20ms Edge & Serverless Endpoints',
          'Real-Time WebSocket & Telemetry Streams',
          'Production MongoDB & Database Sharding',
          '30-Day Concept to Production MVP Sprints',
        ],
        visible: true,
        order: 4,
      },
    ],
  },
  process: {
    badge: '// SPRINT LIFECYCLE & EXECUTION PROTOCOL',
    heading: 'HOW WE BUILD',
    subText: 'A battle-tested 5-phase engineering protocol engineered to eliminate scope creep, protect intellectual property, and ship flagships on schedule.',
    steps: [
      {
        step: '01',
        title: 'DISCOVER',
        subtitle: 'Telemetry & Tech Specs',
        description: 'We deconstruct your technical objectives, user friction points, and competitive moats in a 45-minute discovery briefing. We deliver an immutable technical architecture roadmap.',
        icon: 'Search',
        order: 1,
      },
      {
        step: '02',
        title: 'DESIGN',
        subtitle: 'Kinetic & Token Systems',
        description: 'We craft high-fidelity Figma components, design token tokens across light, dark, and specialized themes, and choreograph fluid micro-interactions before writing a single line of code.',
        icon: 'Compass',
        order: 2,
      },
      {
        step: '03',
        title: 'BUILD',
        subtitle: 'Core Kernel Development',
        description: 'Engineered in strict TypeScript, raw GLSL shaders, and distributed MongoDB / API layers. Continuous client staging previews let you test live builds in real time.',
        icon: 'Code',
        order: 3,
      },
      {
        step: '04',
        title: 'LAUNCH',
        subtitle: 'Production Benchmark QA',
        description: 'Rigorous Lighthouse 95+ audit pass, cross-browser WebGL stress testing, security hardening, and global edge CDN distribution with zero layout shift.',
        icon: 'Rocket',
        order: 4,
      },
      {
        step: '05',
        title: 'SUPPORT',
        subtitle: 'Sprint Radar & SLAs',
        description: 'Continuous telemetry health monitoring and milestone tracking through your dedicated client session tracking code, backed by enterprise NDAs and response guarantees.',
        icon: 'LifeBuoy',
        order: 5,
      },
    ],
  },
  stats: {
    stats: [
      { id: 'st-1', label: 'FPS LOCKED BENCHMARK', value: '120', order: 1 },
      { id: 'st-2', label: 'FLAGSHIPS SHIPPED', value: '12+', autoCalculateFromDb: true, order: 2 },
      { id: 'st-3', label: 'PLATFORM UPTIME', value: '99.99%', suffix: '%', order: 3 },
      { id: 'st-4', label: 'GLOBAL JURISDICTIONS', value: '8+', order: 4 },
    ],
  },
  testimonials: {
    badge: '// CLIENT VALIDATION & DIRECT ENDORSEMENTS',
    heading: 'PROOF OF EXCELLENCE',
    subText: 'Read what technical founders and enterprise engineering directors say after deploying Technova Studio architectures.',
    testimonials: [
      {
        id: 'tst-1',
        author: 'Vikramaditya Rao',
        role: 'Founder & CEO',
        company: 'Aetherius Quantum Systems',
        clearance: 'VERIFIED CLIENT // MISSION TELEMETRY',
        quote: 'Technova engineered our orbital telemetry engine at locked 120 FPS when three previous agencies told us it was technically impossible in a web browser. Outstanding technical rigor and zero compromises on speed.',
        rating: 5,
        visible: true,
        order: 1,
      },
      {
        id: 'tst-2',
        author: 'Elena Rostova',
        role: 'VP of Engineering',
        company: 'Krypton Defense AI',
        clearance: 'VERIFIED CLIENT // ENTERPRISE CLEARANCE',
        quote: 'Zero-knowledge client architecture delivered two weeks ahead of schedule. Their attention to defense-grade security protocols, strict TypeScript, and kinetic UI choreography is light-years ahead of the industry.',
        rating: 5,
        visible: true,
        order: 2,
      },
      {
        id: 'tst-3',
        author: 'Siddharth Mehra',
        role: 'Lead Architect',
        company: 'NovaPulse Analytics',
        clearance: 'VERIFIED CLIENT // HIGH-GROWTH SAAS',
        quote: 'Our institutional sales conversion tripled after deploying Technova’s real-time 3D dashboard. Enterprise leads immediately recognize they are interacting with an institutional-grade platform.',
        rating: 5,
        visible: true,
        order: 3,
      },
    ],
  },
  about: {
    heroTagline: 'WE BUILD BEYOND DIGITAL',
    subTagline: 'An elite collective of systems architects and creative technologists.',
    manifesto:
      'Technova Studio is not an agency. We are an engineering collective — a unit of high-caliber architects who craft digital experiences that defy conventional browser limits. Every project is custom-engineered from raw shaders, low-level state machines, and precision UI/UX.',
    vision: 'Pioneering zero-latency spatial web architectures and mission-critical digital interfaces for visionary enterprises worldwide.',
    methodology: 'Bespoke GLSL shaders, strict TypeScript, zero-knowledge security, and verified 120 FPS standards.',
    securityGuarantee: 'Enterprise NDA enforced on day zero. Isolated client staging environments and dedicated clearance.',
    foundedYear: '2024',
    location: 'Remote-First // Global Operations',
    teamHighlight: 'From WebGL shaders to zero-knowledge auth systems — our team handles the impossible.',
    contactEmail: 'ops@technovastudio.dev',
    tenets: [
      { title: 'Zero Framework Dogmatism', desc: 'We select the optimal tool for the objective — from raw WebGL shaders to distributed Node graphs.' },
      { title: 'Locked 120 FPS Benchmark', desc: 'No frame drops, no jank, and zero cumulative layout shifts across all devices.' },
      { title: 'Zero-Knowledge Security', desc: 'Hardened cryptographic authentication and isolated staging clusters for all client builds.' },
      { title: 'Direct Engineering Access', desc: 'Clients collaborate directly with lead architects, not account middlemen.' },
    ],
    publicMembers: [
      {
        memberId: 'usr-01',
        publicName: 'Sachin J.',
        publicRole: 'Executive Architect & Lead Engineer',
        publicDepartment: 'Management & Spatial Systems',
        publicBio: 'Specializes in low-level WebGL graphics, distributed state machines, and high-frequency cloud architectures.',
        skills: ['Executive Command', 'WebGL', 'Architecture', 'Strategy', 'Next.js'],
        visible: true,
        order: 1,
      },
      {
        memberId: 'usr-01b',
        publicName: 'Anuj B.',
        publicRole: 'Operations Director & Systems Architect',
        publicDepartment: 'Management & Cloud Operations',
        publicBio: 'Leads operational security, distributed telemetry, and enterprise client infrastructure.',
        skills: ['Operations', 'System Architecture', 'High-End Tech', 'Team Strategy'],
        visible: true,
        order: 2,
      },
      {
        memberId: 'usr-02',
        publicName: 'Riya Sharma',
        publicRole: 'Lead Fullstack Architect',
        publicDepartment: 'Fullstack Engineering',
        publicBio: 'Pioneering high-throughput React 19 architectures, Rust WASM integrations, and zero-knowledge data pipelines.',
        skills: ['React', 'Three.js', 'Node.js', 'System Design', 'Rust WASM'],
        visible: true,
        order: 3,
      },
    ],
  },
  architect: {
    enabled: true,
    badge: 'COLLECTIVE INTAKE // TALENT ONBOARDING',
    heading: 'BECOME A TECHNOVA ARCHITECT',
    description: 'We recruit elite shader engineers, systems architects, and spatial designers. Submitting this application dispatches your dossier directly to our internal onboarding console.',
    squadBenefitTitle: 'DECENTRALIZED HIGH-IMPACT SQUAD',
    squadBenefitDesc: 'Work on production contracts with venture-backed AI labs, defense tech platforms, and high-frequency fintech ventures worldwide.',
    compensationTitle: 'HIGH-COMPENSATION COMMISSION POOL',
    compensationDesc: 'Direct revenue-sharing per commission with guaranteed milestone payouts and executive clearance levels.',
    openPositionsNote: 'Actively reviewing Q2/Q3 applicant dossiers.',
    availableDisciplines: [
      'WebGL & Graphics',
      'Fullstack Engineering',
      'AI & Systems',
      'Growth & Sales',
      'UI/UX Design',
    ],
  },
  contact: {
    headline: 'HAVE AN IDEA?',
    highlightText: "LET'S BUILD IT.",
    subText: 'Initiate a discovery briefing, submit your project specification, or reach our operations desk directly. Every technical inquiry receives a dedicated architect response within 24 hours.',
    phone: '+91 98100 45567',
    whatsappNumber: '919810045567',
    whatsappPrefilledMessage: 'Hello Technova Studio Team, I would like to inquire about commissioning a project.',
    email: 'ops@technovastudio.dev',
    scheduleCallLink: '',
    location: 'Remote-First // Global Operations',
    workingHours: '24/7 Asynchronous // 10:00 - 22:00 IST Direct',
    responseTimeGuarantee: '< 24 Hours Guaranteed',
    ndaGuaranteeText: 'Enterprise NDA Enforced On Day Zero',
  },
  forms: {
    briefTitle: 'TRANSMIT PROJECT BRIEF',
    briefSubtitle: 'Submit detailed project specifications directly into our studio intake queue for technical review.',
    callTitle: 'SCHEDULE DISCOVERY CALL',
    callSubtitle: 'Lock in a 45-minute technical briefing with our lead systems architects.',
    availableScopes: [
      'IMPOSSIBLE WEBGL / 3D PLATFORM',
      'CUSTOM AI & DISTRIBUTED SYSTEM',
      'HIGH-END BRAND & INTERACTION DESIGN',
      'FULLSTACK PRODUCT ENGINEERING',
    ],
    availableBudgetRanges: [
      '$15,000 - $30,000',
      '$30,000 - $60,000',
      '$60,000 - $120,000',
      '$120,000+ Enterprise',
    ],
    availableTimelines: [
      'Urgent (< 30 Days)',
      '1 - 3 Months (Standard)',
      'Quarterly / Long-term Build',
    ],
    availableCallSlots: [
      '10:00 - 10:45 AM IST',
      '02:00 - 02:45 PM IST',
      '05:00 - 05:45 PM IST',
      '09:00 - 09:45 PM IST (US East / EU Friendly)',
    ],
    availablePlatforms: [
      'Google Meet (Secure Link)',
      'Zoom Enterprise',
      'Direct Encrypted Audio Call',
    ],
    successMessageBrief: 'Your project inquiry has been queued into the Technova Studio Intake Pipeline.',
    successMessageCall: 'Your discovery call briefing has been queued into our engineering command board.',
  },
  footer: {
    studioBio: 'An elite collective of high-end systems architects, shader engineers, and creative technologists engineering flagship web platforms, real-time 3D environments, and custom AI systems.',
    statusIndicator: 'PRODUCTION KERNEL // 120 FPS // VERIFIED',
    copyrightText: 'TECHNOVA STUDIO. ALL RIGHTS RESERVED. // ENTERPRISE ARCHITECTURE',
    socials: {
      githubUrl: 'https://github.com/technovastudio',
      twitterUrl: 'https://twitter.com',
      linkedinUrl: 'https://linkedin.com',
      websiteUrl: 'https://technovastudio.com',
    },
  },
  seo: {
    siteTitle: 'TECHNOVA STUDIO // Elite Technical Architecture & Flagship Digital Products',
    metaDescription: 'Technova Studio is a premier engineering collective specializing in real-time WebGL, distributed cloud architectures, high-performance web applications, and bespoke AI telemetry interfaces.',
    keywords: [
      'Technova Studio',
      'WebGL Developers',
      'Fullstack Engineering',
      'Creative Technologists',
      '3D Web Design',
      'Next.js Studio',
      'AI Systems',
    ],
    ogImageUrl: '',
    faviconUrl: '',
    announcementBar: {
      enabled: false,
      text: 'NOW ACCEPTING Q2 / Q3 CLIENT COMMISSIONS // LIMITED SLOTS',
      link: '#contact-matrix',
    },
  },
  theme_default: {
    defaultTheme: 'dark-tech',
  },
  ai_agent: {
    enabled: true,
    agentName: 'NV-UNIT.01',
    greetingText: 'NV-UNIT.01 ONLINE. Select a telemetry query below or type your question.',
    suggestedQuestions: [
      {
        q: 'What does Technova Studio engineer?',
        a: 'We architect ultra-high-performance WebGL platforms, custom AI systems, distributed cloud kernels, and bespoke digital experiences that defy standard browser limits.',
      },
      {
        q: 'How do we initiate a project or book a call?',
        a: 'Click "START A PROJECT" or press CMD+K and type /book. Once you submit your scope, our system auto-provisions a client session for you.',
      },
      {
        q: 'How does Team Portal clearance work?',
        a: 'Technova Admins onboard members via email with a fixed encryption key. Working Members access full telemetry & data sheets; new Members have restricted clearance.',
      },
    ],
  },
};

// ─── DATA ACCESS GETTERS (With Synchronous Fallback) ──────────────────────────

/**
 * Read published content for a section.
 * Falls back to local storage cache, and then CMS_SEED_DEFAULTS.
 */
export function getSiteContent<K extends CMSSectionKey>(sectionKey: K): CMSSectionsPayload[K] {
  if (typeof window === 'undefined') {
    return CMS_SEED_DEFAULTS[sectionKey];
  }
  try {
    const publishedStore = getStore<Partial<CMSSectionsPayload>>(
      CMS_STORAGE_KEYS.PUBLISHED,
      {}
    );
    if (publishedStore && publishedStore[sectionKey]) {
      const merged = {
        ...CMS_SEED_DEFAULTS[sectionKey],
        ...publishedStore[sectionKey],
      } as CMSSectionsPayload[K];
      if (sectionKey === 'theme_default') {
        const td = merged as unknown as { defaultTheme?: string };
        if (td.defaultTheme === 'neo-brutalism' || td.defaultTheme === 'brutalist') {
          td.defaultTheme = 'dark-tech';
        }
      }
      return merged;
    }
  } catch {
    // Safe fallback
  }
  return CMS_SEED_DEFAULTS[sectionKey];
}

/**
 * Read draft content for admin editing in the CMS.
 * If no draft exists, returns current published content.
 */
export function getDraftContent<K extends CMSSectionKey>(sectionKey: K): CMSSectionsPayload[K] {
  if (typeof window === 'undefined') {
    return CMS_SEED_DEFAULTS[sectionKey];
  }
  try {
    const draftStore = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.DRAFT, {});
    if (draftStore && draftStore[sectionKey]) {
      const merged = {
        ...CMS_SEED_DEFAULTS[sectionKey],
        ...draftStore[sectionKey],
      } as CMSSectionsPayload[K];
      if (sectionKey === 'theme_default') {
        const td = merged as unknown as { defaultTheme?: string };
        if (td.defaultTheme === 'neo-brutalism' || td.defaultTheme === 'brutalist') {
          td.defaultTheme = 'dark-tech';
        }
      }
      return merged;
    }
  } catch {
    // Safe fallback
  }
  return getSiteContent(sectionKey);
}

/**
 * Save draft for a specific section.
 */
export function saveDraftContent<K extends CMSSectionKey>(
  sectionKey: K,
  data: CMSSectionsPayload[K],
  author: { id: string; name: string }
): void {
  if (typeof window === 'undefined') return;

  const currentDrafts = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.DRAFT, {});
  const updatedDrafts = { ...currentDrafts, [sectionKey]: data };
  setStore(CMS_STORAGE_KEYS.DRAFT, updatedDrafts);

  // Add audit log entry
  logAuditEntry({
    action: 'SAVE_DRAFT',
    sectionKey,
    authorId: author.id,
    authorName: author.name,
    summary: `Saved draft edits for ${sectionKey.toUpperCase()} section.`,
  });

  // Sync to backend API in background
  syncSectionToApi(sectionKey, data, 'draft', author);
}

/**
 * Publish a section: moves draft to published, creates a version snapshot,
 * logs to audit log, and notifies server.
 */
export function publishSectionContent<K extends CMSSectionKey>(
  sectionKey: K,
  author: { id: string; name: string }
): void {
  if (typeof window === 'undefined') return;

  const draft = getDraftContent(sectionKey);
  const currentPublished = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.PUBLISHED, {});
  const updatedPublished = { ...currentPublished, [sectionKey]: draft };
  setStore(CMS_STORAGE_KEYS.PUBLISHED, updatedPublished);

  // Clear section from draft store (since draft matches published now)
  const currentDrafts = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.DRAFT, {});
  delete currentDrafts[sectionKey];
  setStore(CMS_STORAGE_KEYS.DRAFT, currentDrafts);

  // Create version snapshot (keep last 10 versions)
  const versions = getStore<CMSVersion[]>(CMS_STORAGE_KEYS.VERSIONS, []);
  const sectionVersions = versions.filter((v) => v.sectionKey === sectionKey);
  const nextVer = sectionVersions.length + 1;

  const newVersion: CMSVersion = {
    id: `ver-${Date.now()}-${nextVer}`,
    sectionKey,
    versionNumber: nextVer,
    data: draft,
    authorId: author.id,
    authorName: author.name,
    timestamp: new Date().toISOString(),
    summary: `Published version ${nextVer} of ${sectionKey.toUpperCase()}`,
  };

  // Keep latest 10 versions for this section
  const otherVersions = versions.filter((v) => v.sectionKey !== sectionKey);
  const updatedSectionVersions = [newVersion, ...sectionVersions].slice(0, 10);
  setStore(CMS_STORAGE_KEYS.VERSIONS, [...updatedSectionVersions, ...otherVersions]);

  // Log audit
  logAuditEntry({
    action: 'PUBLISH',
    sectionKey,
    authorId: author.id,
    authorName: author.name,
    summary: `Published live changes for ${sectionKey.toUpperCase()} (v${nextVer}).`,
  });

  // Sync to backend API in background
  syncSectionToApi(sectionKey, draft, 'publish', author);
}

/**
 * Discard draft and revert back to currently published content.
 */
export function discardDraftContent<K extends CMSSectionKey>(sectionKey: K): void {
  if (typeof window === 'undefined') return;
  const currentDrafts = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.DRAFT, {});
  delete currentDrafts[sectionKey];
  setStore(CMS_STORAGE_KEYS.DRAFT, currentDrafts);
}

/**
 * Revert a section to a previous version snapshot.
 */
export function revertToVersion(
  versionId: string,
  author: { id: string; name: string }
): boolean {
  if (typeof window === 'undefined') return false;

  const versions = getStore<CMSVersion[]>(CMS_STORAGE_KEYS.VERSIONS, []);
  const found = versions.find((v) => v.id === versionId);
  if (!found) return false;

  // Set as published and draft
  const currentPublished = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.PUBLISHED, {});
  setStore(CMS_STORAGE_KEYS.PUBLISHED, { ...currentPublished, [found.sectionKey]: found.data });

  const currentDrafts = getStore<Partial<CMSSectionsPayload>>(CMS_STORAGE_KEYS.DRAFT, {});
  delete currentDrafts[found.sectionKey];
  setStore(CMS_STORAGE_KEYS.DRAFT, currentDrafts);

  logAuditEntry({
    action: 'REVERT_VERSION',
    sectionKey: found.sectionKey,
    authorId: author.id,
    authorName: author.name,
    summary: `Reverted ${found.sectionKey.toUpperCase()} to snapshot v${found.versionNumber} (${found.timestamp.split('T')[0]}).`,
  });

  syncSectionToApi(found.sectionKey, found.data, 'publish', author);
  return true;
}

/**
 * Helper to log audit entries (capped at 100 entries).
 */
export function logAuditEntry(entry: Omit<CMSAuditLogEntry, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const newEntry: CMSAuditLogEntry = {
    ...entry,
    id: `aud-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  const logs = getStore<CMSAuditLogEntry[]>(CMS_STORAGE_KEYS.AUDIT_LOG, []);
  setStore(CMS_STORAGE_KEYS.AUDIT_LOG, [newEntry, ...logs].slice(0, 100));
}

export function getAuditLog(): CMSAuditLogEntry[] {
  return getStore<CMSAuditLogEntry[]>(CMS_STORAGE_KEYS.AUDIT_LOG, []);
}

export function getSectionVersions(sectionKey: CMSSectionKey): CMSVersion[] {
  const versions = getStore<CMSVersion[]>(CMS_STORAGE_KEYS.VERSIONS, []);
  return versions.filter((v) => v.sectionKey === sectionKey);
}

// ─── API SYNC BRIDGE ──────────────────────────────────────────────────────────

async function syncSectionToApi(
  sectionKey: CMSSectionKey,
  data: unknown,
  mode: 'draft' | 'publish',
  author: { id: string; name: string }
) {
  try {
    await fetch('/api/cms/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-author-id': author.id,
        'x-author-name': author.name,
      },
      body: JSON.stringify({ sectionKey, data, mode }),
    });
  } catch {
    // Handled gracefully by local store
  }
}

