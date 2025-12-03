# Onboarding Flow Documentation

## Overview
The onboarding flow guides new users through creating their first short link. It is triggered after the first successful login if the `onboardCompleted` flag is false.

## Flow Steps
1.  **Welcome**: User enters a long URL.
2.  **Customize**: User optionally sets a custom alias.
3.  **Success**: User sees their new short link and QR code, with options to go to the dashboard or upgrade.

## Database
- **`User.onboardCompleted`**: Boolean flag. Defaults to `false`. Set to `true` when the user completes the flow or clicks "Skip".

## API
- **`POST /api/user/onboard`**: Sets `onboardCompleted = true` for the current user.

## Testing
1.  **Reset User**: To test the flow again for a user, update their record in the database:
    ```sql
    UPDATE User SET onboardCompleted = 0 WHERE email = 'test@example.com';
    ```
    (Or use Prisma Studio: `npx prisma studio`)
2.  **Login**: Log in as that user. You should be redirected to `/onboarding`.
3.  **Complete**: Go through the steps.
4.  **Verify**: You should land on `/dashboard`. Subsequent logins should go directly to `/dashboard`.
