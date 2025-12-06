import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { secret } = req.query

    if (secret !== 'vayro-admin-2024') {
        return res.status(403).json({ message: 'Forbidden: Invalid Secret' })
    }

    try {
        const email = 'adarshyadav8368@zohomail.in'

        // precise update
        const user = await db.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        })

        return res.status(200).json({
            message: 'SUCCESS! You are now an Admin.',
            user: {
                email: user.email,
                role: user.role,
                name: user.displayName
            },
            nextStep: 'Go to /admin/dashboard'
        })
    } catch (error: any) {
        console.error("Admin Setup Error:", error)
        return res.status(500).json({
            message: 'Error updating user. Does the user exist?',
            error: error.message
        })
    }
}
