import prisma from "@/server/db/prisma";
import { getOrCreateActiveSession } from "@/server/services/table.service";

export type CreateOrderItemInput = {
  itemId: string;
  quantity: number;
  notes?: string;
  addons?: Array<{
    addonOptionId?: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
};

export type CreateOrderInput = {
  userId?: string | null;
  tableId?: string | null;
  tableNumber?: number | null;
  tableSessionId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  orderType?: "DINE_IN" | "TAKEAWAY";
  notes?: string | null;
  items: CreateOrderItemInput[];
};

export async function createOrder(input: CreateOrderInput) {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("At least one item is required to place an order");
  }
  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      throw new Error("Each item quantity must be a whole number between 1 and 50");
    }
  }

  // 1. Resolve Table & Session if this is a Dine-in order with a table
  let resolvedTableId = input.tableId || null;
  let resolvedSessionId = input.tableSessionId || null;

  if (input.tableNumber && !resolvedTableId) {
    const table = await prisma.diningTable.findUnique({
      where: { number: input.tableNumber },
    });
    if (!table) throw new Error("Table not found");
    if (table.status === "OUT_OF_SERVICE") throw new Error("This table is currently unavailable");
    resolvedTableId = table.id;
  }

  if (resolvedTableId) {
    const table = await prisma.diningTable.findUnique({ where: { id: resolvedTableId } });
    if (!table) throw new Error("Table not found");
    if (table.status === "OUT_OF_SERVICE") throw new Error("This table is currently unavailable");
  }

  if (resolvedTableId && !resolvedSessionId) {
    const activeSession = await getOrCreateActiveSession(resolvedTableId);
    resolvedSessionId = activeSession.id;
  }

  // 2. Fetch menu items to validate availability and pricing
  const itemIds = input.items.map((i) => i.itemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: itemIds } },
    include: {
      ingredients: true,
      addonGroups: {
        include: { options: true },
      },
    },
  });

  const itemMap = new Map(menuItems.map((item) => [item.id, item]));

  // 3. Compute normalized items with add-ons and calculate total
  let orderTotal = 0;
  const processedItems = input.items.map((inputItem) => {
    const dish = itemMap.get(inputItem.itemId);
    if (!dish) {
      throw new Error(`Menu item (${inputItem.itemId}) not found or removed`);
    }
    if (!dish.isAvailable) {
      throw new Error(`"${dish.name}" is currently sold out`);
    }

    const requestedAddons = inputItem.addons || [];
    let addonsCost = 0;
    const normalizedAddons = requestedAddons.map((addon) => {
      const option = dish.addonGroups.flatMap((group) => group.options).find((candidate) => candidate.id === addon.addonOptionId);
      if (!option || !option.isAvailable) throw new Error(`Invalid or unavailable add-on for ${dish.name}`);
      const addonQuantity = addon.quantity ?? 1;
      if (!Number.isInteger(addonQuantity) || addonQuantity < 1 || addonQuantity > 50) throw new Error("Add-on quantity must be a whole number between 1 and 50");
      const group = dish.addonGroups.find((candidate) => candidate.options.some((candidateOption) => candidateOption.id === option.id))!;
      addonsCost += option.price * addonQuantity;
      return { addonOptionId: option.id, name: option.name, price: option.price, quantity: addonQuantity, groupId: group.id };
    });
    for (const group of dish.addonGroups) {
      const selectedCount = normalizedAddons.filter((addon) => addon.groupId === group.id).length;
      if (selectedCount < group.minSelect || selectedCount > group.maxSelect || (group.required && selectedCount === 0)) throw new Error(`Invalid selections for ${group.name}`);
    }
    const itemUnitPrice = dish.price;
    const itemTotal = (itemUnitPrice + addonsCost) * inputItem.quantity;
    orderTotal += itemTotal;

    return {
      itemId: dish.id,
      name: dish.name,
      price: itemUnitPrice,
      quantity: inputItem.quantity,
      notes: inputItem.notes || null,
      addons: normalizedAddons.map(({ groupId: _groupId, ...addon }) => addon),
      ingredients: dish.ingredients,
    };
  });

  // 4. Create Order in Database
  const order = await prisma.order.create({
    data: {
      userId: input.userId || null,
      tableId: resolvedTableId,
      tableSessionId: resolvedSessionId,
      customerName: input.customerName || (resolvedTableId ? "Table Guest" : "Guest Customer"),
      customerEmail: input.customerEmail || null,
      customerPhone: input.customerPhone || null,
      orderType: input.orderType || (resolvedTableId ? "DINE_IN" : "TAKEAWAY"),
      status: "NEW",
      totalAmount: Math.round(orderTotal * 100) / 100,
      notes: input.notes || null,
      items: {
        create: processedItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
          addons: item.addons.length > 0
            ? {
                create: item.addons.map((a) => ({
                  addonOptionId: a.addonOptionId,
                  name: a.name,
                  price: a.price,
                  quantity: a.quantity,
                })),
              }
            : undefined,
        })),
      },
    },
    include: {
      items: {
        include: {
          item: true,
          addons: true,
        },
      },
      table: true,
      tableSession: true,
    },
  });

  // 5. Automatic Inventory Stock Deduction (if recipes configured)
  try {
    const stockDeductions = new Map<string, number>();

    for (const item of processedItems) {
      if (item.ingredients && item.ingredients.length > 0) {
        for (const recipeIng of item.ingredients) {
          const current = stockDeductions.get(recipeIng.ingredientId) || 0;
          stockDeductions.set(
            recipeIng.ingredientId,
            current + recipeIng.quantity * item.quantity
          );
        }
      }
    }

    if (stockDeductions.size > 0) {
      const deductionOps = Array.from(stockDeductions.entries()).map(
        ([ingredientId, qty]) =>
          prisma.ingredient.update({
            where: { id: ingredientId },
            data: { currentStock: { decrement: qty } },
          })
      );
      await prisma.$transaction(deductionOps);
    }
  } catch (stockErr) {
    console.error("Inventory stock deduction warning:", stockErr);
  }

  return order;
}

export async function updateOrderStatus(orderId: string, nextStatus: string) {
  const current = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!current) {
    throw new Error("Order not found");
  }

  const normalizedNext = nextStatus.toUpperCase();
  const transitions: Record<string, string[]> = { NEW: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PREPARING", "CANCELLED"], PREPARING: ["READY", "CANCELLED"], READY: ["SERVED"], SERVED: ["COMPLETED"], COMPLETED: [], CANCELLED: [] };
  if (!transitions[current.status]?.includes(normalizedNext)) throw new Error(`Invalid order status transition: ${current.status} to ${normalizedNext}`);

  return prisma.order.update({
    where: { id: orderId },
    data: { status: normalizedNext },
    include: {
      items: {
        include: {
          item: true,
          addons: true,
        },
      },
      table: true,
      tableSession: true,
    },
  });
}

export async function getOrders(filters: {
  tableId?: string;
  tableSessionId?: string;
  userId?: string;
  status?: string;
  limit?: number;
} = {}) {
  const where: Record<string, any> = {};

  if (filters.tableId) where.tableId = filters.tableId;
  if (filters.tableSessionId) where.tableSessionId = filters.tableSessionId;
  if (filters.userId) where.userId = filters.userId;
  if (filters.status) where.status = filters.status;

  return prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          item: true,
          addons: true,
        },
      },
      table: true,
      tableSession: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: filters.limit || 100,
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          item: true,
          addons: true,
        },
      },
      table: true,
      tableSession: true,
      user: true,
    },
  });
}

export async function getKitchenOrders() {
  return prisma.order.findMany({
    where: {
      status: { in: ["NEW", "CONFIRMED", "PREPARING", "READY", "pending", "preparing", "ready"] },
    },
    include: {
      items: {
        include: {
          item: true,
          addons: true,
        },
      },
      table: true,
      tableSession: true,
    },
    orderBy: { createdAt: "asc" }, // FIFO: Oldest orders first
  });
}
