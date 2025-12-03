# VAYRO Environment & Secret Management

## 1. Overview
VAYRO runs across multiple environments, each requiring specific configuration. We use `.env` files to manage these variables securely.

## 2. Environments

- **Local**: Uses SQLite and local secrets. Optimized for speed and offline development.
- **Docker**: Uses Postgres and Redis containers. Simulates the production stack locally.
- **Staging**: A mirror of production for testing.
- **Production**: The live application with real data and secure secrets.

## 3. Configuration Files

- **`.env.local`**: Automatically loaded by Next.js for local development. Copy from `.env.local.example`.
- **`.env.docker`**: Used by `docker-compose`. Copy from `.env.docker.example`.
- **`.env.production`**: Reference template for production deployment. **DO NOT commit this file.**

## 4. Secret Management

### GitHub Actions
Store secrets in **Settings > Secrets and variables > Actions**.
- `STRIPE_SECRET_KEY`
- `DATABASE_URL` (if running integration tests against a real DB)

### Vercel
Store secrets in **Settings > Environment Variables**.
- Add variables for `Production`, `Preview`, and `Development` environments separately.

### Docker
For local Docker, use `.env`. For production Docker, inject environment variables via your container orchestrator (e.g., Kubernetes Secrets, AWS Parameter Store).

## 5. Security Rules

1.  **Never Commit Secrets**: Ensure `.env` and `.env.local` are in `.gitignore`.
2.  **Strong Secrets**: Use long, random strings for `SESSION_SECRET` and `JWT_SECRET`.
    - Generate with: `openssl rand -base64 32`
3.  **Stripe Keys**:
    - Use `sk_test_...` for local/staging.
    - Use `sk_live_...` ONLY for production.

## 6. Future Expansion

- **Rotation**: Rotate `JWT_SECRET` and `SESSION_SECRET` periodically.
- **Cloud Storage**: When adding S3/GCS, add `CLOUD_STORAGE_KEY` and `CLOUD_STORAGE_SECRET` to the env templates.
- **Custom Domains**: Configure `NEXT_PUBLIC_BASE_URL` dynamically for multi-tenant setups.
