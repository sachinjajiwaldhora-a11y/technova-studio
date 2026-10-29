// FILE PATH: components/team/cms/sections/SeoEditor.tsx
'use client';

import React, { useState } from 'react';
import { Search, Upload, Megaphone } from 'lucide-react';
import { SeoContent } from '@/lib/cms-types';
import MediaUploaderModal from '../modals/MediaUploaderModal';
import { StudioMember } from '@/lib/store';

interface SeoEditorProps {
  data: SeoContent;
  onChange: (updated: SeoContent) => void;
  currentUser: StudioMember;
}

export default function SeoEditor({ data, onChange, currentUser }: SeoEditorProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeUploadField, setActiveUploadField] = useState<'ogImageUrl' | 'faviconUrl' | null>(null);

  const update = (fields: Partial<SeoContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateAnnouncement = (announcementBar: Partial<SeoContent['announcementBar']>) => {
    onChange({
      ...data,
      announcementBar: { ...data.announcementBar, ...announcementBar },
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 13 // SEO METADATA & SITE BROADCAST BANNER
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure search engine indexing, Open Graph social share cards, favicon, and the optional top announcement strip.
        </p>
      </div>

      {/* Meta tags */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <Search className="w-4 h-4 text-[var(--accent)]" />
          SEARCH ENGINE METADATA
        </h4>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            DOCUMENT TITLE (BROWSER TAB / GOOGLE SEARCH)
          </label>
          <input
            value={data.siteTitle}
            onChange={(e) => update({ siteTitle: e.target.value })}
            className="theme-input font-mono text-xs font-bold"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            META DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={data.metaDescription}
            onChange={(e) => update({ metaDescription: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            META KEYWORDS (comma-separated)
          </label>
          <input
            value={(data.keywords || []).join(', ')}
            onChange={(e) =>
              update({
                keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      {/* Social OG Image & Favicon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
            OPEN GRAPH SHARE IMAGE (1200x630 PX)
          </label>
          <div className="flex gap-2">
            <input
              value={data.ogImageUrl || ''}
              onChange={(e) => update({ ogImageUrl: e.target.value })}
              placeholder="/og-image.png or https://..."
              className="theme-input font-mono text-xs flex-1"
            />
            <button
              type="button"
              onClick={() => {
                setActiveUploadField('ogImageUrl');
                setUploaderOpen(true);
              }}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
            FAVICON URL (.ICO OR .SVG)
          </label>
          <div className="flex gap-2">
            <input
              value={data.faviconUrl || ''}
              onChange={(e) => update({ faviconUrl: e.target.value })}
              placeholder="/favicon.ico or https://..."
              className="theme-input font-mono text-xs flex-1"
            />
            <button
              type="button"
              onClick={() => {
                setActiveUploadField('faviconUrl');
                setUploaderOpen(true);
              }}
              className="theme-button flex items-center gap-1 text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-[var(--accent)]" />
            HOMEPAGE TOP BROADCAST STRIP
          </h4>
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[var(--text)]">
            <input
              type="checkbox"
              checked={data.announcementBar?.enabled}
              onChange={(e) => updateAnnouncement({ enabled: e.target.checked })}
              className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            ENABLE BROADCAST STRIP
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              ANNOUNCEMENT TEXT
            </label>
            <input
              value={data.announcementBar?.text || ''}
              onChange={(e) => updateAnnouncement({ text: e.target.value })}
              placeholder="e.g. Q3 ARCHITECTURE SPRINTS NOW ACCEPTING APPLICATIONS"
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              OPTIONAL ACTION LINK
            </label>
            <input
              value={data.announcementBar?.link || ''}
              onChange={(e) => updateAnnouncement({ link: e.target.value })}
              placeholder="#architect or https://..."
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {uploaderOpen && (
        <MediaUploaderModal
          isOpen={uploaderOpen}
          onClose={() => {
            setUploaderOpen(false);
            setActiveUploadField(null);
          }}
          currentUser={currentUser}
          onUploaded={(url: string) => {
            if (activeUploadField) {
              update({ [activeUploadField]: url });
            }
            setUploaderOpen(false);
            setActiveUploadField(null);
          }}
        />
      )}
    </div>
  );
}
