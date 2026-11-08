import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/admin/login',
        permanent: true
      },
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

