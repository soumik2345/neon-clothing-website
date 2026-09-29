import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowRight, Layers } from "lucide-react-native";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { CategoryType } from "../types";

export function CollectionsScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error("CollectionsScreen error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadCategories();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <Header title="COLLECTIONS" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            colors={["#000000"]}
          />
        }
      >
        {/* Intro */}
        <View className="mb-4">
          <View className="flex-row items-center space-x-1.5">
            <Layers size={14} color="#000000" />
            <Text className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
              ARCHIVE CURATION
            </Text>
          </View>
          <Text className="text-2xl font-black font-mono tracking-tight uppercase text-black mt-1">
            ALL CATEGORIES
          </Text>
          <Text className="text-xs text-neutral-500 mt-1">
            Authentic vintage streetwear drops categorized by fit, weight, and silhouette.
          </Text>
        </View>

        {isLoading && !isRefreshing ? (
          <View className="py-24 items-center justify-center">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-4">
              LOADING ARCHIVES...
            </Text>
          </View>
        ) : (
          <View className="space-y-4 pb-12">
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id || category.slug}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("ShopTab", {
                    screen: "Shop",
                    params: { selectedCategory: category.slug },
                  })
                }
                className="bg-black border border-neutral-800 overflow-hidden mb-4"
              >
                <View className="h-48 relative">
                  <Image
                    source={{ uri: category.image }}
                    className="w-full h-full opacity-65"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/40 justify-between p-5">
                    {category.itemCount !== undefined && (
                      <View className="bg-white/20 self-start px-2 py-0.5">
                        <Text className="text-white text-[10px] font-mono font-bold tracking-widest">
                          {category.itemCount} PIECES
                        </Text>
                      </View>
                    )}

                    <View>
                      <Text className="text-white text-2xl font-black font-mono tracking-tight uppercase">
                        {category.name}
                      </Text>
                      {category.description ? (
                        <Text className="text-neutral-300 text-xs mt-1 max-w-[280px]">
                          {category.description}
                        </Text>
                      ) : null}

                      <View className="flex-row items-center space-x-2 mt-3 self-start bg-white py-2 px-3">
                        <Text className="text-black text-xs font-mono font-bold uppercase tracking-wider">
                          EXPLORE DROP
                        </Text>
                        <ArrowRight size={14} color="#000000" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
