'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export function NewsletterSubscription() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!consent) {
      setErrorMessage(
        language === 'ro'
          ? 'Este necesar acordul pentru politica de confidențialitate.'
          : 'Privacy policy consent is required.'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.ok) {
        setSuccessMessage(
          language === 'ro'
            ? 'Abonare confirmată! Vei primi rapoartele factuale de piață.'
            : 'Subscribed successfully! You will receive factual market briefs.'
        );
        setEmail('');
      } else {
        setErrorMessage(
          data?.error ||
          (language === 'ro'
            ? 'A apărut o problemă. Te rugăm să reîncerci.'
            : 'An error occurred. Please try again.')
        );
      }
    } catch {
      setErrorMessage(
        language === 'ro'
          ? 'Eroare de conexiune. Te rugăm să reîncerci.'
          : 'Network error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#111111] border border-[#1A1D1B] rounded-2xl relative overflow-hidden font-mono text-xs">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl space-y-4">
        <div>
          <span className="text-[10px] text-[#C9A227] uppercase tracking-widest block font-bold">
            {language === 'ro' ? 'NOTIFICĂRI PERIODICE FACTUALE' : 'FACTUAL PERIODIC BRIEFS'}
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans tracking-tight mt-1">
            {language === 'ro' ? 'MONITORIZARE ȘANTIERE & INVESTIȚII ÎN TIMP REAL' : 'REAL-TIME JOB SITE & INVESTMENT INTELLIGENCE'}
          </h3>
          <p className="text-[#888] text-xs leading-relaxed mt-1">
            {language === 'ro'
              ? 'Primiți săptămânal sinteza șantierelor verificate, schimbărilor de autorizare și tranzacțiilor majore din România. Fără spam, fără speculații.'
              : 'Receive weekly summaries of verified job sites, permitting updates, and major institutional capex disclosures in Romania. Zero spam, zero hype.'}
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 bg-[#141F16] border border-[#22c55e]/50 rounded-xl text-[#22c55e] text-xs flex items-center gap-2">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ro' ? 'adresa.ta@companie.ro' : 'your.email@company.com'}
                className="flex-1 bg-[#141715] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-4 py-2.5 text-white placeholder-[#555] outline-none text-xs"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#d8b135] disabled:opacity-50 text-black font-bold text-xs rounded-lg transition-all shrink-0 cursor-pointer"
              >
                {loading
                  ? (language === 'ro' ? 'Se abonează...' : 'Subscribing...')
                  : (language === 'ro' ? 'Abonează-te →' : 'Subscribe →')}
              </button>
            </div>

            {/* GDPR Consent Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#777]">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#262A27] bg-[#141715] text-[#C9A227] focus:ring-0"
              />
              <span>
                {language === 'ro' ? (
                  <>Sunt de acord cu prelucrarea adresei mele de email conform <Link href="/privacy" className="text-[#C9A227] hover:underline">Politicii de Confidențialitate</Link>. Mă pot dezabona oricând cu un clic.</>
                ) : (
                  <>I agree to the processing of my email address in accordance with the <Link href="/privacy" className="text-[#C9A227] hover:underline">Privacy Policy</Link>. I can unsubscribe at any time.</>
                )}
              </span>
            </label>

            {errorMessage && (
              <p className="text-[#ef4444] text-[11px] font-mono">{errorMessage}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
