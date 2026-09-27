import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getProductBySlug, getProducts } from "@/features/products/services/product.service";
import { getBanners } from "@/features/banners/services/banner.service";
import { getSettings } from "@/features/settings/services/settings.service";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const [product, banners, settings] = await Promise.all([
    getProductBySlug(id),
    getBanners(),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  // Fetch related products in same category
  const relatedProducts = await getProducts({
    category: product.category,
    limit: 4,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header
        announcementText={banners.announcementText}
        storeName={settings.storeName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-400 mb-8 uppercase font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-black transition">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-black transition">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Details Section */}
        <ProductDetails product={product} />

        {/* Related Streetwear Section */}
        {relatedProducts.length > 1 && (
          <section className="mt-20 pt-12 border-t border-neutral-200">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
                RECOMMENDED
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-mono mt-1">
                YOU MAY ALSO LIKE
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts
                .filter((p) => p.slug !== product.slug)
                .slice(0, 4)
                .map((item) => (
                  <ProductCard key={item._id || item.slug} product={item} />
                ))}
            </div>
          </section>
        )}
      </main>

      <Footer storeName={settings.storeName} tagline={settings.tagline} />
    </div>
  );
}
