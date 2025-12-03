import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        // Try to create a dummy user or just count users
        const count = await prisma.user.count();
        console.log(`Successfully connected! Found ${count} users.`);

        // Optional: Create a test user if empty (commented out to avoid clutter)
        /*
        const user = await prisma.user.create({
          data: {
            email: `test-${Date.now()}@example.com`,
            password: 'hashed-password',
            plan: 'free'
          }
        });
        console.log('Created test user:', user.id);
        */

    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
