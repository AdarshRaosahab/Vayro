import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession, getSessionIdFromRequest } from '../../../lib/sessions'
import { AppError, AuthError, ValidationError } from '../../../lib/errors'
import { verifyPassword, hashPassword } from '../../../lib/auth'
import { validatePassword } from '../../../lib/validators'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) throw new AuthError()

    const session = await getSession(sessionId)
    if (!session) throw new AuthError()

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        throw new ValidationError('Missing required fields')
    }

    validatePassword(newPassword)

    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (!user || !user.password) throw new AuthError()

    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) throw new ValidationError('Incorrect current password')

    const hashedPassword = await hashPassword(newPassword)

    await db.user.update({
        where: { id: session.userId },
        data: { password: hashedPassword }
    })

    // Optional: Invalidate other sessions here if strict security is required

    res.status(200).json({ ok: true })
})
