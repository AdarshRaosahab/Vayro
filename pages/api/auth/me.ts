import { apiHandler } from '../../../lib/api-wrapper'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'GET') {
        throw new AppError('Method not allowed', 405)
    }

    const cookieHeader = req.headers.cookie
    if (!cookieHeader) {
        throw new AuthError('Not authenticated')
    }

    const cookies: { [key: string]: string } = {}
    cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=')
        if (parts.length === 2) {
            cookies[parts[0].trim()] = parts[1].trim()
        }
    })

    const sessionId = cookies['vayro_session']
    if (!sessionId) {
        throw new AuthError('Not authenticated')
    }

    const session = await getSession(sessionId)
    if (!session) {
        throw new AuthError('Invalid session')
    }

    res.status(200).json({
        ok: true,
        user: {
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.displayName,
            plan: session.user.plan,
            role: session.user.role,
            onboardCompleted: session.user.onboardCompleted,
        },
    })
})
