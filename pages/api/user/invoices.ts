import { apiHandler } from '../../../lib/api-wrapper'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'GET') {
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

    // Mock invoices
    const invoices = [
        {
            id: 'inv_123',
            date: new Date().toISOString(),
            amount: 9.99,
            currency: 'USD',
            status: 'paid',
            downloadUrl: '#'
        }
    ]

    res.status(200).json({ ok: true, invoices })
})
