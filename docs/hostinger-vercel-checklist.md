# Hostinger to Vercel Connection Checklist

Follow these steps exactly in order. Check them off as you go.

## Phase 1: Prepare Vercel (Do this FIRST)

1.  [ ] Open your browser and log in to **[Vercel.com](https://vercel.com)**.
2.  [ ] Click on your **Vayro** project.
3.  [ ] Click on the **Settings** tab at the top.
4.  [ ] Click on **Domains** in the left sidebar.
5.  [ ] In the box that says "example.com", type: `vayro.in`
6.  [ ] Click the **Add** button.
7.  [ ] A popup will appear. Select the option that says **"Add vayro.in and www.vayro.in"**.
8.  [ ] Click **Add**.
    *   *You will see an "Invalid Configuration" error with a red alert. This is NORMAL. Ignore it for now.*
    *   *Leave this tab open.*

## Phase 2: Configure Hostinger (Do this SECOND)

1.  [ ] Open a new tab and log in to **[Hostinger.com](https://www.hostinger.com)**.
2.  [ ] Buy your domain (`vayro.in`) if you haven't already.
3.  [ ] Click on **"Domains"** in the top menu bar.
4.  [ ] Find `vayro.in` in the list and click the **"Manage"** button next to it.
5.  [ ] Look at the left sidebar. Find **"DNS / Nameservers"**.
    *   *If you don't see it, look for a box on the main screen that says "Nameservers".*
6.  [ ] Click **"Change"** (or "Change Nameservers").
7.  [ ] You will see two options: "Hostinger Nameservers" and "Change nameservers".
8.  [ ] **Select "Change nameservers"**.
9.  [ ] Delete any text currently in the boxes.
10. [ ] In **Nameserver 1**, type: `ns1.vercel-dns.com`
11. [ ] In **Nameserver 2**, type: `ns2.vercel-dns.com`
12. [ ] Click **Save**.
    *   *It might say "Nameservers changed successfully" or "Propagation may take 24 hours". This is good.*

## Phase 3: Verify (The Waiting Game)

1.  [ ] Go back to your **Vercel** tab.
2.  [ ] Refresh the page.
3.  [ ] Look at the domain `vayro.in`.
    *   **Blue/Spinning**: It is checking. Wait.
    *   **Green Checkmark**: Success! Your site is live.
    *   **Red Error**: It hasn't updated yet. Wait 15-30 minutes and refresh again.

**Note:** It can take anywhere from **1 minute to 24 hours** for the connection to work globally. Be patient!
