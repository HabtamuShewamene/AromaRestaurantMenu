import { NextRequest, NextResponse } from "next/server";
import { getTableSessionBill, createPayment, completePayment } from "@/server/services/payment.service";
import { isAdminRequest } from "@/server/auth/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableSessionId = searchParams.get("tableSessionId");

    if (!tableSessionId) {
      return NextResponse.json({ message: "tableSessionId is required" }, { status: 400 });
    }

    const bill = await getTableSessionBill(tableSessionId);
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch bill" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.tableSessionId || typeof body.amount !== "number") {
      return NextResponse.json({ message: "tableSessionId and valid amount are required" }, { status: 400 });
    }

    const payment = await createPayment({
      tableSessionId: body.tableSessionId,
      amount: body.amount,
      method: body.method || "CASH",
      orderId: body.orderId || null,
      reference: body.reference || null,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to record payment" },
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
    if (!body.paymentId) {
      return NextResponse.json({ message: "paymentId is required" }, { status: 400 });
    }

    const completed = await completePayment(body.paymentId);
    return NextResponse.json(completed);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to settle payment" },
      { status: 500 }
    );
  }
}
