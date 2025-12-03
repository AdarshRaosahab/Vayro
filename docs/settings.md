# Settings & Profile Management

## Overview
The settings area allows users to manage their account details, security credentials, and billing status.

## Components
- **`AccountSettings`**: Updates display name and website.
- **`PasswordChangeForm`**: Handles secure password updates.
- **`BillingStatus`**: Displays plan info and invoice history.
- **`Preferences`**: Toggles for notifications/marketing.

## API Endpoints

### `POST /api/user/update`
Updates profile fields.
- **Body**: `{ displayName?: string, website?: string }`
- **Returns**: Updated user object.

### `POST /api/user/password`
Changes user password.
- **Body**: `{ currentPassword, newPassword }`
- **Validation**: Enforces min length (8 chars).

### `POST /api/user/subscription/cancel`
Cancels current subscription.
- **Action**: Downgrades user to 'free' plan immediately (MVP).
- **Future**: Integrate with Stripe/Razorpay webhook to handle end-of-period cancellation.

### `GET /api/user/invoices`
Returns a list of past invoices.
- **Current**: Returns mock data.
- **Future**: Fetch from payment provider.

## Testing
1.  **Profile**: Go to Settings -> Account. Change name and save. Verify success message.
2.  **Password**: Change password. Log out and log in with new password.
3.  **Billing**: If on premium, click "Cancel Subscription". Verify plan changes to Free.
