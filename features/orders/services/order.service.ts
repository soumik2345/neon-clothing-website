import { connectDB } from "@/lib/db/mongodb";
import { Order, IOrder } from "@/lib/db/models/Order";
import { OrderType } from "../types/order.types";
import { createNotification } from "@/features/notifications/services/notification.service";

function toPlainOrder(doc: unknown): OrderType {
  const plain = JSON.parse(JSON.stringify(doc));
  return {
    ...plain,
    _id: String(plain._id),
    id: String(plain._id),
    items: (plain.items || []).map((item: Record<string, unknown>) => ({
      ...item,
      _id: item._id ? String(item._id) : undefined,
    })),
  } as OrderType;
}

export async function getOrders(filter?: { email?: string }): Promise<OrderType[]> {
  await connectDB();

  const query: Record<string, unknown> = {};
  if (filter?.email && filter.email.trim()) {
    query["customer.email"] = { $regex: new RegExp(`^${filter.email.trim()}$`, "i") };
  }

  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
  return orders.map(toPlainOrder);
}

export async function getOrderById(idOrNumber: string): Promise<OrderType | null> {
  await connectDB();

  const cleanQuery = idOrNumber.trim();
  let doc = await Order.findOne({
    orderNumber: { $regex: new RegExp(`^${cleanQuery}$`, "i") },
  }).lean();

  if (!doc && cleanQuery.match(/^[0-9a-fA-F]{24}$/)) {
    doc = await Order.findById(cleanQuery).lean();
  }

  if (!doc) return null;

  return toPlainOrder(doc);
}

export async function createOrder(data: {
  customer: OrderType["customer"];
  items: OrderType["items"];
  paymentMethod?: "cod" | "card";
}): Promise<OrderType> {
  await connectDB();

  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 1499 ? 0 : 99;
  const total = subtotal + shippingFee;
  const orderNumber = `NEON-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderPayload = {
    orderNumber,
    customer: {
      ...data.customer,
      name: data.customer.name.trim(),
      email: data.customer.email.toLowerCase().trim(),
      phone: data.customer.phone.trim(),
      address: data.customer.address.trim(),
      city: data.customer.city.trim(),
      postalCode: data.customer.postalCode.trim(),
    },
    items: data.items,
    subtotal,
    shippingFee,
    total,
    status: "pending" as const,
    paymentMethod: data.paymentMethod || "cod",
    paymentStatus: data.paymentMethod === "card" ? ("paid" as const) : ("pending" as const),
  };

  const created = await Order.create(orderPayload);
  return toPlainOrder(created.toObject());
}

export async function updateOrderStatus(
  id: string,
  status: OrderType["status"],
  paymentStatus?: OrderType["paymentStatus"]
): Promise<OrderType | null> {
  await connectDB();

  const prevOrder = await Order.findById(id).lean();
  if (!prevOrder) return null;

  const updateData: Partial<OrderType> = { status };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const updatedDoc = await Order.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!updatedDoc) return null;

  const orderResult = toPlainOrder(updatedDoc);

  // If status changed and customer has an email, trigger customer notification
  if (prevOrder.status !== status && orderResult.customer?.email) {
    try {
      let notifTitle = "";
      let notifMessage = "";

      if (status === "shipped") {
        notifTitle = `Order Shipped! 📦`;
        notifMessage = `Your order #${orderResult.orderNumber} is on the way. Tap to track your package live.`;
      } else if (status === "delivered") {
        notifTitle = `Order Delivered! 🎉`;
        notifMessage = `Your package #${orderResult.orderNumber} has been delivered successfully. Enjoy your streetwear gear!`;
      } else if (status === "processing") {
        notifTitle = `Order Confirmed & Processing ⚡`;
        notifMessage = `Your order #${orderResult.orderNumber} is being prepared for dispatch.`;
      } else if (status === "cancelled") {
        notifTitle = `Order Cancelled ⚠️`;
        notifMessage = `Your order #${orderResult.orderNumber} has been cancelled.`;
      }

      if (notifTitle) {
        await createNotification({
          title: notifTitle,
          message: notifMessage,
          type: "order",
          targetUrl: `/track-order?orderId=${encodeURIComponent(orderResult.orderNumber)}`,
          targetUserEmail: orderResult.customer.email.toLowerCase().trim(),
        });
      }
    } catch (notifErr) {
      console.error("Failed to create automated order status notification:", notifErr);
    }
  }

  return orderResult;
}
