import { Stack, useSegments, router } from "expo-router";
import { Alert } from "react-native";
import { useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./components/CartContext";
import LoadingScreen from "./components/LoadingScreen";

function RootNavigation() {
  const { token, userType, isLoading } = useAuth();
  const segments = useSegments();
  const isAlertShown = useRef(false);

  // 🌐 Internet check
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline =
        !state.isConnected || state.isInternetReachable === false;

      if (isOffline && !isAlertShown.current) {
        isAlertShown.current = true;

        Alert.alert(
          "No Internet Connection",
          "Please check your WiFi or mobile data."
        );
      }

      if (!isOffline) {
        isAlertShown.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Auth routing
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments?.[0] === "auth";

    // ❌ Not logged in → force login
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Logged in → prevent going back to auth
    if (token && inAuthGroup) {
      if (userType === "shop_keeper") {
        router.replace("/(shopkeeper)/shopkeeper/dashboard");
      } else if (userType === "store_manager") {
        router.replace("/(storemanager)/storemanager/dashboard");
      }
      return;
    }
  }, [token, userType, isLoading, segments?.[0]]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        animationDuration: 250,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <RootNavigation />
      </CartProvider>
    </AuthProvider>
  );
}