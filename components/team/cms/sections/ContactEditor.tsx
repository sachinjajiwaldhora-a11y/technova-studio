// FILE PATH: components/team/cms/sections/ContactEditor.tsx
'use client';

import React from 'react';
import { Phone, Mail, MessageSquare, Calendar, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { ContactContent } from '@/lib/cms-types';
import { StudioMember } from '@/lib/store';

interface ContactEditorProps {
  data: ContactContent;
  onChange: (updated: ContactContent) => void;
  currentUser: StudioMember;
}

export default function ContactEditor({ data, onChange }: ContactEditorProps) {
  const update = (fields: Partial<ContactContent>) => {
    onChange({ ...data, ...fields });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          SECTION 10 // CTA BANNER & DIRECT CONTACTS (SINGLE SOURCE OF TRUTH)
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Controls the bottom conversion banner and synchronizes direct Call, WhatsApp, Email, and Calendar booking links across the entire site (Navbar, Floating Actions, Footer, and Contact sections).
        </p>
      </div>

      {/* CTA Banner Heading */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
          CTA BANNER COPY
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              HEADLINE
            </label>
            <input
              value={data.headline}
              onChange={(e) => update({ headline: e.target.value })}
              className="theme-input font-mono text-xs font-bold"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--accent)] uppercase mb-1 font-bold">
              HIGHLIGHT ACCENT TEXT
            </label>
            <input
              value={data.highlightText}
              onChange={(e) => update({ highlightText: e.target.value })}
              className="theme-input font-mono text-xs font-bold border-[var(--accent)] text-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
            SUBTEXT / VALUE PROMISE
          </label>
          <input
            value={data.subText}
            onChange={(e) => update({ subText: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-[var(--accent)]" />
          DIRECT COMMUNICATION CHANNELS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              DIRECT PHONE NUMBER
            </label>
            <input
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              PRIMARY INQUIRY EMAIL
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="architecture@technova.dev"
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              WHATSAPP NUMBER (WITH COUNTRY CODE)
            </label>
            <input
              value={data.whatsappNumber}
              onChange={(e) => update({ whatsappNumber: e.target.value })}
              placeholder="+15550192834"
              className="theme-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              WHATSAPP PRE-FILLED INQUIRY MESSAGE
            </label>
            <input
              value={data.whatsappPrefilledMessage}
              onChange={(e) => update({ whatsappPrefilledMessage: e.target.value })}
              placeholder="Hi Technova team, I would like to discuss engineering a project."
              className="theme-input font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--accent)] uppercase mb-1 font-bold flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            SCHEDULE A CALL URL (CALENDLY / CAL.COM / CUSTOM BOOKING)
          </label>
          <input
            value={data.scheduleCallLink}
            onChange={(e) => update({ scheduleCallLink: e.target.value })}
            placeholder="https://cal.com/technova-sprint or #schedule"
            className="theme-input font-mono text-xs border-[var(--accent)] font-semibold"
          />
        </div>
      </div>

      {/* Operational Details & Guarantees */}
      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[var(--accent)]" />
          AVAILABILITY & ENTERPRISE GUARANTEES
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              STUDIO LOCATION BASE
            </label>
            <input
              value={data.location}
              onChange={(e) => update({ location: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              OPERATIONAL HOURS
            </label>
            <input
              value={data.workingHours}
              onChange={(e) => update({ workingHours: e.target.value })}
              className="theme-input font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1">
              RESPONSE TIME GUARANTEE
            </label>
            <input
              value={data.responseTimeGuarantee}
              onChange={(e) => update({ responseTimeGuarantee: e.target.value })}
              className="theme-input font-mono text-xs text-emerald-400 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[var(--accent)]" />
            MUTUAL NDA GUARANTEE BADGE TEXT
          </label>
          <input
            value={data.ndaGuaranteeText}
            onChange={(e) => update({ ndaGuaranteeText: e.target.value })}
            className="theme-input font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}

