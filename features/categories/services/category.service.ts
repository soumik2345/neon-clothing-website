import { connectDB } from "@/lib/db/mongodb";
import { Category, ICategory } from "@/lib/db/models/Category";
import { CategoryType } from "../types/category.types";
import { initialCategories } from "@/lib/db/seed-data";

export async function getCategories(): Promise<CategoryType[]> {
  try {
    await connectDB();

    const categories = await Category.find().sort({ order: 1 }).lean();
    if (categories && categories.length > 0) {
      const list = categories.map((doc: unknown) => {
        const c = doc as ICategory & { _id: unknown };
        return {
          ...c,
          _id: String(c._id),
          id: String(c._id),
        } as CategoryType;
      });
      return JSON.parse(JSON.stringify(list)) as CategoryType[];
    }
  } catch (error) {
    console.warn("getCategories fallback to initialCategories:", error);
  }

  return JSON.parse(JSON.stringify(initialCategories)) as CategoryType[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  await connectDB();

  const doc = await Category.findOne({ slug: slug.toLowerCase() }).lean();
  if (!doc) return null;

  const c = doc as ICategory & { _id: unknown };
  return {
    ...c,
    _id: String(c._id),
    id: String(c._id),
  } as CategoryType;
}

export async function createCategory(data: Partial<CategoryType>): Promise<CategoryType> {
  await connectDB();

  const created = await Category.create(data);
  return {
    ...created.toObject(),
    _id: String(created._id),
    id: String(created._id),
  } as CategoryType;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryType>
): Promise<CategoryType | null> {
  await connectDB();

  const updated = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!updated) return null;

  const c = updated as ICategory & { _id: unknown };
  return {
    ...c,
    _id: String(c._id),
    id: String(c._id),
  } as CategoryType;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await connectDB();

  const res = await Category.findByIdAndDelete(id);
  return !!res;
}
