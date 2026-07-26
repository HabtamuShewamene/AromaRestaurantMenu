import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, stock, unit, costPerUnit } = data;

    if (!name || !unit) {
      return NextResponse.json(
        { message: "Name and Unit are required" },
        { status: 400 }
      );
    }

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        stock: Number(stock) || 0,
        unit,
        costPerUnit: Number(costPerUnit) || 0,
      },
    });

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
