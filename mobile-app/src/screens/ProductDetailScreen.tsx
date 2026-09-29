import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ChevronDown,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
} from "lucide-react-native";
import { ProductType } from "../types";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";

const { width } = Dimensions.get("window");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80";

export function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const initialProduct: ProductType | undefined = route.params?.product;
  const productId: string | undefined =
    route.params?.productId || initialProduct?._id || initialProduct?.id || initialProduct?.slug;

  const { addToCart, totalItems } = useCart();
  const { formatPrice, freeShippingThreshold } = useSettings();

  const [product, setProduct] = useState<ProductType | null>(initialProduct || null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(!initialProduct);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  // Load product from database
  const loadProduct = useCallback(async () => {
    if (!productId) return;
    try {
      if (!initialProduct) setIsLoading(true);
      const fetched = await api.getProductByIdOrSlug(productId);
      if (fetched) {
        setProduct(fetched);
        const sizes = fetched.sizes || fetched.size || ["S", "M", "L", "XL"];
        if (sizes.length > 0) {
          setSelectedSize(sizes[0]);
        }

        // Fetch related products in the same category
        if (fetched.category) {
          const related = await api.getProducts({
            category: fetched.category,
            limit: 8,
          });
          setRelatedProducts(
            related.filter((p) => p._id !== fetched._id && p.slug !== fetched.slug)
          );
        }
      }
    } catch (err) {
      console.error("ProductDetail loadProduct error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, initialProduct]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Set initial size when initialProduct is available
  useEffect(() => {
    if (initialProduct) {
      const sizes = initialProduct.sizes || initialProduct.size || ["S", "M", "L", "XL"];
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    }
  }, [initialProduct]);

  if (isLoading || !product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-4">
          LOADING ARCHIVE PIECE...
        </Text>
      </SafeAreaView>
    );
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE];

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : product.size && product.size.length > 0
      ? product.size
      : ["S", "M", "L", "XL"];

  const parseBullets = (text?: string) => {
    if (!text || !text.trim()) return [];
    return text
      .split("\n")
      .map((line) => line.trim().replace(/^[•\-\*]\s*/, ""))
      .filter(Boolean);
  };

  const fabricBullets = parseBullets(product.fabricSilhouette);
  const careBullets = parseBullets(product.careGuide);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  const handleAddToCart = () => {
    setIsAdded(true);
    addToCart({
      productId: product._id || product.id || product.slug,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      quantity,
      image: images[0],
      category: product.category,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      {/* Top Bar */}
      <View className="h-14 px-4 bg-white border-b border-neutral-200 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ArrowLeft size={22} color="#000000" />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          className="text-sm font-black font-mono uppercase tracking-tight max-w-[200px]"
        >
          {product.title}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("CartTab", { screen: "Cart" })}
          className="p-2 -mr-2 relative"
        >
          <ShoppingBag size={20} color="#000000" strokeWidth={2} />
          {totalItems > 0 && (
            <View className="absolute top-1 right-1 bg-black rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-[9px] font-mono font-bold">
                {totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Main Swipeable Image Carousel */}
        <View className="relative w-full aspect-[4/5] bg-neutral-100">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              if (idx !== selectedImageIndex && idx < images.length) {
                setSelectedImageIndex(idx);
              }
            }}
            scrollEventThrottle={16}
          >
            {images.map((imgUrl, i) => (
              <View key={i} style={{ width }} className="h-full">
                <Image
                  source={{ uri: imgUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Condition Tag from DB */}
          {product.condition ? (
            <View className="absolute top-3 left-3 bg-black px-2.5 py-1">
              <Text className="text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                {product.condition}
              </Text>
            </View>
          ) : null}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center space-x-1.5">
              {images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 ${
                    selectedImageIndex === i ? "w-6 bg-black" : "w-2 bg-black/30"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <View className="py-2.5 px-4 bg-white border-b border-neutral-100 flex-row space-x-2">
            {images.map((imgUrl, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedImageIndex(i)}
                className={`w-14 h-16 mr-2 border-2 ${
                  selectedImageIndex === i ? "border-black" : "border-transparent"
                }`}
              >
                <Image
                  source={{ uri: imgUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Product Details Info */}
        <View className="p-4 bg-white space-y-4">
          <View>
            <Text className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
              {product.category}
            </Text>
            <Text className="text-xl font-black font-mono uppercase tracking-tight text-black mt-0.5">
              {product.title}
            </Text>
          </View>

          {/* Price & Discount */}
          <View className="flex-row items-center space-x-3">
            <Text className="text-2xl font-black font-mono text-black">
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price ? (
              <Text className="text-sm font-mono text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </Text>
            ) : null}
            {discountPercent !== null && (
              <View className="bg-black px-2 py-0.5">
                <Text className="text-white text-[10px] font-mono font-bold uppercase">
                  SAVE {discountPercent}%
                </Text>
              </View>
            )}
          </View>

          {/* Free Shipping Callout from settings */}
          <View className="p-3 bg-neutral-50 border border-neutral-200 flex-row items-center space-x-2">
            <Truck size={16} color="#000000" />
            <Text className="text-xs text-neutral-700 font-medium">
              Free shipping on orders over{" "}
              <Text className="font-mono font-bold text-black">
                {formatPrice(freeShippingThreshold)}
              </Text>
              .
            </Text>
          </View>

          {/* Size Selector */}
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                SELECT SIZE
              </Text>
              <Text className="text-[11px] font-mono text-neutral-500">
                BOX FIT
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {availableSizes.map((s) => {
                const isSelected = selectedSize === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSelectedSize(s)}
                    className={`min-w-[48px] py-2.5 px-4 border items-center justify-center mr-2 mb-2 ${
                      isSelected
                        ? "bg-black border-black"
                        : "bg-white border-neutral-300"
                    }`}
                  >
                    <Text
                      className={`text-xs font-mono font-bold uppercase ${
                        isSelected ? "text-white" : "text-black"
                      }`}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quantity Stepper */}
          <View className="flex-row items-center justify-between py-2 border-t border-b border-neutral-100">
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              QUANTITY
            </Text>
            <View className="flex-row items-center border border-neutral-300 bg-neutral-50">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2"
              >
                <Minus size={14} color="#000000" />
              </TouchableOpacity>
              <Text className="px-4 text-xs font-mono font-bold text-black">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="p-2"
              >
                <Plus size={14} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ADD TO BAG Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddToCart}
            className={`w-full py-4 items-center justify-center flex-row space-x-2 ${
              isAdded ? "bg-emerald-600" : "bg-black"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={16} color="#ffffff" strokeWidth={3} />
                <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest">
                  ADDED TO BAG
                </Text>
              </>
            ) : (
              <>
                <ShoppingBag size={16} color="#ffffff" strokeWidth={2} />
                <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest">
                  ADD TO BAG • {formatPrice(product.price * quantity)}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Description */}
          <View className="pt-2">
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-1.5">
              DESCRIPTION
            </Text>
            <Text className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </Text>
          </View>

          {/* Expandable Specifications Accordion (Dynamic from DB) */}
          <View className="border-t border-neutral-200 divide-y divide-neutral-200 mt-2">
            {/* Fabric & Silhouette */}
            <View>
              <TouchableOpacity
                onPress={() =>
                  setOpenAccordion(openAccordion === "fabric" ? null : "fabric")
                }
                className="py-3.5 flex-row items-center justify-between"
              >
                <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  FABRIC &amp; SILHOUETTE
                </Text>
                <ChevronDown
                  size={16}
                  color="#737373"
                  style={{
                    transform: [{ rotate: openAccordion === "fabric" ? "180deg" : "0deg" }],
                  }}
                />
              </TouchableOpacity>

              {openAccordion === "fabric" && (
                <View className="pb-3.5 space-y-1.5">
                  {fabricBullets.map((bullet, idx) => (
                    <Text key={idx} className="text-xs text-neutral-600 leading-5">
                      • {bullet}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Care & Wash Guide */}
            <View>
              <TouchableOpacity
                onPress={() =>
                  setOpenAccordion(openAccordion === "care" ? null : "care")
                }
                className="py-3.5 flex-row items-center justify-between"
              >
                <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  CARE &amp; WASH GUIDE
                </Text>
                <ChevronDown
                  size={16}
                  color="#737373"
                  style={{
                    transform: [{ rotate: openAccordion === "care" ? "180deg" : "0deg" }],
                  }}
                />
              </TouchableOpacity>

              {openAccordion === "care" && (
                <View className="pb-3.5 space-y-1.5">
                  {careBullets.map((bullet, idx) => (
                    <Text key={idx} className="text-xs text-neutral-600 leading-5">
                      • {bullet}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Trust badges */}
          <View className="p-3 bg-neutral-100 flex-row items-center justify-center space-x-2 mt-2">
            <ShieldCheck size={16} color="#000000" />
            <Text className="text-[11px] font-mono text-neutral-700">
              100% Authenticity &amp; Curated Thrift Guarantee
            </Text>
          </View>
        </View>

        {/* Related Products from DB */}
        {relatedProducts.length > 0 && (
          <View className="py-6 bg-[#fbfbfb] border-t border-neutral-200">
            <View className="px-4 mb-3">
              <Text className="text-sm font-black font-mono uppercase tracking-wider text-black">
                MORE FROM THIS CATEGORY
              </Text>
              <View className="w-8 h-0.5 bg-black mt-1" />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {relatedProducts.map((p) => (
                <View key={p._id} className="mr-3">
                  <ProductCard product={p} cardWidth={160} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
