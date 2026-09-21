import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

// Manually load .env file
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;
    const [key, ...value] = trimmedLine.split("=");
    if (key && value.length > 0) {
      const rawVal = value.join("=").trim();
      process.env[key.trim()] = rawVal.replace(/^["']|["']$/g, "");
    }
  });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:1921@localhost:5432/digitalmenu?schema=public",
  },
});
