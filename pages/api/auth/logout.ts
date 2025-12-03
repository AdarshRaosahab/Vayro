import { apiHandler } from '../../../lib/api-wrapper'
import { clearSessionCookie, deleteSession, getSession } from '../../../lib/sessions'
import { AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const cookieHeader = req.headers.cookie
    if (cookieHeader) {
        const cookies: { [key: string]: string } = {}
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=')
            if (parts.length === 2) {
                cookies[parts[0].trim()] = parts[1].trim()
            }
        })

        const sessionId = cookies['vayro_session']
        if (sessionId) {
            await deleteSession(sessionId)
        }
    }

    clearSessionCookie(res)

    // Clear UI cookie
    res.setHeader('Set-Cookie', [
        ...((res.getHeader('Set-Cookie') as string[]) || []),
        'vayro_auth_ui=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ])

    res.status(200).json({ ok: true })
})
