import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/features/categories/services/category.service";
import { CategorySchema } from "@/features/categories/schemas/category.schema";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("API Error in GET /api/categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const created = await createCategory(validation.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("API Error in POST /api/categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
