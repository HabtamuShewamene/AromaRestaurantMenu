type OrderWithRelations = {
  id: string;
  userId?: string | null;
  tableId?: string | null;
  tableSessionId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  orderType?: string | null;
  status: string;
  paymentStatus?: string | null;
  totalAmount: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  table?: {
    number: number;
    label?: string | null;
  } | null;
  items: Array<{
    id: string;
    itemId: string;
    quantity: number;
    price: number;
    notes?: string | null;
    item?: {
      name: string;
    } | null;
    addons?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }>;
};

export function serializeOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    userId: order.userId ?? null,
    tableId: order.tableId ?? null,
    tableNumber: order.table?.number ?? null,
    tableSessionId: order.tableSessionId ?? null,
    customerName: order.customerName ?? (order.table ? `Table ${order.table.number}` : "Guest Customer"),
    customerEmail: order.customerEmail ?? "",
    customerPhone: order.customerPhone ?? null,
    orderType: order.orderType ?? "DINE_IN",
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus ?? "PENDING",
    notes: order.notes ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      name: item.item?.name ?? "Menu Item",
      price: item.price,
      quantity: item.quantity,
      notes: item.notes ?? null,
      addons: (item.addons || []).map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        quantity: addon.quantity,
      })),
    })),
  };
}
