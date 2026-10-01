'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  OFFICIAL_SERVICES,
  ServiceDefinition,
  ROLES_LIST,
  PROJECT_TYPES_LIST,
  PROJECT_STAGES_LIST,
  CONTACT_PREFERENCES,
  CONTACT_TIME_INTERVALS,
  URGENCY_LEVELS,
  getServiceBySlug
} from '@/lib/services-config';
import { getOrCreateSession, trackHighValueActivity } from '@/lib/visitor-tracker';

interface IntelligentIntakeFlowProps {
  initialServiceSlug?: string;
  sourceContext?: string;
  onSuccess?: (leadId: string) => void;
}

export function IntelligentIntakeFlow({
  initialServiceSlug,
  sourceContext = 'contact_portal',
  onSuccess
}: IntelligentIntakeFlowProps) {
  // Step navigation: 1 = Role & Service, 2 = Company, 3 = Project, 4 = Specifics, 5 = Contact, 6 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [generatedLeadId, setGeneratedLeadId] = useState<string | null>(null);

  // Form State
  const [selectedRole, setSelectedRole] = useState<string>('Dezvoltator');
  const [customRole, setCustomRole] = useState<string>('');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(
    initialServiceSlug || 'calitate-constructii'
  );

  // Company State
  const [isCompany, setIsCompany] = useState<boolean>(true);
  const [companyName, setCompanyName] = useState<string>('');
  const [cui, setCui] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [companyRole, setCompanyRole] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<string>('');
  const [industryField, setIndustryField] = useState<string>('');
  const [companyLocation, setCompanyLocation] = useState<string>('');
  const [linkedinProfile, setLinkedinProfile] = useState<string>('');

  // Project State
  const [isProjectRelated, setIsProjectRelated] = useState<'yes' | 'no' | 'planning'>('yes');
  const [projectName, setProjectName] = useState<string>('');
  const [projectCity, setProjectCity] = useState<string>('');
  const [projectCounty, setProjectCounty] = useState<string>('');
  const [projectAddress, setProjectAddress] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('Rezidențial');
  const [landArea, setLandArea] = useState<string>('');
  const [builtArea, setBuiltArea] = useState<string>('');
  const [grossArea, setGrossArea] = useState<string>('');
  const [buildingCount, setBuildingCount] = useState<string>('');
  const [unitCount, setUnitCount] = useState<string>('');
  const [projectStage, setProjectStage] = useState<string>('Execuție în desfășurare');

  // Service-Specific Dynamic State
  const [serviceSpecificData, setServiceSpecificData] = useState<Record<string, any>>({});
  const [urgency, setUrgency] = useState<'Normal' | 'Important' | 'Urgent'>('Important');
  const [message, setMessage] = useState<string>('');

  // Contact Info
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<string>('Telefon');
  const [preferredInterval, setPreferredInterval] = useState<string>('Dimineața');
  const [consent, setConsent] = useState<boolean>(true);
  const [honeypot, setHoneypot] = useState<string>('');

  // Attribution & Telemetry
  useEffect(() => {
    if (initialServiceSlug) {
      setSelectedServiceSlug(initialServiceSlug);
    }
  }, [initialServiceSlug]);

  const updateSpecificField = (key: string, value: any) => {
    setServiceSpecificData(prev => ({ ...prev, [key]: value }));
  };

  const activeService = getServiceBySlug(selectedServiceSlug) || OFFICIAL_SERVICES[0];

  // Validation helpers
  const canProceedStep1 = selectedRole !== 'Alt rol' || customRole.trim().length > 0;
  const canProceedContact = fullName.trim().length >= 2 && (email.trim().length > 3 || phone.trim().length >= 6) && consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceedContact) {
      setSubmitError('Te rugăm să completezi numele, cel puțin un canal de contact valid (email sau telefon) și să accepți termenii.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const session = getOrCreateSession();
      const payload = {
        role: selectedRole,
        customRole: selectedRole === 'Alt rol' ? customRole : undefined,
        serviceId: activeService.id,
        serviceName: activeService.title,
        isCompany,
        companyName: isCompany ? companyName : undefined,
        cui: isCompany ? cui : undefined,
        companyWebsite: isCompany ? companyWebsite : undefined,
        companyRole: isCompany ? companyRole : undefined,
        employeeCount: isCompany ? employeeCount : undefined,
        industryField: isCompany ? industryField : undefined,
        companyLocation: isCompany ? companyLocation : undefined,
        linkedinProfile: isCompany ? linkedinProfile : undefined,
        isProjectRelated,
        projectName: isProjectRelated === 'yes' ? projectName : undefined,
        projectCity: isProjectRelated === 'yes' ? projectCity : undefined,
        projectCounty: isProjectRelated === 'yes' ? projectCounty : undefined,
        projectAddress: isProjectRelated === 'yes' ? projectAddress : undefined,
        projectType: isProjectRelated === 'yes' ? projectType : undefined,
        landArea: isProjectRelated === 'yes' ? landArea : undefined,
        builtArea: isProjectRelated === 'yes' ? builtArea : undefined,
        grossArea: isProjectRelated === 'yes' ? grossArea : undefined,
        buildingCount: isProjectRelated === 'yes' ? buildingCount : undefined,
        unitCount: isProjectRelated === 'yes' ? unitCount : undefined,
        projectStage: isProjectRelated === 'yes' ? projectStage : undefined,
        serviceSpecificData,
        message,
        urgency,
        fullName,
        email,
        phone,
        preferredContact,
        preferredInterval,
        consent,
        source: sourceContext,
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
      setGeneratedLeadId(leadId);
      setCurrentStep(6); // Success screen

      // Track telemetry
      trackHighValueActivity(`Intake Submitted: ${activeService.title}`, activeService.id, {
        name: fullName,
        email,
        company: companyName,
        phone,
        message,
        requestType: activeService.title
      });

      if (onSuccess) {
        onSuccess(leadId);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'A apărut o eroare de comunicare. Te rugăm să reîncerci.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setCurrentStep(1);
    setGeneratedLeadId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setServiceSpecificData({});
    setSubmitError(null);
  };

  // ================= RENDER SUCCESS SCREEN (Section 35) =================
  if (currentStep === 6 && generatedLeadId) {
    return (
      <div className="bg-[#0B0D0C] border border-[#C9A227]/40 rounded-2xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 border border-[#C9A227] flex items-center justify-center mx-auto mb-6 text-2xl text-[#C9A227]">
          ✓
        </div>
        <span className="text-xs font-mono tracking-widest text-[#C9A227] uppercase block mb-2 font-bold">
          SOLICITARE ÎNREGISTRATĂ CU SUCCES
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Solicitarea a fost transmisă.
        </h2>
        <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6 max-w-lg mx-auto">
          Am primit informațiile tale și solicitarea a fost înregistrată în registrul operațional CONSTRUCTIONS by AiXLuxury. Echipa noastră va analiza detaliile tehnice furnizate.
        </p>

        <div className="p-4 bg-[#111412] border border-[#1A1D1B] rounded-xl mb-8 inline-block font-mono text-xs text-[#C5C5C5]">
          <span className="text-[#888888] block text-[10px] uppercase">Cod Identificare Solicitare</span>
          <span className="text-base sm:text-lg font-bold text-[#C9A227] tracking-wider">{generatedLeadId}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#161816] hover:bg-[#202320] border border-[#1A1D1B] text-white text-xs font-mono rounded-lg transition-all"
          >
            ← Înapoi la pagina principală
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 py-3 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono rounded-lg transition-all"
          >
            Explorează toate Serviciile →
          </Link>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-[#1A1A1A] border border-[#333333] text-[#A0A0A0] hover:text-white text-xs font-mono rounded-lg transition-all"
          >
            Trimite altă solicitare
          </button>
        </div>
      </div>
    );
  }

  // ================= STEPPERS & MULTI-STEP FLOW =================
  return (
    <div className="bg-[#0B0D0C] border border-[#1A1D1B] rounded-2xl p-5 sm:p-8 lg:p-10 shadow-2xl relative">
      {/* Step Indicator Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-mono text-[#888888] mb-3">
          <span className="text-[#C9A227] font-bold">
            PASUL {currentStep} DIN 5
          </span>
          <span className="text-[11px] text-[#A0A0A0]">
            {currentStep === 1 && 'Rol & Serviciu'}
            {currentStep === 2 && 'Companie'}
            {currentStep === 3 && 'Proiect & Stadiu'}
            {currentStep === 4 && `Detalii ${activeService.title}`}
            {currentStep === 5 && 'Date Contact & Transmitere'}
          </span>
        </div>
        <div className="w-full bg-[#1A1D1B] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#C9A227] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Anti-spam hidden honeypot */}
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

        {/* ================= STEP 1: ENTRY & ROLE & SERVICE ================= */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Primary Entry Heading */}
            <div className="border-b border-[#1A1D1B] pb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                PUNCT DE CONTACT ȘI PRELUARE SERVICII
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                Ce cauți?
              </h2>
              <p className="text-sm text-[#A0A0A0] leading-relaxed max-w-2xl">
                Spune-ne ce ai nevoie. Îți direcționăm solicitarea către serviciul potrivit.
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C5C5C5] mb-3 font-semibold">
                Sunt: <span className="text-[#C9A227]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {ROLES_LIST.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                      selectedRole === role
                        ? 'bg-[#C9A227]/15 border-[#C9A227] text-white font-bold shadow-sm'
                        : 'bg-[#111412] border-[#1A1D1B] text-[#A0A0A0] hover:text-white hover:border-[#333333]'
                    }`}
                  >
                    <span>{role}</span>
                    {selectedRole === role && <span className="text-[#C9A227] text-xs">✓</span>}
                  </button>
                ))}
              </div>

              {selectedRole === 'Alt rol' && (
                <div className="mt-4 p-4 bg-[#111412] border border-[#1A1D1B] rounded-xl">
                  <label className="block text-xs font-mono text-[#C5C5C5] mb-2 font-semibold">
                    Rol / poziție specifică: <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    placeholder="ex. Diriginte de șantier, Responsabil Tehnic, Auditor..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Service Selection (13 Official Services) */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C5C5C5] mb-3 font-semibold">
                Selectează Serviciul Solicitat: <span className="text-[#C9A227]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {OFFICIAL_SERVICES.map(srv => {
                  const isSelected = selectedServiceSlug === srv.slug;
                  return (
                    <div
                      key={srv.slug}
                      onClick={() => setSelectedServiceSlug(srv.slug)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#141715] border-[#C9A227] shadow-lg shadow-[#C9A227]/5'
                          : 'bg-[#111412] border-[#1A1D1B] hover:border-[#333333]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{srv.icon}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1A1D1B] text-[#C9A227] border border-[#C9A227]/20 font-bold">
                            {srv.badge}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold mb-1 ${isSelected ? 'text-[#C9A227]' : 'text-white'}`}>
                          {srv.title}
                        </h4>
                        <p className="text-[11px] text-[#888888] line-clamp-2 leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-[10px] font-mono text-[#666666]">
                        <span>{srv.categoryLabel}</span>
                        {isSelected && <span className="text-[#C9A227] font-bold">SELECTAT ✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation button */}
            <div className="pt-6 border-t border-[#1A1D1B] flex justify-end">
              <button
                type="button"
                disabled={!canProceedStep1}
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#d8b135] disabled:opacity-40 disabled:hover:bg-[#C9A227] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-all min-h-[48px] flex items-center gap-2"
              >
                <span>Continuă: Informații Companie</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: COMPANY INFORMATION (Section 4) ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#1A1D1B] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                SECȚIUNEA 2: DATE DE IDENTIFICARE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Reprezinți o companie?
              </h3>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsCompany(true)}
                className={`flex-1 p-4 rounded-xl border text-xs font-mono text-center font-bold transition-all ${
                  isCompany
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#111412] border-[#1A1D1B] text-[#888888] hover:text-white'
                }`}
              >
                Da, reprezint o companie
              </button>
              <button
                type="button"
                onClick={() => setIsCompany(false)}
                className={`flex-1 p-4 rounded-xl border text-xs font-mono text-center font-bold transition-all ${
                  !isCompany
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#111412] border-[#1A1D1B] text-[#888888] hover:text-white'
                }`}
              >
                Nu, persoană fizică
              </button>
            </div>

            {isCompany && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#111412] border border-[#1A1D1B] rounded-xl">
                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Companie <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Nume companie / entitate"
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    CUI (Cod Unic de Înregistrare)
                  </label>
                  <input
                    type="text"
                    value={cui}
                    onChange={e => setCui(e.target.value)}
                    placeholder="ex. RO12345678"
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Funcție / poziție în companie
                  </label>
                  <input
                    type="text"
                    value={companyRole}
                    onChange={e => setCompanyRole(e.target.value)}
                    placeholder="ex. Director Tehnic, PM, Administrator..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Domeniu de activitate
                  </label>
                  <input
                    type="text"
                    value={industryField}
                    onChange={e => setIndustryField(e.target.value)}
                    placeholder="ex. Antrepriză generală, Dezvoltare, Proiectare..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Localitate / județ sediu
                  </label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={e => setCompanyLocation(e.target.value)}
                    placeholder="ex. București / Sector 1, Cluj-Napoca..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Număr de angajați (opțional)
                  </label>
                  <select
                    value={employeeCount}
                    onChange={e => setEmployeeCount(e.target.value)}
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="">Selectează număr angajați...</option>
                    <option value="1-9">1 - 9 angajați</option>
                    <option value="10-49">10 - 49 angajați</option>
                    <option value="50-249">50 - 249 angajați</option>
                    <option value="250+">250+ angajați</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Website / LinkedIn (opțional)
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={e => setCompanyWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-[#1A1D1B] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-transparent hover:bg-[#1A1D1B] text-[#A0A0A0] hover:text-white text-xs font-mono rounded-lg transition-all"
              >
                ← Înapoi la Servicii
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-all min-h-[48px]"
              >
                Continuă: Date Proiect →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROJECT INFORMATION (Sections 5 & 6) ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#1A1D1B] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                SECȚIUNEA 3: PROIECT ȘI STADIU DE EXECUȚIE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Solicitarea este legată de un proiect?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setIsProjectRelated('yes')}
                className={`p-4 rounded-xl border text-xs font-mono text-center font-bold transition-all ${
                  isProjectRelated === 'yes'
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#111412] border-[#1A1D1B] text-[#888888] hover:text-white'
                }`}
              >
                Da, proiect specific
              </button>
              <button
                type="button"
                onClick={() => setIsProjectRelated('planning')}
                className={`p-4 rounded-xl border text-xs font-mono text-center font-bold transition-all ${
                  isProjectRelated === 'planning'
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#111412] border-[#1A1D1B] text-[#888888] hover:text-white'
                }`}
              >
                Fază de planificare / concept
              </button>
              <button
                type="button"
                onClick={() => setIsProjectRelated('no')}
                className={`p-4 rounded-xl border text-xs font-mono text-center font-bold transition-all ${
                  isProjectRelated === 'no'
                    ? 'bg-[#C9A227]/15 border-[#C9A227] text-white'
                    : 'bg-[#111412] border-[#1A1D1B] text-[#888888] hover:text-white'
                }`}
              >
                Nu, nevoie generală de companie
              </button>
            </div>

            {isProjectRelated !== 'no' && (
              <div className="space-y-4 p-5 bg-[#111412] border border-[#1A1D1B] rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                      Nume proiect
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="ex. Rezidențial Nord, Hală Logistică Vest..."
                      className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                      Tip proiect <span className="text-[#C9A227]">*</span>
                    </label>
                    <select
                      value={projectType}
                      onChange={e => setProjectType(e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
                    >
                      {PROJECT_TYPES_LIST.map(pt => (
                        <option key={pt} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                      Localitate & Județ
                    </label>
                    <input
                      type="text"
                      value={projectCity}
                      onChange={e => setProjectCity(e.target.value)}
                      placeholder="ex. Timișoara, Jud. Timiș"
                      className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                      Adresă / Zonă
                    </label>
                    <input
                      type="text"
                      value={projectAddress}
                      onChange={e => setProjectAddress(e.target.value)}
                      placeholder="ex. Șoseaua Pipera nr. 42"
                      className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                    />
                  </div>
                </div>

                {/* PROJECT STAGE (Section 6) */}
                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-2 font-semibold">
                    În ce stadiu este proiectul? <span className="text-[#C9A227]">*</span>
                  </label>
                  <select
                    value={projectStage}
                    onChange={e => setProjectStage(e.target.value)}
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
                  >
                    {PROJECT_STAGES_LIST.map(stg => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>

                {/* Optional dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] mb-1">Suprafață teren (mp)</label>
                    <input
                      type="text"
                      value={landArea}
                      onChange={e => setLandArea(e.target.value)}
                      placeholder="ex. 5000"
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] mb-1">Suprafață constr. (mp)</label>
                    <input
                      type="text"
                      value={builtArea}
                      onChange={e => setBuiltArea(e.target.value)}
                      placeholder="ex. 12000"
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] mb-1">Număr clădiri</label>
                    <input
                      type="text"
                      value={buildingCount}
                      onChange={e => setBuildingCount(e.target.value)}
                      placeholder="ex. 2 corpuri"
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] mb-1">Număr unități</label>
                    <input
                      type="text"
                      value={unitCount}
                      onChange={e => setUnitCount(e.target.value)}
                      placeholder="ex. 140 apartamente"
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-[#1A1D1B] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-transparent hover:bg-[#1A1D1B] text-[#A0A0A0] hover:text-white text-xs font-mono rounded-lg transition-all"
              >
                ← Înapoi la Companie
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-all min-h-[48px]"
              >
                Continuă: Chestionar {activeService.title} →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SERVICE-SPECIFIC SMART FORMS (Sections 8 - 21) ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#1A1D1B] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                  SECȚIUNEA 4: CHESTIONAR SPECIALIZAT PE SERVICIU
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>{activeService.icon}</span>
                  <span>{activeService.title}</span>
                </h3>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 bg-[#1A1D1B] text-[#C9A227] rounded border border-[#C9A227]/30">
                {activeService.badge}
              </span>
            </div>

            {/* Render Specific Form Fields dynamically */}
            <div className="p-5 bg-[#111412] border border-[#1A1D1B] rounded-xl space-y-4">
              {/* 1. Servicii de calitate în construcții */}
              {activeService.slug === 'calitate-constructii' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Antreprenor general</label>
                    <input
                      type="text"
                      placeholder="Nume antreprenor"
                      onChange={e => updateSpecificField('antreprenor_general', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Beneficiar / Dezvoltator</label>
                    <input
                      type="text"
                      placeholder="Nume beneficiar"
                      onChange={e => updateSpecificField('beneficiar', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Project Manager</label>
                    <input
                      type="text"
                      placeholder="Nume PM / firmă PM"
                      onChange={e => updateSpecificField('project_manager', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Valoare estimată proiect (opțional)</label>
                    <input
                      type="text"
                      placeholder="ex. 5.000.000 EUR"
                      onChange={e => updateSpecificField('valoare_estimata', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Există deja un responsabil/manager de calitate?</label>
                    <select
                      onChange={e => updateSpecificField('are_responsabil_calitate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Nu">Nu, căutăm responsabil / manager</option>
                      <option value="Da">Da, avem nevoie de suport suplimentar / audit</option>
                      <option value="In_curs">În curs de selecție</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Există neconformități cunoscute?</label>
                    <select
                      onChange={e => updateSpecificField('are_neconformitati', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Nu">Nu sunt raportate neconformități</option>
                      <option value="Da">Da, necesită remediere și avizare</option>
                      <option value="Evaluare">În curs de evaluare / auditare</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce servicii de calitate sunt necesare?</label>
                    <input
                      type="text"
                      placeholder="ex. Elaborare PCCVI, participare faze determinante ISC, inspecții armare..."
                      onChange={e => updateSpecificField('servicii_specifice_calitate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. Controlul calității */}
              {activeService.slug === 'controlul-calitatii' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Tip lucrări de verificat</label>
                    <input
                      type="text"
                      placeholder="ex. Structură beton armat, fundații speciale, fațade cortină..."
                      onChange={e => updateSpecificField('tip_lucrari_verificate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce anume trebuie verificat?</label>
                    <input
                      type="text"
                      placeholder="ex. Verificare armare planșeu, teste beton, planeitate..."
                      onChange={e => updateSpecificField('obiectiv_verificare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Există documentație tehnică disponibilă?</label>
                    <select
                      onChange={e => updateSpecificField('documentatie_disponibila', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Da">Da, planuri PT/DDE și detalii complete</option>
                      <option value="Partial">Parțial / În curs de completare</option>
                      <option value="Nu">Nu este disponibilă la momentul actual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Cât de repede este necesară intervenția?</label>
                    <select
                      onChange={e => updateSpecificField('rapiditate_interventie', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Urgent (24-48h)">Urgent (24 - 48 ore)</option>
                      <option value="In aceasta saptamana">În această săptămână</option>
                      <option value="Planificat (1-2 saptamani)">Planificat (1 - 2 săptămâni)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. Manager calitate */}
              {activeService.slug === 'manager-calitate' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce cauți?</label>
                    <select
                      onChange={e => updateSpecificField('optiune_manager_calitate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Manager calitate pentru proiect">Manager calitate pentru proiect</option>
                      <option value="Preluare management calitate">Preluare management calitate</option>
                      <option value="Suport pentru departamentul existent">Suport pentru departamentul existent</option>
                      <option value="Audit intern">Audit intern</option>
                      <option value="Organizarea documentatiei">Organizarea documentației</option>
                      <option value="Pregatire pentru receptie">Pregătire pentru recepție</option>
                      <option value="Alta nevoie">Altă nevoie</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Durata estimată a misiunii</label>
                    <input
                      type="text"
                      placeholder="ex. 6 luni, pe toată durata proiectului..."
                      onChange={e => updateSpecificField('durata_estimata', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Număr aproximativ subcontractori (opțional)</label>
                    <input
                      type="text"
                      placeholder="ex. 8 firme pe șantier"
                      onChange={e => updateSpecificField('numar_subcontractori', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 4. Cartea Tehnică a Construcției */}
              {activeService.slug === 'cartea-tehnica' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce situație ai?</label>
                    <select
                      onChange={e => updateSpecificField('situatie_carte_tehnica', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Cartea Tehnică trebuie întocmită">Cartea Tehnică trebuie întocmită integral</option>
                      <option value="Documentația este incompletă">Documentația este incompletă</option>
                      <option value="Documentele sunt dispersate">Documentele sunt dispersate</option>
                      <option value="Proiectul este aproape de recepție">Proiectul este aproape de recepție</option>
                      <option value="Proiectul este deja finalizat">Proiectul este deja finalizat</option>
                      <option value="Trebuie verificată documentația existentă">Trebuie verificată documentația existentă</option>
                      <option value="Nu știu exact ce documente sunt necesare">Nu știu exact ce documente sunt necesare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Anul construcției / finalizării</label>
                    <input
                      type="text"
                      placeholder="ex. 2024, 2021..."
                      onChange={e => updateSpecificField('anul_constructiei', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Există procese-verbale disponibile?</label>
                    <select
                      onChange={e => updateSpecificField('are_procese_verbale', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Da">Da (PVLA, PVFD, PVRC disponibile)</option>
                      <option value="Partial">Parțial / Lipsesc unele etape</option>
                      <option value="Nu">Nu / Trebuie reconstituite</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 5. Publicitate */}
              {activeService.slug === 'publicitate' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce vrei să promovezi?</label>
                    <select
                      onChange={e => updateSpecificField('ce_promoveaza', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Companie">Companie</option>
                      <option value="Proiect">Proiect</option>
                      <option value="Ansamblu rezidențial">Ansamblu rezidențial</option>
                      <option value="Clădire">Clădire</option>
                      <option value="Teren">Teren</option>
                      <option value="Serviciu">Serviciu</option>
                      <option value="Utilaje">Utilaje</option>
                      <option value="Portofoliu">Portofoliu</option>
                      <option value="Altceva">Altceva</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Obiectivul promovării</label>
                    <select
                      onChange={e => updateSpecificField('obiectiv_promovare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Lead-uri">Lead-uri calificate</option>
                      <option value="Vizibilitate">Vizibilitate de brand</option>
                      <option value="Vânzări">Vânzări unități</option>
                      <option value="Închirieri">Închirieri spații</option>
                      <option value="Promovare proiect">Promovare proiect</option>
                      <option value="Promovare companie">Promovare companie</option>
                      <option value="Recrutare">Recrutare personal tehnic</option>
                      <option value="Parteneriate">Parteneriate B2B</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce vrei să obții prin promovare?</label>
                    <input
                      type="text"
                      placeholder="Descrie pe scurt rezultatul comercial dorit..."
                      onChange={e => updateSpecificField('rezultat_dorit', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 6. Închirieri utilaje */}
              {activeService.slug === 'inchirieri-utilaje' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce utilaj cauți?</label>
                    <select
                      onChange={e => updateSpecificField('tip_utilaj', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Excavator">Excavator</option>
                      <option value="Buldoexcavator">Buldoexcavator</option>
                      <option value="Macara">Macara</option>
                      <option value="Pompă beton">Pompă beton</option>
                      <option value="Autoutilitară">Autoutilitară</option>
                      <option value="Încărcător">Încărcător</option>
                      <option value="Buldozer">Buldozer</option>
                      <option value="Cilindru compactor">Cilindru compactor</option>
                      <option value="Finisor asfalt">Finisor asfalt</option>
                      <option value="Platformă">Platformă</option>
                      <option value="Generator">Generator</option>
                      <option value="Alt utilaj">Alt utilaj</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Opțiune operator</label>
                    <select
                      onChange={e => updateSpecificField('cu_operator', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Cu operator">Cu operator autorizat ISCIR</option>
                      <option value="Fără operator">Fără operator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Perioadă / Durată estimată</label>
                    <input
                      type="text"
                      placeholder="ex. 2 săptămâni, 3 luni..."
                      onChange={e => updateSpecificField('durata_inchiriere', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Specificații tehnice dorite</label>
                    <input
                      type="text"
                      placeholder="ex. Tonaj 22t, braț lung, picon..."
                      onChange={e => updateSpecificField('specificatii_tehnice', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 7. Intermediere asigurări */}
              {activeService.slug === 'asigurari' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce vrei să asiguri?</label>
                    <select
                      onChange={e => updateSpecificField('obiect_asigurare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Construcție / proiect (CAR / EAR)">Construcție / proiect (CAR / EAR)</option>
                      <option value="Companie">Companie</option>
                      <option value="Angajați">Angajați</option>
                      <option value="Utilaje (CPM)">Utilaje (CPM)</option>
                      <option value="Autovehicule">Autovehicule / Flotă</option>
                      <option value="Răspundere profesională">Răspundere civilă profesională (Arhitecți, Ingineri, RTE)</option>
                      <option value="Locuință / Proprietate">Locuință / Proprietate</option>
                      <option value="Altceva">Alt tip de asigurare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Valoare estimată a bunului / proiectului (opțional)</label>
                    <input
                      type="text"
                      placeholder="ex. 2.500.000 EUR"
                      onChange={e => updateSpecificField('valoare_asigurata_estimata', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Există deja o poliță activă?</label>
                    <select
                      onChange={e => updateSpecificField('are_polita_activa', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Nu">Nu, este poliță nouă</option>
                      <option value="Da">Da, expiră în curând / cerem contraofertă</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 8. Credite / finanțare */}
              {activeService.slug === 'credite' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Pentru ce ai nevoie de finanțare?</label>
                    <select
                      onChange={e => updateSpecificField('scop_finantare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Dezvoltare imobiliară">Dezvoltare imobiliară</option>
                      <option value="Construcție">Construcție</option>
                      <option value="Achiziție teren">Achiziție teren</option>
                      <option value="Achiziție locuință">Achiziție locuință</option>
                      <option value="Capital de lucru">Capital de lucru</option>
                      <option value="Refinanțare">Refinanțare</option>
                      <option value="Achiziție spațiu comercial">Achiziție spațiu comercial</option>
                      <option value="Achiziție utilaje">Achiziție utilaje</option>
                      <option value="Altă nevoie">Altă nevoie</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Sumă estimată dorită</label>
                    <input
                      type="text"
                      placeholder="ex. 500.000 EUR"
                      onChange={e => updateSpecificField('suma_estimata', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Tip garanție disponibilă</label>
                    <input
                      type="text"
                      placeholder="ex. Ipotecă teren / imobil, cesiune creanțe..."
                      onChange={e => updateSpecificField('tip_garantie', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 9. Vânzări real estate */}
              {activeService.slug === 'vanzari-real-estate' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce vrei să vinzi?</label>
                    <select
                      onChange={e => updateSpecificField('tip_proprietate_vanzare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Apartament">Apartament</option>
                      <option value="Casă / Vilă">Casă / Vilă</option>
                      <option value="Teren">Teren</option>
                      <option value="Spațiu comercial">Spațiu comercial</option>
                      <option value="Office / Clădire birouri">Office / Clădire birouri</option>
                      <option value="Industrial / Logistic">Industrial / Logistic</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Ansamblu / proiect">Ansamblu / proiect rezidențial</option>
                      <option value="Alt tip">Alt tip</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Preț solicitat / estimativ (opțional)</label>
                    <input
                      type="text"
                      placeholder="ex. 450.000 EUR"
                      onChange={e => updateSpecificField('pret_solicitat', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Detalii proprietate (suprafețe, finisaje, autorizații)</label>
                    <input
                      type="text"
                      placeholder="ex. Suprafață utilă 180mp, teren 500mp, utilități complete..."
                      onChange={e => updateSpecificField('detalii_proprietate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 10. Imobiliare (Căutare proprietate) */}
              {activeService.slug === 'imobiliare' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce cauți?</label>
                    <select
                      onChange={e => updateSpecificField('ce_cauta_imobiliare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Teren dezvoltare">Teren pentru dezvoltare</option>
                      <option value="Clădire office / spațiu comercial">Clădire office / spațiu comercial</option>
                      <option value="Hală / Spațiu industrial">Hală / Spațiu industrial</option>
                      <option value="Apartament / Casă">Apartament / Casă</option>
                      <option value="Investment property">Proprietate cu randament de investiție</option>
                      <option value="Altceva">Altceva</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Scop</label>
                    <select
                      onChange={e => updateSpecificField('scop_achizitie', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Investiție">Investiție (randament)</option>
                      <option value="Dezvoltare">Dezvoltare imobiliară</option>
                      <option value="Locuire">Locuire personală</option>
                      <option value="Business">Activitate de business / sediu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Buget orientativ</label>
                    <input
                      type="text"
                      placeholder="ex. 1.000.000 - 3.000.000 EUR"
                      onChange={e => updateSpecificField('buget_orientativ', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Zone preferate</label>
                    <input
                      type="text"
                      placeholder="ex. București Nord, Cluj Vest, Brașov..."
                      onChange={e => updateSpecificField('zone_preferate', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 11. Inspector SSM */}
              {activeService.slug === 'ssm' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Număr aproximativ de lucrători pe șantier</label>
                    <input
                      type="text"
                      placeholder="ex. 25-50 muncitori"
                      onChange={e => updateSpecificField('numar_lucratori_ssm', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce aveți nevoie?</label>
                    <select
                      onChange={e => updateSpecificField('serviciu_ssm_solicitat', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Servicii SSM integrate">Servicii SSM integrate (coordonare HG 300)</option>
                      <option value="Verificare documentație">Verificare documentație & dosare</option>
                      <option value="Audit SSM pe șantier">Audit SSM pe șantier</option>
                      <option value="Instruire personal">Instruire personal / SSM la angajare</option>
                      <option value="Suport șantier">Suport permanent pe șantier</option>
                      <option value="Evaluare riscuri">Evaluare riscuri specifice</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 12. Proiecte & 13. Arhitecți */}
              {(activeService.slug === 'proiecte' || activeService.slug === 'arhitecti') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Ce trebuie proiectat / căutat?</label>
                    <input
                      type="text"
                      placeholder="ex. Ansamblu 3 blocuri, Hală producție, Vilă individuală..."
                      onChange={e => updateSpecificField('obiectiv_proiectare', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">Certificat de Urbanism disponibil?</label>
                    <select
                      onChange={e => updateSpecificField('certificat_urbanism', e.target.value)}
                      className="w-full bg-[#070908] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Da">Da, este emis</option>
                      <option value="In curs">În curs de obținere</option>
                      <option value="Nu">Nu, avem nevoie de asistență pentru obținere</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Urgency & Short Message for all services */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-2 font-semibold">
                  Grad de Urgență <span className="text-[#C9A227]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {URGENCY_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`p-2.5 rounded-lg border text-xs font-mono text-center font-bold transition-all ${
                        urgency === lvl
                          ? lvl === 'Urgent'
                            ? 'bg-red-950/40 border-red-500 text-red-300'
                            : 'bg-[#C9A227]/20 border-[#C9A227] text-[#C9A227]'
                          : 'bg-[#070908] border-[#1A1D1B] text-[#777777] hover:text-white'
                      }`}
                    >
                      {lvl === 'Urgent' ? '⚡ ' : ''}{lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                  Descrie pe scurt ce ai nevoie (opțional):
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Oferă orice detalii relevante despre proiect, cerințe tehnice sau calendarul de implementare..."
                  className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg p-3 text-xs text-white placeholder-[#555555] outline-none"
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-[#1A1D1B] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-transparent hover:bg-[#1A1D1B] text-[#A0A0A0] hover:text-white text-xs font-mono rounded-lg transition-all"
              >
                ← Înapoi la Proiect
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition-all min-h-[48px]"
              >
                Continuă: Date Contact →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: CONTACT & SUBMISSION (Sections 22, 23 & 30) ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#1A1D1B] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-1">
                SECȚIUNEA 5: DATE DE CONTACT ȘI PREFERINȚE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Unde și cum dorești să te contactăm?
              </h3>
            </div>

            <div className="p-5 bg-[#111412] border border-[#1A1D1B] rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Nume și Prenume <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="ex. Ing. Cristian Popescu"
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Email de afaceri (sau telefon) <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nume@companie.ro"
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Număr de telefon (sau email) <span className="text-[#C9A227]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+40 7..."
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#555555] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Canal preferat de contact
                  </label>
                  <select
                    value={preferredContact}
                    onChange={e => setPreferredContact(e.target.value)}
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
                  >
                    {CONTACT_PREFERENCES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#C5C5C5] mb-1 font-semibold">
                    Interval preferat pentru apel
                  </label>
                  <select
                    value={preferredInterval}
                    onChange={e => setPreferredInterval(e.target.value)}
                    className="w-full bg-[#070908] border border-[#1A1D1B] focus:border-[#C9A227] rounded-lg px-3 py-2.5 text-xs text-white outline-none"
                  >
                    {CONTACT_TIME_INTERVALS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consent check */}
              <div className="pt-3 border-t border-[#1A1D1B]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-1 accent-[#C9A227] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs text-[#A0A0A0] leading-relaxed select-none">
                    Sunt de acord cu prelucrarea datelor cu caracter personal în scopul procesării acestei solicitări de servicii în construcții, conform politicii de confidențialitate CONSTRUCTIONS by AiXLuxury.
                  </span>
                </label>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-xs text-red-200 font-mono" role="alert">
                {submitError}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-[#1A1D1B] flex items-center justify-between">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 bg-transparent hover:bg-[#1A1D1B] text-[#A0A0A0] hover:text-white text-xs font-mono rounded-lg transition-all"
              >
                ← Înapoi la Chestionar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !canProceedContact}
                className="px-10 py-4 bg-[#C9A227] hover:bg-[#d8b135] disabled:opacity-40 disabled:hover:bg-[#C9A227] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-lg transition-all shadow-xl min-h-[48px] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⌛</span>
                    <span>Se transmite solicitarea...</span>
                  </>
                ) : (
                  <>
                    <span>Transmite Solicitarea Oficială</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
