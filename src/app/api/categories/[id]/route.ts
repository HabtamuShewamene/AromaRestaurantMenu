import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";
import { slugify } from "@/shared/utils/slugify";

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
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        nameAm: body.nameAm,
        slug: slugify(String(body.slug ?? body.name)),
        image: body.image,
        description: body.description,
        descriptionAm: body.descriptionAm,
        status: body.status ?? true,
        orderIndex: body.orderIndex ?? 0,
      },
      include: { menuItems: true },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const menuItemsInCategory = await prisma.menuItem.count({
      where: { categoryId: id },
    });
    if (menuItemsInCategory > 0) {
      return NextResponse.json(
        { message: "Cannot delete a category that is still assigned to menu items" },
        { status: 409 }
      );
    }

    const category = await prisma.category.delete({
      where: { id },
    });
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted" });
  } catch {
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}
