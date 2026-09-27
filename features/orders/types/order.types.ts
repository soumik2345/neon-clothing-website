export interface OrderItemType {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface OrderCustomerType {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderType {
  _id?: string;
  id?: string;
  orderNumber: string;
  customer: OrderCustomerType;
  items: OrderItemType[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "card";
  paymentStatus: "pending" | "paid";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
