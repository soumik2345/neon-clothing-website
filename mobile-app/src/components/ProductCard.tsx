import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { ProductType } from "../types";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface ProductCardProps {
  product: ProductType;
  cardWidth?: number | string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product, cardWidth }: ProductCardProps) {
  const navigation = useNavigation<any>();
  const { addToCart } = useCart();
  const { formatPrice } = useSettings();
  const [isAdded, setIsAdded] = useState(false);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [FALLBACK_IMAGE];

  const sizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : product.size && product.size.length > 0
    ? product.size
    : ["M", "L", "XL"];

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
      size: sizes[0] || "M",
      quantity: 1,
      image: images[0],
      category: product.category,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handlePress = () => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <View
      style={cardWidth ? { width: cardWidth as any } : { flex: 1 }}
      className="bg-white border border-neutral-200 mb-3 overflow-hidden"
    >
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
        {/* Product Image */}
        <View className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
          <Image
            source={{ uri: images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Multi-image photo count badge */}
          {images.length > 1 && (
            <View className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5">
              <Text className="text-white text-[9px] font-mono font-bold">
                +{images.length - 1} photos
              </Text>
            </View>
          )}

          {/* Condition tag */}
          {product.condition ? (
            <View className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 border border-black/10">
              <Text className="text-black text-[8px] font-mono font-bold uppercase">
                {product.condition}
              </Text>
            </View>
          ) : null}

          {/* Discount Tag */}
          {discountPercent !== null && (
            <View className="absolute top-2 right-2 bg-black px-1.5 py-0.5">
              <Text className="text-white text-[9px] font-mono font-bold uppercase">
                -{discountPercent}%
              </Text>
            </View>
          )}
        </View>

        {/* Product Meta */}
        <View className="p-2.5">
          <Text
            numberOfLines={1}
            className="text-xs font-bold text-neutral-900 uppercase tracking-tight"
          >
            {product.title}
          </Text>

          <View className="flex-row items-center space-x-2 mt-1">
            <Text className="text-xs font-black font-mono text-black">
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && product.originalPrice > product.price ? (
              <Text className="text-[10px] font-mono text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {/* Streetwear Brutalist ADD TO CART Button */}
      <View className="px-2.5 pb-2.5">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddToCart}
          className={`w-full py-2.5 items-center justify-center flex-row space-x-1 ${
            isAdded ? "bg-emerald-600" : "bg-black"
          }`}
        >
          {isAdded ? (
            <>
              <Check size={12} color="#ffffff" strokeWidth={3} />
              <Text className="text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                ADDED TO BAG
              </Text>
            </>
          ) : (
            <Text className="text-white text-[10px] font-mono font-bold uppercase tracking-wider">
              ADD TO BAG
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
