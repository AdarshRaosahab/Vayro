# CDN & Asset Hosting

## Strategy
VAYRO uses Next.js Image Optimization and static asset serving.

## Configuration
- **`next.config.js`**:
  - `images.unoptimized = true` (if using external CDN completely, otherwise false for Vercel).
  - `compress = true` (Gzip/Brotli).

## Headers
Middleware ensures optimal caching:
- **Immutable**: Fonts, Images, JS chunks.
- **Short TTL**: HTML pages, Redirects.

## Brand Assets
- Store in `public/brand/`.
- Do not link directly from external sites if possible to save bandwidth.
- Use a separate CDN domain (e.g., `assets.vayro.app`) in production if scale demands it.
