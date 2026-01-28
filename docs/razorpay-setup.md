# Razorpay Go-Live Setup for Vayro.in

## 1. What is the "Webhook Secret"?
**Confusion Clarifier:** Think of the **Webhook Secret** as a **shared password** that you simply invent. It is NOT something Razorpay gives you initially. **YOU create it.**

**How it works:**
1.  **You invent a secret password** (e.g., `vayro_secure_pass_2025`).
2.  **You save this password** in your Vercel/System Environment variables (so your code knows it).
3.  **You tell Razorpay this password** in their dashboard (so they know it).

When a payment happens, Razorpay will sign the message with this password. Your code will check the signature using the password it has. If they match, the payment is real.

---

## 2. Update Environment Variables (.env)
You must set this in your Vercel project settings (Environment Variables) for production, or your local `.env` file for testing.

```bash
# 1. Get these from Razorpay Dashboard -> Settings -> API Keys -> Key ID & Key Secret
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# 2. This MUST match the RAZORPAY_KEY_ID above exactly
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx

# 3. Create your own password here. 
# Example: "my_super_secret_password_123"
RAZORPAY_WEBHOOK_SECRET=my_super_secret_password_123
```

---

## 3. Configure Razorpay Webhook (Step-by-Step)
This connects Razorpay to `https://www.vayro.in`.

1.  **Log in** to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Navigate to **Settings** (usually bottom left gear icon).
3.  Click on the **Webhooks** tab.
4.  Click **+ Add New Webhook**.
5.  **Webhook URL**: 
    Enter exactly: `https://www.vayro.in/api/payments/webhook`
6.  **Secret**: 
    Enter the **EXACT SAME** password you invented for `RAZORPAY_WEBHOOK_SECRET` in step 2 (e.g., `my_super_secret_password_123`).
7.  **Alert Email**: (Optional) Your email.
8.  **Active Events**:
    *   Scroll down and check the box for: `payment.captured`
    *   (If you ever add subscriptions later, you might check `subscription.charged`, but for now `payment.captured` is the critical one).
9.  Click **Create Webhook**.

## 4. Final Verification
1.  Make a small real payment (e.g., ₹1) on `https://www.vayro.in`.
2.  Check the database or your user profile. The plan should update to "Premium" automatically.
3.  If it updates, congratulations! Your payments are live and secure.
