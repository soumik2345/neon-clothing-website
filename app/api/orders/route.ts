import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/features/orders/services/order.service";
import { CreateOrderSchema } from "@/features/orders/schemas/order.schema";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get("email") || undefined;

    const session = await getCurrentUser();
    // If authenticated as a customer and no email query or requested own email, use session email
    if (session && session.role === "customer") {
      email = session.email;
    }

    const orders = await getOrders({ email });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("API Error in GET /api/orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const created = await createOrder(validation.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("API Error in POST /api/orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
