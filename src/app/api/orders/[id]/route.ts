import { NextRequest, NextResponse } from "next/server";
import { getAppSession, isAdminRequest } from "@/server/auth/session";
import { serializeOrder } from "@/server/db/serializers";
import { getOrderById, updateOrderStatus } from "@/server/services/order.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const session = await getAppSession();
    const isAdmin = session?.user?.role === "ADMIN";
    const requestedSession = new URL(request.url).searchParams.get("tableSessionId");
    const ownsOrder = Boolean(session?.user?.id && order.userId === session.user.id);
    const hasTableAccess = Boolean(requestedSession && requestedSession === order.tableSessionId);
    if (!isAdmin && !ownsOrder && !hasTableAccess) {
      return NextResponse.json({ message: "Order access denied" }, { status: 403 });
    }
    return NextResponse.json(serializeOrder(order as any));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch order" },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json(serializeOrder(order as any));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update order status" },
      { status: 500 }
    );
  }
}
