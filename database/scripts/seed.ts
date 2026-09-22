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
  console.log("🌱 Starting Aroma Restaurant Phase 1 database seed...");

  // 1. Clean existing records in correct order
  await prisma.waiterRequest.deleteMany({});

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.tableSession.deleteMany({});
  await prisma.diningTable.deleteMany({});

  await prisma.review.deleteMany({});
  await prisma.foodIngredient.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Restaurant profile
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Aroma Restaurant",
      description: "Fine Dining, Artisan Coffee & Gourmet Culinary Craftsmanship",
      coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85",
      phone: "+1 (555) 342-7662",
      email: "contact@aromarestaurant.com",
      address: "450 Grand Avenue, Financial District",
      openingTime: "08:00 AM",
      closingTime: "11:30 PM",
      socialLinks: {
        instagram: "https://instagram.com/aroma_restaurant",
        facebook: "https://facebook.com/aroma_restaurant",
      },
    },
  });
  console.log(`🏛️ Created Restaurant: ${restaurant.name}`);

  // 3. Create Users (ADMIN and CUSTOMER only)
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Aroma General Manager",
      email: "admin@aroma.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Sophia Martinez",
      email: "customer@aroma.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log(`👤 Created Admin: ${admin.email} (Password: Admin@123)`);
  console.log(`👤 Created Customer: ${customer.email} (Password: Customer@123)`);

  // 4. Create Dining Tables (1 through 8)
  const tables = await Promise.all([
    prisma.diningTable.create({
      data: { number: 1, label: "Window Booth 1", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-1", qrCodeUrl: "/table/1" },
    }),
    prisma.diningTable.create({
      data: { number: 2, label: "Window Booth 2", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-2", qrCodeUrl: "/table/2" },
    }),
    prisma.diningTable.create({
      data: { number: 3, label: "Center Dining 3", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-3", qrCodeUrl: "/table/3" },
    }),
    prisma.diningTable.create({
      data: { number: 4, label: "Center Dining 4", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-4", qrCodeUrl: "/table/4" },
    }),
    prisma.diningTable.create({
      data: { number: 5, label: "Terrace Garden 5", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-5", qrCodeUrl: "/table/5" },
    }),
    prisma.diningTable.create({
      data: { number: 6, label: "Terrace Garden 6", capacity: 6, status: "AVAILABLE", qrIdentifier: "table-6", qrCodeUrl: "/table/6" },
    }),
    prisma.diningTable.create({
      data: { number: 7, label: "VIP Private Salon 7", capacity: 8, status: "AVAILABLE", qrIdentifier: "table-7", qrCodeUrl: "/table/7" },
    }),
    prisma.diningTable.create({
      data: { number: 8, label: "Chef's Counter 8", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-8", qrCodeUrl: "/table/8" },
    }),
  ]);
  console.log(`🪑 Created ${tables.length} dining tables with QR codes`);

  // 5. Create Ingredients
  const coffeeBeans = await prisma.ingredient.create({
    data: { name: "Arabica Reserve Coffee Beans", unit: "kg", currentStock: 30.0, minimumStock: 5.0 },
  });
  const milk = await prisma.ingredient.create({
    data: { name: "Organic Whole Milk", unit: "liters", currentStock: 60.0, minimumStock: 10.0 },
  });
  const oatMilk = await prisma.ingredient.create({
    data: { name: "Barista Oat Milk", unit: "liters", currentStock: 40.0, minimumStock: 8.0 },
  });
  const matchaPowder = await prisma.ingredient.create({
    data: { name: "Ceremonial Uji Matcha", unit: "kg", currentStock: 10.0, minimumStock: 2.0 },
  });
  const butter = await prisma.ingredient.create({
    data: { name: "French AOP Butter", unit: "kg", currentStock: 25.0, minimumStock: 4.0 },
  });
  const chocolate = await prisma.ingredient.create({
    data: { name: "Belgian 70% Dark Chocolate", unit: "kg", currentStock: 20.0, minimumStock: 3.0 },
  });
  console.log("📦 Created raw inventory ingredients");

  // 6. Create Categories
  const catCoffee = await prisma.category.create({
    data: {
      name: "Artisan Coffee",
      slug: "artisan-coffee",
      description: "Hand-crafted specialty espresso and single-origin roasts",
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
      description: "Freshly baked artisan croissants, pastries, and desserts",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      orderIndex: 3,
    },
  });

  console.log("📂 Created menu categories");

  // 7. Create Menu Items + Addon Groups + Recipes
  const espresso = await prisma.menuItem.create({
    data: {
      name: "Signature Double Espresso",
      categoryId: catCoffee.id,
      price: 4.5,
      description: "Rich, velvety double shot with notes of caramelized dark cocoa, roasted hazelnut, and citrus bloom.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: true,
      allergens: [],
      rating: 4.9,
      isAvailable: true,
      isFeatured: true,
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
      isFeatured: true,
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
      isFeatured: true,
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
      isFeatured: false,
      viewCount: 120,
      ingredients: {
        create: [
          { ingredientId: butter.id, quantity: 0.05 },
          { ingredientId: chocolate.id, quantity: 0.03 },
        ],
      },
    },
  });

  console.log("🍽️ Created dishes with customization add-ons & recipes");

  // 8. Create Approved Customer Reviews
  await prisma.review.create({
    data: {
      itemId: espresso.id,
      userId: customer.id,
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

  console.log("⭐ Created customer reviews");
  console.log("✅ Phase 1 database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
