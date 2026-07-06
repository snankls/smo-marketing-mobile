import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function ManagerDashboard() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 100;
  const { user, token } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
    products_count: 0,
    order_count: 0,
    total_sales: 0,
    loading: true,
    refreshing: false,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        setDashboardData(prev => ({
          ...prev,
          products_count: response.data.products_count || 0,
          order_count: response.data.order_count || 0,
          total_sales: response.data.total_sales || 0,
          loading: false,
          refreshing: false,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false, refreshing: false }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setDashboardData(prev => ({ ...prev, refreshing: true }));
    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => `PKR ${(price || 0).toLocaleString('en-PK')}`;

  if (dashboardData.loading) {
    return <LoadingScreen />;
  }
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomSpacer },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AW Marketing</Text>
        <Text style={styles.subtitle}>Store Manager Dashboard</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboardData.products_count}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboardData.order_count}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Manage Products</Text>
        <Text style={styles.actionDesc}>
          Add, update and monitor engine oil & spare parts
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(storemanager)/storemanager/products")}
        >
          <Text style={styles.buttonText}>Go to Products</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>View Orders</Text>
        <Text style={styles.actionDesc}>
          Track shopkeeper orders and approvals
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(storemanager)/storemanager/orders")}
        >
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Shopkeepers</Text>
        <Text style={styles.actionDesc}>Manage your shopkeeper network</Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(storemanager)/storemanager/shopkeeper")}
        >
          <Text style={styles.buttonText}>Manage Users</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.storeManager.primary,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.storeManager.primary,
  },
  statLabel: {
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#212121",
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionDesc: {
    color: "#666",
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.storeManager.button.buttonBg1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.storeManager.button.buttonText1,
    fontWeight: "bold",
  },
});
