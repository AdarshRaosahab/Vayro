import { apiHandler } from '../../../../lib/api-wrapper'
import { db } from '../../../../lib/db'
import { getSession } from '../../../../lib/sessions'
import { AppError, AuthError } from '../../../../lib/errors'

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

    // In a real app, call Razorpay/Stripe API to cancel subscription
    // For now, just revert plan to free immediately (or set a 'cancelsAt' flag)

    await db.user.update({
        where: { id: session.userId },
        data: { plan: 'free' } // Simplified: immediate downgrade
    })

    res.status(200).json({ ok: true, cancelled: true })
})
