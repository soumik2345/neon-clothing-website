import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Truck,
  Award,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Headphones,
  RefreshCw,
} from "lucide-react-native";
import { Header } from "../components/Header";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { ProductCard } from "../components/ProductCard";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import { ProductType, CategoryType, BannersDataType, BannerSlideType } from "../types";

const { width } = Dimensions.get("window");

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { settings } = useSettings();

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [banners, setBanners] = useState<BannersDataType | null>(null);

  const loadData = useCallback(async () => {
    try {
      setFetchError(null);
      const [fetchedProducts, fetchedCategories, fetchedBanners] =
        await Promise.allSettled([
          api.getProducts({ limit: 50 }),
          api.getCategories(),
          api.getBanners(),
        ]);

      if (fetchedProducts.status === "fulfilled") {
        setProducts(fetchedProducts.value);
      }
      if (fetchedCategories.status === "fulfilled") {
        setCategories(fetchedCategories.value);
      }
      if (fetchedBanners.status === "fulfilled") {
        setBanners(fetchedBanners.value);
      }
    } catch (err: any) {
      console.error("HomeScreen loadData error:", err);
      setFetchError("Unable to connect to store database. Please check connection.");
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

  const trendingProducts = products.filter((p) => p.isTrending);
  const displayTrending =
    trendingProducts.length > 0 ? trendingProducts : products.slice(0, 6);

  // Group products by available category
  const hoodieProducts = products.filter(
    (p) => p.category?.toLowerCase() === "hoodies"
  );
  const teeProducts = products.filter(
    (p) =>
      p.category?.toLowerCase() === "t-shirts" ||
      p.category?.toLowerCase() === "tshirt" ||
      p.category?.toLowerCase() === "tees"
  );

  // Hero slides from database
  const heroSlides: BannerSlideType[] =
    banners?.heroSlides && banners.heroSlides.length > 0
      ? banners.heroSlides
      : banners?.hero
      ? [banners.hero]
      : [];

  const valueProps = banners?.valueProps || [];

  const renderValuePropIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "truck":
        return <Truck size={14} color="#000000" strokeWidth={2} />;
      case "award":
        return <Award size={14} color="#000000" strokeWidth={2} />;
      case "rotate-ccw":
      case "package":
        return <RotateCcw size={14} color="#000000" strokeWidth={2} />;
      case "headphones":
        return <Headphones size={14} color="#000000" strokeWidth={2} />;
      default:
        return <ShieldCheck size={14} color="#000000" strokeWidth={2} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]" edges={["top"]}>
      <AnnouncementBar />
      <Header />

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
        {isLoading && !isRefreshing ? (
          <View className="py-24 items-center justify-center">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-4">
              CONNECTING TO VAULT...
            </Text>
          </View>
        ) : fetchError && products.length === 0 ? (
          <View className="py-16 px-6 items-center justify-center text-center">
            <Text className="text-sm font-mono font-black uppercase text-black">
              DATABASE CONNECTION ERROR
            </Text>
            <Text className="text-xs text-neutral-500 text-center mt-2 font-mono">
              {fetchError}
            </Text>
            <TouchableOpacity
              onPress={loadData}
              className="mt-4 bg-black px-5 py-2.5 flex-row items-center space-x-2"
            >
              <RefreshCw size={14} color="#ffffff" />
              <Text className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                RETRY CONNECTION
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Hero Banner Carousel from DB */}
            {heroSlides.length > 0 && (
              <View className="relative w-full h-84 bg-black overflow-hidden border-b border-black">
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => {
                    const slide = Math.round(
                      e.nativeEvent.contentOffset.x / width
                    );
                    if (slide !== activeHeroSlide) setActiveHeroSlide(slide);
                  }}
                  scrollEventThrottle={16}
                >
                  {heroSlides.map((slide, idx) => (
                    <View key={idx} style={{ width }} className="h-84 relative">
                      <Image
                        source={{ uri: slide.image }}
                        className="w-full h-full opacity-60"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 bg-black/45 justify-center px-6">
                        <View className="bg-white self-start px-2 py-0.5 mb-2 rounded-none">
                          <Text className="text-black text-[10px] font-mono font-black tracking-widest uppercase">
                            {slide.tag || "ARCHIVE DROP"}
                          </Text>
                        </View>
                        <Text className="text-white text-3xl font-black font-mono tracking-tight uppercase leading-8">
                          {slide.title}
                        </Text>
                        {slide.subtitle ? (
                          <Text className="text-neutral-300 text-xs mt-2 max-w-[280px]">
                            {slide.subtitle}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() =>
                            navigation.navigate("ShopTab", { screen: "Shop" })
                          }
                          className="mt-4 self-start bg-white px-5 py-2.5 flex-row items-center space-x-2"
                        >
                          <Text className="text-black text-xs font-mono font-black tracking-wider uppercase">
                            {slide.ctaText || "EXPLORE CATALOGUE"}
                          </Text>
                          <ArrowRight size={14} color="#000000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Carousel Dots */}
                {heroSlides.length > 1 && (
                  <View className="absolute bottom-3 left-0 right-0 flex-row justify-center space-x-1.5">
                    {heroSlides.map((_, idx) => (
                      <View
                        key={idx}
                        className={`h-1.5 rounded-none ${
                          activeHeroSlide === idx
                            ? "w-6 bg-white"
                            : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Feature Value Props from DB */}
            {valueProps.length > 0 && (
              <View className="py-3 px-4 bg-white border-b border-neutral-200">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="space-x-3"
                >
                  {valueProps.map((item, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center space-x-2 mr-3 bg-neutral-50 border border-neutral-200 py-2 px-3"
                    >
                      {renderValuePropIcon(item.icon)}
                      <View>
                        <Text className="text-[11px] font-bold uppercase font-mono text-black">
                          {item.title}
                        </Text>
                        <Text className="text-[9px] text-neutral-500">
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Shop By Category from DB */}
            {categories.length > 0 && (
              <View className="py-6 bg-white border-b border-neutral-100">
                <View className="px-4 flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="text-sm font-black uppercase font-mono tracking-wider text-black">
                      EXPLORE CATEGORIES
                    </Text>
                    <View className="w-8 h-0.5 bg-black mt-1" />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CollectionsTab", {
                        screen: "Collections",
                      })
                    }
                  >
                    <Text className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                      ALL ({categories.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  className="space-x-3"
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat._id || cat.slug}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("ShopTab", {
                          screen: "Shop",
                          params: { selectedCategory: cat.slug },
                        })
                      }
                      className="mr-3 w-32 bg-white border border-neutral-200 overflow-hidden"
                    >
                      <View className="w-full h-32 bg-neutral-100">
                        <Image
                          source={{ uri: cat.image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                        <View className="absolute inset-0 bg-black/25" />
                        <View className="absolute bottom-2 left-2 right-2">
                          <Text className="text-white text-xs font-black uppercase font-mono tracking-wide">
                            {cat.name}
                          </Text>
                          {cat.itemCount !== undefined && (
                            <Text className="text-neutral-200 text-[10px] font-mono">
                              {cat.itemCount} items
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Trending Now Carousel from DB */}
            {displayTrending.length > 0 && (
              <View className="py-6 bg-white border-b border-neutral-100">
                <View className="px-4 flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-sm font-black uppercase font-mono tracking-wider text-black">
                      TRENDING ARCHIVE DROPS
                    </Text>
                    <View className="w-8 h-0.5 bg-black mt-1" />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ShopTab", { screen: "Shop" })
                    }
                  >
                    <Text className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                      VIEW ALL
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                  {displayTrending.map((product) => (
                    <View key={product._id} className="mr-3">
                      <ProductCard product={product} cardWidth={160} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Promo Cards from DB */}
            {banners?.promoCards && banners.promoCards.length > 0 && (
              <View className="my-6 px-4">
                {banners.promoCards.slice(0, 1).map((promo, idx) => (
                  <View
                    key={idx}
                    className="p-5 bg-black border border-black relative overflow-hidden"
                  >
                    <Text className="text-white/60 text-[10px] font-mono font-bold tracking-widest uppercase">
                      {promo.tag || "EXCLUSIVE DROP"}
                    </Text>
                    <Text className="text-white text-xl font-black font-mono uppercase mt-1">
                      {promo.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ShopTab", { screen: "Shop" })
                      }
                      className="mt-4 self-start bg-white py-2 px-4 flex-row items-center space-x-2"
                    >
                      <Text className="text-black text-xs font-mono font-bold uppercase tracking-wider">
                        {promo.ctaText || "DISCOVER NOW"}
                      </Text>
                      <ArrowRight size={14} color="#000000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Hoodies Collection Section from DB */}
            {hoodieProducts.length > 0 && (
              <View className="py-6 bg-[#fdfdfd] border-b border-neutral-100">
                <View className="px-4 flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-sm font-black uppercase font-mono tracking-wider text-black">
                      HEAVYWEIGHT HOODIES
                    </Text>
                    <View className="w-8 h-0.5 bg-black mt-1" />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ShopTab", {
                        screen: "Shop",
                        params: { selectedCategory: "hoodies" },
                      })
                    }
                  >
                    <Text className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                      SEE ALL ({hoodieProducts.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                  {hoodieProducts.map((product) => (
                    <View key={product._id} className="mr-3">
                      <ProductCard product={product} cardWidth={160} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Graphic Tees Collection Section from DB */}
            {teeProducts.length > 0 && (
              <View className="py-6 bg-white border-b border-neutral-100">
                <View className="px-4 flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-sm font-black uppercase font-mono tracking-wider text-black">
                      OVERSIZED TEES
                    </Text>
                    <View className="w-8 h-0.5 bg-black mt-1" />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ShopTab", {
                        screen: "Shop",
                        params: { selectedCategory: "t-shirts" },
                      })
                    }
                  >
                    <Text className="text-[11px] font-mono font-bold text-neutral-500 uppercase">
                      SEE ALL ({teeProducts.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                  {teeProducts.map((product) => (
                    <View key={product._id} className="mr-3">
                      <ProductCard product={product} cardWidth={160} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Brand Manifesto Footer */}
            <View className="p-8 bg-black mt-6 items-center">
              <Text className="text-white text-2xl font-black font-mono tracking-tight uppercase">
                {settings.storeName}
              </Text>
              <Text className="text-neutral-400 text-center text-xs mt-2 max-w-[280px]">
                {settings.tagline}
              </Text>
              <View className="h-0.5 w-12 bg-neutral-700 my-4" />
              <Text className="text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
                AUTHENTIC STREETWEAR ARCHIVES
              </Text>
              <Text className="text-neutral-600 text-[9px] font-mono mt-1">
                CONNECTED TO LIVE BACKEND DATABASE
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
