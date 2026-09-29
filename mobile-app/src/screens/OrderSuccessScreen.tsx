import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CheckCircle2, ArrowRight, Package } from "lucide-react-native";
import { OrderType } from "../types";
import { useSettings } from "../context/SettingsContext";

export function OrderSuccessScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { formatPrice, settings } = useSettings();
  const order: OrderType = route.params?.order;

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-base font-mono font-bold">No order details found.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTab")}
          className="mt-4 bg-black px-6 py-3"
        >
          <Text className="text-white text-xs font-mono font-bold uppercase">
            GO HOME
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#fdfdfd]" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        {/* Success Header */}
        <View className="items-center py-6 bg-white border border-neutral-200 mb-4">
          <View className="w-16 h-16 bg-black rounded-full items-center justify-center mb-3">
            <CheckCircle2 size={32} color="#ffffff" strokeWidth={2.5} />
          </View>
          <Text className="text-xl font-black font-mono uppercase text-black tracking-tight">
            ORDER CONFIRMED
          </Text>
          <Text className="text-xs text-neutral-500 font-mono mt-1">
            Order #{order.orderNumber}
          </Text>
          <Text className="text-xs text-neutral-600 text-center px-6 mt-2">
            Thank you for shopping with {settings.storeName}. We are curating your order.
          </Text>
        </View>

        {/* Streetwear Cash Memo / Invoice Card */}
        <View className="bg-white border-2 border-black p-5 mb-6">
          {/* Memo Header */}
          <View className="border-b-2 border-black pb-4 mb-4">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-2xl font-black font-mono tracking-tight uppercase text-black">
                  {settings.storeName}
                </Text>
                <Text className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest mt-0.5">
                  Archival Streetwear Vault
                </Text>
                <Text className="text-[10px] text-neutral-600 font-mono mt-1">
                  Tel: {settings.supportPhone}
                </Text>
              </View>

              <View className="items-end">
                <View className="bg-black px-2 py-0.5 mb-1">
                  <Text className="text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                    CASH MEMO
                  </Text>
                </View>
                <Text className="text-xs font-mono font-bold text-black">
                  #{order.orderNumber}
                </Text>
                <Text className="text-[9px] text-neutral-500 font-mono mt-0.5">
                  {orderDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Info */}
          <View className="border-b border-neutral-200 pb-3 mb-3">
            <Text className="text-[10px] font-mono font-bold uppercase text-neutral-400">
              BILLED &amp; SHIPPED TO:
            </Text>
            <Text className="text-xs font-bold font-mono text-black uppercase mt-1">
              {order.customer.name}
            </Text>
            <Text className="text-xs text-neutral-600">
              {order.customer.address}, {order.customer.city}
            </Text>
            <Text className="text-[11px] font-mono text-neutral-600">
              {order.customer.phone}
            </Text>
            <Text className="text-[10px] font-mono font-bold uppercase text-black mt-1">
              PAYMENT: {order.paymentMethod.toUpperCase()} ({order.paymentStatus.toUpperCase()})
            </Text>
          </View>

          {/* Itemized Table */}
          <View className="space-y-2 mb-3">
            <Text className="text-[10px] font-mono font-bold uppercase text-neutral-400 mb-1">
              ORDER ITEMS:
            </Text>
            {order.items.map((item, idx) => (
              <View
                key={idx}
                className="flex-row justify-between items-center py-1 border-b border-neutral-100"
              >
                <View className="flex-1 mr-2">
                  <Text numberOfLines={1} className="text-xs font-mono font-bold text-black">
                    {item.title}
                  </Text>
                  <Text className="text-[10px] text-neutral-500 font-mono">
                    Size: {item.size} • Qty: {item.quantity}
                  </Text>
                </View>
                <Text className="text-xs font-mono font-bold text-black">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View className="border-t border-black pt-3 space-y-1">
            <View className="flex-row justify-between">
              <Text className="text-xs text-neutral-600">Subtotal</Text>
              <Text className="text-xs font-mono font-bold text-black">
                {formatPrice(order.subtotal)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-neutral-600">Shipping</Text>
              <Text className="text-xs font-mono font-bold text-black">
                {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
              </Text>
            </View>
            {order.discount ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-emerald-600">Discount</Text>
                <Text className="text-xs font-mono font-bold text-emerald-600">
                  -{formatPrice(order.discount)}
                </Text>
              </View>
            ) : null}
            <View className="flex-row justify-between items-center pt-2 border-t border-neutral-200">
              <Text className="text-sm font-black font-mono uppercase text-black">
                TOTAL PAID
              </Text>
              <Text className="text-lg font-black font-mono text-black">
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>

          {/* Barcode Visual */}
          <View className="mt-4 pt-3 border-t border-dashed border-neutral-300 items-center">
            <Text className="text-center font-mono text-xs tracking-[6px] font-bold text-black">
              ||| | |||| | ||| || ||| |
            </Text>
            <Text className="text-[9px] text-neutral-400 font-mono mt-1 uppercase">
              Authentic Archive Piece • No Fake Goods
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="space-y-3 mb-12">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TrackOrderTab", {
                screen: "TrackOrder",
                params: { orderNumber: order.orderNumber },
              })
            }
            className="w-full py-4 bg-black flex-row items-center justify-center space-x-2"
          >
            <Package size={16} color="#ffffff" />
            <Text className="text-white text-xs font-mono font-bold uppercase tracking-widest">
              TRACK LIVE ORDER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("HomeTab")}
            className="w-full py-3.5 bg-white border border-neutral-300 items-center justify-center flex-row space-x-2"
          >
            <Text className="text-black text-xs font-mono font-bold uppercase tracking-wider">
              CONTINUE SHOPPING
            </Text>
            <ArrowRight size={14} color="#000000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
