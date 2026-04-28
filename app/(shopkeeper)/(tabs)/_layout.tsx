import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
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

function ShopkeeperTabsHeader({ routeName }: { routeName?: string }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const showBack = routeName === "dashboard" ? false : router.canGoBack();

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/auth/login"),
      },
    ]);
  };

  const menuOptions = [
    {
      label: "My Profile",
      icon: "person-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(shopkeeper)/(tabs)/profile");
      },
    },
    {
      label: "Settings",
      icon: "settings-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(shopkeeper)/(tabs)/settings");
      },
    },
    {
      label: "Notifications",
      icon: "notifications-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(shopkeeper)/(tabs)/notifications");
      },
      badge: 4,
    },
    {
      label: "Change Password",
      icon: "key-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(shopkeeper)/(tabs)/change-password");
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
              <Ionicons name="arrow-back" size={22} color="#0F4C5C" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Image
            source={require("../../../assets/images/logo-small.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons name="menu-outline" size={24} color="#0F4C5C" />
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
          <View style={styles.dropdownMenu}>
            <View style={styles.userInfoSection}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={22} color="#fff" />
              </View>
              <View>
                <Text style={styles.userName}>Ahmed Autos</Text>
                <Text style={styles.userEmail}>shopkeeper@servomotor.com</Text>
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
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.danger ? "#D32F2F" : "#333"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    option.danger && styles.menuItemTextDanger,
                  ]}
                >
                  {option.label}
                </Text>
                {"badge" in option && option.badge ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{option.badge}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function ShopkeeperTabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 6) + 4;

  return (
    <Tabs
      screenOptions={{
        header: ({ route }) => <ShopkeeperTabsHeader routeName={route.name} />,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: "#F4F7F8",
        },
        tabBarStyle: {
          position: "absolute",
          left: 4,
          right: 4,
          bottom: tabBarBottom,
          height: 54,
          backgroundColor: "#0F4C5C",
          borderTopWidth: 0,
          borderRadius: 22,
          marginHorizontal: 10,
          paddingHorizontal: 8,
          paddingTop: 4,
          paddingBottom: Platform.OS === "ios" ? 5 : 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.14,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarItemStyle: {
          minHeight: 44,
        },
      }}
    >
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
      <Tabs.Screen
        name="profile-edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ size }) => (
            <Ionicons name="home-outline" size={size} color="#fff" />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ size }) => (
            <Ionicons name="pricetags-outline" size={size} color="#fff" />
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
              <Ionicons name="cart-outline" size={24} color="#fff" />
            </View>
          ),
          tabBarItemStyle: styles.centerTabItem,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Orders List",
          tabBarIcon: ({ size }) => (
            <Ionicons name="receipt-outline" size={size} color="#fff" />
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
    borderBottomColor: "#E7ECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  // headerSide: {
  //   width: 88,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  logoImage: {
    width: 50,
    height: 61,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    width: 260,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F4F7F8",
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0F4C5C",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2933",
  },
  userEmail: {
    fontSize: 12,
    color: "#7A8A91",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E7ECEF",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: "#E7ECEF",
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  menuItemTextDanger: {
    color: "#D32F2F",
  },
  menuBadge: {
    backgroundColor: "#0F4C5C",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  menuBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  centerTabItem: {
    marginTop: -24,
  },
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D7D8C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#2D7D8C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 10,
  },
  centerTabButtonFocused: {
    backgroundColor: "#1C6572",
  },
});
