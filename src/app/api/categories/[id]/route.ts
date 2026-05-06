import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { isAdminRequest } from "@/lib/session";
import { slugify } from "@/lib/slugify";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: body.name,
        slug: slugify(String(body.slug ?? body.name)),
        image: body.image,
      },
      { new: true, runValidators: true }
    );

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

    await dbConnect();
    const { id } = await context.params;
    const menuItemsInCategory = await MenuItem.countDocuments({ category: id });
    if (menuItemsInCategory > 0) {
      return NextResponse.json(
        { message: "Cannot delete a category that is still assigned to menu items" },
        { status: 409 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted" });
  } catch {
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}
