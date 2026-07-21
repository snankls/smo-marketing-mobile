import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
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
import { useAuth } from "@/app/contexts/AuthContext";
import Version from "@/app/components/Version";
import { Colors } from "@/app/constants/Colors";

function CustomHeader({ routeName }: { routeName?: string }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const showBack = routeName === "dashboard" ? false : router.canGoBack();
  const { user, logout } = useAuth();

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
        router.push("/(storemanager)/storemanager/profile");
      },
    },
    {
      label: "Change Password",
      icon: "key-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(storemanager)/storemanager/change-password");
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
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Image
            source={require("@/assets/images/logo-small.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.headerRight}>
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
                <Text style={styles.userName}>{user?.WhsName}</Text>
                {/* <Text style={styles.userEmail}>{user?.CntctPrsn}</Text> */}
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
                    name={option.icon as any}
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

export default function ManagerLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 6) + 4;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.storeManager.primary,
        tabBarInactiveTintColor: "#7A7A7A",
        header: ({ route }) => {
          return <CustomHeader routeName={route.name} />;
        },
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: "#F5F5F5",
        },
        tabBarStyle: {
          position: "absolute",
          left: 4,
          right: 4,
          bottom: tabBarBottom,
          height: 52,
          backgroundColor: Colors.storeManager.primary,
          borderTopWidth: 0,
          borderRadius: 20,
          marginHorizontal: 10,
          paddingHorizontal: 6,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 4 : 3,
          shadowColor: Colors.storeManager.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarItemStyle: {
          minHeight: 44,
          paddingVertical: 0,
          marginVertical: 0,
        },
      }}
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
          title: "Orders",
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
        name="shopkeeper"
        options={{
          title: "Shop Keepers",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
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
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  // headerCenter: {
  //   flex: 1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   gap: 8,
  // },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  headerButton: {
    padding: 8,
  },
  centerTabItem: {
    marginTop: -24,
  },
  centerTabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.storeManager.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: Colors.storeManager.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  centerTabButtonFocused: {
    backgroundColor: Colors.storeManager.primary,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dropdownMenu: {
    position: "absolute",
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 280,
    shadowColor: "#000",
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
    backgroundColor: "#fff",
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.storeManager.primary,
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
    backgroundColor: "#fff",
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
    color: "#ff0000",
  },
});
