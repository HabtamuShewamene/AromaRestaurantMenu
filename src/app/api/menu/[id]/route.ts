import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const updates = await request.json();
    const { recipe, categoryName, allergens: rawAllergens, ...otherUpdates } = updates;

    let ingredientsUpdate = undefined;
    if (Array.isArray(recipe)) {
      ingredientsUpdate = {
        deleteMany: {},
        create: recipe.map((r: any) => ({
          ingredientId: r.ingredientId,
          quantity: Number(r.quantity) || 0
        }))
      };
    }

    let allergens = undefined;
    if (rawAllergens !== undefined) {
      allergens = Array.isArray(rawAllergens)
        ? rawAllergens.map((a: string) => a.trim()).filter(Boolean)
        : typeof rawAllergens === "string"
        ? rawAllergens.split(",").map((a: string) => a.trim()).filter(Boolean)
        : [];
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...otherUpdates,
        ...(allergens !== undefined && { allergens }),
        ...(ingredientsUpdate && { ingredients: ingredientsUpdate })
      },
      include: {
        category: true,
        ingredients: {
          include: { ingredient: true }
        }
      },
    });

    if (!item) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update menu item";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const item = await prisma.menuItem.delete({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete menu item";
    return NextResponse.json({ message }, { status: 500 });
  }
}
