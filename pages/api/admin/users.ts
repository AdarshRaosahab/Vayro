import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, getSessionIdFromRequest } from '../../../lib/sessions'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const sessionId = getSessionIdFromRequest(req)
        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const session = await getSession(sessionId)
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const admin = await db.user.findUnique({ where: { id: session.userId } })
        if (!admin || admin.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' })
        }

        const { q } = req.query

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Query parameter required' })
        }

        const users = await db.user.findMany({
            where: {
                email: {
                    contains: q,
                    // mode: 'insensitive' // SQLite doesn't support mode: insensitive, but Postgres does. 
                    // Since we switched to Postgres in schema, we can use it, but let's be safe and generic first or assume Postgres.
                    // The user's schema says provider = "sqlite" in the latest edit (Step 289), so I must respect that.
                    // SQLite 'contains' is case-insensitive by default for ASCII characters usually, but let's just use contains.
                }
            },
            take: 20,
            select: {
                id: true,
                email: true,
                displayName: true,
                plan: true,
                status: true,
                createdAt: true
            }
        })

        res.status(200).json({ users })
    } catch (error) {
        console.error('Admin user search error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
