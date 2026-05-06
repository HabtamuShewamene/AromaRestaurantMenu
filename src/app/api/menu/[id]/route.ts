import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { isAdminRequest } from "@/lib/session";

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
    const updates = await request.json();
    const item = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!item) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update menu item" }, { status: 500 });
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
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Menu item deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete menu item" }, { status: 500 });
  }
}
