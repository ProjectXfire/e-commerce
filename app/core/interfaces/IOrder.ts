import { type IProduct } from './IProduct';

export interface IOrder {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  storeId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  orderItems: string;
  totalPrice: string;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: IProduct;
}
