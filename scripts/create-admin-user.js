const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Append ?pgbouncer=true to the connection string to avoid prepared statement errors with Supabase Transaction Pooler
const connectionString = process.env.DATABASE_URL.includes('?')
    ? `${process.env.DATABASE_URL}&pgbouncer=true`
    : `${process.env.DATABASE_URL}?pgbouncer=true`

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
})

async function main() {
    const email = 'admin@vayro.in'
    const password = 'adminpassword123'
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            console.log(`User ${email} already exists. Updating role to ADMIN...`)
            await prisma.user.update({
                where: { email },
                data: {
                    role: 'ADMIN',
                    password: hashedPassword
                }
            })
        } else {
            console.log(`Creating new admin user ${email}...`)
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    plan: 'premium'
                }
            })
        }
        console.log(`Admin user ready: ${email} / ${password}`)
    } catch (error) {
        console.error('Error creating admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
