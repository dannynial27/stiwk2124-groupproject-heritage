export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imagePath?: string; // As per photo storage documentation
}
