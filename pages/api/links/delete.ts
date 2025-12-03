import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError, NotFoundError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const { id } = req.body
    if (!id) throw new AppError('Missing link ID', 400)

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

    // Verify ownership
    const link = await db.link.findUnique({ where: { id } })
    if (!link) throw new NotFoundError('Link not found')
    if (link.userId !== session.userId) throw new AuthError('Not authorized to delete this link')

    await db.link.delete({ where: { id } })

    res.status(200).json({ ok: true })
})
