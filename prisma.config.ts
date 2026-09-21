import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

// Manually load .env file
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
<<<<<<< HEAD
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;
    const [key, ...value] = trimmedLine.split("=");
    if (key && value.length > 0) {
      const rawVal = value.join("=").trim();
      process.env[key.trim()] = rawVal.replace(/^["']|["']$/g, "");
=======
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...value] = trimmed.split("=");
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, "");
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
    }
  });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
<<<<<<< HEAD
    url: process.env.DATABASE_URL ?? "postgresql://postgres:1921@localhost:5432/digitalmenu?schema=public",
=======
    url: process.env.DATABASE_URL ?? "postgresql://postgres:1921@localhost:5432/aroma_restaurant_menu",
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
  },
});
