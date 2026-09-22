import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function GET() {
  try {
    const addons = await prisma.addonGroup.findMany({
      include: {
        options: {
          orderBy: { orderIndex: "asc" }
        },
        menuItem: {
          select: { name: true, id: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(addons);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch add-ons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { menuItemId, name, required, minSelect, maxSelect, options } = await request.json();

    if (!menuItemId || !name) {
      return NextResponse.json({ message: "Menu item and Name are required" }, { status: 400 });
    }

    const addonGroup = await prisma.addonGroup.create({
      data: {
        menuItemId,
        name,
        required: Boolean(required),
        minSelect: Number(minSelect) || 0,
        maxSelect: Number(maxSelect) || 1,
        options: {
          create: options.map((opt: any, index: number) => ({
            name: opt.name,
            price: Number(opt.price) || 0,
            isAvailable: opt.isAvailable ?? true,
            orderIndex: index
          }))
        }
      },
      include: { options: true, menuItem: { select: { name: true, id: true } } }
    });

    return NextResponse.json(addonGroup, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to create add-on" }, { status: 500 });
  }
}
