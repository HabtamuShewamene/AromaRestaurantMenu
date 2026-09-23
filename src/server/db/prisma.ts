import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
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

let connectionString = rawConnectionString.replace(/^["']|["']$/g, '');
const isSupabase = connectionString.includes('supabase.com');

// The pg module crashes with self-signed certificate errors if sslmode=require is in the URL, 
// even if we provide ssl: { rejectUnauthorized: false } in the Pool config.
// We must strip it from the connection string and rely on the ssl object below.
connectionString = connectionString.replace(/[\?&]sslmode=require/, '');
if (connectionString.endsWith('?')) connectionString = connectionString.slice(0, -1);

const pool = new Pool({
  connectionString,
  ...(isSupabase && { ssl: { rejectUnauthorized: false } }),
});

const adapter = new PrismaPg(pool);

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;

declare global {
  var prisma: PrismaClient;
}

