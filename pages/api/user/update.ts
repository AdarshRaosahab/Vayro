import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession, getSessionIdFromRequest } from '../../../lib/sessions'
import { AppError, AuthError } from '../../../lib/errors'
import { validateURL } from '../../../lib/validators'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) throw new AuthError()

    const session = await getSession(sessionId)
    if (!session) throw new AuthError()

    const { displayName, website } = req.body

    // Validation
    if (website) validateURL(website)

    const updatedUser = await db.user.update({
        where: { id: session.userId },
        data: {
            displayName: displayName || undefined,
            website: website || undefined,
        },
        select: {
            id: true,
            email: true,
            displayName: true,
            website: true,
            plan: true,
        }
    })

    res.status(200).json({ ok: true, user: updatedUser })
})
