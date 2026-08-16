/**
 * Service Recommendations Engine v2
 * CONSTRUCTIONS by AiXLuxury — Phase 17
 *
 * Deterministically maps verified commercial gaps and construction scales
 * to tailored architectural and digital packages.
 */

import { CommercialGapItem } from './commercial-gap';

export type ServiceRecommendation = {
  serviceKey: string;
  name: string;
  category: 'DIGITAL_EXPERIENCE' | 'MEDIA_PRODUCTION' | 'BRAND_AUTHORITY' | 'GROWTH';
  reason: string;
  evidence: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedValueRange: { min: number; max: number; currency: string };
};

export function recommendServicesFromGaps(gaps: CommercialGapItem[], activeProjectsCount: number = 1): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = [];

  for (const g of gaps) {
    if (g.status !== 'VERIFIED_GAP') continue;

    switch (g.dimension) {
      case 'WEBSITE':
      case 'MOBILE_EXPERIENCE':
        recommendations.push({
          serviceKey: 'CORPORATE_WEB_ARCHITECTURE',
          name: 'Corporate Architectural Web Architecture',
          category: 'DIGITAL_EXPERIENCE',
          reason: 'Modernizes corporate identity and mobile UX for institutional stakeholders.',
          evidence: g.evidence,
          confidence: g.confidence,
          estimatedValueRange: { min: 12000, max: 28000, currency: 'EUR' }
        });
        break;

      case 'PROJECT_PRESENTATION':
      case 'PROJECT_MARKETING':
      case 'PROPERTY_MARKETING':
        recommendations.push({
          serviceKey: 'PROJECT_SHOWCASE_PORTAL',
          name: 'Interactive Project Masterplan & BIM Showcase Portal',
          category: 'DIGITAL_EXPERIENCE',
          reason: 'Showcases active landmark projects with dynamic cadastre maps and progress logs.',
          evidence: g.evidence,
          confidence: g.confidence,
          estimatedValueRange: { min: 8500, max: 19500, currency: 'EUR' }
        });
        break;

      case 'PHOTOGRAPHY':
      case 'VIDEO':
        recommendations.push({
          serviceKey: 'INSTITUTIONAL_MEDIA_PRODUCTION',
          name: '4K Drone & Construction Progress Milestone Media',
          category: 'MEDIA_PRODUCTION',
          reason: 'Produces verified high-definition drone progress reels and structural photography.',
          evidence: g.evidence,
          confidence: g.confidence,
          estimatedValueRange: { min: 6500, max: 15000, currency: 'EUR' }
        });
        break;

      case 'LEAD_GENERATION':
        recommendations.push({
          serviceKey: 'EXECUTIVE_LEAD_FUNNEL',
          name: 'Private Investor & Subcontractor Proposal Portal',
          category: 'GROWTH',
          reason: 'Directs institutional procurement and investor inquiries into dedicated pipelines.',
          evidence: g.evidence,
          confidence: g.confidence,
          estimatedValueRange: { min: 7500, max: 16000, currency: 'EUR' }
        });
        break;

      case 'SEO':
      case 'DIGITAL_AUTHORITY':
        recommendations.push({
          serviceKey: 'CONSTRUCTION_SEO_AUTHORITY',
          name: 'Romanian Market Organic Authority & Technical Search Optimization',
          category: 'BRAND_AUTHORITY',
          reason: 'Secures high-ranking search positions for regional construction tenders and developments.',
          evidence: g.evidence,
          confidence: g.confidence,
          estimatedValueRange: { min: 4500, max: 9500, currency: 'EUR' }
        });
        break;
    }
  }

  // If company has multiple active projects, ensure project showcase is present
  if (activeProjectsCount >= 2 && !recommendations.some(r => r.serviceKey === 'PROJECT_SHOWCASE_PORTAL')) {
    recommendations.push({
      serviceKey: 'PROJECT_SHOWCASE_PORTAL',
      name: 'Interactive Project Masterplan & BIM Showcase Portal',
      category: 'DIGITAL_EXPERIENCE',
      reason: `${activeProjectsCount} active construction sites identified; requires consolidated multi-project showcase.`,
      evidence: 'Multiple active developments verified.',
      confidence: 'HIGH',
      estimatedValueRange: { min: 9500, max: 22000, currency: 'EUR' }
    });
  }

  return recommendations;
}
