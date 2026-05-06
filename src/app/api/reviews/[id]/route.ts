import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { isAdminRequest } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json({ message: "isApproved must be a boolean" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: isApproved ? "Review approved" : "Review rejected",
      review,
    });
  } catch {
    return NextResponse.json({ message: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const { id } = await context.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch {
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}
