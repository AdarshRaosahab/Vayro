import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query'],
        datasources: {
            db: {
                url: (() => {
                    const url = process.env.DATABASE_URL
                    if (!url) return 'file:./dev.db'
                    // For Supabase Transaction Pooler (port 6543)
                    if (url.includes('pooler.supabase.com') && !url.includes('pgbouncer=true')) {
                        return url.includes('?') ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`
                    }
                    return url
                })(),
            },
        },
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export const db = prisma
