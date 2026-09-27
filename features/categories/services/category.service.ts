import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Category, ICategory } from "@/lib/db/models/Category";
import { initialCategories } from "@/lib/db/seed-data";
import { CategoryType } from "../types/category.types";

let localCategories: CategoryType[] = [...initialCategories].map((c, idx) => ({
  ...c,
  _id: `cat_${idx + 1}`,
  id: `cat_${idx + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export async function seedCategoriesIfEmpty(): Promise<void> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        await Category.insertMany(initialCategories);
        console.log("Successfully seeded MongoDB categories!");
      }
    } catch (e) {
      console.warn("Error seeding MongoDB categories:", e);
    }
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  await seedCategoriesIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const categories = await Category.find().sort({ order: 1 }).lean();
      return categories.map((doc: unknown) => {
        const c = doc as ICategory & { _id: unknown };
        return {
          ...c,
          _id: c._id ? String(c._id) : undefined,
          id: c._id ? String(c._id) : undefined,
        } as CategoryType;
      });
    } catch (err) {
      console.warn("MongoDB getCategories failed, using fallback:", err);
    }
  }

  return [...localCategories].sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Category.findOne({ slug }).lean();
      if (doc) {
        const c = doc as ICategory & { _id: unknown };
        return {
          ...c,
          _id: String(c._id),
          id: String(c._id),
        } as CategoryType;
      }
    } catch (err) {
      console.warn("MongoDB getCategoryBySlug failed, using fallback:", err);
    }
  }

  return localCategories.find((c) => c.slug === slug || c._id === slug || c.id === slug) || null;
}

export async function createCategory(data: Partial<CategoryType>): Promise<CategoryType> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const created = await Category.create(data);
      return {
        ...created.toObject(),
        _id: String(created._id),
        id: String(created._id),
      } as CategoryType;
    } catch (err) {
      console.warn("MongoDB createCategory failed, using fallback:", err);
    }
  }

  const newCategory: CategoryType = {
    _id: `cat_${Date.now()}`,
    id: `cat_${Date.now()}`,
    name: data.name || "NEW CATEGORY",
    slug: data.slug || `cat-${Date.now()}`,
    image: data.image || initialCategories[0].image,
    description: data.description || "",
    itemCount: data.itemCount || 0,
    order: data.order || localCategories.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localCategories.push(newCategory);
  return newCategory;
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryType>
): Promise<CategoryType | null> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const updated = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) {
        const c = updated as ICategory & { _id: unknown };
        return {
          ...c,
          _id: String(c._id),
          id: String(c._id),
        } as CategoryType;
      }
    } catch (err) {
      console.warn("MongoDB updateCategory failed, using fallback:", err);
    }
  }

  const idx = localCategories.findIndex((c) => c._id === id || c.id === id);
  if (idx !== -1) {
    localCategories[idx] = {
      ...localCategories[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return localCategories[idx];
  }

  return null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const res = await Category.findByIdAndDelete(id);
      if (res) return true;
    } catch (err) {
      console.warn("MongoDB deleteCategory failed, using fallback:", err);
    }
  }

  const initLen = localCategories.length;
  localCategories = localCategories.filter((c) => c._id !== id && c.id !== id);
  return localCategories.length < initLen;
}
