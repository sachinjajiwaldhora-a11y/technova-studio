// FILE PATH: components/modals/BookingModal.tsx
'use client';

import React, { useState } from 'react';
import {
  X, CheckCircle2, Terminal, ArrowRight, Calendar,
  FileCode2, Clock, Video, Building2, Mail, User, ShieldCheck, Activity,
} from 'lucide-react';
import {
  ClientInquiry, StudioCMSConfig,
  STORAGE_KEYS, getStore, setStore,
  SEED_INQUIRIES, SEED_CMS,
} from '@/lib/store';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'BRIEF' | 'CALL';
  onOpenTracker?: (code: string) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  defaultMode = 'BRIEF',
  onOpenTracker,
}: BookingModalProps) {
  const [activeMode, setActiveMode] = useState<'BRIEF' | 'CALL'>(defaultMode);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  // Brief specific fields
  const [projectTitle, setProjectTitle] = useState('');
  const [scope, setScope] = useState('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('1 - 3 Months');

  // Call specific fields
  const [callDate, setCallDate] = useState('');
  const [callSlot, setCallSlot] = useState('');
  const [meetingTopic, setMeetingTopic] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('');

  const [submittedData, setSubmittedData] = useState<{
    sessionCode: string;
    email: string;
    kind: 'PROJECT_INQUIRY' | 'CALL_BOOKING';
  } | null>(null);

  if (!isOpen) return null;

  // Retrieve custom options configured dynamically via CMS Booking Settings
  const cmsConfig = getStore<StudioCMSConfig>(STORAGE_KEYS.CMS, SEED_CMS);
  const booking = cmsConfig?.bookingSettings || SEED_CMS.bookingSettings;

  const scopes = booking.availableScopes?.length ? booking.availableScopes : [
    'IMPOSSIBLE WEBGL / 3D PLATFORM',
    'CUSTOM AI & DISTRIBUTED SYSTEM',
    'HIGH-END BRAND & INTERACTION DESIGN',
    'FULLSTACK PRODUCT ENGINEERING',
  ];

  const budgetRanges = booking.availableBudgetRanges?.length ? booking.availableBudgetRanges : [
    '$15,000 - $30,000',
    '$30,000 - $60,000',
    '$60,000 - $120,000',
    '$120,000+ Enterprise',
  ];

  const callSlots = booking.availableCallSlots?.length ? booking.availableCallSlots : [
    '10:00 - 10:45 AM IST',
    '02:00 - 02:45 PM IST',
    '05:00 - 05:45 PM IST',
    '09:00 - 09:45 PM IST (US East / EU Friendly)',
  ];

  const platforms = booking.callMeetingPlatforms?.length ? booking.callMeetingPlatforms : [
    'Google Meet (Secure Link)',
    'Zoom Enterprise',
    'Direct Encrypted Audio Call',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = Date.now();
    const inqId = `inq-${timestamp.toString(36)}`;
    const sessionCode = `NV-${activeMode === 'BRIEF' ? 'INQ' : 'CALL'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isBrief = activeMode === 'BRIEF';
    const parsedRevenue = parseInt((budgetRange || booking.minimumBudget || '25000').replace(/\D/g, '')) || 25000;

    // DIRECTLY AND STRICTLY DISPATCH TO INQUIRY TAB
    const newInquiry: ClientInquiry = {
      id: inqId,
      trackingCode: sessionCode,
      kind: isBrief ? 'PROJECT_INQUIRY' : 'CALL_BOOKING',
      clientName: name,
      company: company || 'Stealth Venture',
      email: email,
      title: isBrief ? (projectTitle || `${company || name} Commission`) : (meetingTopic || 'Discovery Architecture Session'),
      scope: isBrief ? (scope || scopes[0]) : (meetingTopic || 'Executive Strategy Call'),
      description: isBrief ? description : `Requested Call Slot: ${callSlot || callSlots[0]} via ${meetingPlatform || platforms[0]}. Topic: ${meetingTopic}`,
      budget: isBrief ? (budgetRange || budgetRanges[0]) : 'Consultation / Scoping',
      timeline: isBrief ? timeline : undefined,
      callTimeSlot: !isBrief ? (callSlot || callSlots[0]) : undefined,
      meetingPlatform: !isBrief ? (meetingPlatform || platforms[0]) : undefined,
      expectedRevenue: parsedRevenue,
      leadSource: 'WEBSITE_HUD',
      preferredCallDate: !isBrief && callDate ? callDate : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'NEW_INQUIRY',
      assignedSalesId: 'usr-02',
      dealNotes: isBrief
        ? `Inbound Project Inquiry: "${projectTitle}". Domain: ${scope || scopes[0]}. Target: ${timeline}.`
        : `Scheduled Call Request for ${callDate || 'ASAP'} (${callSlot || callSlots[0]}). Platform: ${meetingPlatform || platforms[0]}.`,
      submittedAt: new Date().toISOString(),
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    };

    const existingInquiries = getStore<ClientInquiry[]>(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
    setStore(STORAGE_KEYS.INQUIRIES, [newInquiry, ...existingInquiries]);

    // Backward compatible session storage for client
    try {
      localStorage.setItem(
        'technova_client_session',
        JSON.stringify({ name, email, sessionCode, kind: newInquiry.kind, scope: newInquiry.scope })
      );
    } catch {
      // safe fallback
    }

    setSubmittedData({
      sessionCode,
      email,
      kind: isBrief ? 'PROJECT_INQUIRY' : 'CALL_BOOKING',
    });
  };

  return (
    <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl border border-red-500/50 bg-[#060606] p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.25)] hud-clip my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedData ? (
          <>
            <div className="flex items-center space-x-2 text-red-500 font-mono text-[10px] tracking-[0.25em] uppercase">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIRECT DISPATCH // CLIENT ENGAGEMENT TERMINAL</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-extrabold tracking-tight text-white uppercase">
                {activeMode === 'BRIEF' ? 'TRANSMIT PROJECT BRIEF' : 'SCHEDULE DISCOVERY CALL'}
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 border border-white/10 bg-black/60 p-1">
              <button
                type="button"
                onClick={() => setActiveMode('BRIEF')}
                className={`flex items-center justify-center space-x-2 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  activeMode === 'BRIEF'
                    ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>PROJECT INQUIRY</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('CALL')}
                className={`flex items-center justify-center space-x-2 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                  activeMode === 'CALL'
                    ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>SCHEDULE CALL</span>
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-400">
              {activeMode === 'BRIEF'
                ? 'Submit detailed project specifications directly into our studio intake queue for technical review.'
                : 'Lock in a 45-minute technical briefing with our lead systems architects.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Client Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    YOUR NAME *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                    WORK EMAIL *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="v.rao@enterprise.io"
                    className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                  COMPANY / VENTURE
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Aetherius Quantum / Stealth"
                  className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* MODE 1: PROJECT INQUIRY BRIEF */}
              {activeMode === 'BRIEF' ? (
                <>
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                      PROJECT TITLE / VISION *
                    </label>
                    <input
                      required
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Real-Time WebGL Orbital Command Platform"
                      className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                        ARCHITECTURE DOMAIN
                      </label>
                      <select
                        value={scope || scopes[0]}
                        onChange={(e) => setScope(e.target.value)}
                        className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        {scopes.map((sc) => (
                          <option key={sc} value={sc}>
                            {sc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                        BUDGET ALLOCATION
                      </label>
                      <select
                        value={budgetRange || budgetRanges[0]}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        {budgetRanges.map((br) => (
                          <option key={br} value={br}>
                            {br}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                      PROJECT REQUIREMENTS & TECHNICAL SPECIFICATIONS *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe target features, visual benchmarks, performance goals (e.g. 120 FPS WebGL, zero-knowledge auth), and tech requirements..."
                      className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                      TARGET DELIVERY TIMELINE
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Urgent (< 30 Days)">Urgent (&lt; 30 Days)</option>
                      <option value="1 - 3 Months">1 - 3 Months (Standard)</option>
                      <option value="Quarterly / Long-term Build">Quarterly / Long-term Build</option>
                    </select>
                  </div>
                </>
              ) : (
                /* MODE 2: SCHEDULE DISCOVERY CALL */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                        PREFERRED CALL DATE *
                      </label>
                      <input
                        required
                        type="date"
                        value={callDate}
                        onChange={(e) => setCallDate(e.target.value)}
                        className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                        AVAILABLE TIME SLOT
                      </label>
                      <select
                        value={callSlot || callSlots[0]}
                        onChange={(e) => setCallSlot(e.target.value)}
                        className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                      >
                        {callSlots.map((cs) => (
                          <option key={cs} value={cs}>
                            {cs}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                      MEETING TOPIC / AGENDA *
                    </label>
                    <input
                      required
                      value={meetingTopic}
                      onChange={(e) => setMeetingTopic(e.target.value)}
                      placeholder="e.g. Architecture review for spatial 3D web platform & timeline"
                      className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-zinc-400 uppercase mb-1">
                      PREFERRED MEETING PLATFORM
                    </label>
                    <select
                      value={meetingPlatform || platforms[0]}
                      onChange={(e) => setMeetingPlatform(e.target.value)}
                      className="w-full border border-white/15 bg-black px-3.5 py-2.5 font-mono text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      {platforms.map((pl) => (
                        <option key={pl} value={pl}>
                          {pl}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full mt-3 flex items-center justify-center space-x-2 border border-red-500 bg-red-600/30 py-3.5 font-mono text-xs tracking-[0.25em] text-white uppercase hover:bg-red-600 transition-all hud-clip shadow-[0_0_30px_rgba(220,38,38,0.25)]"
              >
                <span>{activeMode === 'BRIEF' ? 'DISPATCH INQUIRY TO STUDIO BOARD' : 'LOCK & CONFIRM CALL SLOT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-red-500" />
                  <span>ENTERPRISE NDA PROTECTED</span>
                </span>
                <span>RESPONSE GUARANTEE: {booking.responseTime || '< 24 HOURS'}</span>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-red-500 mx-auto animate-pulse" />
            <h4 className="text-2xl font-black tracking-wide text-white uppercase">
              TRANSMISSION LOCKED
            </h4>
            <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
              Your {submittedData.kind === 'PROJECT_INQUIRY' ? 'project inquiry' : 'discovery call briefing'} has been queued into the Technova Studio Intake Pipeline. Our team lead will review and confirm.
            </p>
            <div className="border border-red-500/40 bg-red-950/20 p-5 font-mono text-xs max-w-sm mx-auto">
              <div className="text-zinc-400 text-[10px] uppercase tracking-widest">
                SESSION TRACKING CODE
              </div>
              <div className="text-red-400 text-lg font-extrabold tracking-widest mt-1">
                {submittedData.sessionCode}
              </div>
              <div className="text-zinc-500 text-[10px] mt-1">
                Assigned to: {submittedData.email}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onOpenTracker && (
                <button
                  type="button"
                  onClick={() => {
                    const code = submittedData.sessionCode;
                    setSubmittedData(null);
                    onClose();
                    onOpenTracker(code);
                  }}
                  className="w-full sm:w-auto border border-emerald-500 bg-emerald-600/30 px-6 py-3 font-mono text-xs text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all uppercase flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>TRACK THIS SPRINT LIVE →</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  onClose();
                }}
                className="w-full sm:w-auto border border-white/20 px-6 py-3 font-mono text-xs text-white hover:border-red-500 hover:bg-red-600/20 transition-all uppercase"
              >
                RETURN TO MATRIX
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}