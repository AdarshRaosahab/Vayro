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

        const user = await db.user.findUnique({ where: { id: session.userId } })
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' })
        }

        // Fetch stats
        const totalUsers = await db.user.count()
        const totalLinks = await db.link.count()
        const totalClicks = await db.clickEvent.count()

        // Recent users
        const recentUsers = await db.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                displayName: true,
                plan: true,
                createdAt: true
            }
        })

        res.status(200).json({
            stats: {
                totalUsers,
                totalLinks,
                totalClicks
            },
            recentUsers
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
