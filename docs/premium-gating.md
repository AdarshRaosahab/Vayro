# Premium Gating Documentation

## Overview
VAYRO uses a "Freemium" model. Basic features are free, while advanced features are locked behind a Premium plan.

## Gated Features
| Feature | Free Plan | Premium Plan |
| :--- | :--- | :--- |
| **Analytics History** | Last 7 Days | Last 30 Days |
| **Bulk QR** | Locked | Unlimited |
| **Ads** | Visible | Hidden |
| **Support** | Standard | Priority |

## Implementation

### Frontend (`FeatureGate`)
We use the `<FeatureGate />` component to conditionally render content.
```tsx
<FeatureGate requiresPremium userPlan={user.plan} fallback="overlay">
  <AdvancedChart />
</FeatureGate>
```
- **fallback="overlay"**: Shows the content blurred with a lock icon.
- **fallback="upsell"**: Replaces content with an upgrade card.
- **fallback="hidden"**: Renders nothing.

### Backend Enforcement
APIs check `req.user.plan` (via session) before returning data.
- **`api/analytics/summary`**: Returns truncated timeseries data for free users.
- **`api/qr/bulk`**: Throws `402 Payment Required` for free users.

### Upsell Strategy
- **Dashboard Sidebar**: Always shows an "Upgrade to Premium" card for free users.
- **Premium Badge**: Displayed next to the username for premium users.
