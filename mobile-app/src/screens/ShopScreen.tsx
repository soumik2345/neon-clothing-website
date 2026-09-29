import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { ProductType, CategoryType } from "../types";

export function ShopScreen() {
  const route = useRoute<any>();
  const initialCategory = route?.params?.selectedCategory || "all";

  const { formatPrice } = useSettings();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Update selectedCategory if route params change
  useEffect(() => {
    if (route?.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);
    }
  }, [route?.params?.selectedCategory]);

  const loadData = useCallback(async () => {
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.allSettled([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);

      if (fetchedProducts.status === "fulfilled") {
        setProducts(fetchedProducts.value);
      }
      if (fetchedCategories.status === "fulfilled") {
        setCategories(fetchedCategories.value);
      }
    } catch (err) {
      console.error("ShopScreen loadData error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const priceRanges = [
    { id: 1, label: `Under ${formatPrice(999)}`, max: 999 },
    { id: 2, label: `${formatPrice(1000)} - ${formatPrice(1999)}`, min: 1000, max: 1999 },
    { id: 3, label: `${formatPrice(2000)}+`, min: 2000 },
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== "all") {
          const catMatch =
            p.category?.toLowerCase() === selectedCategory.toLowerCase();
          if (!catMatch) return false;
        }
        // Search
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(query);
          const matchDesc = p.description?.toLowerCase().includes(query);
          const matchCat = p.category?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }
        // Price Range
        if (selectedPriceRange !== null) {
          const range = priceRanges.find((r) => r.id === selectedPriceRange);
          if (range) {
            if (range.min !== undefined && p.price < range.min) return false;
            if (range.max !== undefined && p.price > range.max) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, search, selectedCategory, selectedPriceRange, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedPriceRange(null);
    setSortBy("newest");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedPriceRange !== null ||
    sortBy !== "newest";

  // Split products into rows of 2 for a clean 2-column grid
  const productRows = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    productRows.push(filteredProducts.slice(i, i + 2));
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <Header title="ARCHIVE CATALOGUE" showSearch={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
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
        {/* Search Bar */}
        <View className="p-4 bg-white border-b border-neutral-200">
          <View className="flex-row items-center bg-neutral-100 border border-neutral-300 px-3 py-2.5">
            <Search size={16} color="#737373" strokeWidth={2} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search vintage tees, hoodies, denim..."
              placeholderTextColor="#a3a3a3"
              className="flex-1 ml-2 text-xs font-medium text-black py-0"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} className="p-1">
                <X size={14} color="#000000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Horizontal Category Chips from DB */}
        <View className="py-2.5 bg-white border-b border-neutral-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            className="space-x-2"
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory("all")}
              className={`mr-2 px-3 py-1.5 border ${
                selectedCategory === "all"
                  ? "bg-black border-black"
                  : "bg-white border-neutral-300"
              }`}
            >
              <Text
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  selectedCategory === "all" ? "text-white" : "text-neutral-700"
                }`}
              >
                ALL ({products.length})
              </Text>
            </TouchableOpacity>

            {categories.map((c) => {
              const isSelected = selectedCategory === c.slug;
              return (
                <TouchableOpacity
                  key={c._id || c.slug}
                  onPress={() => setSelectedCategory(c.slug)}
                  className={`mr-2 px-3 py-1.5 border flex-row items-center space-x-1.5 ${
                    isSelected
                      ? "bg-black border-black"
                      : "bg-white border-neutral-300"
                  }`}
                >
                  <Text
                    className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isSelected ? "text-white" : "text-neutral-700"
                    }`}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Price & Sort Filter Bar */}
        <View className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-[11px] font-mono text-neutral-500 font-bold uppercase">
              SHOWING {filteredProducts.length} ARCHIVE PIECES
            </Text>

            <TouchableOpacity
              onPress={() => setShowSortMenu(!showSortMenu)}
              className="flex-row items-center space-x-1 bg-white border border-neutral-300 px-2.5 py-1"
            >
              <SlidersHorizontal size={12} color="#000000" />
              <Text className="text-[10px] font-mono font-bold uppercase text-black">
                {sortBy === "newest"
                  ? "NEWEST"
                  : sortBy === "price-asc"
                  ? "PRICE: LOW-HIGH"
                  : "PRICE: HIGH-LOW"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Sort Options Dropdown */}
          {showSortMenu && (
            <View className="bg-white border border-neutral-200 p-2 mb-2 space-y-1">
              {[
                { label: "NEWEST DROPS", value: "newest" },
                { label: "PRICE: LOW TO HIGH", value: "price-asc" },
                { label: "PRICE: HIGH TO LOW", value: "price-desc" },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    setSortBy(opt.value as any);
                    setShowSortMenu(false);
                  }}
                  className={`py-1.5 px-2 ${
                    sortBy === opt.value ? "bg-neutral-100" : ""
                  }`}
                >
                  <Text className="text-[11px] font-mono font-bold uppercase text-black">
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Price Range Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-1.5 pt-1"
          >
            {priceRanges.map((r) => {
              const isSelected = selectedPriceRange === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() =>
                    setSelectedPriceRange(isSelected ? null : r.id)
                  }
                  className={`mr-1.5 px-2.5 py-1 border ${
                    isSelected
                      ? "bg-black border-black"
                      : "bg-white border-neutral-200"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-mono font-bold uppercase ${
                      isSelected ? "text-white" : "text-neutral-600"
                    }`}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {hasActiveFilters && (
              <TouchableOpacity
                onPress={handleResetFilters}
                className="flex-row items-center space-x-1 px-2.5 py-1 bg-red-50 border border-red-200 ml-1"
              >
                <RotateCcw size={10} color="#dc2626" />
                <Text className="text-[10px] font-mono font-bold uppercase text-red-600">
                  RESET
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View className="p-3">
          {isLoading && !isRefreshing ? (
            <View className="py-24 items-center justify-center">
              <ActivityIndicator size="large" color="#000000" />
              <Text className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-4">
                FETCHING CATALOGUE...
              </Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="py-20 items-center justify-center bg-white border border-neutral-200 p-6">
              <Text className="text-sm font-black font-mono uppercase text-black">
                NO PIECES FOUND
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 mb-4 font-mono">
                Try searching with different keywords or resetting filters.
              </Text>
              <TouchableOpacity
                onPress={handleResetFilters}
                className="bg-black py-2.5 px-5"
              >
                <Text className="text-white text-xs font-mono font-bold uppercase">
                  RESET ALL FILTERS
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            productRows.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row space-x-3">
                {row.map((product) => (
                  <View key={product._id} className="flex-1 mr-2 last:mr-0">
                    <ProductCard product={product} />
                  </View>
                ))}
                {row.length === 1 && <View className="flex-1" />}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
