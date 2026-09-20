import prisma from "@/server/db/prisma";

export async function getAllTables() {
  return prisma.diningTable.findMany({
    include: {
      tableSessions: {
        where: { status: "ACTIVE" },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  item: true,
                  addons: true,
                },
              },
            },
          },
          waiterRequests: {
            where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
          },
          payments: true,
        },
      },
    },
    orderBy: { number: "asc" },
  });
}

export async function getTableByNumber(tableNumber: number) {
  return prisma.diningTable.findUnique({
    where: { number: tableNumber },
    include: {
      tableSessions: {
        where: { status: "ACTIVE" },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  item: true,
                  addons: true,
                },
              },
            },
          },
          waiterRequests: true,
          payments: true,
        },
      },
    },
  });
}

export async function getTableById(tableId: string) {
  return prisma.diningTable.findUnique({
    where: { id: tableId },
    include: {
      tableSessions: {
        where: { status: "ACTIVE" },
        include: {
          orders: true,
          waiterRequests: true,
        },
      },
    },
  });
}

/**
 * Resolves or creates an active session for a dining table.
 * If a session is already ACTIVE, returns it to avoid creating duplicate visits.
 */
export async function getOrCreateActiveSession(tableId: string, guestCount: number = 1) {
  const existingActive = await prisma.tableSession.findFirst({
    where: {
      tableId,
      status: "ACTIVE",
    },
    include: {
      table: true,
      orders: {
        include: {
          items: {
            include: {
              item: true,
              addons: true,
            },
          },
        },
      },
      waiterRequests: true,
      payments: true,
    },
  });

  if (existingActive) {
    return existingActive;
  }

  // Create new active session and update table status to OCCUPIED
  const [newSession] = await prisma.$transaction([
    prisma.tableSession.create({
      data: {
        tableId,
        guestCount,
        status: "ACTIVE",
      },
      include: {
        table: true,
        orders: true,
        waiterRequests: true,
        payments: true,
      },
    }),
    prisma.diningTable.update({
      where: { id: tableId },
      data: { status: "OCCUPIED" },
    }),
  ]);

  return newSession;
}

export async function closeTableSession(sessionId: string) {
  const session = await prisma.tableSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Table session not found");
  }

  const [updatedSession] = await prisma.$transaction([
    prisma.tableSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        closedAt: new Date(),
      },
    }),
    prisma.diningTable.update({
      where: { id: session.tableId },
      data: { status: "AVAILABLE" },
    }),
  ]);

  return updatedSession;
}

export async function updateTableStatus(tableId: string, status: string) {
  return prisma.diningTable.update({
    where: { id: tableId },
    data: { status },
  });
}
