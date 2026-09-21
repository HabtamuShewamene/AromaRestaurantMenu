import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env manually for standalone seed script
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...value] = trimmed.split("=");
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
}

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:1921@localhost:5432/digitalmenu?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Admin & Demo Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@elitecafe.com" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      name: "Elite Café Admin",
      email: "admin@elitecafe.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: { password: customerPassword, role: "CLIENT" },
    create: {
      name: "Sophia Laurent",
      email: "customer@example.com",
      password: customerPassword,
      role: "CLIENT",
    },
  });

  console.log(`✅ Users seeded: Admin (${admin.email}), Customer (${customer.email})`);

  // 2. Restaurant Profile
  const existingRestaurant = await prisma.restaurant.findFirst();
  if (!existingRestaurant) {
    await prisma.restaurant.create({
      data: {
        name: "Elite Café",
        description: "Curated flavors crafted for every moment. Experience luxury dining at its finest.",
        coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90",
        phone: "+1 (555) 123-4567",
        email: "concierge@elitecafe.com",
        address: "123 Luxury Avenue, Metropolis",
        openingTime: "08:00 AM",
        closingTime: "11:00 PM",
      },
    });
  }

  // 3. Raw Inventory Ingredients
  const ingredientsData = [
    { name: "Single-Origin Arabica Beans", unit: "kg", currentStock: 45, minimumStock: 10 },
    { name: "Organic Whole Milk", unit: "L", currentStock: 60, minimumStock: 15 },
    { name: "Oat Milk Barista Edition", unit: "L", currentStock: 35, minimumStock: 10 },
    { name: "Ceremonial Grade Matcha", unit: "kg", currentStock: 12, minimumStock: 3 },
    { name: "Valrhona 70% Dark Chocolate", unit: "kg", currentStock: 25, minimumStock: 5 },
    { name: "Madagascar Bourbon Vanilla", unit: "L", currentStock: 8, minimumStock: 2 },
    { name: "French Normandy Butter", unit: "kg", currentStock: 30, minimumStock: 8 },
    { name: "Organic Pastry Flour", unit: "kg", currentStock: 80, minimumStock: 20 },
    { name: "Hass Avocados", unit: "pcs", currentStock: 50, minimumStock: 15 },
    { name: "Artisanal Sourdough Loaf", unit: "pcs", currentStock: 20, minimumStock: 5 },
    { name: "Norwegian Smoked Salmon", unit: "kg", currentStock: 15, minimumStock: 4 },
  ];

  const ingredientMap = new Map<string, string>();

  for (const ing of ingredientsData) {
    const created = await prisma.ingredient.upsert({
      where: { id: ing.name }, // lookup dummy
      update: {},
      create: ing,
    }).catch(async () => {
      const existing = await prisma.ingredient.findFirst({ where: { name: ing.name } });
      if (existing) return existing;
      return prisma.ingredient.create({ data: ing });
    });
    ingredientMap.set(ing.name, created.id);
  }

  console.log(`✅ ${ingredientMap.size} Ingredients verified`);

  // 4. Categories
  const categoriesData = [
    {
      name: "Artisanal Coffee",
      slug: "artisanal-coffee",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      description: "Single-origin pour-overs, nitro cold brews, and handcrafted espresso.",
    },
    {
      name: "Signature Teas & Infusions",
      slug: "signature-teas",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
      description: "Ceremonial matcha, rare loose leaves, and organic botanical blends.",
    },
    {
      name: "Gourmet Pastries",
      slug: "gourmet-pastries",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      description: "Flaky viennoiserie, artisanal tarts, and freshly baked delights.",
    },
    {
      name: "Savory & Brunch",
      slug: "savory-brunch",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      description: "Truffled toasts, gourmet bowls, and ocean-fresh culinary creations.",
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image, description: cat.description },
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  console.log(`✅ ${categoryMap.size} Categories seeded`);

  // 5. Menu Items with Recipes & Dietary Info
  const menuItems = [
    {
      name: "Gold Leaf Truffle Cappuccino",
      categorySlug: "artisanal-coffee",
      price: 12.50,
      description: "Double shot espresso with silky microfoam, a touch of white truffle honey, and edible 24k gold leaf.",
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Dairy"],
      recipe: [
        { name: "Single-Origin Arabica Beans", quantity: 0.02 },
        { name: "Organic Whole Milk", quantity: 0.2 },
      ],
    },
    {
      name: "Velvet Nitro Cold Brew",
      categorySlug: "artisanal-coffee",
      price: 8.50,
      description: "Steeped for 24 hours in pure spring water, infused with nitrogen for a cascading velvet crema.",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: true,
      allergens: [],
      recipe: [
        { name: "Single-Origin Arabica Beans", quantity: 0.04 },
      ],
    },
    {
      name: "Kyoto Ceremonial Matcha Cloud",
      categorySlug: "signature-teas",
      price: 11.00,
      description: "Stone-ground Uji matcha whisked with oat milk, topped with a Madagascar vanilla foam cloud.",
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: false,
      sugarFree: false,
      allergens: [],
      recipe: [
        { name: "Ceremonial Grade Matcha", quantity: 0.005 },
        { name: "Oat Milk Barista Edition", quantity: 0.25 },
        { name: "Madagascar Bourbon Vanilla", quantity: 0.01 },
      ],
    },
    {
      name: "Valrhona Triple Chocolate Croissant",
      categorySlug: "gourmet-pastries",
      price: 9.00,
      description: "Laminated with 84% Normandy butter and filled with molten Valrhona 70% dark chocolate batons.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      vegetarian: true,
      vegan: false,
      spicy: false,
      sugarFree: false,
      allergens: ["Dairy", "Gluten"],
      recipe: [
        { name: "French Normandy Butter", quantity: 0.05 },
        { name: "Organic Pastry Flour", quantity: 0.08 },
        { name: "Valrhona 70% Dark Chocolate", quantity: 0.04 },
      ],
    },
    {
      name: "Smoked Salmon & Caviar Brioche Toast",
      categorySlug: "savory-brunch",
      price: 24.00,
      description: "Toasted sourdough with cured Norwegian salmon, whipped herb labneh, caper berries, and imperial caviar.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      vegetarian: false,
      vegan: false,
      spicy: false,
      sugarFree: true,
      allergens: ["Fish", "Dairy", "Gluten"],
      recipe: [
        { name: "Artisanal Sourdough Loaf", quantity: 0.1 },
        { name: "Norwegian Smoked Salmon", quantity: 0.08 },
        { name: "Hass Avocados", quantity: 0.5 },
      ],
    },
    {
      name: "Truffled Avocado Tartine",
      categorySlug: "savory-brunch",
      price: 18.50,
      description: "Smashed Hass avocados on artisanal sourdough, topped with heirloom radish, chili flakes, and black truffle drizzle.",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80",
      vegetarian: true,
      vegan: true,
      spicy: true,
      sugarFree: true,
      allergens: ["Gluten"],
      recipe: [
        { name: "Artisanal Sourdough Loaf", quantity: 0.1 },
        { name: "Hass Avocados", quantity: 1 },
      ],
    },
  ];

  for (const item of menuItems) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });

    const recipeCreates = item.recipe
      .map(r => ({
        ingredientId: ingredientMap.get(r.name)!,
        quantity: r.quantity,
      }))
      .filter(r => Boolean(r.ingredientId));

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          price: item.price,
          description: item.description,
          image: item.image,
          vegetarian: item.vegetarian,
          vegan: item.vegan,
          spicy: item.spicy,
          sugarFree: item.sugarFree,
          allergens: item.allergens,
        },
      });
    } else {
      const createdItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          categoryId,
          vegetarian: item.vegetarian,
          vegan: item.vegan,
          spicy: item.spicy,
          sugarFree: item.sugarFree,
          allergens: item.allergens,
          ingredients: {
            create: recipeCreates,
          },
        },
      });

      // Add a sample approved review
      await prisma.review.create({
        data: {
          itemId: createdItem.id,
          userId: customer.id,
          name: "Sophia Laurent",
          email: "customer@example.com",
          rating: 5,
          comment: "Sublime presentation and exquisite flavors. The finest coffee experience in the city!",
          isApproved: true,
        },
      });
    }
  }

  console.log("✅ Menu Items and initial reviews seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
