# Vercel Deployment Guide for VAYRO

Follow these steps to deploy your application to Vercel.

## Prerequisites

1.  **GitHub Account**: Ensure your code is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Step 1: Push Code to GitHub

If you haven't already, push your local code to GitHub:

```bash
git add .
git commit -m "Ready for V1 Launch"
git push origin main
```

## Step 2: Import Project in Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `Vayro` repository in the list and click **"Import"**.

## Step 3: Configure Project

Vercel will auto-detect that this is a Next.js project. You don't need to change the Build Command or Output Directory.

### **CRITICAL: Environment Variables**

You must add the following variables in the **"Environment Variables"** section. Copy the values exactly from your local `.env` file.

| Variable Name | Description |
| :--- | :--- |
| `DATABASE_URL` | **Must include** `?pgbouncer=true` at the end. Use the Transaction Pooler URL (Port 6543). |
| `DIRECT_URL` | Use the Session Pooler URL (Port 5432). |
| `SESSION_SECRET` | Your generated secret. |
| `JWT_SECRET` | Your generated secret. |
| `NEXTAUTH_SECRET` | Your generated secret. |
| `NEXT_PUBLIC_BASE_URL` | Set this to your production domain (e.g., `https://vayro.in`) or the Vercel URL after deployment. |
| `RAZORPAY_KEY_ID` | Your **Live** Key ID. |
| `RAZORPAY_KEY_SECRET` | Your **Live** Key Secret. |
| `ADSENSE_CLIENT_ID` | Your Google AdSense Publisher ID. |

**Note:** For `DATABASE_URL`, ensure it looks like this:
`postgresql://...:6543/postgres?pgbouncer=true`

## Step 4: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to complete. It usually takes 1-2 minutes.
3.  Once done, you will see a "Congratulations!" screen with your live URL.

## Step 5: Post-Deployment Verification

1.  **Visit the URL**: Open your new site.
2.  **Check Database**: Try logging in with your Admin account (`admin@vayro.in`).
3.  **Check Links**: Create a short link and verify it redirects correctly.
4.  **Check Admin Panel**: Go to `/admin/reports` to verify you have access.

## Troubleshooting

- **500 Error on Login/Register**: Usually means `DATABASE_URL` is missing `?pgbouncer=true` or `DIRECT_URL` is incorrect.
- **Build Failed**: Check the "Logs" tab in Vercel for specific error messages.
