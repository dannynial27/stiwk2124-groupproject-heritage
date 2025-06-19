import { Product } from './product.model';

export interface WishlistItem {
  wishlistItemId?: number;
  product: Product;
  addedAt?: string;
}

export interface Wishlist {
  wishlistId?: number;
  userId?: number;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}