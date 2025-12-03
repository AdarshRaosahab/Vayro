# How to Connect Your Domain (DNS) on Vercel

Since you want your site to be accessible at **vayro.in** (instead of `vayro.vercel.app`), follow these steps.

## Step 1: Add Domain in Vercel

1.  Go to your Project Dashboard on Vercel.
2.  Click **Settings** (top menu) -> **Domains** (side menu).
3.  Enter `vayro.in` in the input box and click **Add**.
4.  Select the recommended option (usually "Add `vayro.in` and `www.vayro.in`").

## Step 2: Update DNS Records

Vercel will show you a configuration error because you haven't pointed your domain to them yet. You have two options:

### Option A: Nameservers (Easiest)
This gives Vercel full control over your DNS.
1.  Log in to where you bought your domain (GoDaddy, Namecheap, Hostinger, etc.).
2.  Find the **"Nameservers"** section.
3.  Change them to Vercel's nameservers:
    *   `ns1.vercel-dns.com`
    *   `ns2.vercel-dns.com`

### Option B: A Records (Advanced)
Use this if you have other services (like custom email) already set up on your domain.
1.  Log in to your domain registrar.
2.  Go to **DNS Management**.
3.  Add an **A Record**:
    *   **Type**: `A`
    *   **Name/Host**: `@`
    *   **Value**: `76.76.21.21` (Vercel's IP)
4.  Add a **CNAME Record**:
    *   **Type**: `CNAME`
    *   **Name/Host**: `www`
    *   **Value**: `cname.vercel-dns.com`

## Step 3: Wait for Propagation

DNS changes can take anywhere from **1 minute to 24 hours** to update globally.
*   Vercel will automatically issue an SSL certificate (HTTPS) for you once the DNS is connected.
*   Once the error message on Vercel turns into a green checkmark, your site is live at `vayro.in`!
