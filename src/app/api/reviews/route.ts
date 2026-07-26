import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-options";

const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REVIEWS = 3;

// GET: Fetch approved reviews for a menu item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get("menuItemId");

    if (!menuItemId) {
      return NextResponse.json({ message: "menuItemId is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        itemId: menuItemId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(String(avgRating)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch reviews", error }, { status: 500 });
  }
}

// POST: Submit a new review with rate limiting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuItemId, name, email, rating, comment } = body;

    if (!menuItemId || !email || !rating || !comment) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (comment.trim().length < 3) {
      return NextResponse.json({ message: "Comment must be at least 3 characters" }, { status: 400 });
    }

    // Check if menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    });
    
    if (!menuItem) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    // Capture IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    // Rate limiting: Check how many reviews from this email or IP in the last hour
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW);
    const recentReviews = await prisma.review.count({
      where: {
        OR: [
          { email },
          { ipAddress: ip }
        ],
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentReviews >= RATE_LIMIT_MAX_REVIEWS) {
      return NextResponse.json(
        { message: "Review limit reached for this hour. Please try again later." },
        { status: 429 }
      );
    }

    const review = await prisma.review.create({
      data: {
        itemId: menuItemId,
        userId: userId || null,
        name: name || "Anonymous",
        email,
        rating: Number(rating),
        comment,
        isApproved: false,
        ipAddress: ip,
      },
    });

    return NextResponse.json(
      {
        message: "Review submitted! Awaiting admin approval",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Failed to submit review", error }, { status: 500 });
  }
}
