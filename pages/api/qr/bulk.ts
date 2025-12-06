import { apiHandler } from '../../../lib/api-wrapper'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'
import QRCode from 'qrcode'

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

    // Check premium status (simplified)
    if (session.user.plan !== 'premium' && session.user.role !== 'ADMIN') {
        throw new AppError('Bulk QR generation is a premium feature', 403)
    }

    const { codes } = req.body
    if (!Array.isArray(codes) || codes.length === 0) {
        throw new AppError('No codes provided', 400)
    }

    if (codes.length > 50) {
        throw new AppError('Too many codes (max 50)', 400)
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vayro.in'

    const results = await Promise.all(
        codes.map(async (code) => {
            const url = `${baseUrl}/${code}`
            const dataUrl = await QRCode.toDataURL(url, {
                width: 256,
                margin: 1,
                color: {
                    dark: '#0A1A2F',
                    light: '#FFFFF0',
                },
            })
            return { code, dataUrl }
        })
    )

    res.status(200).json({ ok: true, results })
})
