import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Search,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { OrderType } from "../types";

export function TrackOrderScreen() {
  const route = useRoute<any>();
  const initialNum = route?.params?.orderNumber || "";

  const { orders } = useCart();
  const { formatPrice } = useSettings();

  const [orderQuery, setOrderQuery] = useState(initialNum);
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchOrder = useCallback(
    async (query: string) => {
      const clean = query.trim();
      if (!clean) return;

      setIsSearching(true);
      setErrorMessage("");

      // 1. Check local recent orders first
      const local = orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === clean.toLowerCase() ||
          o._id === clean ||
          o.id === clean
      );
      if (local) {
        setActiveOrder(local);
        setIsSearching(false);
        return;
      }

      // 2. Fetch directly from MongoDB backend API
      try {
        const fetched = await api.getOrderById(clean);
        if (fetched && (fetched.orderNumber || fetched._id)) {
          setActiveOrder(fetched);
        } else {
          setErrorMessage(`No order found matching "${clean}".`);
        }
      } catch (err: any) {
        console.warn("TrackOrder search error:", err);
        setErrorMessage(
          `Order "${clean}" was not found in the database. Please verify your order number (e.g. NEON-1234).`
        );
      } finally {
        setIsSearching(false);
      }
    },
    [orders]
  );

  useEffect(() => {
    if (initialNum) {
      searchOrder(initialNum);
    } else if (orders.length > 0) {
      setActiveOrder(orders[0]);
      setOrderQuery(orders[0].orderNumber);
    }
  }, [initialNum, orders, searchOrder]);

  const steps = [
    { key: "pending", title: "ORDER PLACED", desc: "Received in database & queue", icon: Clock },
    { key: "processing", title: "PROCESSING & PACKED", desc: "Curated with quality inspection", icon: Package },
    { key: "shipped", title: "DISPATCHED / ON THE ROAD", desc: "Courier partner in transit", icon: Truck },
    { key: "delivered", title: "DELIVERED", desc: "Package handed to customer", icon: CheckCircle2 },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!activeOrder) return "upcoming";
    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIdx = statusOrder.indexOf(activeOrder.status);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (currentIdx >= stepIdx) return "completed";
    return "upcoming";
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <Header title="TRACK ORDER" showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        {/* Search Order Number */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-2">
            ENTER ORDER NUMBER OR ID
          </Text>
          <View className="flex-row space-x-2">
            <View className="flex-1 flex-row items-center bg-neutral-50 border border-neutral-300 px-3 py-2 mr-2">
              <Package size={16} color="#737373" />
              <TextInput
                value={orderQuery}
                onChangeText={setOrderQuery}
                placeholder="e.g. NEON-1234"
                placeholderTextColor="#a3a3a3"
                className="flex-1 ml-2 text-xs font-mono uppercase text-black py-0"
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity
              disabled={isSearching}
              onPress={() => searchOrder(orderQuery)}
              className="bg-black px-4 items-center justify-center flex-row space-x-1"
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Search size={14} color="#ffffff" />
                  <Text className="text-white text-xs font-mono font-bold uppercase ml-1">
                    TRACK
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {errorMessage.length > 0 && (
            <Text className="text-xs text-red-600 font-mono mt-2">
              {errorMessage}
            </Text>
          )}
        </View>

        {activeOrder ? (
          <View className="space-y-4 pb-12">
            {/* Status Card */}
            <View className="bg-white p-5 border border-neutral-200">
              <View className="flex-row justify-between items-start border-b border-neutral-200 pb-3 mb-4">
                <View>
                  <Text className="text-xs font-mono font-bold uppercase text-neutral-400">
                    LIVE STATUS
                  </Text>
                  <Text className="text-base font-black font-mono uppercase text-black mt-0.5">
                    {activeOrder.status === "delivered"
                      ? "PACKAGE DELIVERED"
                      : activeOrder.status === "shipped"
                      ? "OUT FOR DELIVERY"
                      : activeOrder.status === "processing"
                      ? "PROCESSING & PACKED"
                      : "ORDER PLACED (PENDING)"}
                  </Text>
                </View>
                <View className="bg-black px-2 py-0.5">
                  <Text className="text-white text-[10px] font-mono font-bold uppercase">
                    #{activeOrder.orderNumber}
                  </Text>
                </View>
              </View>

              {/* Stepper Timeline */}
              <View className="space-y-4 py-2">
                {steps.map((step, idx) => {
                  const state = getStepStatus(step.key);
                  const isDone = state === "completed";
                  const StepIcon = step.icon;

                  return (
                    <View key={step.key} className="flex-row items-start space-x-3">
                      {/* Left icon circle & line */}
                      <View className="items-center mr-3">
                        <View
                          className={`w-7 h-7 rounded-full items-center justify-center border ${
                            isDone
                              ? "bg-black border-black"
                              : "bg-white border-neutral-300"
                          }`}
                        >
                          <StepIcon
                            size={14}
                            color={isDone ? "#ffffff" : "#a3a3a3"}
                          />
                        </View>
                        {idx < steps.length - 1 && (
                          <View
                            className={`w-0.5 h-8 my-1 ${
                              isDone ? "bg-black" : "bg-neutral-200"
                            }`}
                          />
                        )}
                      </View>

                      {/* Content */}
                      <View className="flex-1 pt-0.5">
                        <Text
                          className={`text-xs font-mono font-bold uppercase ${
                            isDone ? "text-black" : "text-neutral-400"
                          }`}
                        >
                          {step.title}
                        </Text>
                        <Text className="text-[11px] text-neutral-500">
                          {step.desc}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Delivery Destination */}
            {activeOrder.customer && (
              <View className="bg-white p-4 border border-neutral-200">
                <View className="flex-row items-center space-x-2 mb-2">
                  <MapPin size={16} color="#000000" />
                  <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                    DELIVERY DESTINATION
                  </Text>
                </View>
                <Text className="text-xs font-bold font-mono text-black uppercase">
                  {activeOrder.customer.name}
                </Text>
                <Text className="text-xs text-neutral-600 mt-0.5">
                  {activeOrder.customer.address}, {activeOrder.customer.city}
                </Text>
                <Text className="text-xs text-neutral-600 font-mono mt-0.5">
                  {activeOrder.customer.phone}
                </Text>
              </View>
            )}

            {/* Package Contents */}
            {activeOrder.items && activeOrder.items.length > 0 && (
              <View className="bg-white p-4 border border-neutral-200">
                <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-3">
                  ORDER CONTENTS ({activeOrder.items.length})
                </Text>
                {activeOrder.items.map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row justify-between items-center py-2 border-b border-neutral-100 last:border-b-0"
                  >
                    <Text
                      numberOfLines={1}
                      className="text-xs font-mono text-neutral-800 flex-1 mr-2"
                    >
                      {item.title} (x{item.quantity}) • {item.size}
                    </Text>
                    <Text className="text-xs font-mono font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          !isSearching && (
            <View className="py-16 items-center justify-center bg-white border border-neutral-200 p-6">
              <Package size={32} color="#a3a3a3" />
              <Text className="text-xs font-mono font-bold uppercase text-black mt-2">
                NO ORDER SELECTED
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 font-mono">
                Enter your Order Number above to track its live status from the database.
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
