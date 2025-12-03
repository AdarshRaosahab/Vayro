# Production Release Checklist

## 1. Environment Verification
- [ ] **Environment Variables**: Verify all required variables are set in production (Vercel/Docker).
    - `DATABASE_URL`
    - `REDIS_URL`
    - `NEXTAUTH_SECRET` / `JWT_SECRET`
    - `NEXT_PUBLIC_BASE_URL`
    - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
    - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
    - `MALWARE_API_KEY`
- [ ] **Database**:
    - [ ] Migrations are up to date (`npx prisma migrate deploy`).
    - [ ] Indexes are verified (see `docs/db-indexes.md`).
    - [ ] Connection pooling is configured (if applicable).
- [ ] **Redis**:
    - [ ] Connection is established.
    - [ ] Eviction policy is set (e.g., `allkeys-lru`).

## 2. Third-Party Integrations
- [ ] **Razorpay**:
    - [ ] Switched from Test Mode to Live Mode keys.
    - [ ] Webhooks are configured for `subscription.charged`, `subscription.cancelled`.
- [ ] **AdSense**:
    - [ ] `ads.txt` is accessible at root.
    - [ ] Privacy Policy and Terms pages are live and compliant.
- [ ] **Malware Scanning**:
    - [ ] API key is valid and has sufficient quota.

## 3. Performance & Caching
- [ ] **Caching Headers**: Verify `Cache-Control` headers on:
    - [ ] Static assets (immutable, long max-age).
    - [ ] Short link redirects (short max-age, stale-while-revalidate).
- [ ] **CDN**: Assets are being served via CDN (Vercel Edge Network).
- [ ] **Aggregation**: Analytics aggregation job is scheduled (Cron/Worker).

## 4. Security Audit
- [ ] **HTTPS**: Enforced on all routes.
- [ ] **Cookies**: `Secure`, `HttpOnly`, `SameSite=Lax` flags set.
- [ ] **Rate Limiting**: Active on `/api/shorten`, `/api/auth/*`.
- [ ] **Input Validation**: All API inputs are validated using `lib/validators.ts`.
- [ ] **CSRF**: Protection enabled for state-changing forms.

## 5. Monitoring & Logging
- [ ] **Logs**: Error logging is capturing stack traces (e.g., Sentry or Vercel Logs).
- [ ] **Metrics**: Basic counters (shortens, clicks) are visible.
- [ ] **Alerts**: Set up alerts for:
    - [ ] High error rate (>1%).
    - [ ] DB connection failures.
    - [ ] High latency (>1s p95).

## 6. Smoke Tests
- [ ] **Authentication**: Sign up, Log in, Log out.
- [ ] **Core Flow**: Create a short link, access it, verify redirect.
- [ ] **Analytics**: Verify click is recorded and visible in dashboard.
- [ ] **QR Code**: Generate and scan a QR code.
- [ ] **Settings**: Update profile, change password.
- [ ] **Premium**: Attempt to access a gated feature (should be blocked/upsell).

## 7. Backup & Recovery
- [ ] **Database**: Automated daily backups configured.
- [ ] **Environment**: Copy of production `.env` saved securely (e.g., 1Password).

## 8. Final Polish
- [ ] **Accessibility**: Run a quick Lighthouse audit (aim for >90).
- [ ] **404 Page**: Custom 404 page is working.
- [ ] **Favicon**: Correct favicon is showing.
