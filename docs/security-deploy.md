# Security Deployment Guide

## Infrastructure Checklist

### 1. HTTPS & HSTS
- Ensure SSL is enabled on the load balancer / Vercel.
- HSTS headers are recommended for production.

### 2. Cookies
- `lib/sessions.ts` sets `Secure` and `HttpOnly` flags automatically in production (`NODE_ENV=production`).
- Ensure your production environment sets `NODE_ENV` correctly.

### 3. WAF / DDoS Protection
- Use Cloudflare or Vercel Firewall.
- Enable "Under Attack Mode" if high traffic anomalies are detected.

### 4. Environment Variables
- `REDIS_URL`: Essential for distributed rate limiting.
- `MALWARE_API_KEY`: Required if enabling real malware scanning.
- `METRICS_BACKEND`: For shipping security logs.
