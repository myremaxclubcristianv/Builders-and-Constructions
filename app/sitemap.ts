import { MetadataRoute } from 'next';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';
import { OFFICIAL_SERVICES } from '@/lib/services-config';
import { constructionMaterialsDataset } from '@/lib/knowledge-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://constructions.cristianvaduva.com';

  const staticRoutes = [
    '',
    '/contact',
    '/services',
    '/knowledge',
    '/knowledge/materials',
    '/knowledge/concrete',
    '/knowledge/systems',
    '/knowledge/infrastructure',
    '/knowledge/engineering',
    '/knowledge/processes',
    '/knowledge/standards',
    '/knowledge/glossary',
    '/knowledge/compare',
    '/knowledge/sources',
    '/intelligence',
    '/market',
    '/changes',
    '/search',
    '/signals',
    '/network',
    '/watchlist',
    '/projects',
    '/companies',
    '/developers',
    '/agencies',
    '/contractors',
    '/architects',
    '/engineers',
    '/cities',
    '/rankings',
    '/compare',
    '/pipeline',
    '/map',
    '/video',
    '/coverage',
    '/methodology',
    '/about/cristian-vaduva',
    '/about/aixluxury',
    '/report-error',
    '/research-request',
    '/work-with-us',
    '/terms',
    '/privacy',
    '/gdpr'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/contact' || route === '/services' ? 0.9 : 0.8
  }));

  const serviceRoutes = OFFICIAL_SERVICES.map(s => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85
  }));

  const knowledgeMaterialRoutes = constructionMaterialsDataset.map(m => ({
    url: `${baseUrl}/knowledge/materials/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75
  }));

  const companyRoutes = realCompaniesDataset.map(c => ({
    url: `${baseUrl}/companies/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const projectRoutes = realProjectsDataset.map(p => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  const cityRoutes = realLocationsDataset.map(c => ({
    url: `${baseUrl}/cities/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...knowledgeMaterialRoutes,
    ...companyRoutes,
    ...projectRoutes,
    ...cityRoutes
  ];
}
