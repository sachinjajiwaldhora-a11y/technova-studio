// FILE PATH: lib/cms-types.ts
// TECHNOVA STUDIO // TYPED PUBLIC CMS DATA SCHEMA

export type ThemeType = 'dark-tech' | 'minimal-clean' | 'bold-gradient' | 'neo-brutalism';

export interface FeaturedProjectItem {
  id: string;
  projectId?: string; // Link to internal studio_projects id
  code: string;
  title: string;
  tagline?: string;
  category: string;
  tags: string[];
  metrics: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  liveUrl: string;
  repoUrl?: string;
  coverImage?: string;
  allowIframe: boolean;
  featured: boolean;
  order: number;
}

// ─── 15 EDITABLE CMS SECTION SCHEMAS ──────────────────────────────────────────

// Section 1: Hero
export interface HeroSectionContent {
  headlinePrefix: string; // e.g. "WE ENGINEER"
  highlightWords: string; // e.g. "FLAGSHIP DIGITAL PRODUCTS"
  headlineSuffix: string; // e.g. "THAT DEFY CONVENTIONS."
  subText: string;
  availabilityBadge: string;
  primaryCtaLabel: string;
  primaryCtaTarget: string; // anchor e.g. "#book"
  secondaryCtaLabel: string;
  secondaryCtaTarget: string; // anchor e.g. "#work-matrix"
}

// Section 2: Trust Strip
export interface TrustClientItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  link?: string;
  visible: boolean;
  order: number;
}
export interface TrustStripContent {
  titleBadge: string;
  clients: TrustClientItem[];
}

// Section 3: Featured Work
export interface FeaturedWorkContent {
  badge: string;
  heading: string;
  subText: string;
  maxHomeItems: number; // default 4
  projects: FeaturedProjectItem[];
}

// Section 4: Services
export interface ServiceItem {
  id: string;
  num: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: string; // Icon identifier
  visible: boolean;
  order: number;
}
export interface ServicesContent {
  badge: string;
  heading: string;
  subText: string;
  services: ServiceItem[];
}

// Section 5: Process
export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  order: number;
}
export interface ProcessContent {
  badge: string;
  heading: string;
  subText: string;
  steps: ProcessStep[];
}

// Section 6: Stats
export interface StatCounterItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  autoCalculateFromDb?: boolean;
  order: number;
}
export interface StatsContent {
  stats: StatCounterItem[];
}

// Section 7: Testimonials
export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  clearance: string;
  quote: string;
  rating: number; // 1 to 5
  photoUrl?: string;
  visible: boolean;
  order: number;
}
export interface TestimonialsContent {
  badge: string;
  heading: string;
  subText: string;
  testimonials: TestimonialItem[];
}

// Section 8: About / Team
export interface PublicTeamMemberItem {
  memberId: string;
  publicName: string;
  publicRole: string;
  publicDepartment: string;
  publicBio: string;
  publicAvatar?: string;
  skills: string[];
  visible: boolean;
  order: number;
}
export interface AboutContent {
  heroTagline: string;
  subTagline: string;
  manifesto: string;
  vision: string;
  methodology: string;
  securityGuarantee: string;
  foundedYear: string;
  location: string;
  teamHighlight: string;
  contactEmail: string;
  tenets: { title: string; desc: string }[];
  publicMembers: PublicTeamMemberItem[];
}

// Section 9: Become an Architect
export interface ArchitectContent {
  enabled: boolean;
  badge: string;
  heading: string;
  description: string;
  squadBenefitTitle: string;
  squadBenefitDesc: string;
  compensationTitle: string;
  compensationDesc: string;
  openPositionsNote: string;
  availableDisciplines: string[];
}

// Section 10: CTA Banner & Direct Contacts (SINGLE SOURCE OF TRUTH)
export interface ContactContent {
  headline: string;
  highlightText: string;
  subText: string;
  phone: string;
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
  email: string;
  scheduleCallLink: string;
  location: string;
  workingHours: string;
  responseTimeGuarantee: string;
  ndaGuaranteeText: string;
}

// Section 11: Forms Config (Booking / Brief / Call)
export interface FormsConfigContent {
  briefTitle: string;
  briefSubtitle: string;
  callTitle: string;
  callSubtitle: string;
  availableScopes: string[];
  availableBudgetRanges: string[];
  availableTimelines: string[];
  availableCallSlots: string[];
  availablePlatforms: string[];
  successMessageBrief: string;
  successMessageCall: string;
}

// Section 12: Footer & Socials
export interface FooterContent {
  studioBio: string;
  statusIndicator: string;
  copyrightText: string;
  socials: {
    githubUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };
}

// Section 13: SEO & Site Settings
export interface SeoContent {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImageUrl?: string;
  faviconUrl?: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
}

// Section 14: Theme Default
export interface ThemeDefaultContent {
  defaultTheme: ThemeType;
}

// Section 15: AI Agent Settings
export interface AiAgentContent {
  enabled: boolean;
  agentName: string;
  greetingText: string;
  suggestedQuestions: { q: string; a: string }[];
}

// ─── MASTER CMS DATA DICTIONARY ───────────────────────────────────────────────

export type CMSSectionKey =
  | 'hero'
  | 'trust_strip'
  | 'featured_work'
  | 'services'
  | 'process'
  | 'stats'
  | 'testimonials'
  | 'about'
  | 'architect'
  | 'contact'
  | 'forms'
  | 'footer'
  | 'seo'
  | 'theme_default'
  | 'ai_agent';

export interface CMSSectionsPayload {
  hero: HeroSectionContent;
  trust_strip: TrustStripContent;
  featured_work: FeaturedWorkContent;
  services: ServicesContent;
  process: ProcessContent;
  stats: StatsContent;
  testimonials: TestimonialsContent;
  about: AboutContent;
  architect: ArchitectContent;
  contact: ContactContent;
  forms: FormsConfigContent;
  footer: FooterContent;
  seo: SeoContent;
  theme_default: ThemeDefaultContent;
  ai_agent: AiAgentContent;
}

export type CMSDataDictionary = CMSSectionsPayload;

// ─── PLATFORM SYSTEM MODELS ───────────────────────────────────────────────────

export interface CMSSectionRecord<T = unknown> {
  id: CMSSectionKey;
  sectionKey: CMSSectionKey;
  draftData: T;
  publishedData: T;
  status: 'DRAFT_CHANGED' | 'PUBLISHED';
  lastEditedBy: string;
  lastEditedAt: string;
  publishedBy?: string;
  publishedAt?: string;
}

export interface CMSVersion<T = unknown> {
  id: string;
  sectionKey: CMSSectionKey;
  versionNumber: number;
  data: T;
  authorId: string;
  authorName: string;
  timestamp: string;
  summary: string;
}

export interface CMSAuditLogEntry {
  id: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  action: 'SAVE_DRAFT' | 'PUBLISH' | 'REVERT_VERSION' | 'UPLOAD_MEDIA' | 'TOGGLE_FEATURED';
  sectionKey: CMSSectionKey | 'media' | 'projects';
  summary: string;
}

export interface CMSMediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  altText: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Bridge mapping table: connects studio_projects to public display
export interface FeaturedProjectBridge {
  id: string;
  projectId: string; // Links to StudioProject.id
  isFeatured: boolean;
  order: number;
  publicVisibility: boolean;
  publicOverrides: {
    title?: string;
    tagline?: string;
    category?: string;
    tags?: string[];
    problem?: string;
    solution?: string;
    result?: string;
    techStack?: string[];
    coverImage?: string;
    liveUrl?: string;
    allowIframe?: boolean;
  };
  updatedAt: string;
}
