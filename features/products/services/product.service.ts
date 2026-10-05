import { connectDB } from "@/lib/db/mongodb";
import { Product, IProduct } from "@/lib/db/models/Product";
import { ProductType, ProductFilterParams } from "../types/product.types";
import { initialProducts } from "@/lib/db/seed-data";

export async function getProducts(params?: ProductFilterParams): Promise<ProductType[]> {
  try {
    await connectDB();

    const query: Record<string, unknown> = {};

    if (params?.ids && params.ids.length > 0) {
      query._id = { $in: params.ids };
    }

    if (params?.category && params.category !== "all") {
      const cleanCat = params.category.trim();
      query.category = { $regex: new RegExp(`^${cleanCat}$`, "i") };
    }

    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      const priceQuery: Record<string, number> = {};
      if (params.minPrice !== undefined) priceQuery.$gte = params.minPrice;
      if (params.maxPrice !== undefined) priceQuery.$lte = params.maxPrice;
      query.price = priceQuery;
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

    const limit = params?.limit || 50;
    const page = params?.page ? Math.max(1, params.page) : undefined;

    let queryBuilder = Product.find(query).sort(sortOption);
    if (page !== undefined) {
      queryBuilder = queryBuilder.skip((page - 1) * limit);
    }

    const products = await queryBuilder.limit(limit).lean();

    if (products && products.length > 0) {
      const list = products.map((doc: unknown) => {
        const p = doc as IProduct & { _id: unknown };
        return {
          ...p,
          _id: String(p._id),
          id: String(p._id),
        } as ProductType;
      });
      return JSON.parse(JSON.stringify(list)) as ProductType[];
    }
  } catch (error) {
    console.warn("getProducts fallback to initialProducts:", error);
  }

  // Fallback to initialProducts
  let fallback = [...initialProducts] as unknown as ProductType[];
  if (params?.category && params.category !== "all") {
    fallback = fallback.filter(
      (p) => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }
  if (params?.isTrending !== undefined) {
    fallback = fallback.filter((p) => p.isTrending === params.isTrending);
  }
  if (params?.isFeatured !== undefined) {
    fallback = fallback.filter((p) => p.isFeatured === params.isFeatured);
  }
  if (params?.limit) {
    fallback = fallback.slice(0, params.limit);
  }
  return JSON.parse(JSON.stringify(fallback)) as ProductType[];
}

export async function getProductBySlug(slugOrId: string): Promise<ProductType | null> {
  await connectDB();

  // Try finding by slug, or by ObjectId if valid
  let doc = await Product.findOne({ slug: slugOrId }).lean();
  if (!doc && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
    doc = await Product.findById(slugOrId).lean();
  }

  if (!doc) return null;

  const p = doc as IProduct & { _id: unknown };
  return JSON.parse(
    JSON.stringify({
      ...p,
      _id: String(p._id),
      id: String(p._id),
    })
  ) as ProductType;
}

export async function getProductById(idOrSlug: string): Promise<ProductType | null> {
  return getProductBySlug(idOrSlug);
}

export async function createProduct(data: Partial<ProductType>): Promise<ProductType> {
  await connectDB();

  const created = await Product.create(data);
  return {
    ...created.toObject(),
    _id: String(created._id),
    id: String(created._id),
  } as ProductType;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductType>
): Promise<ProductType | null> {
  await connectDB();

  const updated = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!updated) return null;

  const p = updated as IProduct & { _id: unknown };
  return {
    ...p,
    _id: String(p._id),
    id: String(p._id),
  } as ProductType;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await connectDB();

  const res = await Product.findByIdAndDelete(id);
  return !!res;
}
