import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { createSession, setSessionCookie } from '../../../lib/sessions'
import { AuthError, RateLimitError } from '../../../lib/errors'
import { validateEmail, validatePassword } from '../../../lib/validators'
import { verifyPassword } from '../../../lib/auth'
import { rateLimit } from '../../../lib/rateLimit'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AuthError('Method not allowed')
    }

    const ip = rateLimit.getIp(req)
    await rateLimit.check(ip, { limit: 20, windowSeconds: 60 * 60 }) // 20 attempts per hour

    const { email, password } = req.body

    const validEmail = validateEmail(email)
    const validPassword = validatePassword(password)

    const user = await db.user.findUnique({
        where: { email: validEmail },
    })

    if (!user || !user.password) {
        throw new AuthError('Invalid email or password')
    }

    if (user.status === 'SUSPENDED') {
        throw new AuthError('Your account has been suspended due to security violations.')
    }

    const isValid = await verifyPassword(validPassword, user.password)

    if (!isValid) {
        throw new AuthError('Invalid email or password')
    }

    // Rate limit resets automatically via expiration

    const session = await createSession(user.id)
    // Set HttpOnly session cookie
    setSessionCookie(res, session.id)

    // Set UI cookie (non-HttpOnly) for frontend state
    res.setHeader('Set-Cookie', [
        ...((res.getHeader('Set-Cookie') as string[]) || []),
        'vayro_auth_ui=true; Path=/; Max-Age=2592000; SameSite=Lax'
    ])

    res.status(200).json({ ok: true, user: { id: user.id, email: user.email } })
})
