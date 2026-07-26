import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";
import { slugify } from "@/shared/utils/slugify";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        menuItems: true,
      },
    });
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

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }
    const slug = slugify(String(body.slug ?? body.name));

    const category = await prisma.category.create({
      data: { name: body.name, slug, image: body.image },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}
