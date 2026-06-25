type OrderWithRelations = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    itemId: string;
    quantity: number;
    price: number;
    item?: {
      name: string;
    } | null;
  }>;
};

export function serializeOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      name: item.item?.name ?? "Menu Item",
      price: item.price,
      quantity: item.quantity,
    })),
  };
}
