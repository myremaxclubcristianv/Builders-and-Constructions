import { MetadataRoute } from 'next';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '@/lib/real-romanian-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://constructions.cristianvaduva.com';

  const staticRoutes = [
    '',
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
    priority: route === '' ? 1.0 : 0.8
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

  return [...staticRoutes, ...companyRoutes, ...projectRoutes, ...cityRoutes];
}
