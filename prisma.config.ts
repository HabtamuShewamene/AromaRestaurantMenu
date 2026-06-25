import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

// Manually load .env file
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...value] = line.split("=");
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join("=").trim();
    }
  });
}

export default defineConfig({
  schema: "database/prisma/schema.prisma",
  migrations: {
    path: "database/prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:1234@localhost:5432/elite_cafe_menu",
  },
});
