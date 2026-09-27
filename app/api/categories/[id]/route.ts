import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/features/categories/services/category.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("API Error in PUT /api/categories/[id]:", error);
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Category not found or delete failed" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("API Error in DELETE /api/categories/[id]:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
