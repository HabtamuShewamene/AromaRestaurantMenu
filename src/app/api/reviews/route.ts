import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import MenuItem from "@/models/MenuItem";

const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REVIEWS = 3;

// GET: Fetch approved reviews for a menu item
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get("menuItemId");

    if (!menuItemId) {
      return NextResponse.json({ message: "menuItemId is required" }, { status: 400 });
    }

    const reviews = await Review.find({
      menuItem: menuItemId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(String(avgRating)),
      totalReviews: reviews.length,
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review with rate limiting
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    // Rate limiting: Check how many reviews from this email in the last hour
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW);
    const recentReviews = await Review.countDocuments({
      email,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentReviews >= RATE_LIMIT_MAX_REVIEWS) {
      return NextResponse.json(
        { message: "You can only submit 3 reviews per hour. Please try again later." },
        { status: 429 }
      );
    }

    const review = await Review.create({
      menuItem: menuItemId,
      name: name || "Anonymous",
      email,
      rating,
      comment,
      isApproved: false,
    });

    return NextResponse.json(
      {
        message: "Review submitted! Awaiting admin approval",
        review,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
