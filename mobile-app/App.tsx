import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { SettingsProvider } from "./src/context/SettingsContext";
import { CartProvider } from "./src/context/CartContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <CartProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </CartProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
