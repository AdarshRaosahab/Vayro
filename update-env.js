const fs = require('fs');
const content = `# App Configuration
NEXT_PUBLIC_BASE_URL=https://vayro.in
NEXT_TELEMETRY_DISABLED=1

# Database
# Production Supabase (Transaction Pooler)
DATABASE_URL="postgresql://postgres.tshnyrvkvnhlbzwuxcxc:Adarsh%40152199@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct Connection (Attempting direct DB host for migration)
DIRECT_URL="postgresql://postgres:Adarsh%40152199@db.tshnyrvkvnhlbzwuxcxc.supabase.co:5432/postgres"
REDIS_URL=

# Authentication
# Generated secure secrets
SESSION_SECRET="lM0bsUdYg6vXeFsvq3KpcmZeQQ8MUqMTiAQDPRF6w1M="
JWT_SECRET="fmMgAs8dXMYhC7w2wfPpEpa6afXOOABFlo4EN4LLXzM="
NEXTAUTH_SECRET="aFhbqPR4HTdBSS1oasAtBgEW2ZkRf+6Idt0btjr4zCo="

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# External Services
ADSENSE_CLIENT_ID=
CLOUD_STORAGE_KEY=

# Razorpay (Payments)
RAZORPAY_KEY_ID=rzp_test_RmoZbMadBAmN5z
RAZORPAY_KEY_SECRET=VLQnLYlzgwvUXeJ72JSSPGdp
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RmoZbMadBAmN5z`;

fs.writeFileSync('.env', content);
console.log('.env updated with direct URL');
