import prisma from "@/server/db/prisma";

export type CreateWaiterRequestInput = {
  tableId: string;
  tableSessionId: string;
  type?: "CALL_WAITER" | "REQUEST_BILL" | "REQUEST_WATER" | "REQUEST_CUTLERY" | "CUSTOM";
  note?: string | null;
};

export async function createWaiterRequest(input: CreateWaiterRequestInput) {
  return prisma.waiterRequest.create({
    data: {
      tableId: input.tableId,
      tableSessionId: input.tableSessionId,
      type: input.type || "CALL_WAITER",
      note: input.note || null,
      status: "PENDING",
    },
    include: {
      table: true,
      tableSession: true,
    },
  });
}

export async function getActiveWaiterRequests() {
  return prisma.waiterRequest.findMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS"] },
    },
    include: {
      table: true,
      tableSession: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateWaiterRequestStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED"
) {
  return prisma.waiterRequest.update({
    where: { id },
    data: { status },
    include: {
      table: true,
      tableSession: true,
    },
  });
}
