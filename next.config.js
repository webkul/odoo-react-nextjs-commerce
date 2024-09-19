/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'odooheadless-testing.webkul.in'
      }
    ]
  },
  env: {
    ODOO_API_VERSION: process.env.ODOO_API_VERSION,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};
