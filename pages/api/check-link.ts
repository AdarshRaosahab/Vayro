import { apiHandler } from '../../lib/api-wrapper'
import { db } from '../../lib/db'
import { rateLimit } from '../../lib/rateLimit'
import { fraudPrevention } from '../../lib/fraudPrevention'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new Error('Method not allowed')
    }

    const ip = rateLimit.getIp(req)
    await rateLimit.check(ip, { limit: 30, windowSeconds: 60 })

    const { url } = req.body

    if (!url) {
        throw new Error('URL is required')
    }

    // Extract code from URL (e.g., vayro.io/abc -> abc)
    // Supports full URL or just the code
    let code = url.trim()
    try {
        const urlObj = new URL(url)
        const path = urlObj.pathname.replace(/^\/+/, '') // Remove leading slashes
        code = path.split('/')[0] // Get the first segment
    } catch (e) {
        // If not a valid URL, assume it's the code itself if it doesn't contain slashes
        if (code.includes('/')) {
            // Try to handle cases like "localhost:3000/abc" without protocol
            const parts = code.split('/')
            code = parts[parts.length - 1]
        }
    }

    if (!code) {
        throw new Error('Invalid link format')
    }

    let link = await db.link.findUnique({
        where: { code },
        select: {
            id: true,
            code: true,
            target: true,
            status: true,
            reports: true,
            createdAt: true,
            userId: true,
        }
    })

    if (!link) {
        return res.status(404).json({ ok: false, message: 'Link not found' })
    }

    // Perform fresh safety check if not already banned
    if (link.status !== 'BANNED') {
        const fraudCheck = fraudPrevention.isSuspicious(link.target)
        if (fraudCheck.isSuspicious) {
            // Auto-ban the link
            link = await db.link.update({
                where: { id: link.id },
                data: { status: 'BANNED' },
                select: {
                    id: true,
                    code: true,
                    target: true,
                    status: true,
                    reports: true,
                    createdAt: true,
                    userId: true,
                }
            })

            // Check for account suspension
            if (link.userId) {
                const bannedCount = await db.link.count({
                    where: {
                        userId: link.userId,
                        status: 'BANNED',
                    },
                })

                if (bannedCount >= 5) {
                    const userToSuspend = await db.user.findUnique({
                        where: { id: link.userId },
                        select: { role: true }
                    })

                    if (userToSuspend && userToSuspend.role !== 'ADMIN') {
                        await db.user.update({
                            where: { id: link.userId },
                            data: { status: 'SUSPENDED' },
                        })
                    }
                }
            }
        }
    }

    res.status(200).json({ ok: true, link })
})
