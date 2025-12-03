# AdSense Integration Notes

## Overview
VAYRO uses a conditional rendering system to show Google AdSense ads only to free users. Premium users enjoy an ad-free experience.

## Configuration
- **Environment Variable**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
  - Set this in your `.env` file (e.g., `ca-pub-XXXXXXXXXXXXXXXX`).
  - If missing, the ad component will simply render nothing.

## Gating Logic
1.  **Server-Side (`lib/ads.ts`)**:
    - Checks if the user is logged in via session cookie.
    - If logged in, checks the `User.plan` field in the database.
    - Returns `true` (show ads) for guests and free users.
    - Returns `false` (hide ads) for premium users.

2.  **Client-Side (`components/AdSlot.tsx`)**:
    - Fetches status from `/api/ads/can-show` on mount.
    - If `showAds` is true, injects the AdSense script and renders the `<ins>` tag.
    - If `showAds` is false, renders `null`.

## Policy Compliance
- The AdSense script is **never loaded** for premium users, ensuring no tracking or ad requests are made for them.
- No user data is passed to AdSense.
- Placements are responsive and non-intrusive.

## Testing
- **Free User/Guest**: You should see a placeholder (or actual ad if approved) in the layout footer area.
- **Premium User**: The ad slot should be completely absent from the DOM.
