import { NextRequest, NextResponse } from "next/server";
import { getAllTables } from "@/server/services/table.service";
import prisma from "@/server/db/prisma";
import { isAdminRequest } from "@/server/auth/session";

export async function GET() {
  try {
    const tables = await getAllTables();
    return NextResponse.json(tables);
  } catch {
    return NextResponse.json({ message: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const tableNumber = Number(body.number);
    if (!tableNumber) {
      return NextResponse.json({ message: "Valid table number is required" }, { status: 400 });
    }

    const table = await prisma.diningTable.upsert({
      where: { number: tableNumber },
      update: {
        label: body.label || null,
        capacity: Number(body.capacity) || 2,
        status: body.status || "AVAILABLE",
        qrIdentifier: body.qrIdentifier || `table-${tableNumber}`,
        qrCodeUrl: `/table/${tableNumber}`,
      },
      create: {
        number: tableNumber,
        label: body.label || null,
        capacity: Number(body.capacity) || 2,
        status: body.status || "AVAILABLE",
        qrIdentifier: body.qrIdentifier || `table-${tableNumber}`,
        qrCodeUrl: `/table/${tableNumber}`,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to save table" },
      { status: 500 }
    );
  }
}
