import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { hashPassword } from '../../../lib/auth'
import { validateEmail, validatePassword } from '../../../lib/validators'
import { AppError, ValidationError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const { email, password, fullName } = req.body

    const validEmail = validateEmail(email)
    const validPassword = validatePassword(password)

    const existingUser = await db.user.findUnique({
        where: { email: validEmail },
    })

    if (existingUser) {
        throw new AppError('User already exists', 409)
    }

    const hashedPassword = await hashPassword(validPassword)

    const user = await db.user.create({
        data: {
            email: validEmail,
            password: hashedPassword,
            displayName: fullName,
        },
    })

    res.status(201).json({ ok: true, user: { id: user.id, email: user.email } })
})
