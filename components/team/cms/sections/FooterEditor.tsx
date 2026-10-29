// FILE PATH: components/team/cms/sections/FooterEditor.tsx
'use client';

import React from 'react';
import { Globe, Code2, Share2 } from 'lucide-react';
import { FooterContent } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface FooterEditorProps {
  data: FooterContent;
  onChange: (updated: FooterContent) => void;
  currentUser: StudioMember;
}

export default function FooterEditor({ data, onChange }: FooterEditorProps) {
  const update = (fields: Partial<FooterContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateSocials = (socials: Partial<FooterContent['socials']>) => {
    onChange({
      ...data,
      socials: { ...data.socials, ...socials },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 12 // FOOTER, SYSTEM STATUS & SOCIAL LINKS
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure global footer biography, system status badge, legal copyright text, and official social media URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            STUDIO BIOGRAPHY (SHORT BLURB)
          </label>
          <textarea
            rows={3}
            value={data.studioBio}
            onChange={(e) => update({ studioBio: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              SYSTEM STATUS INDICATOR TEXT
            </label>
            <input
              value={data.statusIndicator}
              onChange={(e) => update({ statusIndicator: e.target.value })}
              placeholder="ALL SYSTEMS OPERATIONAL // NEXT SPRINT OPEN"
              className="theme-input font-mono text-xs text-emerald-400 font-bold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              COPYRIGHT NOTICE
            </label>
            <input
              value={data.copyrightText}
              onChange={(e) => update({ copyrightText: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[var(--accent)]" />
          OFFICIAL PUBLIC PROFILES
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              GITHUB PROFILE / REPO URL
            </label>
            <input
              value={data.socials?.githubUrl || ''}
              onChange={(e) => updateSocials({ githubUrl: e.target.value })}
              placeholder="https://github.com/technova-studio"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              X (TWITTER) URL
            </label>
            <input
              value={data.socials?.twitterUrl || ''}
              onChange={(e) => updateSocials({ twitterUrl: e.target.value })}
              placeholder="https://x.com/technovastudio"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              LINKEDIN COMPANY URL
            </label>
            <input
              value={data.socials?.linkedinUrl || ''}
              onChange={(e) => updateSocials({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/company/technova-studio"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              CANONICAL WEBSITE DOMAIN
            </label>
            <input
              value={data.socials?.websiteUrl || ''}
              onChange={(e) => updateSocials({ websiteUrl: e.target.value })}
              placeholder="https://technova.dev"
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
