import { apiHandler } from '../../../lib/api-wrapper'
import { getSession } from '../../../lib/sessions'
import { AppError, AuthError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

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

    const { marketingEmails } = req.body

    // Since we don't have a preferences field in DB yet, we'll just log it
    // In a real app, update db.user.preferences or similar
    console.log(`Updated preferences for user ${session.userId}:`, { marketingEmails })

    res.status(200).json({ ok: true })
})
