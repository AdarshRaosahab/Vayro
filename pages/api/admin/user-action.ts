import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, getSessionIdFromRequest } from '../../../lib/sessions'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
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

        const { userId, action } = req.body

        if (!userId || !action) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        let updateData = {}
        if (action === 'suspend') {
            updateData = { status: 'SUSPENDED' }
        } else if (action === 'unsuspend') {
            updateData = { status: 'ACTIVE' }
        } else {
            return res.status(400).json({ message: 'Invalid action' })
        }

        const targetUser = await db.user.findUnique({ where: { id: userId } })

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (targetUser.role === 'ADMIN' && action === 'suspend') {
            return res.status(403).json({ message: 'Cannot suspend an admin account' })
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, email: true, status: true }
        })

        res.status(200).json({ ok: true, user: updatedUser })
    } catch (error) {
        console.error('Admin user action error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
