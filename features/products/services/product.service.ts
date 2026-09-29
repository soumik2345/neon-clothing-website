import { connectDB } from "@/lib/db/mongodb";
import { Product, IProduct } from "@/lib/db/models/Product";
import { ProductType, ProductFilterParams } from "../types/product.types";

export async function getProducts(params?: ProductFilterParams): Promise<ProductType[]> {
  await connectDB();

  const query: Record<string, unknown> = {};

  if (params?.ids && params.ids.length > 0) {
    query._id = { $in: params.ids };
  }

  if (params?.category && params.category !== "all") {
    query.category = params.category.toLowerCase().trim();
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

  const products = await Product.find(query)
    .sort(sortOption)
    .limit(limit)
    .lean();

  return products.map((doc: unknown) => {
    const p = doc as IProduct & { _id: unknown };
    return {
      ...p,
      _id: String(p._id),
      id: String(p._id),
    } as ProductType;
  });
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
  return {
    ...p,
    _id: String(p._id),
    id: String(p._id),
  } as ProductType;
}

export async function getProductById(id: string): Promise<ProductType | null> {
  await connectDB();

  const doc = await Product.findById(id).lean();
  if (!doc) return null;

  const p = doc as IProduct & { _id: unknown };
  return {
    ...p,
    _id: String(p._id),
    id: String(p._id),
  } as ProductType;
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
