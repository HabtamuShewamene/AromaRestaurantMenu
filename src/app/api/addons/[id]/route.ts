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
    const { menuItemId, name, required, minSelect, maxSelect, options } = await request.json();

    if (!menuItemId || !name) {
      return NextResponse.json({ message: "Menu item and Name are required" }, { status: 400 });
    }

    // First, delete existing options (simple replace approach)
    await prisma.addonOption.deleteMany({
      where: { addonGroupId: id }
    });

    const addonGroup = await prisma.addonGroup.update({
      where: { id },
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

    return NextResponse.json(addonGroup);
  } catch (err) {
    return NextResponse.json({ message: "Failed to update add-on" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    await prisma.addonGroup.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Add-on deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Failed to delete add-on" }, { status: 500 });
  }
}
