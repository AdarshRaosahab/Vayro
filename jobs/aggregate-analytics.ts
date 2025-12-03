import { db } from '../lib/db'
import { aggregator } from '../lib/aggregator'

async function run() {
    console.log('Starting analytics aggregation job...')
    const start = Date.now()

    try {
        // 1. Get all active links (in batches in a real app)
        const links = await db.link.findMany({ select: { id: true } })
        console.log(`Found ${links.length} links to process.`)

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

        const endOfYesterday = new Date(yesterday)
        endOfYesterday.setHours(23, 59, 59, 999)

        // 2. Compute aggregates for each
        for (const link of links) {
            await aggregator.computeDailyAggregates(link.id, yesterday, endOfYesterday)
        }

        console.log(`Aggregation complete in ${Date.now() - start}ms`)
    } catch (err) {
        console.error('Aggregation job failed:', err)
        process.exit(1)
    }
}

// Execute if run directly
if (require.main === module) {
    run()
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
}
