import React from "react";
import { View, Text } from "react-native";
import { useSettings } from "../context/SettingsContext";

interface AnnouncementBarProps {
  customText?: string;
}

export function AnnouncementBar({ customText }: AnnouncementBarProps) {
  const { formatPrice, freeShippingThreshold } = useSettings();

  const displayText =
    customText || `FREE SHIPPING ON ALL ORDERS ABOVE ${formatPrice(freeShippingThreshold)}`;

  return (
    <View className="bg-black py-2 px-3 items-center justify-center border-b border-neutral-800">
      <Text className="text-white text-[10px] font-mono tracking-widest uppercase font-semibold text-center">
        {displayText}
      </Text>
    </View>
  );
}
