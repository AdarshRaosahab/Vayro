import { cache } from './cache'
import { RateLimitError } from './errors'

interface RateLimitConfig {
    limit: number
    windowSeconds: number
}

/**
 * Rate limiter using the unified cache interface (Redis or Memory).
 * Implements a simple fixed window counter.
 */
export const rateLimit = {
    async check(key: string, config: RateLimitConfig) {
        const { limit, windowSeconds } = config
        const cacheKey = `ratelimit:${key}`

        // Get current count
        const current = await cache.get<number>(cacheKey) || 0

        if (current >= limit) {
            throw new RateLimitError(`Rate limit exceeded. Try again in ${windowSeconds} seconds.`)
        }

        // Increment count
        // Note: This is not atomic in the memory fallback, but sufficient for MVP.
        // In Redis, we would use INCR and EXPIRE.
        await cache.set(cacheKey, current + 1, windowSeconds)
    },

    /**
     * Middleware helper to get IP from request
     */
    getIp(req: any): string {
        return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    }
}
