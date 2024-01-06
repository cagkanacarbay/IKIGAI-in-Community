// testDbConnection.ts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    // Perform a simple query - for example, count the records in the user table
    const count = await prisma.user.count();
    console.log(`Number of users in the database: ${count}`);

    // If successful, close the connection
    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

testDbConnection();
