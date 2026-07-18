export interface CartItem {
  /** Backend variant ID — required to call cart mutation APIs */
  variantId?: string;
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  /** Optional thumbnail from backend cart response */
  image?: string | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
