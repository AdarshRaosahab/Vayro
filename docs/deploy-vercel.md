# Vercel Deployment Guide

## Build Configuration
- **Framework Preset**: Next.js
- **Build Command**: `next build` (or `npm run build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables
Configure the following in Project Settings > Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connection string for production DB |
| `REDIS_URL` | Connection string for Redis (Upstash/Redis Cloud) |
| `NEXTAUTH_SECRET` | Random string for session encryption |
| `NEXT_PUBLIC_BASE_URL` | `https://vayro.app` (Your prod domain) |
| `RAZORPAY_KEY_ID` | Live Key ID |
| `RAZORPAY_KEY_SECRET` | Live Key Secret |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense Publisher ID |
| `MALWARE_API_KEY` | Google Safe Browsing API Key |

## Caching & Edge
- Vercel automatically handles caching for static assets.
- `middleware.ts` handles custom caching headers for short links.
- Ensure `experimental: { esmExternals: true }` is in `next.config.js` if using Edge functions (optional).

## Cron Jobs
Vercel supports Cron Jobs for periodic tasks (like analytics aggregation).
Add `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate-analytics",
      "schedule": "0 0 * * *"
    }
  ]
}
```
*Note: Ensure the cron endpoint is secured (e.g., check for a secret header).*
