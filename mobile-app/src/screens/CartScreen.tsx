import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

export function CartScreen() {
  const navigation = useNavigation<any>();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discount,
    couponCode,
    applyCoupon,
    total,
  } = useCart();
  const { formatPrice, freeShippingThreshold } = useSettings();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(couponCode !== "");

  const difference = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = () => {
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess(true);
      setCouponError("");
    } else {
      setCouponError("Invalid code. Use NEON10 for 10% off.");
      setCouponSuccess(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdfdfd]" edges={["top"]}>
      <Header title={`BAG (${cart.length})`} showSearch={false} />

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-16 h-16 bg-neutral-100 rounded-full items-center justify-center mb-4">
            <ShoppingBag size={28} color="#a3a3a3" />
          </View>
          <Text className="text-base font-black font-mono uppercase text-black">
            YOUR BAG IS EMPTY
          </Text>
          <Text className="text-xs text-neutral-500 text-center mt-1 mb-6 max-w-[240px]">
            Looks like you haven't added any curated streetwear drops yet.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopTab", { screen: "Shop" })}
            className="bg-black py-3 px-6"
          >
            <Text className="text-white text-xs font-mono font-bold uppercase tracking-wider">
              START SHOPPING
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {/* Free Shipping Progress Indicator */}
          <View className="bg-neutral-50 p-4 border-b border-neutral-200">
            <Text className="text-xs font-medium text-neutral-800">
              {difference <= 0 ? (
                <Text className="text-emerald-600 font-bold">
                  🎉 YOU UNLOCKED FREE SHIPPING!
                </Text>
              ) : (
                <Text>
                  Add{" "}
                  <Text className="font-mono font-bold text-black">
                    {formatPrice(difference)}
                  </Text>{" "}
                  more for Free Shipping
                </Text>
              )}
            </Text>

            {/* Bar */}
            <View className="w-full bg-neutral-200 h-1.5 mt-2 rounded-full overflow-hidden">
              <View
                className="bg-black h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>

          {/* Cart Items List */}
          <View className="p-4 divide-y divide-neutral-200">
            {cart.map((item) => (
              <View
                key={`${item.productId}-${item.size}`}
                className="py-4 flex-row space-x-3"
              >
                {/* Image */}
                <View className="w-20 h-24 bg-neutral-100 mr-3 border border-neutral-200">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Info */}
                <View className="flex-1 justify-between">
                  <View>
                    <View className="flex-row items-start justify-between">
                      <Text
                        numberOfLines={1}
                        className="text-xs font-bold font-mono uppercase text-black flex-1 mr-2"
                      >
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          removeFromCart(item.productId, item.size)
                        }
                        className="p-1"
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </TouchableOpacity>
                    </View>

                    <View className="self-start bg-neutral-100 px-2 py-0.5 mt-1">
                      <Text className="text-[10px] font-mono font-bold text-neutral-600">
                        SIZE: {item.size}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    {/* Stepper */}
                    <View className="flex-row items-center border border-neutral-300 bg-neutral-50">
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="p-1.5"
                      >
                        <Minus size={12} color="#000000" />
                      </TouchableOpacity>
                      <Text className="px-3 text-xs font-mono font-bold text-black">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="p-1.5"
                      >
                        <Plus size={12} color="#000000" />
                      </TouchableOpacity>
                    </View>

                    {/* Price */}
                    <Text className="text-xs font-mono font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Promo Code Box */}
          <View className="p-4 bg-white border-t border-b border-neutral-200 my-2">
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
              DISCOUNT CODE
            </Text>
            <View className="flex-row space-x-2">
              <View className="flex-1 flex-row items-center bg-neutral-50 border border-neutral-300 px-3 py-2 mr-2">
                <Tag size={14} color="#737373" />
                <TextInput
                  value={inputCoupon}
                  onChangeText={setInputCoupon}
                  placeholder="Try 'NEON10' (10% off)"
                  placeholderTextColor="#a3a3a3"
                  className="flex-1 ml-2 text-xs font-mono uppercase text-black py-0"
                  autoCapitalize="characters"
                />
              </View>
              <TouchableOpacity
                onPress={handleApplyCoupon}
                className="bg-black px-4 items-center justify-center"
              >
                <Text className="text-white text-xs font-mono font-bold uppercase">
                  APPLY
                </Text>
              </TouchableOpacity>
            </View>

            {couponSuccess && (
              <View className="flex-row items-center space-x-1 mt-2">
                <Check size={12} color="#16a34a" />
                <Text className="text-[11px] font-mono font-bold text-emerald-600">
                  Coupon NEON10 applied! (10% off)
                </Text>
              </View>
            )}

            {couponError.length > 0 && (
              <Text className="text-[11px] font-mono text-red-600 mt-2">
                {couponError}
              </Text>
            )}
          </View>

          {/* Pricing Summary */}
          <View className="p-4 bg-white border-t border-neutral-200 space-y-2 mb-8">
            <View className="flex-row justify-between text-xs">
              <Text className="text-neutral-600 text-xs">Subtotal</Text>
              <Text className="font-mono font-bold text-black text-xs">
                {formatPrice(subtotal)}
              </Text>
            </View>

            <View className="flex-row justify-between text-xs">
              <Text className="text-neutral-600 text-xs">Shipping</Text>
              <Text className="font-mono font-bold text-black text-xs">
                {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
              </Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between text-xs">
                <Text className="text-emerald-600 text-xs font-bold">
                  Discount (10%)
                </Text>
                <Text className="font-mono font-bold text-emerald-600 text-xs">
                  -{formatPrice(discount)}
                </Text>
              </View>
            )}

            <View className="pt-3 border-t border-neutral-200 flex-row justify-between items-center">
              <Text className="text-sm font-black font-mono uppercase text-black">
                TOTAL AMOUNT
              </Text>
              <Text className="text-lg font-black font-mono text-black">
                {formatPrice(total)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Checkout")}
              className="w-full py-4 bg-black flex-row items-center justify-center space-x-2 mt-4"
            >
              <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest">
                PROCEED TO CHECKOUT
              </Text>
              <ArrowRight size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
