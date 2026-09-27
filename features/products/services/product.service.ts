import { connectDB, isMongoConnected } from "@/lib/db/mongodb";
import { Product, IProduct } from "@/lib/db/models/Product";
import { initialProducts } from "@/lib/db/seed-data";
import { ProductType, ProductFilterParams } from "../types/product.types";

// In-memory fallback cache to ensure instant responsiveness & offline resilience
let localProducts: ProductType[] = [...initialProducts].map((p, idx) => ({
  ...p,
  _id: `prod_${idx + 1}`,
  id: `prod_${idx + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export async function seedProductsIfEmpty(): Promise<void> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(initialProducts);
        console.log("Successfully seeded MongoDB products!");
      }
    } catch (e) {
      console.warn("Error seeding MongoDB products:", e);
    }
  }
}

export async function getProducts(params?: ProductFilterParams): Promise<ProductType[]> {
  await seedProductsIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const query: Record<string, unknown> = {};

      if (params?.category && params.category !== "all") {
        query.category = params.category.toLowerCase();
      }

      if (params?.isTrending !== undefined) {
        query.isTrending = params.isTrending;
      }

      if (params?.isFeatured !== undefined) {
        query.isFeatured = params.isFeatured;
      }

      if (params?.search) {
        query.$or = [
          { title: { $regex: params.search, $options: "i" } },
          { description: { $regex: params.search, $options: "i" } },
          { category: { $regex: params.search, $options: "i" } },
        ];
      }

      let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
      if (params?.sort === "price-asc") sortOption = { price: 1 };
      if (params?.sort === "price-desc") sortOption = { price: -1 };
      if (params?.sort === "popular") sortOption = { isTrending: -1, createdAt: -1 };

      const products = await Product.find(query)
        .sort(sortOption)
        .limit(params?.limit || 50)
        .lean();

      return products.map((doc: unknown) => {
        const p = doc as IProduct & { _id: unknown };
        return {
          ...p,
          _id: p._id ? String(p._id) : undefined,
          id: p._id ? String(p._id) : undefined,
        } as ProductType;
      });
    } catch (err) {
      console.warn("MongoDB fetch products failed, using fallback:", err);
    }
  }

  // Fallback memory filtering
  let filtered = [...localProducts];

  if (params?.category && params.category !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }

  if (params?.isTrending !== undefined) {
    filtered = filtered.filter((p) => p.isTrending === params.isTrending);
  }

  if (params?.isFeatured !== undefined) {
    filtered = filtered.filter((p) => p.isFeatured === params.isFeatured);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (params?.sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params?.sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (params?.limit) {
    filtered = filtered.slice(0, params.limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await seedProductsIfEmpty();

  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Product.findOne({ slug }).lean();
      if (doc) {
        const p = doc as IProduct & { _id: unknown };
        return {
          ...p,
          _id: String(p._id),
          id: String(p._id),
        } as ProductType;
      }
    } catch (err) {
      console.warn("MongoDB getProductBySlug failed, using fallback:", err);
    }
  }

  const found = localProducts.find((p) => p.slug === slug || p._id === slug || p.id === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<ProductType | null> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const doc = await Product.findById(id).lean();
      if (doc) {
        const p = doc as IProduct & { _id: unknown };
        return {
          ...p,
          _id: String(p._id),
          id: String(p._id),
        } as ProductType;
      }
    } catch (err) {
      console.warn("MongoDB getProductById failed, using fallback:", err);
    }
  }

  const found = localProducts.find((p) => p._id === id || p.id === id || p.slug === id);
  return found || null;
}

export async function createProduct(data: Partial<ProductType>): Promise<ProductType> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const created = await Product.create(data);
      return {
        ...created.toObject(),
        _id: String(created._id),
        id: String(created._id),
      } as ProductType;
    } catch (err) {
      console.warn("MongoDB createProduct failed, falling back to local:", err);
    }
  }

  const newProduct: ProductType = {
    _id: `prod_${Date.now()}`,
    id: `prod_${Date.now()}`,
    title: data.title || "Untitled Product",
    slug: data.slug || `prod-${Date.now()}`,
    price: data.price || 999,
    originalPrice: data.originalPrice,
    category: data.category || "t-shirts",
    description: data.description || "",
    condition: data.condition || "Grade A Curated Vintage",
    images: data.images && data.images.length > 0 ? data.images : [initialProducts[0].images[0]],
    sizes: data.sizes || ["S", "M", "L", "XL"],
    stock: data.stock !== undefined ? data.stock : 10,
    isTrending: !!data.isTrending,
    isFeatured: !!data.isFeatured,
    isNewArrival: data.isNewArrival !== undefined ? data.isNewArrival : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductType>
): Promise<ProductType | null> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const updated = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) {
        const p = updated as IProduct & { _id: unknown };
        return {
          ...p,
          _id: String(p._id),
          id: String(p._id),
        } as ProductType;
      }
    } catch (err) {
      console.warn("MongoDB updateProduct failed, using fallback:", err);
    }
  }

  const index = localProducts.findIndex((p) => p._id === id || p.id === id);
  if (index !== -1) {
    localProducts[index] = {
      ...localProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return localProducts[index];
  }

  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db && isMongoConnected()) {
    try {
      const res = await Product.findByIdAndDelete(id);
      if (res) return true;
    } catch (err) {
      console.warn("MongoDB deleteProduct failed, using fallback:", err);
    }
  }

  const initialLen = localProducts.length;
  localProducts = localProducts.filter((p) => p._id !== id && p.id !== id);
  return localProducts.length < initialLen;
}
