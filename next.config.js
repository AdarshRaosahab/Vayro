/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    images: {
        unoptimized: true,
    },
    poweredByHeader: false,
    experimental: {
        esmExternals: true,
    },
    async rewrites() {
        return [
            {
                source: '/api/py/:path*',
                destination: 'http://127.0.0.1:8000/api/:path*', // Proxy to Backend
            },
        ]
    },
}

module.exports = nextConfig
