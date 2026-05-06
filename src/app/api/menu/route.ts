import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { isAdminRequest } from "@/lib/session";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    await dbConnect();
    const items = await MenuItem.find().populate("category").sort({ createdAt: -1 });
    return NextResponse.json(items);
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

    await dbConnect();
    const body = await request.json();
    if (!body.name || !body.description || !body.image || typeof body.price !== "number") {
      return NextResponse.json({ message: "Missing required menu item fields" }, { status: 400 });
    }

    let categoryId = body.category;

    if (body.categoryName && !categoryId) {
      const slug = slugify(String(body.categoryName));
      const category = await Category.findOneAndUpdate(
        { slug },
        { name: body.categoryName, slug },
        { new: true, upsert: true }
      );
      categoryId = category._id;
    }

    if (!categoryId) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    const item = await MenuItem.create({
      name: body.name,
      price: body.price,
      description: body.description,
      category: categoryId,
      image: body.image,
      isAvailable: body.isAvailable ?? true,
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create menu item" }, { status: 500 });
  }
}
