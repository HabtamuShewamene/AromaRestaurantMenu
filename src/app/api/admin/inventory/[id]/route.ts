import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const { name, stock, unit, costPerUnit } = data;

    const updatedIngredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name,
        stock: Number(stock),
        unit,
        costPerUnit: Number(costPerUnit),
      },
    });

    return NextResponse.json(updatedIngredient);
  } catch (error) {
    console.error("Failed to update ingredient:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.ingredient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    console.error("Failed to delete ingredient:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
