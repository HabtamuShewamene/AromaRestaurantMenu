import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json({ message: "isApproved must be a boolean" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: isApproved ? "Review approved" : "Review rejected",
      review,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update review", error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await context.params;

    const review = await prisma.review.delete({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete review", error }, { status: 500 });
  }
}
