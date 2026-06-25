import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { getAppSession } from "@/server/auth/session";
import { serializeOrder } from "@/server/db/serializers";

type OrderCreateItemInput = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function GET() {
  try {
    const session = await getAppSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Sign in required" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: session.user.role === "ADMIN" ? {} : { user: { email: session.user.email } },
      include: {
        items: {
          include: { item: true },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders.map(serializeOrder));
  } catch {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAppSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Sign in required to place orders" }, { status: 401 });
    }

    const body = await request.json();
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ message: "At least one item is required" }, { status: 400 });
    }

    const menuItemIds = body.items.map((item: { itemId: string }) => item.itemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });
    const itemMap = new Map(menuItems.map((item) => [item.id, item]));

    const normalizedItems: OrderCreateItemInput[] = body.items.map((item: { itemId: string; quantity: number }) => {
      const source = itemMap.get(item.itemId);
      if (!source) {
        throw new Error("One or more menu items no longer exist");
      }
      if (!source.isAvailable) {
        throw new Error(`${source.name} is currently unavailable`);
      }
      return {
        name: source.name,
        price: source.price,
        quantity: item.quantity,
        itemId: source.id,
      };
    });

    const totalAmount = normalizedItems.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    // Get or create user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        customerName: user.name ?? "Customer",
        customerEmail: user.email,
        totalAmount,
        status: "pending",
        items: {
          create: normalizedItems.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { item: true } },
        user: true,
      },
    });

    return NextResponse.json(serializeOrder(order), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
