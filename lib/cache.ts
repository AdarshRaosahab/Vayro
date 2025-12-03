// Simple cache wrapper. 
// In a real production environment, you would use Redis.
// For this demo/local dev, we'll use an in-memory Map or a lightweight library if available.
// To use Redis, install 'ioredis' and set REDIS_URL env var.

let redisClient: any = null

if (process.env.REDIS_URL) {
    try {
        // Dynamic import to avoid build errors if ioredis is not installed
        // const Redis = require('ioredis')
        // redisClient = new Redis(process.env.REDIS_URL)
        console.log('Redis enabled (mock)')
    } catch (e) {
        console.warn('Redis not found, falling back to memory cache')
    }
}

const memoryCache = new Map<string, { value: any; expiry: number }>()

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        if (redisClient) {
            const val = await redisClient.get(key)
            return val ? JSON.parse(val) : null
        }

        const item = memoryCache.get(key)
        if (!item) return null
        if (Date.now() > item.expiry) {
            memoryCache.delete(key)
            return null
        }
        return item.value as T
    },

    async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
        if (redisClient) {
            await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds)
            return
        }

        memoryCache.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
        })
    },

    async del(key: string): Promise<void> {
        if (redisClient) {
            await redisClient.del(key)
            return
        }
        memoryCache.delete(key)
    },
}
