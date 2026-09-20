import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import fs from 'fs';
import path from 'path';

if (!process.env.DATABASE_URL) {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...value] = trimmed.split('=');
      if (key && value.length > 0) {
        process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

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
