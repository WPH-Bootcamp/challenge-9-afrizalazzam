export type CartMenu = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type CartItem = {
  id: number;
  menu: CartMenu;
  quantity: number;
  itemTotal: number;
};

export type CartGroup = {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  subtotal: number;
};

export type CartSummary = {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
};

export type CartResponse = {
  cart: CartGroup[];
  summary: CartSummary;
};

export type AddToCartPayload = {
  restaurantId: number;
  menuId: number;
  quantity?: number;
};
