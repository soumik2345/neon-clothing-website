import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Order, IOrder } from "@/lib/db/models/Order";
import { initialOrders } from "@/lib/db/seed-data";
import { OrderType } from "../types/order.types";

let localOrders: OrderType[] = [...initialOrders].map((o, idx) => ({
  ...o,
  _id: `ord_${idx + 1}`,
  id: `ord_${idx + 1}`,
  createdAt: new Date(Date.now() - idx * 3600000 * 5).toISOString(),
  updatedAt: new Date().toISOString(),
})) as OrderType[];

export async function seedOrdersIfEmpty(): Promise<void> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const count = await Order.countDocuments();
      if (count === 0) {
        await Order.insertMany(initialOrders);
        console.log("Successfully seeded MongoDB orders!");
      }
    } catch (e) {
      console.warn("Error seeding MongoDB orders:", e);
    }
  }
}

export async function getOrders(): Promise<OrderType[]> {
  await seedOrdersIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return orders.map((doc: unknown) => {
        const o = doc as IOrder & { _id: unknown };
        return {
          ...o,
          _id: o._id ? String(o._id) : undefined,
          id: o._id ? String(o._id) : undefined,
        } as OrderType;
      });
    } catch (err) {
      console.warn("MongoDB getOrders failed, using fallback:", err);
    }
  }

  return [...localOrders].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export async function getOrderById(id: string): Promise<OrderType | null> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Order.findById(id).lean();
      if (doc) {
        const o = doc as IOrder & { _id: unknown };
        return {
          ...o,
          _id: String(o._id),
          id: String(o._id),
        } as OrderType;
      }
    } catch (err) {
      console.warn("MongoDB getOrderById failed, using fallback:", err);
    }
  }

  return (
    localOrders.find((o) => o._id === id || o.id === id || o.orderNumber === id) || null
  );
}

export async function createOrder(data: {
  customer: OrderType["customer"];
  items: OrderType["items"];
  paymentMethod?: "cod" | "card";
}): Promise<OrderType> {
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 1499 ? 0 : 99;
  const total = subtotal + shippingFee;
  const orderNumber = `NEON-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderPayload = {
    orderNumber,
    customer: data.customer,
    items: data.items,
    subtotal,
    shippingFee,
    total,
    status: "pending" as const,
    paymentMethod: data.paymentMethod || "cod",
    paymentStatus: data.paymentMethod === "card" ? ("paid" as const) : ("pending" as const),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const created = await Order.create(orderPayload);
      return {
        ...created.toObject(),
        _id: String(created._id),
        id: String(created._id),
      } as OrderType;
    } catch (err) {
      console.warn("MongoDB createOrder failed, using fallback:", err);
    }
  }

  const newOrder: OrderType = {
    ...orderPayload,
    _id: `ord_${Date.now()}`,
    id: `ord_${Date.now()}`,
  };

  localOrders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderType["status"],
  paymentStatus?: OrderType["paymentStatus"]
): Promise<OrderType | null> {
  const updateData: Partial<OrderType> = { status };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const updated = await Order.findByIdAndUpdate(id, updateData, { new: true }).lean();
      if (updated) {
        const o = updated as IOrder & { _id: unknown };
        return {
          ...o,
          _id: String(o._id),
          id: String(o._id),
        } as OrderType;
      }
    } catch (err) {
      console.warn("MongoDB updateOrderStatus failed, using fallback:", err);
    }
  }

  const idx = localOrders.findIndex((o) => o._id === id || o.id === id);
  if (idx !== -1) {
    localOrders[idx] = {
      ...localOrders[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return localOrders[idx];
  }

  return null;
}
