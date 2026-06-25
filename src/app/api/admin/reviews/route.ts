import { NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    // Get all reviews (both pending and approved)
    const reviews = await prisma.review.findMany({
      include: {
        item: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch reviews", error }, { status: 500 });
  }
}
