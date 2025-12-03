# Authentication Notes

## Session Management
- **Cookie Name**: `vayro_session`
- **Attributes**:
  - `HttpOnly`: Yes (inaccessible to JS)
  - `Secure`: Yes (in production)
  - `SameSite`: Lax
  - `Max-Age`: 30 days
- **Storage**:
  - Sessions are stored in the database (`Session` table).
  - Can be migrated to Redis for higher performance.

## Security
- **Passwords**: Hashed using `bcrypt` (via `bcryptjs`).
- **Rate Limiting**:
  - Login attempts are rate-limited by IP (20 attempts/hour).
  - Implemented in-memory for MVP (resets on server restart).
  - Should be moved to Redis for production.

## Testing Locally
To test authentication flows using `curl`:

### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  -c cookies.txt
```

### 3. Check Session (Me)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### 4. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```
