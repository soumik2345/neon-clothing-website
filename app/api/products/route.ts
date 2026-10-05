import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/features/products/services/product.service";
import { ProductSchema } from "@/features/products/schemas/product.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const isTrending = searchParams.has("isTrending")
      ? searchParams.get("isTrending") === "true"
      : undefined;
    const isFeatured = searchParams.has("isFeatured")
      ? searchParams.get("isFeatured") === "true"
      : undefined;
    const sort = (searchParams.get("sort") as "price-asc" | "price-desc" | "newest" | "popular") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 100;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const ids = searchParams.get("ids") ? searchParams.get("ids")!.split(",").filter(Boolean) : undefined;

    const products = await getProducts({
      category,
      search,
      isTrending,
      isFeatured,
      sort,
      page,
      limit,
      ids,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("API Error in GET /api/products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const created = await createProduct(validation.data);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("API Error in POST /api/products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
