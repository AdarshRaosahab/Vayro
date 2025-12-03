import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './db'

export async function getUserFromRequest(req: NextApiRequest) {
    // For MVP, we check for a mock session cookie 'vayro-session'
    // In a real app, this would verify a JWT or session ID
    const cookies = req.cookies
    const sessionToken = cookies['vayro-session']

    if (!sessionToken) {
        return null
    }

    // For MVP, we assume if the cookie exists, it's valid and belongs to the first user
    // or a specific user if we encoded it.
    // Let's just fetch the first user for now to keep it simple but functional for the demo.
    // In a real implementation, verify(sessionToken) -> userId

    const user = await db.user.findFirst()
    return user
}

export function withSession(handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void> | void) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const user = await getUserFromRequest(req)

        if (!user) {
            return res.status(401).json({ ok: false, error: 'Unauthorized' })
        }

        return handler(req, res, user)
    }
}
