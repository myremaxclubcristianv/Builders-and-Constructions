'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getOrCreateSession, trackHighValueActivity } from '@/lib/visitor-tracker';

const INTEREST_OPTIONS = [
  { value: 'general-contact', label: 'Contact General / Discuție Proiect' },
  { value: 'Construcții', label: 'Construcții' },
  { value: 'Calitatea construcțiilor', label: 'Calitatea construcțiilor' },
  { value: 'Controlul calității', label: 'Controlul calității' },
  { value: 'Manager calitate', label: 'Manager calitate' },
  { value: 'Cartea Tehnică a Construcției', label: 'Cartea Tehnică a Construcției' },
  { value: 'SSM', label: 'SSM (Securitate și Sănătate în Muncă)' },
  { value: 'Proiecte', label: 'Proiecte' },
  { value: 'Arhitectură', label: 'Arhitectură' },
  { value: 'Publicitate', label: 'Publicitate' },
  { value: 'Închirieri utilaje', label: 'Închirieri utilaje' },
  { value: 'Asigurări', label: 'Asigurări' },
  { value: 'Credite / finanțare', label: 'Credite / finanțare' },
  { value: 'Vânzări real estate', label: 'Vânzări real estate' },
  { value: 'Imobiliare', label: 'Imobiliare' },
  { value: 'Altceva', label: 'Altceva' }
];

export function QuickContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceInterest, setServiceInterest] = useState('general-contact');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState('Telefon');
  const [urgency, setUrgency] = useState<'Normal' | 'Important' | 'Urgent'>('Important');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Global event listener to open modal from anywhere on site
  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      if (e.detail?.interest) {
        setServiceInterest(e.detail.interest);
      }
      setIsOpen(true);
      setSuccessLeadId(null);
      setSubmitError(null);
    };

    window.addEventListener('open-quick-contact', handleOpenEvent);
    return () => window.removeEventListener('open-quick-contact', handleOpenEvent);
  }, []);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus lock and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setMessage('');
    setSuccessLeadId(null);
    setSubmitError(null);
    setIsOpen(false);
  };

  const hasValidContact = fullName.trim().length >= 2 && (email.trim().length > 3 || phone.trim().length >= 6) && consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidContact) {
      setSubmitError('Te rugăm să completezi numele, cel puțin un mod de contact valid (telefon sau email) și acordul GDPR.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const session = getOrCreateSession();
      const interestLabel = INTEREST_OPTIONS.find(o => o.value === serviceInterest)?.label || serviceInterest;

      const payload = {
        role: 'Solicitare Generală / Contact',
        serviceId: 'general-contact',
        serviceName: interestLabel,
        isCompany: Boolean(companyName.trim()),
        companyName: companyName.trim() || undefined,
        isProjectRelated: 'no' as const,
        serviceSpecificData: {
          tip_solicitare: 'Contact Rapid / Always-On Desk',
          interes_selectat: interestLabel,
          canal_contact: preferredContact
        },
        message: message.trim() || undefined,
        urgency,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        preferredContact,
        consent,
        source: 'always_on_contact_modal',
        landingPath: typeof window !== 'undefined' ? window.location.pathname : '/contact',
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        visitorId: session.visitorId,
        sessionId: session.sessionId,
        website_hp: honeypot
      };

      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'A apărut o eroare la salvarea solicitării.');
      }

      const leadId = data.leadId || 'LEAD-CONFIRMED';
      setSuccessLeadId(leadId);

      // Track telemetry
      trackHighValueActivity('General Contact Submitted: ' + interestLabel, 'always_on_contact', {
        name: fullName,
        email,
        company: companyName,
        phone,
        message,
        requestType: interestLabel
      });
    } catch (err) {
      setSubmitError('Nu am putut trimite solicitarea. Te rugăm să reîncerci.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-contact-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#0B0D0C] border border-[#1A1D1B] rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto relative animate-fadeIn"
      >
        {/* Header with Close Button */}
        <div className="flex items-start justify-between border-b border-[#1A1D1B] pb-4 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold block mb-1">
              CONSTRUCTIONS BY AIXLUXURY • CONTACT DESK
            </span>
            <h2 id="quick-contact-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {successLeadId ? 'Mesaj trimis.' : 'Spune-ne cu ce te putem ajuta.'}
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-1">
              {successLeadId
                ? 'Solicitarea ta a fost transmisă. Revenim către tine cât mai curând.'
                : 'Trimite-ne câteva detalii și revenim către tine.'}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close contact modal"
            className="w-9 h-9 rounded-lg bg-[#111412] border border-[#1A1D1B] text-[#A0A0A0] hover:text-white flex items-center justify-center text-sm transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Success State (Section 9) */}
        {successLeadId ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#C9A227]/10 border border-[#C9A227] flex items-center justify-center mx-auto text-xl text-[#C9A227]">
              ✓
            </div>
            <div className="p-4 bg-[#111412] border border-[#1A1D1B] rounded-xl inline-block font-mono text-xs text-[#C5C5C5]">
              <span className="text-[#888888] block text-[10px] uppercase">Request ID</span>
              <span className="text-base font-bold text-[#C9A227] tracking-wider">{successLeadId}</span>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono rounded-lg transition-all"
              >
                Închide
              </button>
            </div>
          </div>
        ) : (
          /* Form Body (Section 4) */
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Honeypot */}
            <input
              type="text"
              name="website_hp"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none', position: 'absolute', left: '-9999px' }}
              aria-hidden="true"
            />

            <div>
              <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                Nume și prenume <span className="text-[#C9A227]">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Numele tău complet"
                className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                  Telefon <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+40 7..."
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                  Email <span className="text-[#C9A227]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@companie.ro"
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                  Companie (opțional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Nume companie"
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                  Ce te interesează?
                </label>
                <select
                  value={serviceInterest}
                  onChange={e => setServiceInterest(e.target.value)}
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  {INTEREST_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                Mesaj (opțional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Spune-ne pe scurt despre cerințele tale..."
                className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg p-2.5 text-xs text-white placeholder-[#555555] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-mono text-[#888888] mb-1">
                  Preferință contact
                </label>
                <select
                  value={preferredContact}
                  onChange={e => setPreferredContact(e.target.value)}
                  className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value="Telefon">Telefon</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Nu contează">Nu contează</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#888888] mb-1">
                  Urgență
                </label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">⚡ Urgent</option>
                </select>
              </div>
            </div>

            {/* Consent */}
            <div className="pt-2 border-t border-[#1A1D1B]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#C9A227] w-3.5 h-3.5 rounded cursor-pointer"
                />
                <span className="text-[11px] text-[#888888] leading-tight select-none">
                  Sunt de acord cu prelucrarea datelor pentru soluționarea acestei solicitări.
                </span>
              </label>
            </div>

            {/* Error State (Section 10) */}
            {submitError && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-[11px] text-red-200 font-mono" role="alert">
                {submitError}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-mono text-[#888888] hover:text-white transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasValidContact}
                className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#d8b135] disabled:opacity-40 disabled:hover:bg-[#C9A227] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-all shadow-md min-h-[44px] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Se trimite...</span>
                  </>
                ) : (
                  <>
                    <span>Trimite Solicitarea</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
