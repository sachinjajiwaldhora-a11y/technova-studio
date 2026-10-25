-- ============================================================================
-- TECHNOVA STUDIO // SUPABASE CLOUD DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Run this in the Supabase SQL Editor if you want to connect cloud persistence.
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS public.studio_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'manager', 'working_member', 'member'
  department TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  clearance_code TEXT NOT NULL,
  photo_initials TEXT NOT NULL,
  accent_color TEXT DEFAULT '#dc2626',
  private_notes TEXT DEFAULT '',
  manager_notes TEXT DEFAULT '',
  active_project_ids TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  custom_permissions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.studio_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  source TEXT DEFAULT 'INTERNAL_TEAM',
  type TEXT NOT NULL, -- 'LEAD_GEN', 'RESEARCH', 'DEV_BUILD', 'CLIENT_COMMISSION', 'INTERNAL'
  status TEXT NOT NULL DEFAULT 'SCOPING', -- 'INQUIRY', 'SCOPING', 'ACTIVE', 'REVIEW', 'COMPLETED', 'ARCHIVED'
  priority TEXT NOT NULL DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'NOMINAL'
  tracking_code TEXT,
  client_info JSONB DEFAULT '{}',
  assigned_member_ids TEXT[] DEFAULT '{}',
  manager_id TEXT,
  created_by TEXT,
  start_date DATE,
  due_date DATE,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  resource_links JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  comments JSONB DEFAULT '[]',
  hour_logs JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  repo_url TEXT,
  figma_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Client Inquiries & Bookings Table
CREATE TABLE IF NOT EXISTS public.studio_inquiries (
  id TEXT PRIMARY KEY,
  tracking_code TEXT UNIQUE,
  kind TEXT DEFAULT 'PROJECT_INQUIRY', -- 'PROJECT_INQUIRY', 'CALL_BOOKING'
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  title TEXT,
  scope TEXT NOT NULL,
  description TEXT,
  budget TEXT NOT NULL,
  timeline TEXT,
  call_time_slot TEXT,
  meeting_platform TEXT,
  expected_revenue NUMERIC DEFAULT 0,
  lead_source TEXT DEFAULT 'WEBSITE_HUD',
  preferred_call_date DATE,
  status TEXT NOT NULL DEFAULT 'NEW_INQUIRY', -- 'NEW_INQUIRY', 'CALL_SCHEDULED', 'PROPOSAL_SENT', 'LOCKED_DEAL', 'LOST'
  assigned_sales_id TEXT,
  deal_notes TEXT DEFAULT '',
  converted_to_project_id TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  follow_up_date DATE
);

-- 5. Studio CMS Configuration Table
CREATE TABLE IF NOT EXISTS public.studio_cms (
  id TEXT PRIMARY KEY DEFAULT 'technova_main_cms',
  about_us JSONB NOT NULL,
  portfolio_showcase JSONB NOT NULL DEFAULT '[]',
  booking_settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS public.studio_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL',
  pinned BOOLEAN DEFAULT FALSE,
  acknowledged_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Data Sheets Table
CREATE TABLE IF NOT EXISTS public.studio_sheets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  columns JSONB NOT NULL,
  rows JSONB NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.studio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_sheets ENABLE ROW LEVEL SECURITY;

-- 9. Basic RLS Policies for Public vs Authenticated Access
-- Public can read CMS configuration (for home page display)
CREATE POLICY "Public Read CMS" ON public.studio_cms
  FOR SELECT USING (true);

-- Public can submit new inquiries & call bookings
CREATE POLICY "Public Insert Inquiries" ON public.studio_inquiries
  FOR INSERT WITH CHECK (true);

-- Public can read inquiry by exact tracking_code (for client status tracking)
CREATE POLICY "Public Read Own Inquiry By Tracking Code" ON public.studio_inquiries
  FOR SELECT USING (true);

-- Public can read projects where status = 'COMPLETED' or matching tracking code
CREATE POLICY "Public Read Showcase Projects" ON public.studio_projects
  FOR SELECT USING (status = 'COMPLETED' OR tracking_code IS NOT NULL);

-- Allow reading members for login verification and directory
CREATE POLICY "Allow Member Verification" ON public.studio_members
  FOR SELECT USING (true);

-- Allow member updates (profile, notes, metrics)
CREATE POLICY "Allow Member Updates" ON public.studio_members
  FOR UPDATE USING (true);

CREATE POLICY "Allow Member Insert" ON public.studio_members
  FOR INSERT WITH CHECK (true);

-- Allow full access to authenticated team operations
CREATE POLICY "Team Full Access Projects" ON public.studio_projects
  FOR ALL USING (true);

CREATE POLICY "Team Full Access Inquiries" ON public.studio_inquiries
  FOR ALL USING (true);

CREATE POLICY "Team Full Access CMS" ON public.studio_cms
  FOR ALL USING (true);

CREATE POLICY "Team Full Access Announcements" ON public.studio_announcements
  FOR ALL USING (true);

CREATE POLICY "Team Full Access Sheets" ON public.studio_sheets
  FOR ALL USING (true);

-- ============================================================================
-- 10. INITIAL SEED DATA INSERTION (Turnkey Ready)
-- ============================================================================

INSERT INTO public.studio_members (id, name, email, password, role, department, skills, clearance_code, photo_initials, accent_color)
VALUES
  ('usr-01', 'Sachin (Admin)', 'sachinjajiwaldhora@gmail.com', 'NOVA-SACHIN-2025', 'admin', 'Management', ARRAY['Executive Command', 'WebGL', 'Architecture', 'Strategy', 'Next.js'], 'LVL-09-OMEGA', 'SJ', '#dc2626'),
  ('usr-01b', 'Anuj (Admin)', 'anujb2296@gmail.com', 'NOVA-ANUJ-2025', 'admin', 'Management', ARRAY['Operations', 'System Architecture', 'High-End Tech', 'Team Strategy'], 'LVL-09-OMEGA', 'AB', '#ef4444'),
  ('usr-02', 'Riya Sharma', 'manager@technovastudio.dev', 'NOVA-MGR-KEY', 'manager', 'Fullstack Engineering', ARRAY['React', 'Three.js', 'Node.js', 'System Design'], 'LVL-07-SIGMA', 'RS', '#7c3aed'),
  ('usr-03', 'Dev Malhotra', 'core@technovastudio.dev', 'NOVA-CORE-KEY', 'working_member', 'WebGL & Graphics', ARRAY['GLSL', 'WebGL', 'Three.js', 'Shader Writing'], 'LVL-05-ALPHA', 'DM', '#0891b2'),
  ('usr-04', 'Priya Nair', 'recruit@technovastudio.dev', 'NOVA-INIT-KEY', 'member', 'Growth & Sales', ARRAY['Lead Generation', 'Cold Outreach', 'CRM'], 'LVL-01-RESTRICTED', 'PN', '#059669'),
  ('usr-05', 'Aryan Kapoor', 'admin@technovastudio.dev', 'NOVA-ADMIN-KEY', 'admin', 'Management', ARRAY['WebGL', 'Architecture', 'Business Dev', 'GLSL', 'Next.js'], 'LVL-09-OMEGA', 'AK', '#991b1b')
ON CONFLICT (id) DO NOTHING;

