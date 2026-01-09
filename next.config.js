/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'lucide-react', 'recharts']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 10
  }
}

module.exports = nextConfig