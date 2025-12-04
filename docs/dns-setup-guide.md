# How to Connect Your Domain (DNS) on Vercel

Since you want your site to be accessible at **vayro.in** (instead of `vayro.vercel.app`), follow these steps.

## Step 1: Add Domain in Vercel

1.  Go to your Project Dashboard on Vercel.
2.  Click **Settings** (top menu) -> **Domains** (side menu).
3.  Enter `vayro.in` in the input box and click **Add**.
4.  Select the recommended option (usually "Add `vayro.in` and `www.vayro.in`").

## Step 2: Update DNS Records

Vercel will show you a configuration error because you haven't pointed your domain to them yet. You have two options:

### Option A: Nameservers (Easiest & Recommended for Hostinger)
This gives Vercel full control over your DNS and is the simplest setup.

**Hostinger Specific Steps:**
1.  Log in to your **Hostinger Dashboard**.
2.  Click on **Domains** in the top menu.
3.  Click **Manage** next to `vayro.in`.
4.  Look for **"Nameservers"** in the left sidebar (or scroll down to find it).
5.  Click **Change**.
6.  Select **"Change nameservers"** (not "Use Hostinger nameservers").
7.  Enter Vercel's nameservers:
    *   Nameserver 1: `ns1.vercel-dns.com`
    *   Nameserver 2: `ns2.vercel-dns.com`
8.  Click **Save**.

**General Steps (Other Registrars):**
1.  Log in to your registrar.
2.  Find the **"Nameservers"** section.
3.  Change them to:
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
