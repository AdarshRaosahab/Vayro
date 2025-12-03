import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'GET') {
        throw new AuthError('Method not allowed')
    }

    // Check Admin Auth
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
    if (!session || session.user.role !== 'ADMIN') throw new AuthError('Admin access required')

    const reports = await db.abuseReport.findMany({
        include: {
            link: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            displayName: true,
                            status: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    res.status(200).json({ ok: true, reports })
})
