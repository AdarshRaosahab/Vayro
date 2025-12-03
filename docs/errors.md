# Global Error Handling Architecture

## Overview
VAYRO uses a unified error handling strategy to ensure consistent API responses, safe logging, and a premium user experience.

## Error Classes (`lib/errors.ts`)
We use custom error classes to handle different scenarios:
- **`AppError`**: Base class for all application errors.
- **`AuthError`**: 401 Unauthorized (missing/invalid session).
- **`ValidationError`**: 400 Bad Request (invalid input).
- **`RateLimitError`**: 429 Too Many Requests.
- **`PaymentError`**: 402 Payment Required.
- **`NotFoundError`**: 404 Not Found.

## API Wrapper (`lib/api-wrapper.ts`)
All API routes are wrapped with `apiHandler`. This high-order function:
1.  Catches any errors thrown during execution.
2.  Logs unexpected errors using `lib/logger.ts`.
3.  Formats the error into a standard JSON response:
    ```json
    {
      "ok": false,
      "error": "Error message here",
      "code": "ErrorClassName"
    }
    ```

## Frontend Handling
- **`Alert` Component**: Used to display error messages in the UI.
- **Fetch Logic**: Frontend checks `res.ok` or `data.ok`. If false, it displays `data.error`.

## Usage Example
```typescript
import { apiHandler } from 'lib/api-wrapper'
import { AppError } from 'lib/errors'

export default apiHandler(async (req, res) => {
  if (!req.body.name) {
    throw new AppError('Name is required', 400)
  }
  res.status(200).json({ ok: true })
})
```
