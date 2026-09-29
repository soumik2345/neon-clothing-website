import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Package,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Phone,
  FileText,
  Server,
  RefreshCw,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { getActiveApiUrl, setActiveApiUrl, api } from "../services/api";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { orders, fetchUserOrders } = useCart();
  const { formatPrice, currency, updateCurrency, settings, refreshSettings } = useSettings();

  const [apiUrlInput, setApiUrlInput] = useState(getActiveApiUrl());
  const [userEmail, setUserEmail] = useState("");
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const currencies = ["Tk", "৳", "₹", "$"];

  const handleUpdateApiUrl = async () => {
    try {
      setIsTestingApi(true);
      setActiveApiUrl(apiUrlInput);
      await Promise.all([refreshSettings(), fetchUserOrders(userEmail || undefined)]);
      Alert.alert("API Connected", `Successfully connected to: ${getActiveApiUrl()}`);
    } catch (err: any) {
      Alert.alert(
        "Connection Warning",
        `Could not reach API at ${apiUrlInput}. Verify that Next.js server is running on that address.`
      );
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleFetchOrdersByEmail = async () => {
    if (!userEmail.trim()) {
      Alert.alert("Input Required", "Please enter your order email address.");
      return;
    }
    try {
      setIsFetchingOrders(true);
      const fetched = await fetchUserOrders(userEmail.trim());
      Alert.alert("Orders Synced", `Found ${fetched.length} orders for ${userEmail.trim()}`);
    } catch (err) {
      Alert.alert("Sync Error", "Could not fetch orders. Please verify server connection.");
    } finally {
      setIsFetchingOrders(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <Header title="MY ACCOUNT" showSearch={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* User Profile Card */}
        <View className="bg-white p-4 border border-neutral-200 mb-4 flex-row items-center space-x-3">
          <View className="w-14 h-14 bg-black rounded-full items-center justify-center mr-3">
            <User size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-black font-mono uppercase text-black">
              NEON ARCHIVE CLIENT
            </Text>
            <Text className="text-xs text-neutral-500 font-mono">
              {userEmail || "Guest Session"}
            </Text>
            <Text className="text-[10px] text-neutral-400 font-mono mt-0.5">
              DATABASE CONNECTED • {settings.storeName}
            </Text>
          </View>
        </View>

        {/* Currency Switcher */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
            ACTIVE CURRENCY
          </Text>
          <Text className="text-[11px] text-neutral-500 mb-3">
            Switch currency dynamically across all prices and receipts:
          </Text>
          <View className="flex-row space-x-2">
            {currencies.map((curr) => {
              const isSelected = currency.toLowerCase() === curr.toLowerCase();
              return (
                <TouchableOpacity
                  key={curr}
                  onPress={() => updateCurrency(curr)}
                  className={`px-4 py-2 border mr-2 ${
                    isSelected
                      ? "bg-black border-black"
                      : "bg-neutral-50 border-neutral-300"
                  }`}
                >
                  <Text
                    className={`text-xs font-mono font-bold uppercase ${
                      isSelected ? "text-white" : "text-black"
                    }`}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sync Orders by Email */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-1">
            SYNC PREVIOUS ORDERS
          </Text>
          <Text className="text-[11px] text-neutral-500 mb-2">
            Enter your email to load your previous orders directly from the database:
          </Text>
          <View className="flex-row space-x-2">
            <TextInput
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="e.g. name@mail.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 p-2 bg-neutral-50 border border-neutral-300 text-xs font-mono text-black mr-2"
            />
            <TouchableOpacity
              onPress={handleFetchOrdersByEmail}
              disabled={isFetchingOrders}
              className="bg-black px-4 items-center justify-center flex-row space-x-1"
            >
              {isFetchingOrders ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-xs font-mono font-bold uppercase">
                  SYNC
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Order History */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <View className="flex-row items-center justify-between border-b border-neutral-200 pb-2 mb-3">
            <View className="flex-row items-center space-x-2">
              <Package size={16} color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                ORDER HISTORY ({orders.length})
              </Text>
            </View>
          </View>

          {orders.length === 0 ? (
            <Text className="text-xs text-neutral-500 py-4 text-center font-mono">
              No orders found. Place an order to see it here!
            </Text>
          ) : (
            <View className="space-y-3">
              {orders.map((order) => (
                <TouchableOpacity
                  key={order._id || order.id || order.orderNumber}
                  onPress={() => navigation.navigate("OrderSuccess", { order })}
                  className="p-3 bg-neutral-50 border border-neutral-200 mb-2"
                >
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs font-mono font-bold text-black">
                      #{order.orderNumber}
                    </Text>
                    <View
                      className={`px-2 py-0.5 ${
                        order.status === "delivered"
                          ? "bg-emerald-100"
                          : "bg-neutral-200"
                      }`}
                    >
                      <Text
                        className={`text-[9px] font-mono font-bold uppercase ${
                          order.status === "delivered"
                            ? "text-emerald-800"
                            : "text-neutral-700"
                        }`}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[11px] text-neutral-500 font-mono">
                    {order.items?.length || 0} item(s) • Total: {formatPrice(order.total)}
                  </Text>

                  <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                    <View className="flex-row items-center space-x-1">
                      <FileText size={12} color="#000000" />
                      <Text className="text-[10px] font-mono font-bold uppercase text-black">
                        VIEW CASH MEMO
                      </Text>
                    </View>
                    <ChevronRight size={14} color="#737373" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Backend API Configuration */}
        <View className="bg-white p-4 border border-neutral-200 mb-4">
          <View className="flex-row items-center space-x-2 mb-2">
            <Server size={14} color="#000000" />
            <Text className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              BACKEND SERVER CONNECTION
            </Text>
          </View>
          <Text className="text-[10px] text-neutral-500 font-mono mb-2">
            Current Endpoint: {getActiveApiUrl()}
          </Text>
          <View className="flex-row space-x-2">
            <TextInput
              value={apiUrlInput}
              onChangeText={setApiUrlInput}
              placeholder="http://192.168.0.xxx:3000/api"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              className="flex-1 p-2 bg-neutral-50 border border-neutral-300 text-[11px] font-mono text-black mr-2"
            />
            <TouchableOpacity
              onPress={handleUpdateApiUrl}
              disabled={isTestingApi}
              className="bg-black px-3 items-center justify-center flex-row space-x-1"
            >
              {isTestingApi ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <RefreshCw size={12} color="#ffffff" />
                  <Text className="text-white text-[10px] font-mono font-bold uppercase ml-1">
                    TEST
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Support & Policies */}
        <View className="bg-white border border-neutral-200 mb-12 divide-y divide-neutral-100">
          <TouchableOpacity
            onPress={() => navigation.navigate("TrackOrderTab")}
            className="p-3.5 flex-row items-center justify-between"
          >
            <View className="flex-row items-center space-x-3">
              <Package size={16} color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase text-black ml-2">
                LIVE ORDER TRACKING
              </Text>
            </View>
            <ChevronRight size={16} color="#a3a3a3" />
          </TouchableOpacity>

          <View className="p-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <RotateCcw size={16} color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase text-black ml-2">
                7-DAY EASY RETURN POLICY
              </Text>
            </View>
            <ChevronRight size={16} color="#a3a3a3" />
          </View>

          <View className="p-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <ShieldCheck size={16} color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase text-black ml-2">
                100% AUTHENTICITY GUARANTEE
              </Text>
            </View>
            <ChevronRight size={16} color="#a3a3a3" />
          </View>

          <View className="p-3.5 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <Phone size={16} color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase text-black ml-2">
                SUPPORT: {settings.supportPhone}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
