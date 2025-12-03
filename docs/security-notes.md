# Security Notes

## Controls Implemented

### 1. Rate Limiting
- **Library**: `lib/rateLimit.ts`
- **Strategy**: Fixed window counter (Redis/Memory).
- **Limits**:
  - Login: 5 attempts / min / IP
  - Shorten: 10 req / min / IP
  - Update: 20 req / min / User

### 2. URL Safety
- **Library**: `lib/urlSafety.ts`
- **Checks**:
  - Valid scheme (http/https only)
  - No private IPs (127.0.0.1, etc.)
  - Blocklist check

### 3. CSRF
- **Library**: `lib/csrf.ts`
- **Strategy**: Double-submit cookie (optional implementation for state-changing forms).

### 4. Abuse Prevention
- **Blocklist**: `lib/blocklist.ts` checks against a list of known bad domains.
- **Malware**: `lib/malwareCheck.ts` stub for external scanning.

## Monitoring
- Watch for `RateLimitError` spikes in logs.
- Monitor `ValidationError` for "Unsafe URL" messages.
