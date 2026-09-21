export type CategoryRecord = {
  id: string;
  name: string;
  slug?: string | null;
  image?: string | null;
  description?: string | null;
  orderIndex: number;
  status: boolean;
};

export type AddonOptionRecord = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  orderIndex?: number;
};

export type AddonGroupRecord = {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: AddonOptionRecord[];
};

export type IngredientRecord = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
};

export type MenuItemIngredientRecord = {
  id: string;
  quantity: number;
  ingredient: IngredientRecord;
};

export type MenuItemRecord = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: CategoryRecord | string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
  rating?: number;
  viewCount?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
  sugarFree?: boolean;
  allergens?: string[];
  addonGroups?: AddonGroupRecord[];
  ingredients?: MenuItemIngredientRecord[];
  createdAt?: string;
  updatedAt?: string;
};

export type OrderItemAddonRecord = {
  id?: string;
  addonOptionId?: string | null;
  name: string;
  price: number;
  quantity?: number;
};

export type CartItemRecord = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  category: string;
  isAvailable: boolean;
  addons?: OrderItemAddonRecord[];
  notes?: string;
};

export type ReviewRecord = {
  id: string;
  userId?: string | null;
  itemId: string;
  name: string;
  email: string;
  rating: number;
  comment?: string | null;
  isApproved: boolean;
  createdAt: string;
  item?: {
    id: string;
    name: string;
    image?: string | null;
  };
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
  totalAmount?: number;
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
