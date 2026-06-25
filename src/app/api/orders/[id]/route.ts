import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";
import { serializeOrder } from "@/server/db/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      include: {
        items: { include: { item: true } },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(serializeOrder(order));
  } catch {
    return NextResponse.json({ message: "Failed to update order status" }, { status: 500 });
  }
}
