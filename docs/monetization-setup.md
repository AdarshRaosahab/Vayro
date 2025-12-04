# Monetization Setup Guide 💸

This guide covers the exact steps to activate payments (Razorpay) and ads (Google AdSense) for Vayro.

---

## Part 1: Razorpay (Accepting Real Money)

Currently, you are using "Test Mode". To accept real money, you must activate your account.

### Step 1: Complete KYC
1.  Log in to your **[Razorpay Dashboard](https://dashboard.razorpay.com/)**.
2.  Look for the **"Activate Account"** button (usually at the top or in settings).
3.  Fill in your business details:
    *   **Business Type**: Individual / Proprietorship (if it's just you).
    *   **Bank Details**: Where you want to receive the money.
    *   **KYC Documents**: PAN Card, Aadhar, etc.
4.  **Submit** and wait. Approval usually takes 2-3 days.

### Step 2: Generate Live Keys
Once your account shows **"Live"** (Green Badge):
1.  Go to **Settings** -> **API Keys**.
2.  Click **"Generate Live Key"**.
3.  **COPY THESE IMMEDIATELY**. You will see:
    *   `Key ID` (starts with `rzp_live_...`)
    *   `Key Secret` (long random string)
4.  Save them in a secure note (Notepad) temporarily.

### Step 3: Update Vercel
1.  Go to **Vercel Dashboard** -> **Settings** -> **Environment Variables**.
2.  Find `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
    *   Click **Edit**.
    *   Paste your **Live Key ID**.
    *   Save.
3.  Find `RAZORPAY_KEY_SECRET`.
    *   Click **Edit**.
    *   Paste your **Live Key Secret**.
    *   Save.
4.  **Redeploy** your project for changes to take effect.

---

## Part 2: Google AdSense (Displaying Ads)

### Step 1: Apply for AdSense
1.  Go to **[Google AdSense](https://www.google.com/adsense/start/)**.
2.  Click **Get Started**.
3.  **Your Site**: Enter `vayro.in` (do not use the vercel.app link).
4.  Follow the steps to create your account.

### Step 2: Connect Your Site
Google will give you a "Publisher ID" (looks like `ca-pub-1234567890123456`).

1.  **Update Vercel**:
    *   Go to Vercel **Environment Variables**.
    *   Add a new variable: `ADSENSE_CLIENT_ID`
    *   Value: `ca-pub-XXXXXXXXXXXXXXXX` (Replace with your actual ID).
    *   Save.

### Step 3: Add ads.txt (Crucial for Approval)
Google will ask you to add an `ads.txt` file.

1.  Google will provide a snippet of text looking like:
    `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`
2.  **Create this file in your project**:
    *   Create a new file named `ads.txt` inside the `public/` folder.
    *   Paste the line from Google into it.
3.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Add ads.txt"
    git push
    ```

### Step 4: Request Review
1.  Go back to AdSense dashboard.
2.  Click **"I've added the code"**.
3.  Click **"Request Review"**.
4.  **Wait**. This can take 2 days to 2 weeks.

---

## Summary Checklist

- [ ] Razorpay KYC Submitted
- [ ] Razorpay Live Keys added to Vercel
- [ ] AdSense Account Created
- [ ] `ADSENSE_CLIENT_ID` added to Vercel
- [ ] `public/ads.txt` created and pushed
- [ ] AdSense Review Requested
