import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { IntelligentIntakeFlow } from '@/components/IntelligentIntakeFlow';

export const metadata = {
  title: 'Contact & Servicii în Construcții · CONSTRUCTIONS by AiXLuxury',
  description: 'Punctul oficial de preluare solicitări tehnice, servicii de calitate în construcții, cartea tehnică, utilaje, asigurări, proiectare și parteneriate.'
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell pt-28 pb-20">
        <section className="page-hero mb-8">
          <div className="eyebrow">INTELLIGENT INTAKE DESK</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 mb-4 text-white">
            SERVICII & SOLICITĂRI CONSTRUCȚII
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A0A0A0]">
            Sistemul integrat de preluare și direcționare a cererilor către echipele tehnice specializate CONSTRUCTIONS by AiXLuxury.
          </p>
        </section>

        <section className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[#888888]">Încărcare formular inteligent...</div>}>
            <IntelligentIntakeFlow sourceContext="contact_main" />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
