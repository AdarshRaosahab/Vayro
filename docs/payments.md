# Razorpay Integration Guide

## Overview
VAYRO uses Razorpay for processing payments and subscriptions.

## Environment Variables
Ensure these are set in your `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

## Setup Instructions

### 1. Razorpay Dashboard
- Create a Razorpay account.
- Generate Test Keys (Key ID and Key Secret).
- Set up Webhooks:
  - URL: `https://your-domain.com/api/payments/webhook` (Use ngrok for local dev)
  - Secret: Same as `RAZORPAY_WEBHOOK_SECRET`
  - Events: `payment.captured`, `subscription.charged`

### 2. Local Development
- Use `ngrok` to expose your local server: `ngrok http 3000`.
- Add the ngrok URL to Razorpay Webhooks.

### 3. Testing
- Go to `/checkout`.
- Click "Pay with Razorpay".
- Use Razorpay Test Card details or Test UPI ID (`success@razorpay`).

## Database
- `RazorpayPayment`: Tracks one-time payments.
- `RazorpaySubscription`: Tracks recurring subscriptions.
- `User.plan`: Updated to 'premium' upon successful payment/subscription.

## UPI Support
Razorpay Checkout automatically handles UPI flows (Google Pay, PhonePe, Paytm, etc.) based on the user's device and installed apps.
