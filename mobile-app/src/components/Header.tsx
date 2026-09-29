import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Search, ShoppingBag, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface HeaderProps {
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
  showSearch?: boolean;
}

export function Header({
  showBack = false,
  onBackPress,
  title,
  showSearch = true,
}: HeaderProps) {
  const navigation = useNavigation<any>();
  const { totalItems } = useCart();
  const { settings } = useSettings();

  const displayTitle = title || settings.storeName || "NEON";

  return (
    <View className="bg-white border-b border-neutral-200 h-14 px-4 flex-row items-center justify-between relative">
      {/* Left side: Back Button or spacer */}
      <View className="w-10 z-10">
        {showBack ? (
          <TouchableOpacity
            onPress={onBackPress || (() => navigation.goBack())}
            className="p-1 -ml-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={22} color="#000000" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center: Brand Name or Screen Title perfectly centered */}
      <View className="absolute left-0 right-0 items-center justify-center pointer-events-none">
        <Text className="text-xl font-black uppercase font-mono tracking-tight text-black">
          {displayTitle}
        </Text>
      </View>

      {/* Right side: Search and Shopping Bag */}
      <View className="flex-row items-center space-x-2 z-10">
        {showSearch && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopTab", { screen: "Shop" })}
            className="p-2"
          >
            <Search size={20} color="#000000" strokeWidth={2} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("CartTab", { screen: "Cart" })}
          className="p-2 relative"
        >
          <ShoppingBag size={20} color="#000000" strokeWidth={2} />
          {totalItems > 0 && (
            <View className="absolute top-1 right-0.5 bg-black rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-[9px] font-mono font-bold">
                {totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
