import { NextRequest, NextResponse } from "next/server";
import { createWaiterRequest, getActiveWaiterRequests, updateWaiterRequestStatus } from "@/server/services/waiter.service";
import { isAdminRequest } from "@/server/auth/session";

export async function GET() {
  try {
    if (!(await isAdminRequest())) return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    const requests = await getActiveWaiterRequests();
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ message: "Failed to fetch waiter requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.tableId) {
      return NextResponse.json({ message: "Table ID is required" }, { status: 400 });
    }

    const waiterReq = await createWaiterRequest({
      tableId: body.tableId,
      tableSessionId: body.tableSessionId || null,
      type: body.type || "CALL_WAITER",
      note: body.note || null,
    });

    return NextResponse.json(waiterReq, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create waiter request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest();
    if (!isAdmin) {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ message: "Request ID and status are required" }, { status: 400 });
    }

    const updated = await updateWaiterRequestStatus(body.id, body.status);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update waiter request" },
      { status: 500 }
    );
  }
}
