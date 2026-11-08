import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api',
        '/api/',
        '/admin',
        '/admin/',
        '/workspace',
        '/workspace/',
        '/command',
        '/command/',
        '/dealflow',
        '/dealflow/',
        '/commercial',
        '/commercial/',
        '/product-health',
        '/product-health/',
        '/accounts',
        '/accounts/',
        '/outreach',
        '/outreach/',
        '/actions',
        '/actions/',
        '/decisions',
        '/decisions/'
      ]
    },
    sitemap: 'https://constructions.cristianvaduva.com/sitemap.xml'
  };
}
