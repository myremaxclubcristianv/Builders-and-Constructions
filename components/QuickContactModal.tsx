'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getOrCreateSession, trackHighValueActivity, trackFormStarted, trackFormAbandoned } from '@/lib/visitor-tracker';

const INTEREST_OPTIONS = [
  { value: 'Servicii de calitate în construcții', label: 'Servicii de calitate în construcții' },
  { value: 'Controlul calității', label: 'Controlul calității' },
  { value: 'Manager calitate', label: 'Manager calitate' },
  { value: 'Cartea Tehnică a Construcției', label: 'Cartea Tehnică a Construcției' },
  { value: 'Inspector SSM', label: 'Inspector SSM' },
  { value: 'Proiecte', label: 'Proiecte' },
  { value: 'Arhitecți', label: 'Arhitecți' },
  { value: 'Publicitate', label: 'Publicitate' },
  { value: 'Închirieri utilaje', label: 'Închirieri utilaje' },
  { value: 'Intermediere asigurări', label: 'Intermediere asigurări' },
  { value: 'Credite / finanțare', label: 'Credite / finanțare' },
  { value: 'Vânzări real estate', label: 'Vânzări real estate' },
  { value: 'Imobiliare', label: 'Imobiliare' },
  { value: 'Altă solicitare', label: 'Altă solicitare' }
];

export function QuickContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Servicii de calitate în construcții');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState('Telefon');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Foarte urgent'>('Normal');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const prevIsOpenRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const isSubmittedRef = useRef(false);

  // Keep form values in ref to prevent handleClose recreation on keystrokes
  const formValuesRef = useRef({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    serviceInterest: 'Servicii de calitate în construcții',
    message: ''
  });

  useEffect(() => {
    formValuesRef.current = { fullName, phone, email, companyName, serviceInterest, message };
  }, [fullName, phone, email, companyName, serviceInterest, message]);

  // Global event listener to open modal from anywhere on site
  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      if (e.detail?.interest) {
        setServiceInterest(e.detail.interest);
      }
      setIsOpen(true);
      setSuccessLeadId(null);
      setSubmitError(null);
      isSubmittedRef.current = false;
      if (!hasTrackedStartRef.current) {
        trackFormStarted('quick_contact_modal', e.detail?.interest || serviceInterest);
        hasTrackedStartRef.current = true;
      }
    };

    window.addEventListener('open-quick-contact', handleOpenEvent);
    return () => window.removeEventListener('open-quick-contact', handleOpenEvent);
  }, [serviceInterest]);

  // Stable close handler that tracks abandonment without triggering rerender loops
  const handleClose = useCallback(() => {
    if (!isSubmittedRef.current && !successLeadId) {
      const vals = formValuesRef.current;
      const completed: string[] = [];
      if (vals.fullName.trim()) completed.push('Name');
      if (vals.phone.trim()) completed.push('Phone');
      if (vals.email.trim()) completed.push('Email');
      if (vals.companyName.trim()) completed.push('Company');
      if (vals.serviceInterest) completed.push('Interest');
      if (vals.message.trim()) completed.push('Message');

      if (completed.length > 0) {
        trackFormAbandoned('quick_contact_modal', completed);
      }
    }
    setIsOpen(false);
  }, [successLeadId]);

  // Focus Name field ONCE on modal open transition only
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
      prevIsOpenRef.current = true;
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      prevIsOpenRef.current = false;
    }
  }, [isOpen]);

  // Keyboard accessibility: Escape to close & Body scroll lock
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent anti-bot discard

    if (!fullName.trim() || (!phone.trim() && !email.trim())) {
      setSubmitError('Te rugăm să completezi numele și cel puțin un număr de telefon sau o adresă de email.');
      return;
    }

    if (!consent) {
      setSubmitError('Este necesar acordul GDPR pentru a transmite solicitarea.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const session = getOrCreateSession();

    try {
      const payload = {
        serviceId: 'general-contact',
        serviceName: serviceInterest,
        role: companyRole || 'Nespecificat',
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        isCompany: Boolean(companyName.trim()),
        companyName: companyName.trim() || undefined,
        companyRole: companyRole.trim() || undefined,
        message: message.trim(),
        preferredContact,
        urgency,
        consentGranted: consent,
        source: 'always_on_contact_modal',
        landingPath: typeof window !== 'undefined' ? window.location.pathname : '/',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        visitorId: session.visitorId,
        sessionId: session.sessionId,
        deviceCategory: session.navigationPath.length > 0 ? 'Web' : 'Desktop',
        serviceSpecificData: {
          interestCategory: serviceInterest,
          companyRole: companyRole.trim() || 'N/A'
        }
      };

      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        isSubmittedRef.current = true;
        setSuccessLeadId(data.leadId);
        trackHighValueActivity('General Contact Submission', serviceInterest, {
          name: fullName,
          email,
          phone,
          company: companyName,
          requestType: serviceInterest
        });
      } else {
        setSubmitError(data.error || 'Nu am putut trimite solicitarea. Te rugăm să încerci din nou.');
      }
    } catch {
      setSubmitError('Nu am putut trimite solicitarea. Te rugăm să verifici conexiunea la internet și să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidContact = fullName.trim().length > 0 && (phone.trim().length > 0 || email.trim().length > 0) && consent;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-contact-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#0F1210] border border-[#232825] rounded-xl shadow-2xl p-4 sm:p-6 text-white relative my-auto animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1A1D1B] pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#C9A227] uppercase font-bold">
                Direct Contact Desk
              </span>
            </div>
            <h2 id="quick-contact-title" className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Spune-ne cu ce te putem ajuta
            </h2>
            <p className="text-xs text-[#888888] mt-0.5">
              Trimite-ne câteva detalii și revenim către tine în cel mai scurt timp.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#666666] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Închide fereastra"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {successLeadId ? (
          /* Success State */
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mx-auto text-xl border border-[#C9A227]/40">
              ✓
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mesaj trimis cu succes</h3>
              <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
                Am primit detaliile tale. Un reprezentant tehnic te va contacta în cel mai scurt timp.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-[#1A1D1B] rounded border border-[#2A2E2C] text-[11px] font-mono text-[#C9A227]">
                ID Înregistrare: LEAD-{successLeadId.replace(/^LEAD-/, '')}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
            >
              Închide
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Honeypot field */}
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
                Nume complet <span className="text-[#C9A227]">*</span>
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
                  inputMode="tel"
                  autoComplete="tel"
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
                  inputMode="email"
                  autoComplete="email"
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
                  Rol / poziție (opțional)
                </label>
                <input
                  type="text"
                  value={companyRole}
                  onChange={e => setCompanyRole(e.target.value)}
                  placeholder="ex: Administrator, Inginer, Manager"
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] outline-none"
                />
              </div>
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
                  <option value="Urgent">Urgent</option>
                  <option value="Foarte urgent">⚡ Foarte urgent</option>
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

            {/* Error State */}
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
