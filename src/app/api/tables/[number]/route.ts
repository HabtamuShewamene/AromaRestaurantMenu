import { NextRequest, NextResponse } from "next/server";
import { getTableByNumber, getOrCreateActiveSession } from "@/server/services/table.service";

type RouteContext = {
  params: Promise<{ number: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { number } = await context.params;
    const tableNum = parseInt(number, 10);
    if (isNaN(tableNum)) {
      return NextResponse.json({ message: "Invalid table number" }, { status: 400 });
    }

    const table = await getTableByNumber(tableNum);
    if (!table) {
      return NextResponse.json({ message: "Table not found" }, { status: 404 });
    }

    // Auto resolve or join existing active session
    const activeSession = await getOrCreateActiveSession(table.id);

    return NextResponse.json({
      table: {
        id: table.id,
        number: table.number,
        label: table.label,
        capacity: table.capacity,
        status: table.status,
      },
      activeSession: {
        id: activeSession.id,
        status: activeSession.status,
        guestCount: activeSession.guestCount,
        openedAt: activeSession.openedAt,
        orders: (activeSession as any).orders || [],
        waiterRequests: (activeSession as any).waiterRequests || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to resolve table session" },
      { status: 500 }
    );
  }
}
