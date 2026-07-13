export interface CartItem {
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
