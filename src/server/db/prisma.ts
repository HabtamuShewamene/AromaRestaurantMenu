import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error('DATABASE_URL is required');
}

const connectionString = rawConnectionString.replace(/^["']|["']$/g, '');
const adapter = new PrismaPg({ connectionString });

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // Avoid exhausting database connection limit during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient;
}
