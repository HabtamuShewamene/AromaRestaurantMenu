import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { isAdminRequest } from "@/lib/session";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch categories", error }, { status: 500 });
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
    if (!body.name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }
    const slug = slugify(String(body.slug ?? body.name));

    const category = await Category.create({
      name: body.name,
      slug,
      image: body.image,
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}
