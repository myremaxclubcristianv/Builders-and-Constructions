'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ro' | 'en';

export interface Translations {
  [key: string]: {
    ro: string;
    en: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  'nav.projects': { ro: 'Proiecte', en: 'Projects' },
  'nav.companies': { ro: 'Companii', en: 'Companies' },
  'nav.developers': { ro: 'Dezvoltatori', en: 'Developers' },
  'nav.contractors': { ro: 'Constructori', en: 'General Contractors' },
  'nav.architects': { ro: 'Arhitecți', en: 'Architects' },
  'nav.engineers': { ro: 'Ingineri & Structuriști', en: 'Engineers & MEP' },
  'nav.agencies': { ro: 'Agenții Imobiliare', en: 'Real Estate Agencies' },
  'nav.map': { ro: 'Hartă Națională', en: 'National Map' },
  'nav.network': { ro: 'Rețea Relațională', en: 'Relationship Graph' },
  'nav.intelligence': { ro: 'Inteligență Piață', en: 'Market Intelligence' },
  'nav.knowledge': { ro: 'Cunoștințe Tehnice', en: 'Technical Knowledge' },
  'nav.watchlist': { ro: 'Monitorizare', en: 'Watchlist' },
  'nav.search': { ro: 'Căutare', en: 'Search' },
  'nav.admin': { ro: 'Terminal Executiv', en: 'Executive Terminal' },
  'nav.report_error': { ro: 'Raportează Eroare', en: 'Report Error' },
  'nav.sample_report': { ro: 'Raport Mostră', en: 'Sample Report' },

  // Hero & Homepage
  'hero.badge': { ro: 'PLATFORMĂ DE INTELIGENȚĂ PENTRU CONSTRUCȚII & REAL ESTATE ROMÂNIA', en: 'CONSTRUCTION & REAL ESTATE INTELLIGENCE PLATFORM ROMANIA' },
  'hero.title': { ro: 'RADARUL REALITĂȚII ÎN CONSTRUCȚIILE DIN ROMÂNIA', en: 'REALITY RADAR FOR ROMANIAN BUILT ENVIRONMENT' },
  'hero.subtitle': {
    ro: 'Informații structurate, verificate faptic din surse oficiale despre dezvoltatori, antreprenori generali, ingineri, arhitecți și proiecte majore.',
    en: 'Factually verified intelligence from official disclosures on developers, general contractors, engineers, architects, and major projects.'
  },
  'hero.cta_projects': { ro: 'Explorează Proiectele', en: 'Explore Projects' },
  'hero.cta_companies': { ro: 'Descoperă Companiile', en: 'Discover Companies' },
  'hero.cta_map': { ro: 'Harta Șantierelor', en: 'Construction Map' },
  'hero.cta_intelligence': { ro: 'Semnale de Piață', en: 'Market Signals' },

  // Trust & Value Proposition
  'value.title': { ro: 'CUI SE ADRESEAZĂ PLATFORMA CONSTRUCTIONS', en: 'WHO CONSTRUCTIONS SERVES' },
  'value.buyers': { ro: 'Cumpărători & Utilizatori Finali', en: 'Buyers & End-Users' },
  'value.buyers_desc': { ro: 'Verifică istoricul dezvoltatorului, constructorul real și stadiul fizic înainte de orice decizie de achiziție.', en: 'Verify developer track record, actual general contractor, and real physical stage before purchasing.' },
  'value.investors': { ro: 'Investitori Instituționali', en: 'Institutional Investors' },
  'value.investors_desc': { ro: 'Date auditate BVB/ONRC, suprafețe GLA, bugete de investiții și capacități operaționale fără exagerări promoționale.', en: 'Audited BVB/registry disclosures, GLA areas, investment capex, and operational capacity without hype.' },
  'value.contractors': { ro: 'Constructori & Antreprenori', en: 'Contractors & Builders' },
  'value.contractors_desc': { ro: 'Identifică licitații, subcontractări, parteneriate și proiecte aflate în fază de autorizare sau structură.', en: 'Identify upcoming tenders, subcontracting opportunities, and projects in permitting or structure stage.' },
  'value.suppliers': { ro: 'Furnizori de Materiale & Sisteme', en: 'Materials & Systems Suppliers' },
  'value.suppliers_desc': { ro: 'Conectează-te cu șantierele active și inginerii de proiect conform normativelor europene și românești.', en: 'Connect with active jobsites and project engineers adhering to European and Romanian building codes.' },

  // Status & Verification Labels
  'status.under_construction': { ro: 'În Construcție', en: 'Under Construction' },
  'status.completed': { ro: 'Livrat / Finalizat', en: 'Delivered / Completed' },
  'status.upcoming': { ro: 'Planificare / Autorizare', en: 'Planning / Permitting' },
  'status.verified': { ro: 'VERIFICAT FAPTIC', en: 'FACTUALLY VERIFIED' },
  'status.reported': { ro: 'RAPORTAT OFICIAL', en: 'OFFICIALLY REPORTED' },
  'status.estimated': { ro: 'ESTIMAT', en: 'ESTIMATED' },
  'status.not_disclosed': { ro: 'NEDIVULGAT', en: 'NOT DISCLOSED' },

  // Common Actions
  'action.search_placeholder': { ro: 'Caută proiect, dezvoltator, constructor, oraș...', en: 'Search project, developer, contractor, city...' },
  'action.filter': { ro: 'Filtrează', en: 'Filter' },
  'action.reset_filters': { ro: 'Resetează filtrele', en: 'Reset filters' },
  'action.view_dossier': { ro: 'Vezi Dosarul Complet →', en: 'View Full Dossier →' },
  'action.add_watchlist': { ro: 'Salvează în Monitorizare', en: 'Add to Watchlist' },
  'action.remove_watchlist': { ro: 'Elimină din Monitorizare', en: 'Remove from Watchlist' },
  'action.report_correction': { ro: 'Raportează o corecție', en: 'Report a correction' },
  'action.subscribe': { ro: 'Abonează-te la Notificări', en: 'Subscribe to Alerts' },
  'action.contact': { ro: 'Contactează Echipa', en: 'Contact Our Team' },

  // Footer
  'footer.disclaimer': {
    ro: 'CONSTRUCTIONS by AiXLuxury este o platformă independentă de inteligență economică și tehnică pentru mediul construit din România. Toate datele publicate sunt verificate faptic prin citarea surselor primare (BVB, ONRC, pagini oficiale, certificate de urbanism). Informațiile tehnice sunt consultative și nu înlocuiesc expertiza autorizată a inginerilor proiectanți.',
    en: 'CONSTRUCTIONS by AiXLuxury is an independent market and technical intelligence platform for Romania’s built environment. All data is verified with primary source citations (BVB, Trade Registry, official developer disclosures). Technical references are informational and do not replace certified engineering consultation.'
  },
  'footer.copyright': { ro: 'Toate drepturile rezervate.', en: 'All rights reserved.' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ro',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ro');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('aix_lang') as Language;
      if (saved === 'ro' || saved === 'en') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        setLanguageState('ro');
        document.documentElement.lang = 'ro';
      }
    } catch {
      // localStorage unavailable fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aix_lang', lang);
      document.cookie = `aix_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    } catch {
      // cookie / storage fallback
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ro' ? 'en' : 'ro');
  };

  const t = (key: string, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
