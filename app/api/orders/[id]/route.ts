import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/features/orders/services/order.service";
import { createNotification } from "@/features/notifications/services/notification.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("API Error in GET /api/orders/[id]:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const updated = await updateOrderStatus(id, status, paymentStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Trigger automated order notification if status changed
    if (status && updated.customer?.email) {
      try {
        let notifTitle = "";
        let notifMessage = "";

        if (status === "shipped") {
          notifTitle = `Order Shipped! 📦`;
          notifMessage = `Your order #${updated.orderNumber} is on the way. Tap to track your package.`;
        } else if (status === "delivered") {
          notifTitle = `Order Delivered! 🎉`;
          notifMessage = `Your order #${updated.orderNumber} has arrived safely. Enjoy your streetwear gear!`;
        } else if (status === "cancelled") {
          notifTitle = `Order Cancelled ⚠️`;
          notifMessage = `Your order #${updated.orderNumber} has been cancelled.`;
        } else if (status === "processing") {
          notifTitle = `Order Processing ⚡`;
          notifMessage = `Your order #${updated.orderNumber} is being prepared for dispatch.`;
        }

        if (notifTitle) {
          await createNotification({
            title: notifTitle,
            message: notifMessage,
            type: "order",
            targetUrl: `/track-order?orderId=${encodeURIComponent(updated.orderNumber)}`,
            targetUserEmail: updated.customer.email,
          });
        }
      } catch (notifErr) {
        console.error("Failed to create automated order notification:", notifErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("API Error in PATCH /api/orders/[id]:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

