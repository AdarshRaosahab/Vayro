# Performance Monitoring Guide

## Key Metrics to Watch

### 1. Latency
- **Redirect Latency**: Time from request to 307 redirect. Target: < 100ms.
- **API Latency**: P95 for `/api/*` routes. Target: < 300ms.

### 2. Database
- **Slow Queries**: Any query taking > 500ms.
- **Connection Pool**: Wait times for acquiring a connection.

### 3. Cache
- **Hit Ratio**: Percentage of requests served from Redis/Edge vs DB. Target: > 90% for redirects.
- **Eviction Rate**: If high, increase Redis memory.

### 4. System
- **CPU/Memory**: Standard resource monitoring.
- **Queue Lag**: If using background jobs for analytics.

## Tools
- **Vercel Analytics**: Good for frontend/edge metrics.
- **Datadog/New Relic**: Comprehensive backend monitoring.
- **PgHero**: PostgreSQL insights.
