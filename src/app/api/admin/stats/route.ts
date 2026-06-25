import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [
      totalItems,
      totalReviews,
      pendingReviews,
      avgRatingResult,
    ] = await Promise.all([
      prisma.menuItem.count(),
      prisma.review.count(),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.review.aggregate({
        _avg: { rating: true },
        where: { isApproved: true }
      })
    ]);

    // Get most popular items (highest rated with at least 1 review)
    const topItems = await prisma.review.groupBy({
      by: ['itemId'],
      _avg: { rating: true },
      _count: { rating: true },
      where: { isApproved: true },
      orderBy: {
        _avg: { rating: 'desc' }
      },
      take: 5
    });

    // Fetch names for top items
    const topItemsWithNames = await Promise.all(
      topItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.itemId },
          select: { name: true }
        });
        return {
          id: item.itemId,
          name: menuItem?.name || "Unknown",
          avgRating: item._avg.rating || 0,
          count: item._count.rating
        };
      })
    );

    return NextResponse.json({
      totalItems,
      totalReviews,
      pendingReviews,
      averageRating: avgRatingResult._avg.rating || 0,
      topItems: topItemsWithNames
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
