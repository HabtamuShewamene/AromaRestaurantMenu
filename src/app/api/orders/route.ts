import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/server/auth/session";
import { serializeOrder } from "@/server/db/serializers";
import { createOrder, getOrders } from "@/server/services/order.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getAppSession();
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get("tableId") || undefined;
    const tableSessionId = searchParams.get("tableSessionId") || undefined;

    // Admin can see all orders; authenticated customer sees their own; guest can query by tableSessionId
    if (session?.user?.role === "ADMIN") {
      const orders = await getOrders({ tableId, tableSessionId });
      return NextResponse.json(orders.map(serializeOrder));
    }

    if (session?.user?.id) {
      const orders = await getOrders({ userId: session.user.id });
      return NextResponse.json(orders.map(serializeOrder));
    }

    if (tableSessionId) {
      const orders = await getOrders({ tableSessionId });
      return NextResponse.json(orders.map(serializeOrder));
    }

    return NextResponse.json({ message: "Sign in or active table session required" }, { status: 401 });
  } catch {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAppSession();
    const body = await request.json();

    const order = await createOrder({
      userId: session?.user?.id || null,
      tableId: body.tableId || null,
      tableNumber: body.tableNumber ? Number(body.tableNumber) : null,
      tableSessionId: body.tableSessionId || null,
      customerName: body.customerName || session?.user?.name || null,
      customerEmail: body.customerEmail || session?.user?.email || null,
      customerPhone: body.customerPhone || null,
      orderType: body.orderType || (body.tableId || body.tableNumber ? "DINE_IN" : "TAKEAWAY"),
      notes: body.notes || null,
      items: body.items || [],
    });

    return NextResponse.json(serializeOrder(order), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create order" },
      { status: 400 }
    );
  }
}
