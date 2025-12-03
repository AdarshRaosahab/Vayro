import { cache } from './cache'

// In a real app, this would be backed by a DB table 'Blocklist'
const MOCK_BLOCKLIST = new Set([
    'malware.com',
    'phishing.site',
    'evil-corp.net'
])

export const blocklist = {
    async isBlocked(domain: string): Promise<boolean> {
        // Check cache first
        const cacheKey = `blocklist:${domain}`
        const cached = await cache.get<boolean>(cacheKey)
        if (cached !== null) return cached

        // Check "DB" (Mock)
        const isBlocked = MOCK_BLOCKLIST.has(domain)

        // Cache result for 1 hour
        await cache.set(cacheKey, isBlocked, 3600)

        return isBlocked
    },

    async add(domain: string) {
        MOCK_BLOCKLIST.add(domain)
        await cache.del(`blocklist:${domain}`)
    },

    async remove(domain: string) {
        MOCK_BLOCKLIST.delete(domain)
        await cache.del(`blocklist:${domain}`)
    }
}
