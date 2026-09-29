import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Home,
  SlidersHorizontal,
  Layers,
  ShoppingBag,
  User,
} from "lucide-react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { ShopScreen } from "../screens/ShopScreen";
import { CollectionsScreen } from "../screens/CollectionsScreen";
import { CartScreen } from "../screens/CartScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { OrderSuccessScreen } from "../screens/OrderSuccessScreen";
import { TrackOrderScreen } from "../screens/TrackOrderScreen";
import { useCart } from "../context/CartContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Streetwear Bottom Tab Bar matching the web mobile navbar style
function CustomBottomTabBar({ state, descriptors, navigation }: any) {
  const { totalItems } = useCart();

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isHome = route.name === "HomeTab";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const renderIcon = () => {
            const color = isFocused ? "#ffffff" : "#888888";
            const size = isHome ? 22 : 20;

            switch (route.name) {
              case "ShopTab":
                return <SlidersHorizontal size={size} color={color} strokeWidth={2} />;
              case "CollectionsTab":
                return <Layers size={size} color={color} strokeWidth={2} />;
              case "HomeTab":
                return <Home size={size} color="#ffffff" strokeWidth={2.5} />;
              case "CartTab":
                return (
                  <View style={{ position: "relative" }}>
                    <ShoppingBag size={size} color={color} strokeWidth={2} />
                    {totalItems > 0 && (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalItems}</Text>
                      </View>
                    )}
                  </View>
                );
              case "ProfileTab":
                return <User size={size} color={color} strokeWidth={2} />;
              default:
                return <Home size={size} color={color} strokeWidth={2} />;
            }
          };

          const getLabel = () => {
            switch (route.name) {
              case "ShopTab":
                return "Shop";
              case "CollectionsTab":
                return "Drops";
              case "HomeTab":
                return "Home";
              case "CartTab":
                return "Bag";
              case "ProfileTab":
                return "Profile";
              default:
                return "";
            }
          };

          if (isHome) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.homeTabButton}
              >
                <View style={styles.homeIconCircle}>
                  {renderIcon()}
                </View>
                <Text style={styles.homeLabelText}>HOME</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.regularTabButton}
            >
              {renderIcon()}
              <Text
                style={[
                  styles.tabLabelText,
                  { color: isFocused ? "#ffffff" : "#888888" },
                ]}
              >
                {getLabel()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="ShopTab" component={ShopScreen} />
      <Tab.Screen name="CollectionsTab" component={CollectionsScreen} />
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="TrackOrderTab" component={TrackOrderScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
    borderRadius: 24,
    height: 64,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#262626",
  },
  regularTabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  homeTabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
  },
  homeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabLabelText: {
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 3,
  },
  homeLabelText: {
    fontSize: 8,
    fontFamily: "monospace",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#ffffff",
    marginTop: 2,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#000000",
    fontSize: 8,
    fontWeight: "900",
    fontFamily: "monospace",
  },
});
