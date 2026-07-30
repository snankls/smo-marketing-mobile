import { Ionicons } from "@expo/vector-icons";
import { router, Tabs, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
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

function AdministratorHeader({ routeName }: { routeName?: string }) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { user, logout, token } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const showBack = routeName === "dashboard" ? false : router.canGoBack();

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
        router.push("/(administrator)/administrator/profile");
      },
    },
    {
      label: "Change Password",
      icon: "key-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(administrator)/administrator/change-password");
      },
    },
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
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Image
            source={require("@/assets/images/logo-small.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu-outline" size={26} color="#000000" />
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
                <Ionicons name="person" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.userName}>{user?.fullname || user?.username}</Text>
                <Text style={styles.userEmail}>{user?.email || user?.mobile}</Text>
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

export default function AdministratorLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 6) + 4;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        header: ({ route }) => <AdministratorHeader routeName={route.name} />,
        tabBarHideOnKeyboard: true,

        // HIDE TAB BAR FOR SPECIFIC SCREENS
        tabBarStyle: [
          {
            position: "absolute",
            left: 4,
            right: 4,
            bottom: tabBarBottom,
            height: 52,
            backgroundColor: Colors.administrator.primary,
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
        name="orders"
        options={{
          title: "Orders List",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.centerTabButton,
                focused && styles.centerTabButtonFocused,
              ]}
            >
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                size={24}
                color="#fff"
              />
            </View>
          ),
          tabBarItemStyle: styles.centerTabItem,
        }}
      />
      <Tabs.Screen
        name="storemanager"
        options={{
          title: "Store Manager",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "business" : "business-outline"}
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
        name="storemanager-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="order-details"
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
  // headerButton: {
  //   padding: 8,
  // },


  headerLeft: { // New style
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerCenter: { // New style (replaces headerSide)
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: { // New style (replaces headerSide)
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerButton: {
    padding: 8,
    minWidth: 40, // Added for better touch area
    minHeight: 40, // Added for better touch area
    alignItems: "center",
    justifyContent: "center",
  },


  // headerCenter: {
  //   alignItems: "center",
  // },
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
    backgroundColor: Colors.administrator.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: Colors.global.white,
    shadowColor: Colors.administrator.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  centerTabButtonFocused: {
    backgroundColor: Colors.administrator.primary,
  },
  menuButton: {
    position: "absolute",
    right: 16,
    padding: 8,
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
    backgroundColor: Colors.administrator.primary,
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