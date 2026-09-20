import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/server/auth/session";
import { serializeOrder } from "@/server/db/serializers";
import { updateOrderStatus } from "@/server/services/order.service";

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

    if (!body.status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const order = await updateOrderStatus(id, body.status);
    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update order status" },
      { status: 500 }
    );
  }
}
