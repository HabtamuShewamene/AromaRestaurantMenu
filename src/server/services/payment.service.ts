import prisma from "@/server/db/prisma";

export async function getTableSessionBill(tableSessionId: string) {
  const session = await prisma.tableSession.findUnique({
    where: { id: tableSessionId },
    include: {
      table: true,
      orders: {
        where: { status: { not: "CANCELLED" } },
        include: {
          items: {
            include: {
              item: true,
              addons: true,
            },
          },
        },
      },
      payments: true,
    },
  });

  if (!session) {
    throw new Error("Table session not found");
  }

  const totalBill = session.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidAmount = session.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = Math.max(0, totalBill - paidAmount);

  return {
    sessionId: session.id,
    tableNumber: session.table.number,
    tableLabel: session.table.label,
    guestCount: session.guestCount,
    ordersCount: session.orders.length,
    totalBill: Math.round(totalBill * 100) / 100,
    paidAmount: Math.round(paidAmount * 100) / 100,
    remainingBalance: Math.round(remainingBalance * 100) / 100,
    isFullyPaid: remainingBalance <= 0 && totalBill > 0,
    orders: session.orders,
    payments: session.payments,
  };
}

export async function createPayment(input: {
  tableSessionId: string;
  amount: number;
  method?: "CASH" | "CARD" | "DIGITAL";
  orderId?: string | null;
  reference?: string | null;
}) {
  return prisma.payment.create({
    data: {
      tableSessionId: input.tableSessionId,
      amount: input.amount,
      method: input.method || "CASH",
      status: "PENDING",
      orderId: input.orderId || null,
      reference: input.reference || null,
    },
    include: {
      tableSession: {
        include: { table: true },
      },
    },
  });
}

export async function completePayment(paymentId: string) {
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "COMPLETED" },
    include: {
      tableSession: {
        include: { table: true },
      },
    },
  });

  // Check if entire session is now paid off
  const bill = await getTableSessionBill(payment.tableSessionId);
  if (bill.isFullyPaid) {
    await prisma.order.updateMany({
      where: { tableSessionId: payment.tableSessionId },
      data: { paymentStatus: "COMPLETED" },
    });
  }

  return payment;
}
