import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/app/contexts/AuthContext";
import Version from "@/app/components/Version";
import { Colors } from "@/app/constants/Colors";

function ShopkeeperHeader({ routeName }: { routeName?: string }) {
  const { user, logout, token } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const showBack = routeName === "dashboard" ? false : router.canGoBack();

  // Add this function
  const loadCartCount = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('shopkeeper_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum: number, item: any) => sum + (item.cartQuantity || 1), 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.log("Error loading cart count:", err);
      setCartCount(0);
    }
  };

  // Add this useFocusEffect
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
  };
  // const handleLogout = () => {
  //   setMenuVisible(false);

  //   Alert.alert("Logout", "Are you sure you want to logout?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Logout",
  //       style: "destructive",
  //       onPress: async () => {
  //         await logout();
  //       },
  //     },
  //   ]);
  // };

  const menuOptions = [
    {
      label: "My Profile",
      icon: "person-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(shopkeeper)/shopkeeper/profile");
      },
    },
    // {
    //   label: "Change Password",
    //   icon: "key-outline" as const,
    //   onPress: () => {
    //     setMenuVisible(false);
    //     router.push("/(shopkeeper)/shopkeeper/change-password");
    //   },
    // },
    {
      label: "Logout",
      icon: "log-out-outline" as const,
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerSide}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={22} color="#000000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Image
            source={require("@/assets/images/logo-small.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.headerSide}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(shopkeeper)/shopkeeper/cart");
            }}
            style={styles.headerButton}
          >
            <Ionicons name="cart-outline" size={24} color="#000000" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount === 0 ? 0 : cartCount > 99 ? "99+" : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons name="menu-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[
            styles.dropdownMenu,
            {
              top: Platform.OS === "ios" ? 90 : 60,
            },
          ]}>
            <View style={styles.userInfoSection}>
              <View style={styles.userAvatar}>
                <Ionicons name="storefront" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.userName}>{user?.CardName}</Text>
                <Text style={styles.userEmail}>{user?.CntctPrsn}</Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.menuItem,
                  option.danger && styles.menuItemDanger,
                ]}
                onPress={option.onPress}
              >
                <View style={[styles.menuIcon, option.danger && styles.menuIconDanger]}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color="#000000"
                  />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    option.danger && styles.menuItemTextDanger,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* App Version */}
            <Version />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function ShopkeeperLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 6) + 4;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        header: ({ route }) => <ShopkeeperHeader routeName={route.name} />,
        tabBarHideOnKeyboard: true,

        // HIDE TAB BAR FOR SPECIFIC SCREENS
        tabBarStyle: [
          {
            position: "absolute",
            left: 4,
            right: 4,
            bottom: tabBarBottom,
            height: 52,
            backgroundColor: Colors.shopKeeper.primary,
            borderTopWidth: 0,
            borderRadius: 22,
            marginHorizontal: 10,
            paddingHorizontal: 8,
            paddingTop: 6,
            paddingBottom: Platform.OS === "ios" ? 5 : 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.14,
            shadowRadius: 12,
            elevation: 12,
          },

          // THIS LINE HIDES TAB BAR
          route.name === "profile-edit" && { display: "none" },
          // route.name === "change-password" && { display: "none" },
        ],

        sceneStyle: {
          backgroundColor: "#F4F7F8",
        },
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={30}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "cube" : "cube-outline"}
              size={30}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.centerTabButton,
                focused && styles.centerTabButtonFocused,
              ]}
            >
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={24}
                color="#fff"
              />
            </View>
          ),
          tabBarItemStyle: styles.centerTabItem,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders List",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={30}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={30}
              color="#fff"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile-edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: Colors.global.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E7ECEF",
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSide: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.global.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  centerTabItem: {
    marginTop: -24,
  },
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.shopKeeper.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.global.white,
    shadowColor: Colors.shopKeeper.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  centerTabButtonFocused: {
    backgroundColor: Colors.shopKeeper.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dropdownMenu: {
    position: "absolute",
    right: 16,
    backgroundColor: Colors.global.white,
    borderRadius: 16,
    width: 280,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.global.white,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.shopKeeper.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: Colors.global.white,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "#FEF2F2",
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  menuItemTextDanger: {
    color: Colors.global.danger,
  },
});