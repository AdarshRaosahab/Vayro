import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
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

    const { onboardCompleted } = req.body

    if (typeof onboardCompleted !== 'boolean') {
        throw new AppError('Invalid input', 400)
    }

    await db.user.update({
        where: { id: session.userId },
        data: { onboardCompleted },
    })

    res.status(200).json({ ok: true })
})
