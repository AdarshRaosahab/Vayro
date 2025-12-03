# VAYRO Performance Notes

VAYRO is engineered for speed and efficiency. This document outlines our performance strategies.

## Core Optimizations

### 1. Next.js Configuration
- **SWC Minification**: We use the Rust-based SWC compiler for faster builds and minification.
- **Standalone Output**: Builds are optimized for Docker, reducing container size by tracing dependencies.
- **Compression**: Gzip compression is enabled by default for all text-based assets.
- **React Strict Mode**: Enabled to highlight potential problems in the application.

### 2. Styling (Tailwind CSS)
- **JIT Engine**: Tailwind's Just-In-Time engine generates styles on-demand.
- **Purging**: Unused CSS classes are automatically removed from the production build, ensuring a minimal CSS bundle size.
- **Critical CSS**: Next.js automatically inlines critical CSS for faster First Contentful Paint (FCP).

### 3. Caching Strategy
- **Static Assets**: Images and fonts in `/public` should be served with long-lived `Cache-Control` headers (handled by Vercel or Nginx in production).
- **API Routes**: Dynamic API routes are server-side only and should be cached at the edge where possible (e.g., using Vercel Edge Config or Redis).

## Build & Verification

To verify the production build size and performance locally:

1.  **Build**:
    ```bash
    npm run build:prod
    ```
    Check the output for "First Load JS shared by all" size. Aim for < 100kB.

2.  **Start**:
    ```bash
    npm start
    ```

3.  **Audit**:
    Run Lighthouse in Chrome DevTools to audit performance, accessibility, and SEO.

## Assets
- We avoid heavy image generation.
- All logos and branding assets are served as optimized PNGs from the `VAYRO-Brand` source.
