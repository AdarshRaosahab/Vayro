import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError, NotFoundError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const { linkId } = req.body
    if (!linkId) throw new AppError('Missing link ID', 400)

    // Auth check
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) throw new AuthError()

    const cookies: { [key: string]: string } = {}
    cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=')
        if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
    })

    const sessionId = cookies['vayro_session']
    if (!sessionId) throw new AuthError()

    const session = await getSession(sessionId)
    if (!session) throw new AuthError()

    const link = await db.link.findUnique({ where: { id: linkId } })
    if (!link) throw new NotFoundError('Link not found')
    if (link.userId !== session.userId) throw new AuthError('Not authorized')

    const totalClicks = await db.clickEvent.count({ where: { linkId } })

    // Premium Gate: Limit history for free users
    const isPremium = session.user.plan === 'premium' || session.user.role === 'ADMIN'
    const days = isPremium ? 30 : 7

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    // Fetch clicks
    const clicks = await db.clickEvent.findMany({
        where: {
            linkId,
            createdAt: {
                gte: startDate,
            },
        },
        select: {
            createdAt: true,
            country: true,
            device: true,
        },
    })

    // Aggregate Timeseries
    const timeseriesMap = new Map<string, number>()
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        timeseriesMap.set(d.toISOString().split('T')[0], 0)
    }

    clicks.forEach((click: any) => {
        const date = click.createdAt.toISOString().split('T')[0]
        if (timeseriesMap.has(date)) {
            timeseriesMap.set(date, (timeseriesMap.get(date) || 0) + 1)
        }
    })

    const timeseries = Array.from(timeseriesMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

    // Aggregate Top Countries
    const countryMap = new Map<string, number>()
    clicks.forEach((click: any) => {
        const c = click.country || 'Unknown'
        countryMap.set(c, (countryMap.get(c) || 0) + 1)
    })
    const topCountries = Array.from(countryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // Aggregate Top Devices
    const deviceMap = new Map<string, number>()
    clicks.forEach((click: any) => {
        const d = click.device || 'Unknown'
        deviceMap.set(d, (deviceMap.get(d) || 0) + 1)
    })
    const topDevices = Array.from(deviceMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    const stats = {
        code: link.code,
        totalClicks,
        isPremium,
        timeseries,
        topCountries,
        topDevices
    }

    res.status(200).json({ ok: true, stats })
})
