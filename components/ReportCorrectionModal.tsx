'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

interface ReportCorrectionModalProps {
  entityName?: string;
  entityType?: 'Project' | 'Company';
  entitySlug?: string;
}

export function ReportCorrectionModal({
  entityName = '',
  entityType = 'Project',
  entitySlug = ''
}: ReportCorrectionModalProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [fieldToCorrect, setFieldToCorrect] = useState('Stadiu Fizic / Construction Stage');
  const [currentValue, setCurrentValue] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [sourceCitation, setSourceCitation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.entityName) {
        // can override
      }
      setIsOpen(true);
      setSubmitted(false);
      setErrorMessage('');
    };

    window.addEventListener('open-correction-modal', handleOpen);
    return () => window.removeEventListener('open-correction-modal', handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'report_error',
          name: contactName || 'Contribuitor Anonim',
          email: contactEmail,
          company: entityName,
          requestType: 'Profile Correction Request',
          message: `CORRECTION REQUEST FOR ${entityName} (${entityType}) [${entitySlug}]:
Field: ${fieldToCorrect}
Current Value: ${currentValue}
Proposed Value: ${proposedValue}
Source Citation: ${sourceCitation}
Submitted by: ${contactName} (${contactEmail})`,
          leadType: 'correction_request'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(data?.error || (language === 'ro' ? 'Eroare la transmitere. Te rugăm să reîncerci.' : 'Submission error. Please try again.'));
      }
    } catch {
      setErrorMessage(language === 'ro' ? 'Eroare de rețea. Te rugăm să reîncerci.' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-mono text-xs">
      <div className="bg-[#111111] border border-[#262A27] rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#888] hover:text-white text-lg p-1"
        >
          ✕
        </button>

        <div>
          <span className="text-[10px] text-[#C9A227] uppercase tracking-widest block font-bold">
            {language === 'ro' ? 'PROCEDURĂ DE CORECTARE EDITORIALĂ' : 'EDITORIAL CORRECTION WORKFLOW'}
          </span>
          <h3 className="text-lg font-bold text-white font-sans mt-0.5">
            {language === 'ro' ? `Raportează o corecție pentru ${entityName}` : `Report a correction for ${entityName}`}
          </h3>
          <p className="text-[#888] text-[11px] leading-relaxed mt-1">
            {language === 'ro'
              ? 'Toate modificările intră într-un flux de verificare factuală independentă cu verificare de sursă primară înainte de actualizarea publică.'
              : 'All proposed corrections enter an independent factual verification workflow before public publication.'}
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-[#141F16] border border-[#22c55e]/50 rounded-xl space-y-2 text-[#22c55e]">
            <p className="font-bold text-sm">
              {language === 'ro' ? '✓ Solicitare recepționată cu succes!' : '✓ Correction submitted successfully!'}
            </p>
            <p className="text-[11px] text-[#BBB]">
              {language === 'ro'
                ? 'Echipa editorială va analiza documentul probatoriu citat și va actualiza dosarul în baza de date.'
                : 'Our editorial desk will cross-examine the cited source and update the official dossier.'}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 px-4 py-2 bg-[#22c55e] text-black font-bold rounded-lg text-xs"
            >
              {language === 'ro' ? 'Închide' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-[#777] uppercase block mb-1">
                {language === 'ro' ? 'CÂMP DE CORECTAT' : 'FIELD TO CORRECT'}
              </label>
              <select
                value={fieldToCorrect}
                onChange={(e) => setFieldToCorrect(e.target.value)}
                className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-2 text-white outline-none focus:border-[#C9A227]"
              >
                <option value="Stadiu Fizic / Construction Stage">Stadiu Fizic / Construction Stage</option>
                <option value="Suprafață Construită / Built Area">Suprafață Construită / Built Area</option>
                <option value="Buget Investiție / Investment Capex">Buget Investiție / Investment Capex</option>
                <option value="Constructor General / General Contractor">Constructor General / General Contractor</option>
                <option value="Dezvoltator / Developer">Dezvoltator / Developer</option>
                <option value="Arhitect / Proiectant Structură">Arhitect / Proiectant Structură</option>
                <option value="Imagine Proiect / Project Media">Imagine Proiect / Project Media</option>
                <option value="Alt Câmp / Other Field">Alt Câmp / Other Field</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#777] uppercase block mb-1">
                  {language === 'ro' ? 'VALOARE ACTUALĂ' : 'CURRENT VALUE'}
                </label>
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder={language === 'ro' ? 'ex. În construcție' : 'e.g. Under construction'}
                  className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#777] uppercase block mb-1">
                  {language === 'ro' ? 'VALOARE PROPUSĂ (*)' : 'PROPOSED VALUE (*)'}
                </label>
                <input
                  type="text"
                  required
                  value={proposedValue}
                  onChange={(e) => setProposedValue(e.target.value)}
                  placeholder={language === 'ro' ? 'ex. Finalizat / Recepționat' : 'e.g. Delivered'}
                  className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#777] uppercase block mb-1">
                {language === 'ro' ? 'SURSA PROBATORIE / LINK VERIFICABIL (*)' : 'SOURCE CITATION / PROOF LINK (*)'}
              </label>
              <input
                type="text"
                required
                value={sourceCitation}
                onChange={(e) => setSourceCitation(e.target.value)}
                placeholder={language === 'ro' ? 'https://bvb.ro/... sau raport oficial' : 'https://... official investor report'}
                className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#777] uppercase block mb-1">
                  {language === 'ro' ? 'NUME CONTACT' : 'YOUR NAME'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nume Prenume"
                  className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#C9A227]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#777] uppercase block mb-1">
                  {language === 'ro' ? 'EMAIL PENTRU CONFIRMARE (*)' : 'YOUR EMAIL (*)'}
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="email@companie.ro"
                  className="w-full bg-[#141715] border border-[#1A1D1B] rounded-lg px-3 py-1.5 text-white outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-[#ef4444] text-[11px]">{errorMessage}</p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#141715] hover:bg-[#1A1D1B] text-[#AAA] rounded-lg text-xs"
              >
                {language === 'ro' ? 'Anulează' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#C9A227] hover:bg-[#d8b135] disabled:opacity-50 text-black font-bold rounded-lg text-xs"
              >
                {loading
                  ? (language === 'ro' ? 'Se transmite...' : 'Submitting...')
                  : (language === 'ro' ? 'Trimite Corecția →' : 'Submit Correction →')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
