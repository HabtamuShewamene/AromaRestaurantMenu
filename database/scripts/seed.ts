import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Manually load .env file
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...value] = trimmed.split("=");
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
}

const rawConnectionString = process.env.DATABASE_URL;
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const connectionString = rawConnectionString.replace(/^["']|["']$/g, "");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Aroma Restaurant database seed...");

  // 1. Clean existing records
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.foodIngredient.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const hashedPassword = await bcrypt.hash("Admin@123", 10);
  const clientPassword = await bcrypt.hash("Client@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Aroma Admin",
      email: "admin@aroma.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "client@aroma.com",
      password: clientPassword,
      role: "CLIENT",
    },
  });

  console.log(`👤 Created Admin: ${admin.email} (Password: Admin@123)`);
  console.log(`👤 Created Client: ${client.email} (Password: Client@123)`);

  // 3. Create Ingredients
  const coffeeBeans = await prisma.ingredient.create({
    data: { name: "Arabica Coffee Beans", unit: "kg", currentStock: 25.0, minimumStock: 5.0 },
  });
  const milk = await prisma.ingredient.create({
    data: { name: "Organic Whole Milk", unit: "liters", currentStock: 50.0, minimumStock: 10.0 },
  });
  const oatMilk = await prisma.ingredient.create({
    data: { name: "Barista Oat Milk", unit: "liters", currentStock: 30.0, minimumStock: 8.0 },
  });
  const matchaPowder = await prisma.ingredient.create({
    data: { name: "Ceremonial Grade Matcha", unit: "kg", currentStock: 8.0, minimumStock: 2.0 },
  });
  const butter = await prisma.ingredient.create({
    data: { name: "French Butter", unit: "kg", currentStock: 20.0, minimumStock: 4.0 },
  });
  const chocolate = await prisma.ingredient.create({
    data: { name: "Belgian Dark Chocolate", unit: "kg", currentStock: 15.0, minimumStock: 3.0 },
  });

  console.log("📦 Created raw inventory ingredients");

  // 4. Create Categories
  const catCoffee = await prisma.category.create({
    data: {
      name: "Artisan Coffee",
      slug: "artisan-coffee",
      description: "Hand-crafted specialty espresso and pour-over roasts",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      orderIndex: 1,
    },
  });

  const catTea = await prisma.category.create({
    data: {
      name: "Specialty Tea & Matcha",
      slug: "specialty-tea-matcha",
      description: "Carefully sourced loose leaves and ceremonial teas",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
      orderIndex: 2,
    },
  });

  const catPastries = await prisma.category.create({
    data: {
      name: "Bakery & Pastries",
      slug: "bakery-pastries",
      description: "Freshly baked artisan croissants and desserts",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      orderIndex: 3,
    },
  });

  console.log("📂 Created menu categories");

  // 5. Create Menu Items + Recipes
  const espresso = await prisma.menuItem.create({
    data: {
      name: "Signature Double Espresso",
      categoryId: catCoffee.id,
      price: 4.5,
      description: "Rich, velvety double shot with notes of caramelized dark cocoa and roasted hazelnut.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: true,
      allergens: [],
      rating: 4.9,
      isAvailable: true,
      viewCount: 142,
      ingredients: {
        create: [{ ingredientId: coffeeBeans.id, quantity: 0.02 }],
      },
    },
  });

  const cappuccino = await prisma.menuItem.create({
    data: {
      name: "Velvet Cappuccino",
      categoryId: catCoffee.id,
      price: 5.75,
      description: "Silky micro-foam poured over our rich signature espresso with a dusted cinnamon finish.",
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Dairy"],
      rating: 4.8,
      isAvailable: true,
      viewCount: 98,
      ingredients: {
        create: [
          { ingredientId: coffeeBeans.id, quantity: 0.02 },
          { ingredientId: milk.id, quantity: 0.2 },
        ],
      },
    },
  });

  const matchaLatte = await prisma.menuItem.create({
    data: {
      name: "Ceremonial Oat Matcha Latte",
      categoryId: catTea.id,
      price: 6.5,
      description: "First-harvest Uji ceremonial matcha whisked with creamy steamed barista oat milk.",
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: false,
      allergens: ["Oats"],
      rating: 4.9,
      isAvailable: true,
      viewCount: 85,
      ingredients: {
        create: [
          { ingredientId: matchaPowder.id, quantity: 0.005 },
          { ingredientId: oatMilk.id, quantity: 0.25 },
        ],
      },
    },
  });

  const croissant = await prisma.menuItem.create({
    data: {
      name: "Pain au Chocolat",
      categoryId: catPastries.id,
      price: 4.95,
      description: "Flaky, multi-layered French pastry stuffed with rich Belgian bittersweet dark chocolate.",
      image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Gluten", "Dairy"],
      rating: 4.7,
      isAvailable: true,
      viewCount: 120,
      ingredients: {
        create: [
          { ingredientId: butter.id, quantity: 0.05 },
          { ingredientId: chocolate.id, quantity: 0.03 },
        ],
      },
    },
  });

  console.log("🍽️ Created sample menu items with recipes");

  // 6. Create Approved Sample Reviews
  await prisma.review.create({
    data: {
      itemId: espresso.id,
      userId: client.id,
      name: "Sophia Martinez",
      email: "sophia@example.com",
      rating: 5,
      comment: "Best espresso in town! The crema and flavor profile are exceptional.",
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      itemId: matchaLatte.id,
      name: "David Kim",
      email: "david@example.com",
      rating: 5,
      comment: "Smooth, authentic matcha flavor. Love that oat milk is standard!",
      isApproved: true,
    },
  });

  console.log("⭐ Created sample reviews");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
