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
<<<<<<< HEAD
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
=======
          addonGroups: {
            include: {
              options: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
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
        ingredientNames: item.ingredients.map(fi => fi.ingredient?.name).filter(Boolean),
        recipe: item.ingredients.map(fi => ({
          ingredientId: fi.ingredientId,
          quantity: fi.quantity,
          ingredientName: fi.ingredient?.name,
          unit: fi.ingredient?.unit,
        })),
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

    // Process allergens
    const allergens = Array.isArray(body.allergens) 
      ? body.allergens.map((a: string) => a.trim()).filter(Boolean)
      : typeof body.allergens === "string" 
      ? body.allergens.split(",").map((a: string) => a.trim()).filter(Boolean)
      : [];

    const item = await prisma.menuItem.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        categoryId,
        image: body.image,
        isAvailable: body.isAvailable ?? true,
<<<<<<< HEAD
        vegetarian: Boolean(body.vegetarian),
        vegan: Boolean(body.vegan),
        spicy: Boolean(body.spicy),
        sugarFree: Boolean(body.sugarFree),
        allergens,
=======
        isFeatured: body.isFeatured ?? false,
        vegetarian: body.vegetarian ?? false,
        vegan: body.vegan ?? false,
        spicy: body.spicy ?? false,
        sugarFree: body.sugarFree ?? false,
        allergens: Array.isArray(body.allergens) ? body.allergens : [],
>>>>>>> d034e7030184471ff69b5318637ae74846dbc349
        ingredients: {
          create: recipeData,
        },
      },
      include: {
        category: true,
        addonGroups: {
          include: { options: true },
        },
      },
      include: {
        category: true,
        ingredients: {
          include: { ingredient: true }
        }
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create menu item";
    return NextResponse.json({ message }, { status: 500 });
  }
}
