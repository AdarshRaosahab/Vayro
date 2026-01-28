const { PrismaClient } = require('@prisma/client');

// Hardcoded connection string for testing (using the one we think is correct)
// We use port 5432 for local testing as it usually works better locally
const connectionString = 'postgresql://postgres.tshnyrvkvnhlbzwuxcxc:VayroSecure2024@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

console.log('Testing connection to:', connectionString.replace(/:[^:]*@/, ':****@')); // Hide password in logs

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString,
        },
    },
});

async function main() {
    try {
        console.log('Attempting to connect...');
        const count = await prisma.user.count();
        console.log('✅ SUCCESS! Connected to database.');
        console.log(`Found ${count} users.`);
    } catch (e) {
        console.error('❌ FAILED to connect.');
        console.error('Error message:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
