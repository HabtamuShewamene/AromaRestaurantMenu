import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { isAdminRequest } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();

    // Get all reviews (both pending and approved)
    const reviews = await Review.find().sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}
