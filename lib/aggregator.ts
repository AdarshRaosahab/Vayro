import { db } from './db'
import { cache } from './cache'

export const aggregator = {
    /**
     * Computes daily click counts for a link and caches the result.
     * This is a heavy operation intended to be run by a background job.
     */
    async computeDailyAggregates(linkId: string, from: Date, to: Date) {
        // 1. Check cache first (optional, but good for frequent re-runs)
        const cacheKey = `agg:daily:${linkId}:${from.toISOString().split('T')[0]}`
        const cached = await cache.get(cacheKey)
        if (cached) return cached

        // 2. Heavy DB Query
        const clicks = await db.clickEvent.count({
            where: {
                linkId,
                createdAt: {
                    gte: from,
                    lte: to,
                },
            },
        })

        // 3. Store result (e.g., in a separate 'AnalyticsAggregate' table or just cache)
        // For this MVP, we'll just cache it for 24 hours
        await cache.set(cacheKey, clicks, 86400)

        return clicks
    },

    /**
     * Aggregates all links for a user (e.g. for a weekly report)
     */
    async aggregateUserStats(userId: string) {
        const links = await db.link.findMany({
            where: { userId },
            select: { id: true }
        })

        let totalClicks = 0
        for (const link of links) {
            const count = await db.clickEvent.count({ where: { linkId: link.id } })
            totalClicks += count
        }

        return { totalClicks, linkCount: links.length }
    }
}
