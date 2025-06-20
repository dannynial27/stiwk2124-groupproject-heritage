import { Product } from './product.model';
import { User } from './user.model';

export interface OrderItem {
  unitPrice: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  user?: User;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string; // ISO date string
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentMethod: string;
  detailsLoaded?: boolean;
  isLoadingDetails?: boolean;
}

export interface ShippingInfo {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET' | 'CASH_ON_DELIVERY';
}
