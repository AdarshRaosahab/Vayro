/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compress: true,
    output: 'standalone',
    images: {
        unoptimized: true,
    },
    poweredByHeader: false,
    experimental: {
        esmExternals: true,
    },
}

module.exports = nextConfig
