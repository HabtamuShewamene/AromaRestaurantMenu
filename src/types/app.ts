export type Role = "ADMIN" | "CLIENT";

export type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export type MenuItemRecord = {
  _id: string;
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
  _id: string;
  menuItem: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
};

export type CartItemRecord = {
  id: string;
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  isAvailable: boolean;
};

export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type OrderItemRecord = {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderRecord = {
  _id: string;
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
