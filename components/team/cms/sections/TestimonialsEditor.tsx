// FILE PATH: components/team/cms/sections/TestimonialsEditor.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Upload, Star } from 'lucide-react';
import { TestimonialsContent, TestimonialItem } from '@/lib/cms-types';
import MediaUploaderModal from '../modals/MediaUploaderModal';
import { StudioMember } from '@/lib/store';

interface TestimonialsEditorProps {
  data: TestimonialsContent;
  onChange: (updated: TestimonialsContent) => void;
  currentUser: StudioMember;
}

export default function TestimonialsEditor({
  data,
  onChange,
  currentUser,
}: TestimonialsEditorProps) {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const update = (fields: Partial<TestimonialsContent>) => {
    onChange({ ...data, ...fields });
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    onChange({ ...data, testimonials });
  };

  const handleAdd = () => {
    const newItem: TestimonialItem = {
      id: `tst-${Date.now()}`,
      author: 'ENTERPRISE PARTNER',
      role: 'VP OF PRODUCT',
      company: 'GLOBAL SYSTEMS INC.',
      clearance: 'PRODUCTION',
      quote: 'Technova delivered our flagship platform ahead of schedule with immaculate technical execution.',
      rating: 5,
      visible: true,
      order: data.testimonials.length + 1,
    };
    updateTestimonials([...data.testimonials, newItem]);
  };

  const handleRemove = (index: number) => {
    const next = [...data.testimonials];
    next.splice(index, 1);
    next.forEach((item, i) => (item.order = i + 1));
    updateTestimonials(next);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.testimonials.length) return;
    const next = [...data.testimonials];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    next.forEach((item, i) => (item.order = i + 1));
    updateTestimonials(next);
  };

  const handleFieldChange = (index: number, field: keyof TestimonialItem, value: any) => {
    const next = [...data.testimonials];
    next[index] = { ...next[index], [field]: value };
    updateTestimonials(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            SECTION 07 // CLIENT TESTIMONIALS & ENDORSEMENTS
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage partner endorsements, quotes, clearance verification, and ratings.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="theme-button flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD TESTIMONIAL
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)]">
        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION BADGE
          </label>
          <input
            value={data.badge}
            onChange={(e) => update({ badge: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SECTION HEADING
          </label>
          <input
            value={data.heading}
            onChange={(e) => update({ heading: e.target.value })}
            className="theme-input font-mono text-xs font-bold"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SUBTEXT
          </label>
          <input
            value={data.subText}
            onChange={(e) => update({ subText: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-4">
        {data.testimonials.map((t, idx) => (
          <div
            key={t.id}
            className={`p-4 rounded-lg border transition-all ${
              t.visible
                ? 'border-[var(--border)] bg-[var(--surface)]'
                : 'border-dashed border-[var(--border)]/50 opacity-60 bg-[var(--surface-sunken)]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--accent)]">
                  #{idx + 1}
                </span>
                <span className="font-mono text-sm font-bold text-[var(--text)]">
                  {t.author}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  — {t.company}
                </span>
                {t.visible ? (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    VISIBLE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    HIDDEN
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFieldChange(idx, 'visible', !t.visible)}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {t.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === data.testimonials.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  AUTHOR NAME
                </label>
                <input
                  value={t.author}
                  onChange={(e) => handleFieldChange(idx, 'author', e.target.value)}
                  className="theme-input font-mono text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  ROLE / TITLE
                </label>
                <input
                  value={t.role}
                  onChange={(e) => handleFieldChange(idx, 'role', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  COMPANY / ENTITY
                </label>
                <input
                  value={t.company}
                  onChange={(e) => handleFieldChange(idx, 'company', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  RATING (1-5)
                </label>
                <div className="flex items-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleFieldChange(idx, 'rating', star)}
                      className={`p-1 ${
                        star <= (t.rating || 5) ? 'text-amber-400' : 'text-neutral-600'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                QUOTE / ENDORSEMENT
              </label>
              <textarea
                rows={3}
                value={t.quote}
                onChange={(e) => handleFieldChange(idx, 'quote', e.target.value)}
                className="theme-input font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  CLEARANCE BADGE (e.g. LEVEL 4 // VERIFIED CLIENT)
                </label>
                <input
                  value={t.clearance}
                  onChange={(e) => handleFieldChange(idx, 'clearance', e.target.value)}
                  className="theme-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
                  AVATAR / LOGO IMAGE URL
                </label>
                <div className="flex gap-2">
                  <input
                    value={t.photoUrl || ''}
                    onChange={(e) => handleFieldChange(idx, 'photoUrl', e.target.value)}
                    placeholder="/uploads/... or https://..."
                    className="theme-input font-mono text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItemIndex(idx);
                      setUploaderOpen(true);
                    }}
                    className="theme-button flex items-center gap-1 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {uploaderOpen && (
        <MediaUploaderModal
          isOpen={uploaderOpen}
          onClose={() => {
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
          currentUser={currentUser}
          onUploaded={(url: string) => {
            if (activeItemIndex !== null) {
              handleFieldChange(activeItemIndex, 'photoUrl', url);
            }
            setUploaderOpen(false);
            setActiveItemIndex(null);
          }}
        />
      )}
    </div>
  );
}
