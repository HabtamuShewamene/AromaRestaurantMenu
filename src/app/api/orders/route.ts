import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import { getAppSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getAppSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Sign in required" }, { status: 401 });
    }

    await dbConnect();
    const filter = session.user.role === "ADMIN" ? {} : { customerEmail: session.user.email };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAppSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Sign in required to place orders" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ message: "At least one item is required" }, { status: 400 });
    }

    const menuItemIds = body.items.map((item: { menuItem: string }) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    const itemMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

    const normalizedItems = body.items.map((item: { menuItem: string; quantity: number }) => {
      const source = itemMap.get(item.menuItem);
      if (!source) {
        throw new Error("One or more menu items no longer exist");
      }
      if (!source.isAvailable) {
        throw new Error(`${source.name} is currently unavailable`);
      }
      return {
        menuItem: source._id,
        name: source.name,
        price: source.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = normalizedItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      customerName: session.user.name ?? "Cafe Guest",
      customerEmail: session.user.email,
      items: normalizedItems,
      totalAmount,
      status: "PENDING",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
