import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/commercial',
        '/product-health',
        '/workspace',
        '/accounts',
        '/command',
        '/dealflow',
        '/outreach',
        '/actions',
        '/decisions'
      ]
    },
    sitemap: 'https://constructions.cristianvaduva.com/sitemap.xml'
  };
}
