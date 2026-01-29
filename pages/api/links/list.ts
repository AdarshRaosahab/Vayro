import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'GET') {
        throw new AppError('Method not allowed', 405)
    }

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

    const links = await db.link.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { clickEvents: true }
            }
        }
    })

    const linksWithCounts = links.map((link: any) => ({
        ...link,
        clicks_count: link._count.clickEvents
    }))

    res.status(200).json({ ok: true, links: linksWithCounts })
})
