import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";
import { AnalyticsRecord } from "@/shared/types/app";

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: { items: { include: { item: true } } },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const completedOrders = orders.filter((order) => order.status === "completed").length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    const statusMap = new Map<string, number>();

    for (const order of orders) {
      statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
      for (const item of order.items) {
        const current = itemMap.get(String(item.itemId)) ?? {
          name: item.item?.name ?? "Menu Item",
          quantity: 0,
          revenue: 0,
        };
        current.quantity += item.quantity;
        current.revenue += item.price * item.quantity;
        itemMap.set(String(item.itemId), current);
      }
    }

    const popularItems = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    const salesByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status as AnalyticsRecord["salesByStatus"][number]["status"],
      count,
    }));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      popularItems,
      salesByStatus,
    } satisfies AnalyticsRecord);
  } catch {
    return NextResponse.json({ message: "Failed to load analytics" }, { status: 500 });
  }
}
