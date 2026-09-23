import { PrismaClient } from "@prisma/client";
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
      process.env[key.trim()] = value.join("=").trim().replace(/^[\"']|[\"']$/g, "");
    }
  });
}

const rawConnectionString = process.env.DATABASE_URL;
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Aroma Restaurant database seed (bilingual)...");

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
      phone: "+251 959 104 671",
      email: "contact@aromarestaurant.com",
      address: "Debre Birhan, Tebasse Gebeyehu Building, 1st Floor",
      openingTime: "08:00 AM",
      closingTime: "11:30 PM",
      socialLinks: {
        instagram: "https://instagram.com/aroma_restaurant",
        facebook: "https://facebook.com/aroma_restaurant",
        tiktok: "https://www.tiktok.com/@aromarestaurantdb",
      },
    },
  });
  console.log(`🏛️ Created Restaurant: ${restaurant.name}`);

  // 3. Create Users
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
      name: "Biruk Alemu",
      email: "customer@aroma.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log(`👤 Created Admin: ${admin.email} (Password: Admin@123)`);
  console.log(`👤 Created Customer: ${customer.email} (Password: Customer@123)`);

  // 4. Create Dining Tables
  const tables = await Promise.all([
    prisma.diningTable.create({ data: { number: 1, label: "Window Booth 1", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-1", qrCodeUrl: "/table/1" } }),
    prisma.diningTable.create({ data: { number: 2, label: "Window Booth 2", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-2", qrCodeUrl: "/table/2" } }),
    prisma.diningTable.create({ data: { number: 3, label: "Center Dining 3", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-3", qrCodeUrl: "/table/3" } }),
    prisma.diningTable.create({ data: { number: 4, label: "Center Dining 4", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-4", qrCodeUrl: "/table/4" } }),
    prisma.diningTable.create({ data: { number: 5, label: "Terrace Garden 5", capacity: 4, status: "AVAILABLE", qrIdentifier: "table-5", qrCodeUrl: "/table/5" } }),
    prisma.diningTable.create({ data: { number: 6, label: "Terrace Garden 6", capacity: 6, status: "AVAILABLE", qrIdentifier: "table-6", qrCodeUrl: "/table/6" } }),
    prisma.diningTable.create({ data: { number: 7, label: "VIP Private Salon 7", capacity: 8, status: "AVAILABLE", qrIdentifier: "table-7", qrCodeUrl: "/table/7" } }),
    prisma.diningTable.create({ data: { number: 8, label: "Chef's Counter 8", capacity: 2, status: "AVAILABLE", qrIdentifier: "table-8", qrCodeUrl: "/table/8" } }),
  ]);
  console.log(`🪑 Created ${tables.length} dining tables`);

  // 5. Create Ingredients
  const coffeeBeans = await prisma.ingredient.create({ data: { name: "Arabica Reserve Coffee Beans", unit: "kg", currentStock: 30.0, minimumStock: 5.0 } });
  const milk = await prisma.ingredient.create({ data: { name: "Organic Whole Milk", unit: "liters", currentStock: 60.0, minimumStock: 10.0 } });
  const oatMilk = await prisma.ingredient.create({ data: { name: "Barista Oat Milk", unit: "liters", currentStock: 40.0, minimumStock: 8.0 } });
  const matchaPowder = await prisma.ingredient.create({ data: { name: "Ceremonial Uji Matcha", unit: "kg", currentStock: 10.0, minimumStock: 2.0 } });
  const butter = await prisma.ingredient.create({ data: { name: "French AOP Butter", unit: "kg", currentStock: 25.0, minimumStock: 4.0 } });
  const chocolate = await prisma.ingredient.create({ data: { name: "Belgian 70% Dark Chocolate", unit: "kg", currentStock: 20.0, minimumStock: 3.0 } });
  console.log("📦 Created raw inventory ingredients");

  // 6. Create Categories (with Amharic names)
  const catCoffee = await prisma.category.create({
    data: {
      name: "Artisan Coffee",
      nameAm: "ቡና",
      slug: "artisan-coffee",
      description: "Hand-crafted specialty espresso and single-origin roasts",
      descriptionAm: "በእጅ የተዘጋጀ ልዩ ኤስፕሬሶ እና ቡና",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      orderIndex: 1,
    },
  });

  const catTea = await prisma.category.create({
    data: {
      name: "Specialty Tea",
      nameAm: "ሻይ",
      slug: "specialty-tea",
      description: "Carefully sourced loose leaves and ceremonial teas",
      descriptionAm: "ልዩ ቅጠላ ቅጠልና ሻይ",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
      orderIndex: 2,
    },
  });

  const catBreakfast = await prisma.category.create({
    data: {
      name: "Breakfast",
      nameAm: "ቁርስ",
      slug: "breakfast",
      description: "Freshly prepared Ethiopian and continental breakfast",
      descriptionAm: "ትኩስ ኢትዮጵያዊ እና አህጉራዊ ቁርስ",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
      orderIndex: 3,
    },
  });

  const catMainCourse = await prisma.category.create({
    data: {
      name: "Main Course",
      nameAm: "ዋና ምግቦች",
      slug: "main-course",
      description: "Signature Ethiopian and gourmet mains",
      descriptionAm: "ዋና የኢትዮጵያ እና ዓለም አቀፍ ምግቦች",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      orderIndex: 4,
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      name: "Drinks",
      nameAm: "መጠጦች",
      slug: "drinks",
      description: "Fresh juices, smoothies, and soft drinks",
      descriptionAm: "ትኩስ ጭማቂ፣ ስሙዝ እና ለስላሳ መጠጦች",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
      orderIndex: 5,
    },
  });

  const catPastries = await prisma.category.create({
    data: {
      name: "Bakery & Pastries",
      nameAm: "ዳቦ እና ኬክ",
      slug: "bakery-pastries",
      description: "Freshly baked artisan pastries and desserts",
      descriptionAm: "ትኩስ ዳቦ፣ ኬክ እና ጣፋጭ ምግቦች",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      orderIndex: 6,
    },
  });

  console.log("📂 Created bilingual menu categories");

  // 7. Create Menu Items with Amharic translations
  // --- Coffee ---
  const espresso = await prisma.menuItem.create({
    data: {
      name: "Signature Double Espresso",
      nameAm: "ድቡል ኤስፕሬሶ",
      categoryId: catCoffee.id,
      price: 75,
      description: "Rich, velvety double shot with notes of caramelized dark cocoa, roasted hazelnut, and citrus bloom.",
      descriptionAm: "ሁለት ሾት ቡና፤ ካራሜል ጣዕም ያለው ልዩ ኤስፕሬሶ።",
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
      ingredients: { create: [{ ingredientId: coffeeBeans.id, quantity: 0.02 }] },
    },
  });

  const cappuccino = await prisma.menuItem.create({
    data: {
      name: "Velvet Cappuccino",
      nameAm: "ካፑቺኖ",
      categoryId: catCoffee.id,
      price: 90,
      description: "Silky micro-foam poured over our rich signature espresso with a dusted cinnamon finish.",
      descriptionAm: "ለስላሳ አረፋ ያለው ካፑቺኖ፤ ቀረፋ ተነስንሶበታል።",
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
      ingredients: { create: [{ ingredientId: coffeeBeans.id, quantity: 0.02 }, { ingredientId: milk.id, quantity: 0.2 }] },
    },
  });

  const macchiato = await prisma.menuItem.create({
    data: {
      name: "Ethiopian Macchiato",
      nameAm: "ማኪያቶ",
      categoryId: catCoffee.id,
      price: 60,
      description: "Traditional Ethiopian-style espresso with a touch of sweet milk foam.",
      descriptionAm: "ኢትዮጵያዊ ዘይቤ ማኪያቶ፤ ትንሽ ወተት አረፋ ያለው።",
      image: "https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Dairy"],
      rating: 4.9,
      isAvailable: true,
      isFeatured: true,
      viewCount: 200,
      ingredients: { create: [{ ingredientId: coffeeBeans.id, quantity: 0.015 }, { ingredientId: milk.id, quantity: 0.05 }] },
    },
  });

  // --- Tea ---
  const matchaLatte = await prisma.menuItem.create({
    data: {
      name: "Ceremonial Oat Matcha Latte",
      nameAm: "ማቻ ላቴ",
      categoryId: catTea.id,
      price: 110,
      description: "First-harvest Uji ceremonial matcha whisked with creamy steamed barista oat milk.",
      descriptionAm: "ልዩ ማቻ ዱቄት ከኦት ወተት ጋር የተዘጋጀ ሻይ።",
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
      ingredients: { create: [{ ingredientId: matchaPowder.id, quantity: 0.005 }, { ingredientId: oatMilk.id, quantity: 0.25 }] },
    },
  });

  const ginger = await prisma.menuItem.create({
    data: {
      name: "Ginger Lemon Tea",
      nameAm: "ዝንጅብል ሻይ",
      categoryId: catTea.id,
      price: 65,
      description: "Warming fresh ginger steeped with lemon and local honey.",
      descriptionAm: "ዝንጅብልና ሎሚ ከማር ጋር የተዘጋጀ ሞቅ ሻይ።",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca3d9cde4?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: false,
      allergens: [],
      rating: 4.7,
      isAvailable: true,
      isFeatured: false,
      viewCount: 60,
      ingredients: { create: [] },
    },
  });

  // --- Breakfast ---
  await prisma.menuItem.create({
    data: {
      name: "Full Ethiopian Breakfast",
      nameAm: "የኢትዮጵያ ቁርስ",
      categoryId: catBreakfast.id,
      price: 180,
      description: "Traditional Ethiopian breakfast with firfir, eggs, cheese, and fresh bread.",
      descriptionAm: "ፍርፍር፣ እንቁላል፣ አይብ እና ትኩስ ዳቦ ያለው ሙሉ ቁርስ።",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
      vegetarian: false,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Gluten", "Dairy", "Eggs"],
      rating: 4.8,
      isAvailable: true,
      isFeatured: true,
      viewCount: 150,
      ingredients: { create: [{ ingredientId: butter.id, quantity: 0.02 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Scrambled Eggs & Toast",
      nameAm: "እንቁላልና ዳቦ",
      categoryId: catBreakfast.id,
      price: 120,
      description: "Soft scrambled eggs with buttered artisan toast and fresh tomatoes.",
      descriptionAm: "ለስላሳ እንቁላል ከዳቦ እና ቲማቲም ጋር።",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Gluten", "Dairy", "Eggs"],
      rating: 4.6,
      isAvailable: true,
      isFeatured: false,
      viewCount: 80,
      ingredients: { create: [{ ingredientId: butter.id, quantity: 0.01 }] },
    },
  });

  // --- Main Course ---
  await prisma.menuItem.create({
    data: {
      name: "Tibs — Pan-Fried Meat",
      nameAm: "ጥብስ",
      categoryId: catMainCourse.id,
      price: 280,
      description: "Tender sautéed beef or lamb with rosemary, onion, and jalapeño. Served with injera.",
      descriptionAm: "ቅቤ ውስጥ የተጠበሰ ሥጋ ከሽንኩርት እና ጃላፔኖ ጋር። ከእንጀራ ጋር ይቀርባል።",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      vegetarian: false,
      vegan: false,
      spicy: true,
      sugarFree: true,
      allergens: [],
      rating: 4.9,
      isAvailable: true,
      isFeatured: true,
      viewCount: 220,
      ingredients: { create: [] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Kitfo — Ethiopian Steak Tartare",
      nameAm: "ክትፎ",
      categoryId: catMainCourse.id,
      price: 320,
      description: "Minced prime beef seasoned with mitmita spice and spiced butter. Served with injera and ayib.",
      descriptionAm: "ቅቤና ሚጥሚጣ ያለው ቁሻሻ ምርጥ ሥጋ። ከእንጀራ እና አይብ ጋር ይቀርባል።",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
      vegetarian: false,
      vegan: false,
      spicy: true,
      sugarFree: true,
      allergens: ["Dairy"],
      rating: 4.9,
      isAvailable: true,
      isFeatured: true,
      viewCount: 190,
      ingredients: { create: [{ ingredientId: butter.id, quantity: 0.03 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Shiro — Chickpea Stew",
      nameAm: "ሽሮ",
      categoryId: catMainCourse.id,
      price: 160,
      description: "Smooth spiced chickpea powder stew slow-cooked in a rich onion and tomato sauce.",
      descriptionAm: "ሽንኩርትና ቲማቲም ያለው ቀስ ብሎ የበሰለ ሽሮ።",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: true,
      allergens: [],
      rating: 4.7,
      isAvailable: true,
      isFeatured: false,
      viewCount: 130,
      ingredients: { create: [] },
    },
  });

  // --- Drinks ---
  await prisma.menuItem.create({
    data: {
      name: "Fresh Avocado Juice",
      nameAm: "አቮካዶ ጭማቂ",
      categoryId: catDrinks.id,
      price: 100,
      description: "Thick, creamy fresh avocado blended with milk and a hint of honey.",
      descriptionAm: "ከወተት እና ማር ጋር የተዘጋጀ ትኩስ አቮካዶ ጭማቂ።",
      image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Dairy"],
      rating: 4.8,
      isAvailable: true,
      isFeatured: true,
      viewCount: 175,
      ingredients: { create: [{ ingredientId: milk.id, quantity: 0.15 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Mango Papaya Juice",
      nameAm: "ማንጎ ጭማቂ",
      categoryId: catDrinks.id,
      price: 90,
      description: "Tropical blend of ripe mango and papaya — sweet, fresh and refreshing.",
      descriptionAm: "ትኩስ ማንጎ እና ፓፓያ ጭማቂ።",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: false,
      allergens: [],
      rating: 4.7,
      isAvailable: true,
      isFeatured: false,
      viewCount: 110,
      ingredients: { create: [] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Still Water",
      nameAm: "ውሃ",
      categoryId: catDrinks.id,
      price: 30,
      description: "Pure still mineral water — chilled and refreshing.",
      descriptionAm: "ቀዝቃዛ ንጹህ ማዕድናዊ ውሃ።",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: true,
      allergens: [],
      rating: 5.0,
      isAvailable: true,
      isFeatured: false,
      viewCount: 50,
      ingredients: { create: [] },
    },
  });

  // --- Pastries ---
  const croissant = await prisma.menuItem.create({
    data: {
      name: "Pain au Chocolat",
      nameAm: "ቸኮሌት ዳቦ",
      categoryId: catPastries.id,
      price: 85,
      description: "Flaky, multi-layered French pastry stuffed with rich Belgian bittersweet dark chocolate.",
      descriptionAm: "ቸኮሌት ሞልቶበት ፈርጠም ያለ የፈረንሣይ ዳቦ።",
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
      ingredients: { create: [{ ingredientId: butter.id, quantity: 0.05 }, { ingredientId: chocolate.id, quantity: 0.03 }] },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Honey Cake",
      nameAm: "የማር ኬክ",
      categoryId: catPastries.id,
      price: 95,
      description: "Moist Ethiopian honey cake with a hint of cardamom and cloves.",
      descriptionAm: "ቅስቅሳ እና ቅርንፉድ ያለው ትኩስ የኢትዮጵያ ማር ኬክ።",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Gluten", "Dairy", "Eggs"],
      rating: 4.8,
      isAvailable: true,
      isFeatured: true,
      viewCount: 95,
      ingredients: { create: [{ ingredientId: butter.id, quantity: 0.03 }] },
    },
  });

  console.log("🍽️ Created bilingual menu items");

  // 8. Create Reviews
  await prisma.review.create({
    data: {
      itemId: espresso.id,
      userId: customer.id,
      name: "Biruk Alemu",
      email: "biruk@example.com",
      rating: 5,
      comment: "Best espresso in town! The crema and flavor profile are exceptional.",
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      itemId: matchaLatte.id,
      name: "Sara Tadesse",
      email: "sara@example.com",
      rating: 5,
      comment: "Smooth, authentic matcha flavor. Love that oat milk is standard!",
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      itemId: macchiato.id,
      name: "Yonas Haile",
      email: "yonas@example.com",
      rating: 5,
      comment: "ማኪያቶው ልዩ ነው! Every morning I start my day here.",
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      itemId: cappuccino.id,
      name: "Tigist Bekele",
      email: "tigist@example.com",
      rating: 5,
      comment: "ካፑቺኖው ጣዕሙ በጣም ጥሩ ነው። Highly recommend!",
      isApproved: true,
    },
  });

  console.log("⭐ Created customer reviews");
  console.log("✅ Bilingual database seed completed successfully!");
  console.log("");
  console.log("📋 Category Summary:");
  console.log("  ቡና (Coffee) • ሻይ (Tea) • ቁርስ (Breakfast) • ዋና ምግቦች (Main Course) • መጠጦች (Drinks) • ዳቦ እና ኬክ (Pastries)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
