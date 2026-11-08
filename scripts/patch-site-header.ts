import * as fs from 'fs';
import * as path from 'path';

const headerPath = path.join(process.cwd(), 'components/SiteHeader.tsx');
let code = fs.readFileSync(headerPath, 'utf8');

// 1. Top bar styling
code = code.replace(
  'scrolled\n            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1D1B] py-2"\n            : "bg-gradient-to-b from-[#050505]/95 via-[#050505]/85 to-transparent py-2.5 sm:py-3"',
  'scrolled\n            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-2 shadow-sm"\n            : "bg-white/90 backdrop-blur-md border-b border-slate-100 py-2.5 sm:py-3"'
);

// 2. Logo Icon & text colors
code = code.replace(
  'bg-gradient-to-br from-[#1E221F] via-[#141715] to-[#0A0C0B] border border-[#C9A227]/40 flex items-center justify-center shadow-sm group-hover:border-[#C9A227]',
  'bg-amber-50 border border-amber-300 flex items-center justify-center shadow-sm group-hover:border-[#b45309]'
);
code = code.replace(
  'text-[#C9A227] font-extrabold text-sm tracking-wider font-mono',
  'text-[#b45309] font-extrabold text-sm tracking-wider font-mono'
);
code = code.replace(
  'font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-[#C9A227]',
  'font-extrabold tracking-tight text-base sm:text-lg text-slate-900 group-hover:text-[#b45309]'
);
code = code.replace(
  'text-[9px] font-mono tracking-widest text-[#A0A0A0] uppercase mt-0.5 group-hover:text-[#C9A227]/80',
  'text-[9px] font-mono tracking-widest text-slate-500 uppercase mt-0.5 group-hover:text-[#b45309]'
);

// 3. Desktop nav text color
code = code.replace(
  'text-[11px] 2xl:text-xs tracking-wider uppercase font-medium text-[#C5C5C5]',
  'text-[11px] 2xl:text-xs tracking-wider uppercase font-medium text-slate-600'
);

// 4. Discover Dropdown items: translate & white panel
code = code.replace(
  'bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn',
  'bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-2 animate-fadeIn text-slate-700'
);
code = code.replaceAll('text-[#C9A227]', 'text-[#b45309]');
code = code.replaceAll('border-[#C9A227]', 'border-[#b45309]');
code = code.replaceAll('hover:text-[#C9A227]', 'hover:text-[#b45309]');
code = code.replaceAll('hover:bg-[#151515]', 'hover:bg-slate-50');
code = code.replaceAll('text-[#C5C5C5]', 'text-slate-700');
code = code.replaceAll('text-[#888888]', 'text-slate-400');
code = code.replaceAll('bg-[#111111]', 'bg-slate-100');
code = code.replaceAll('border-[#1A1D1B]', 'border-slate-200');
code = code.replaceAll('bg-[#0B0B0B]', 'bg-white');
code = code.replaceAll('bg-[#070807]', 'bg-white');
code = code.replaceAll('bg-[#0E0F0E]', 'bg-slate-50');

// English to Romanian translations in SiteHeader
code = code.replaceAll('Real Estate Developers', 'Dezvoltatori Imobiliari');
code = code.replaceAll('Construction Projects', 'Proiecte & Șantiere');
code = code.replaceAll('Contractors & Builders', 'Constructori & Antreprenori Generali');
code = code.replaceAll('Architects & Planners', 'Arhitecți & Proiectanți');
code = code.replaceAll('Engineering Consultants', 'Consultanți & Ingineri Structuriști');
code = code.replaceAll('Real Estate Agencies', 'Agenții Imobiliare');
code = code.replaceAll('Geographic Locations', 'Poluri Regionale & Orașe');
code = code.replaceAll('Knowledge Hub Overview', 'Prezentare Centru Normative');
code = code.replaceAll('Materials & Products Catalog', 'Catalog Materiale & Produse');
code = code.replaceAll('Concrete & Cement Intelligence', 'Standarde Beton & Ciment');
code = code.replaceAll('Structural Systems & P100-1', 'Sisteme Structurale & P100-1');
code = code.replaceAll('Civil Infrastructure & Roads', 'Infrastructură Civilă & Drumuri');
code = code.replaceAll('Building Physics & Fire', 'Fizica Construcțiilor & ISU');
code = code.replaceAll('15-Stage Execution Guide', 'Ghid de Execuție în 15 Etape (PVLA)');
code = code.replaceAll('Eurocodes & CPR 2024', 'Eurocoduri & CPR 2024');
code = code.replaceAll('Technical Glossary (POT, CUT)', 'Glosar Tehnic (POT, CUT)');
code = code.replaceAll('Material Comparison Matrix', 'Matrice Comparativă Materiale');
code = code.replaceAll('Looking for property?', 'Căutați o proprietate?');
code = code.replaceAll('13 OFFICIAL DIVISIONS', '13 DIVIZII OFICIALE');
code = code.replaceAll('Inquiry Form →', 'Formular Solicitare →');
code = code.replaceAll('<span>SERVICES</span>', '<span>SERVICII</span>');

// Replace dark drawer text & background
code = code.replaceAll('text-white', 'text-slate-900');

// Fix Solicitare button color
code = code.replace(
  'bg-[#b45309] hover:bg-[#d8b135] text-black',
  'bg-[#b45309] hover:bg-[#92400e] text-white'
);

fs.writeFileSync(headerPath, code, 'utf8');
console.log('SiteHeader.tsx successfully patched with white theme and Romanian localization!');
