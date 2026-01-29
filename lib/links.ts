import { db } from './db'
import { nanoid } from 'nanoid'

// Base62 characters for custom implementation if needed, but nanoid is sufficient for MVP
// const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export async function createLink(target: string, userId: string, customAlias?: string) {
    // Validate alias if provided
    if (customAlias) {
        const isValid = /^[a-zA-Z0-9-_]{3,30}$/.test(customAlias)
        if (!isValid) {
            throw new Error('Invalid alias. Must be 3-30 characters, alphanumeric, dashes, or underscores.')
        }

        const existing = await db.link.findUnique({ where: { code: customAlias } })
        if (existing) {
            throw new Error('Alias already taken.')
        }

        return db.link.create({
            data: {
                code: customAlias,
                target,
                userId,
            },
        })
    }

    // Generate unique code
    let code = nanoid(6)
    let retries = 0
    while (await db.link.findUnique({ where: { code } })) {
        code = nanoid(6)
        retries++
        if (retries > 5) throw new Error('Failed to generate unique code. Please try again.')
    }

    return db.link.create({
        data: {
            code,
            target,
            userId,
        },
    })
}

export async function getLinkByCode(code: string) {
    try {
        const link = await db.link.findUnique({
            where: { code },
            include: { user: true },
        })
        if (link) return link
    } catch (e) {
        console.warn("DB Read failed (getLinkByCode), checking Mock DB")
    }

    // Fallback to Mock DB
    const MOCK_DB = (global as any)._MOCK_LINKS || {}
    const mockData = MOCK_DB[code]
    if (mockData) {
        return {
            id: 'mock-id',
            code: code,
            target: mockData.target,
            userId: null,
            created: mockData.created || new Date(),
            clicks: 0,
            status: 'ACTIVE',
            user: null
        } as any // Cast to any to match Prisma Link type partially
    }

    return null
}

export async function validateAlias(alias: string) {
    if (!/^[a-zA-Z0-9-_]{3,30}$/.test(alias)) return false
    const existing = await db.link.findUnique({ where: { code: alias } })
    return !existing
}
