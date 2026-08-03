import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";

export default function AdministratorDashboard() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 100;
  const { user, token } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, update and monitor engine oil & spare parts",
      button: "View Products",
      route: "/(administrator)/administrator/products",
    },
    {
      title: "Manage Orders",
      description: "Track administrator orders and approvals",
      button: "View Orders",
      route: "/(administrator)/administrator/orders",
    },
    {
      title: "Manage Store Manager",
      description: "View store managers and change passwords",
      button: "View Store Managers",
      route: "/(administrator)/administrator/storemanager",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2C3E50"]} />
      }
    >
      {/* Hero Section */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.welcomeBadge}>
            <Text style={styles.welcomeText}>Welcome back 👋</Text>
          </View>
          <Text style={styles.title}>{user?.fullname || user?.username}</Text>
          <Text style={styles.subtitle}>{user?.email || user?.mobile}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      {quickActions.map((item) => (
        <View key={item.route} style={styles.actionCard}>
          <Text style={styles.actionTitle}>{item.title}</Text>

          <Text style={styles.actionDesc}>
            {item.description}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.buttonText}>
              {item.button}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  heroCard: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#2C3E50",
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: "#2C3E50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  heroContent: {
    padding: 24,
  },
  welcomeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    color: Colors.global.white,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#212121",
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1F2937",
  },
  actionDesc: {
    color: "#6B7280",
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.administrator.button.buttonBg1 || "#2C3E50",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2C3E50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: Colors.administrator.button.buttonText1 || "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});