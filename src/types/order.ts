export type CheckoutItemPayload = {
  menuId: number;
  quantity: number;
};

export type CheckoutRestaurantPayload = {
  restaurantId: number;
  items: CheckoutItemPayload[];
};

export type CheckoutPayload = {
  restaurants: CheckoutRestaurantPayload[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
};

export type OrderPricing = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
};

export type OrderRestaurantItem = {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  itemTotal: number;
  image?: string | null;
};

export type OrderRestaurantGroup = {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: OrderRestaurantItem[];
  subtotal: number;
};

export type Transaction = {
  id: number;
  transactionId: string;
  paymentMethod: string;
  status: "done";
  deliveryAddress: string;
  phone?: string;
  pricing: OrderPricing;
  restaurants: OrderRestaurantGroup[];
  createdAt: string;
};

export type CheckoutResponse = {
  transaction: Transaction;
};

export type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "cancelled";

export type MyOrder = {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress?: string;
  phone?: string;
  pricing: OrderPricing;
  restaurants: OrderRestaurantGroup[];
  createdAt: string;
  updatedAt: string;
};

export type GetMyOrdersParams = {
  status?: OrderStatus;
  page?: number;
  limit?: number;
};

export type MyOrdersResponse = {
  orders: MyOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
