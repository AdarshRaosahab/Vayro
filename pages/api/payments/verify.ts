import { apiHandler } from '../../../lib/api-wrapper'
import { verifySignature } from '../../../lib/payments'
import { AppError, PaymentError } from '../../../lib/errors'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const { orderId, paymentId, signature } = req.body

    const isValid = verifySignature(orderId, paymentId, signature)

    if (!isValid) {
        throw new PaymentError('Invalid payment signature')
    }

    // Upgrade user to premium
    // We need the userId. Ideally, it should be in the session or passed in the body (and verified).
    // Since this is a protected API route (we should check session), we can get userId from session.
    const cookieHeader = req.headers.cookie
    if (cookieHeader) {
        const cookies: { [key: string]: string } = {}
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=')
            if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
        })
        const sessionId = cookies['vayro_session']
        if (sessionId) {
            const session = await getSession(sessionId)
            if (session) {
                await db.user.update({
                    where: { id: session.userId },
                    data: { plan: 'premium' }
                })
            }
        }
    }

    res.status(200).json({ ok: true, verified: true })
})
