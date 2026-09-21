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
        },
      },
    },
  });
}

export async function getTableByQrIdentifier(identifier: string) {
  // Try finding by qrIdentifier first
  let table = await prisma.diningTable.findUnique({
    where: { qrIdentifier: identifier },
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
        },
      },
    },
  });

  // If not found and identifier is numeric or "table-X", try resolving by number
  if (!table) {
    const num = parseInt(identifier.replace(/^table-?/i, ""), 10);
    if (!isNaN(num)) {
      table = await getTableByNumber(num);
    }
  }

  return table;
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
