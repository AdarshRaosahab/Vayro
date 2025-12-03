# Vercel Deployment Guide

## Overview
Deploying VAYRO to Vercel provides a scalable, serverless environment optimized for Next.js applications.

## Deployment Steps

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Import Project**: Log in to Vercel, click "Add New...", and select "Project". Import your VAYRO repository.
3.  **Configure Project**:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./`
4.  **Environment Variables**: Add the required variables (see below).
5.  **Deploy**: Click "Deploy". Vercel will build and deploy the `main` branch.

## Required Environment Variables

Ensure these are set in the Vercel Project Settings:

- `DATABASE_URL`: Connection string for your production Postgres database (e.g., from Supabase or Neon).
- `REDIS_URL`: Connection string for your Redis instance (e.g., Upstash).
- `STRIPE_SECRET_KEY`: Production Stripe Secret Key.
- `STRIPE_WEBHOOK_SECRET`: Production Stripe Webhook Secret.
- `NEXT_PUBLIC_BASE_URL`: The full URL of your deployment (e.g., `https://vayro.io`).

## Post-Deployment Checks

After deployment is complete, verify the following:

1.  **Landing Page**: Visit the root URL. It should load without errors.
2.  **Dashboard**: Navigate to `/dashboard`. It should render the UI (data may be empty if DB is fresh).
3.  **API Health**: Check `/api/health` (if implemented) or verify `/api/shorten` responds to requests.

## Performance & Caching

- **Static Assets**: Vercel automatically caches assets in `/public` and static pages at the Edge.
- **Serverless Functions**: API routes run as serverless functions. Cold starts are minimized by Vercel's infrastructure.
- **Image Optimization**: Images are optimized on-the-fly. Do not regenerate brand assets; use the provided files in `VAYRO-Brand/`.

## Note on Assets
All brand assets are located in `VAYRO-Brand/`. Do not generate new logos during the build process.
