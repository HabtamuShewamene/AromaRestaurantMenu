import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/server/auth/session";
import { getKitchenOrders, updateOrderStatus } from "@/server/services/order.service";
import { serializeOrder } from "@/server/db/serializers";

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const orders = await getKitchenOrders();
    const serialized = orders.map((order) => serializeOrder(order as any));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Failed to fetch kitchen orders:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch kitchen orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const orderId = body.id || body.orderId;
    const status = body.status;

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and target status are required" },
        { status: 400 }
      );
    }

    const validKitchenStatuses = ["CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"];
    if (!validKitchenStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { message: `Invalid status for kitchen: ${status}` },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, status);
    return NextResponse.json(serializeOrder(updated as any));
  } catch (error) {
    console.error("Failed to update kitchen order status:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update order status" },
      { status: 500 }
    );
  }
}
