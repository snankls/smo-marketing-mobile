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

function CustomHeader({ routeName }: { routeName?: string }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const showBack = routeName === "dashboard" ? false : router.canGoBack();

  const handleLogout = async () => {
    setMenuVisible(false);
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const menuOptions = [
    {
      label: "My Profile",
      icon: "person-outline",
      onPress: () => {
        setMenuVisible(false);
        router.push("/(manager)/profile");
      },
    },
    {
      label: "Settings",
      icon: "settings-outline",
      onPress: () => {
        setMenuVisible(false);
        router.push("/(manager)/settings");
      },
    },
    {
      label: "Notificationsaa",
      icon: "notifications-outline",
      onPress: () => {
        setMenuVisible(false);
        router.push("/(manager)/notifications");
      },
      badge: 3,
    },
    {
      label: "Change Password",
      icon: "key-outline" as const,
      onPress: () => {
        setMenuVisible(false);
        router.push("/(manager)/change-password");
      },
    },
    {
      label: "Logout",
      icon: "log-out-outline",
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
              <Ionicons name="arrow-back" size={24} color="#C62828" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Image
            source={require("../../assets/images/logo-small.png")}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons name="menu-outline" size={24} color="#C62828" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
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
                <Text style={styles.userAvatarText}>SM</Text>
              </View>
              <View>
                <Text style={styles.userName}>Store Manager</Text>
                <Text style={styles.userEmail}>manager@servomotor.com</Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  option.danger && styles.menuItemDanger,
                ]}
                onPress={option.onPress}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.danger ? "#FF3B30" : "#333"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    option.danger && styles.menuItemTextDanger,
                  ]}
                >
                  {option.label}
                </Text>
                {option.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{option.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
        tabBarActiveTintColor: "#C62828",
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
          backgroundColor: "#C62828",
          borderTopWidth: 0,
          borderRadius: 20,
          marginHorizontal: 10,
          paddingHorizontal: 6,
          paddingTop: 4,
          paddingBottom: Platform.OS === "ios" ? 4 : 3,
          shadowColor: "#000",
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color="#fff" />
          ),
        }}
      />
      <Tabs.Screen
        name="shopkeepers"
        options={{
          title: "Shop Keepers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color="#fff" />
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
              <Ionicons name="receipt-outline" size={26} color="#fff" />
            </View>
          ),
          tabBarItemStyle: styles.centerTabItem,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color="#fff" />
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
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoImage: {
    width: 50,
    height: 61,
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
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  centerTabButtonFocused: {
    backgroundColor: "#C62828",
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 250,
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
    backgroundColor: "#f8f8f8",
    gap: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
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
    borderTopColor: "#e0e0e0",
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  menuItemTextDanger: {
    color: "#FF3B30",
  },
  menuBadge: {
    backgroundColor: "#C62828",
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
    fontWeight: "bold",
  },
});
