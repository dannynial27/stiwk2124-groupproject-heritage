import { Product } from './product.model';

export interface CartItem {
  cartItemId?: number;
  product: Product;
  quantity: number;
  subtotal?: number;
  addedAt?: string;
}

export interface Cart {
  cartId?: number;
  userId?: number;
  items: CartItem[];
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}
