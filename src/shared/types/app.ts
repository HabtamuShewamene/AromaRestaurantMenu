export type Role = "ADMIN" | "CLIENT";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    image?: string | null;
  }>;
};

export type MenuItemRecord = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  category: CategoryRecord | string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewRecord = {
  id: string;
  itemId: string;
  item?: {
    id?: string;
    name: string;
  };
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CartItemRecord = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  isAvailable: boolean;
};

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderItemRecord = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemRecord[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
};

export type AnalyticsRecord = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  popularItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesByStatus: Array<{
    status: OrderStatus;
    count: number;
  }>;
};
