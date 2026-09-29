import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react-native";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

export function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { cart, subtotal, shippingFee, discount, total, placeOrder, isPlacingOrder } = useCart();
  const { formatPrice } = useSettings();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const handleConfirmOrder = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Required Field", "Please enter your contact phone number.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Required Field", "Please enter your delivery street address.");
      return;
    }
    if (!city.trim()) {
      Alert.alert("Required Field", "Please enter your city.");
      return;
    }

    try {
      const order = await placeOrder(
        {
          name: name.trim(),
          email: email.trim() || `${phone.replace(/\D/g, "") || "user"}@guest.neonthrift.com`,
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim() || "0000",
        },
        paymentMethod
      );

      navigation.replace("OrderSuccess", { order });
    } catch (error: any) {
      console.error("Order placement error:", error);
      Alert.alert(
        "Order Placement Failed",
        error?.message || "Could not save your order to the server. Please check your connection and retry."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <Header title="CHECKOUT" showBack={true} showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        {/* Shipping Address Section */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <View className="flex-row items-center space-x-2 border-b border-neutral-200 pb-2 mb-3">
            <Truck size={16} color="#000000" />
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              1. SHIPPING DETAILS
            </Text>
          </View>

          <View className="space-y-3">
            <View>
              <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                Full Name *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor="#9ca3af"
                className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black"
              />
            </View>

            <View className="flex-row space-x-3">
              <View className="flex-1 mr-2">
                <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                  Phone Number *
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="e.g. 01712345678"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black"
                />
              </View>

              <View className="flex-1">
                <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                  Email Address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@mail.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black"
                />
              </View>
            </View>

            <View>
              <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                Street Address *
              </Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="House, road, flat, landmark"
                placeholderTextColor="#9ca3af"
                className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black"
              />
            </View>

            <View className="flex-row space-x-3">
              <View className="flex-1 mr-2">
                <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                  City *
                </Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Dhaka / Kolkata"
                  placeholderTextColor="#9ca3af"
                  className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black"
                />
              </View>

              <View className="flex-1">
                <Text className="text-[11px] font-mono font-bold text-neutral-600 uppercase mb-1">
                  Postal Code
                </Text>
                <TextInput
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="e.g. 1213"
                  placeholderTextColor="#9ca3af"
                  className="p-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium text-black font-mono"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <View className="flex-row items-center space-x-2 border-b border-neutral-200 pb-2 mb-3">
            <CreditCard size={16} color="#000000" />
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              2. PAYMENT METHOD
            </Text>
          </View>

          <View className="space-y-2.5">
            {/* COD */}
            <TouchableOpacity
              onPress={() => setPaymentMethod("cod")}
              className={`p-3 border flex-row items-center justify-between mb-2 ${
                paymentMethod === "cod"
                  ? "bg-neutral-50 border-black"
                  : "bg-white border-neutral-200"
              }`}
            >
              <View className="flex-row items-center space-x-3">
                <Banknote size={18} color="#000000" />
                <View className="ml-2">
                  <Text className="text-xs font-mono font-bold uppercase text-black">
                    CASH ON DELIVERY (COD)
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Pay upon package handover at your doorstep.
                  </Text>
                </View>
              </View>
              <View
                className={`w-4 h-4 rounded-full border items-center justify-center ${
                  paymentMethod === "cod" ? "border-black" : "border-neutral-300"
                }`}
              >
                {paymentMethod === "cod" && (
                  <View className="w-2 h-2 rounded-full bg-black" />
                )}
              </View>
            </TouchableOpacity>

            {/* Online Payment */}
            <TouchableOpacity
              onPress={() => setPaymentMethod("card")}
              className={`p-3 border flex-row items-center justify-between ${
                paymentMethod === "card"
                  ? "bg-neutral-50 border-black"
                  : "bg-white border-neutral-200"
              }`}
            >
              <View className="flex-row items-center space-x-3">
                <CreditCard size={18} color="#000000" />
                <View className="ml-2">
                  <Text className="text-xs font-mono font-bold uppercase text-black">
                    ONLINE CARD / MOBILE BANKING
                  </Text>
                  <Text className="text-[10px] text-neutral-500">
                    Instant 100% encrypted checkout.
                  </Text>
                </View>
              </View>
              <View
                className={`w-4 h-4 rounded-full border items-center justify-center ${
                  paymentMethod === "card" ? "border-black" : "border-neutral-300"
                }`}
              >
                {paymentMethod === "card" && (
                  <View className="w-2 h-2 rounded-full bg-black" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Review & Total */}
        <View className="bg-white p-4 border border-neutral-200 mb-8 space-y-3">
          <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
            3. ORDER SUMMARY ({cart.length} ITEMS)
          </Text>

          {cart.map((item) => (
            <View
              key={`${item.productId}-${item.size}`}
              className="flex-row justify-between items-center py-1"
            >
              <Text numberOfLines={1} className="text-xs text-neutral-700 flex-1 mr-2">
                {item.title} (x{item.quantity}) • {item.size}
              </Text>
              <Text className="text-xs font-mono font-bold text-black">
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View className="pt-2 border-t border-neutral-200 space-y-1.5">
            <View className="flex-row justify-between">
              <Text className="text-xs text-neutral-600">Subtotal</Text>
              <Text className="text-xs font-mono font-bold text-black">
                {formatPrice(subtotal)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-neutral-600">Shipping</Text>
              <Text className="text-xs font-mono font-bold text-black">
                {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
              </Text>
            </View>
            {discount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-xs text-emerald-600">Discount</Text>
                <Text className="text-xs font-mono font-bold text-emerald-600">
                  -{formatPrice(discount)}
                </Text>
              </View>
            )}
            <View className="pt-2 border-t border-neutral-200 flex-row justify-between items-center">
              <Text className="text-sm font-black font-mono uppercase text-black">
                TOTAL TO PAY
              </Text>
              <Text className="text-xl font-black font-mono text-black">
                {formatPrice(total)}
              </Text>
            </View>
          </View>

          {/* Place Order CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isPlacingOrder}
            onPress={handleConfirmOrder}
            className={`w-full py-4 items-center justify-center mt-3 ${
              isPlacingOrder ? "bg-neutral-600" : "bg-black"
            }`}
          >
            {isPlacingOrder ? (
              <View className="flex-row items-center space-x-2">
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest ml-2">
                  SAVING ORDER TO DATABASE...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest">
                CONFIRM &amp; PLACE ORDER ({formatPrice(total)})
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-1.5 pt-1">
            <ShieldCheck size={14} color="#000000" />
            <Text className="text-[10px] text-neutral-500 font-mono">
              256-bit Encrypted Secure Checkout
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
