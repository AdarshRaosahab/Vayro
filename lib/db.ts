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
                url: process.env.DATABASE_URL || 'file:./dev.db', // Fallback to prevent build crash if env is missing
            },
        },
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export const db = prisma
