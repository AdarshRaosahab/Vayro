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

        // Get User Session
        const cookieHeader = req.headers.cookie
        let userId: string | undefined

        if (cookieHeader) {
            const cookies: { [key: string]: string } = {}
            cookieHeader.split(';').forEach((cookie) => {
                const parts = cookie.split('=')
                if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
            })
            const sessionId = cookies['vayro_session']
            if (sessionId) {
                // We need to import getSession or just query db directly since we are in API
                // Let's query directly to avoid circular deps or just use the session table
                const session = await prisma.session.findUnique({
                    where: { id: sessionId },
                    select: { userId: true, expiresAt: true }
                })
                if (session && session.expiresAt > new Date()) {
                    userId = session.userId
                }
            }
        }

        // Check for duplicate report
        if (userId) {
            const existingReport = await prisma.abuseReport.findUnique({
                where: {
                    linkId_userId: {
                        linkId: link.id,
                        userId: userId
                    }
                }
            })
            if (existingReport) {
                return res.status(400).json({ message: 'You have already reported this link.' })
            }
        } else {
            // Optional: Check by IP for anonymous users to prevent spam
            // For now, we'll just allow it but maybe limit by IP in the future
        }

        // Create abuse report
        await prisma.abuseReport.create({
            data: {
                linkId: link.id,
                reason,
                ip: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown',
                userId: userId
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
