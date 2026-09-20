export type Role = "ADMIN" | "CUSTOMER" | "CLIENT";

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

export type IngredientRecord = {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  minimumStock: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FoodIngredientRecord = {
  ingredientId: string;
  quantity: number;
  ingredientName?: string;
};

export type AddonOptionRecord = {
  id: string;
  addonGroupId?: string;
  name: string;
  price: number;
  isAvailable: boolean;
  orderIndex?: number;
};

export type AddonGroupRecord = {
  id: string;
  menuItemId?: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: AddonOptionRecord[];
};

export type MenuItemRecord = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  category: CategoryRecord | string;
  ingredients?: string[];
  allergens?: string[];
  viewCount?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
  sugarFree?: boolean;
  recipe?: FoodIngredientRecord[];
  addonGroups?: AddonGroupRecord[];
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

export type OrderItemAddonRecord = {
  id?: string;
  addonOptionId?: string;
  name: string;
  price: number;
  quantity: number;
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
  addons?: OrderItemAddonRecord[];
  notes?: string;
};

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED"
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "DINE_IN" | "TAKEAWAY";
export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED";
export type PaymentMethod = "CASH" | "CARD" | "DIGITAL";

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE";
export type TableSessionStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type WaiterRequestType =
  | "CALL_WAITER"
  | "REQUEST_BILL"
  | "REQUEST_WATER"
  | "REQUEST_CUTLERY"
  | "CUSTOM";

export type WaiterRequestStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";

export type DiningTableRecord = {
  id: string;
  number: number;
  label?: string | null;
  capacity: number;
  status: TableStatus;
  qrIdentifier?: string | null;
  qrCodeUrl?: string | null;
  activeSession?: TableSessionRecord | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TableSessionRecord = {
  id: string;
  tableId: string;
  tableNumber?: number;
  tableLabel?: string | null;
  status: TableSessionStatus;
  guestCount: number;
  openedAt: string;
  closedAt?: string | null;
  orders?: OrderRecord[];
  waiterRequests?: WaiterRequestRecord[];
  payments?: PaymentRecord[];
  totalAmount?: number;
  paidAmount?: number;
  createdAt?: string;
};

export type WaiterRequestRecord = {
  id: string;
  tableSessionId: string;
  tableId: string;
  tableNumber?: number;
  type: WaiterRequestType;
  note?: string | null;
  status: WaiterRequestStatus;
  createdAt: string;
  updatedAt?: string;
};

export type PaymentRecord = {
  id: string;
  tableSessionId: string;
  orderId?: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string | null;
  createdAt: string;
};

export type OrderItemRecord = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string | null;
  addons?: OrderItemAddonRecord[];
};

export type OrderRecord = {
  id: string;
  userId?: string | null;
  tableId?: string | null;
  tableNumber?: number | null;
  tableSessionId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  orderType?: OrderType;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalAmount: number;
  notes?: string | null;
  items: OrderItemRecord[];
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
