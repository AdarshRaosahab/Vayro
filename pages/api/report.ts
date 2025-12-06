import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { url, reason } = req.body

    if (!url || !reason) {
        return res.status(400).json({ message: 'Missing URL or reason' })
    }

    try {
        // Extract code from URL (e.g., http://localhost:3000/abc -> abc)
        const code = url.split('/').pop()

        const link = await prisma.link.findUnique({
            where: { code },
        })

        if (!link) {
            return res.status(404).json({ message: 'Link not found' })
        }

        // Simpler Logic due to DB Limitations (userId removed from AbuseReport)
        // Original logic checked for logged-in user to prevent duplicates.
        // We removed this because the PROD database doesn't have the column.

        // Optional: Check by IP for anonymous users to prevent spam
        // For now, we'll just allow it but maybe limit by IP in the future

        // Create abuse report
        await prisma.abuseReport.create({
            data: {
                linkId: link.id,
                reason,
                ip: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown',
                // userId: userId // Field removed from DB schema
            },
        })

        // Increment report count
        const updatedLink = await prisma.link.update({
            where: { id: link.id },
            data: {
                reports: { increment: 1 },
            },
        })

        // Auto-ban logic: If reports >= 2, ban the link
        if (updatedLink.reports >= 2) {
            const bannedLink = await prisma.link.update({
                where: { id: link.id },
                data: { status: 'BANNED' },
            })

            // Account Suspension Logic
            if (bannedLink.userId) {
                const bannedCount = await prisma.link.count({
                    where: {
                        userId: bannedLink.userId,
                        status: 'BANNED',
                    },
                })

                if (bannedCount >= 5) {
                    const userToSuspend = await prisma.user.findUnique({
                        where: { id: bannedLink.userId },
                        select: { role: true }
                    })

                    if (userToSuspend && userToSuspend.role !== 'ADMIN') {
                        await prisma.user.update({
                            where: { id: bannedLink.userId },
                            data: { status: 'SUSPENDED' },
                        })
                    }
                }
            }
        }

        return res.status(200).json({ message: 'Report submitted successfully' })
    } catch (error) {
        console.error('Report error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
