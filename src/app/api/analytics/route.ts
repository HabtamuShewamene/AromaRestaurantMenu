import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { isAdminRequest } from "@/lib/session";
import { AnalyticsRecord } from "@/types/app";

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const orders = await Order.find().lean();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
    const completedOrders = orders.filter((order) => order.status === "COMPLETED").length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    const statusMap = new Map<AnalyticsRecord["salesByStatus"][number]["status"], number>();

    for (const order of orders) {
      statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
      for (const item of order.items) {
        const current = itemMap.get(item.name) ?? { name: item.name, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += item.price * item.quantity;
        itemMap.set(item.name, current);
      }
    }

    const popularItems = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    const salesByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      popularItems,
      salesByStatus,
    } satisfies AnalyticsRecord);
  } catch (error) {
    return NextResponse.json({ message: "Failed to load analytics" }, { status: 500 });
  }
}
