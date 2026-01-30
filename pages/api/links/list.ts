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

    let links = [];
    try {
        links = await db.link.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { clickEvents: true }
                }
            }
        })
    } catch (e) {
        console.warn("DB Connection failed (list), using Mock Data");
        // Fallback to Mock Data
        const MOCK_DB = (global as any)._MOCK_LINKS || {};
        // Convert map object to array
        links = Object.values(MOCK_DB).map((l: any) => ({
            id: 'mock-id', // dummy ID
            code: Object.keys(MOCK_DB).find(key => MOCK_DB[key] === l) || 'unknown',
            target: l.target,
            userId: session.userId,
            createdAt: l.created || new Date(),
            clicks: 0,
            note: 'Mock Link',
            _count: { clickEvents: 0 }
        }));
    }

    const linksWithCounts = links.map((link: any) => ({
        ...link,
        clicks_count: link._count ? link._count.clickEvents : 0
    }))

    res.status(200).json({ ok: true, links: linksWithCounts })
})
