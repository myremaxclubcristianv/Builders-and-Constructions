import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/greenfield-baneasa',
        destination: '/projects/greenfield-baneasa',
        permanent: true
      },
      {
        source: '/greenfield-baneasa-residence',
        destination: '/projects/greenfield-baneasa-residence',
        permanent: true
      },
      {
        source: '/ctpark-cluj',
        destination: '/projects/ctpark-cluj-logistics',
        permanent: true
      },
      {
        source: '/projects/ctpark-cluj',
        destination: '/projects/ctpark-cluj-logistics',
        permanent: true
      },
      {
        source: '/speedwell-riverside-arad',
        destination: '/projects/speedwell-riverside-arad-site',
        permanent: true
      },
      {
        source: '/projects/speedwell-riverside-arad',
        destination: '/projects/speedwell-riverside-arad-site',
        permanent: true
      },
      {
        source: '/porr-construct',
        destination: '/companies/porr-construct-romania',
        permanent: true
      },
      {
        source: '/companies/porr-construct',
        destination: '/companies/porr-construct-romania',
        permanent: true
      },
      {
        source: '/companies/comp-porr-construct',
        destination: '/companies/porr-construct-romania',
        permanent: true
      },
      {
        source: '/a7-highway-focsani-bacau',
        destination: '/projects/autostrada-a7-moldovei-umb',
        permanent: true
      },
      {
        source: '/projects/a7-highway-focsani-bacau',
        destination: '/projects/autostrada-a7-moldovei-umb',
        permanent: true
      },
      {
        source: '/cookie-policy',
        destination: '/cookies',
        permanent: true
      },
      {
        source: '/cookie',
        destination: '/cookies',
        permanent: true
      },
      {
        source: '/accessibility-statement',
        destination: '/accessibility',
        permanent: true
      }
    ];
  }
};

export default nextConfig;

