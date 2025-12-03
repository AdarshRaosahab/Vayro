import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, ValidationError, AppError } from '../../../lib/errors'
import { validateURL, validateAlias } from '../../../lib/validators'
import { rateLimit } from '../../../lib/rateLimit'
import { urlSafety } from '../../../lib/urlSafety'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AuthError('Method not allowed')
    }

    const ip = rateLimit.getIp(req)
    await rateLimit.check(ip, { limit: 10, windowSeconds: 60 })

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

    const { id, target, code, note } = req.body

    if (!id) throw new ValidationError('Link ID is required')

    // Verify ownership
    const link = await db.link.findUnique({ where: { id } })
    if (!link || link.userId !== session.userId) {
        throw new AuthError('Link not found or unauthorized')
    }

    // Check for premium status
    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (user?.plan !== 'premium' && user?.role !== 'ADMIN') {
        throw new AppError('Editing links is a premium feature', 403)
    }

    const validTarget = target ? validateURL(target) : undefined
    const validCode = code ? validateAlias(code) : undefined

    if (validTarget) {
        const isSafe = await urlSafety.isSafe(validTarget)
        if (!isSafe) {
            throw new AppError('Unsafe URL detected', 400)
        }
    }

    if (validCode && validCode !== link.code) {
        const existing = await db.link.findUnique({ where: { code: validCode } })
        if (existing) throw new ValidationError('Alias already taken')
    }

    const updated = await db.link.update({
        where: { id },
        data: {
            target: validTarget || undefined,
            code: validCode || undefined,
            note: note !== undefined ? note : undefined
        },
    })

    res.status(200).json({ ok: true, link: updated })
})
