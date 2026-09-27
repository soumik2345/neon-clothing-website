import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  size: z.string(),
  image: z.string(),
});

export const OrderCustomerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

export const CreateOrderSchema = z.object({
  customer: OrderCustomerSchema,
  items: z.array(OrderItemSchema).min(1, "Cart cannot be empty"),
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
