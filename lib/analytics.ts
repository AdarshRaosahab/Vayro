import { db } from './db'
import { IncomingMessage } from 'http'
import crypto from 'crypto'

export async function recordEvent(linkId: string, req: IncomingMessage) {
    try {
        const userAgent = req.headers['user-agent'] || 'unknown'
        const referrer = (req.headers['referer'] as string) || 'direct'
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
        const locale = (req.headers['accept-language'] as string)?.split(',')[0] || 'unknown'

        // Simple device detection
        let device = 'desktop'
        if (/mobile/i.test(userAgent)) device = 'mobile'
        else if (/tablet|ipad/i.test(userAgent)) device = 'tablet'

        // Simple browser detection
        let browser = 'other'
        if (/chrome/i.test(userAgent)) browser = 'chrome'
        else if (/firefox/i.test(userAgent)) browser = 'firefox'
        else if (/safari/i.test(userAgent)) browser = 'safari'
        else if (/edge/i.test(userAgent)) browser = 'edge'

        // Anonymize IP
        const ipHash = crypto
            .createHmac('sha256', process.env.SESSION_SECRET || 'secret')
            .update(Array.isArray(ip) ? ip[0] : ip)
            .digest('hex')

        // In a real production app with high volume, we would push this to Redis.
        // For MVP/Local, we write directly to DB.
        if (process.env.REDIS_URL) {
            // TODO: Implement Redis stream push
            // await redis.xadd('events', '*', 'linkId', linkId, 'data', JSON.stringify({...}))
            // For now, fallback to DB even if Redis is set, to keep it simple.
        }

        await db.clickEvent.create({
            data: {
                linkId,
                userAgent,
                referrer,
                ipHash,
                locale,
                device,
                browser,
                country: 'XX', // GeoIP lookup would happen here or in a background worker
            },
        })
    } catch (error) {
        console.error('Failed to record analytics event:', error)
        // Fail silently to not block redirect
    }
}

export async function getLinkStats(linkId: string) {
    const clicks = await db.clickEvent.findMany({
        where: { linkId },
        orderBy: { createdAt: 'desc' },
    })

    const totalClicks = clicks.length

    // Last 30 days timeseries
    const days = 30
    const timeseries = new Array(days).fill(0).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return { date: d.toISOString().split('T')[0], count: 0 }
    }).reverse()

    clicks.forEach(click => {
        const date = click.createdAt.toISOString().split('T')[0]
        const entry = timeseries.find(t => t.date === date)
        if (entry) entry.count++
    })

    // Top Countries
    const countryMap = new Map<string, number>()
    clicks.forEach(c => {
        const country = c.country || 'Unknown'
        countryMap.set(country, (countryMap.get(country) || 0) + 1)
    })
    const topCountries = Array.from(countryMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

    // Top Devices
    const deviceMap = new Map<string, number>()
    clicks.forEach(c => {
        const device = c.device || 'Unknown'
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    })
    const topDevices = Array.from(deviceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

    // Top Referrers
    const referrerMap = new Map<string, number>()
    clicks.forEach(c => {
        const ref = c.referrer || 'Direct'
        referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1)
    })
    const topReferrers = Array.from(referrerMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

    return {
        totalClicks,
        timeseries,
        topCountries,
        topDevices,
        topReferrers
    }
}
