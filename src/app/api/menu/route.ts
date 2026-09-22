import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";
import { slugify } from "@/shared/utils/slugify";

export async function GET() {
  try {
    const [items, stats] = await Promise.all([
      prisma.menuItem.findMany({
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.groupBy({
        by: ["itemId"],
        _avg: { rating: true },
        _count: { rating: true },
        where: { isApproved: true },
      }),
    ]);

    const itemsWithStats = items.map((item) => {
      const itemStats = stats.find((s) => s.itemId === item.id);
      return {
        ...item,
        averageRating: itemStats?._avg.rating ? parseFloat(itemStats._avg.rating.toFixed(1)) : 0,
        totalReviews: itemStats?._count.rating || 0,
      };
    });

    return NextResponse.json(itemsWithStats);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch menu items", error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.description || !body.image || typeof body.price !== "number") {
      return NextResponse.json({ message: "Missing required menu item fields" }, { status: 400 });
    }

    let categoryId = body.category;

    if (body.categoryName && !categoryId) {
      const slug = slugify(String(body.categoryName));
      const category = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: body.categoryName, slug },
      });
      categoryId = category.id;
    }

    if (!categoryId) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    // Process recipe
    const recipeData = Array.isArray(body.recipe)
      ? body.recipe.map((r: any) => ({
          ingredientId: r.ingredientId,
          quantity: Number(r.quantity) || 0,
        }))
      : [];

    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        categoryId,
        image: body.image,
        isAvailable: body.isAvailable ?? true,
        isFeatured: body.isFeatured ?? false,
        vegetarian: body.vegetarian ?? false,
        vegan: body.vegan ?? false,
        spicy: body.spicy ?? false,
        sugarFree: body.sugarFree ?? false,
        allergens: Array.isArray(body.allergens) ? body.allergens : [],
        ingredients: {
          create: recipeData,
        },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create menu item" }, { status: 500 });
  }
}
