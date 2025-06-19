export interface Product {
  productId: number; // Make this required (no question mark)
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
