import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

const { width } = Dimensions.get('window');

// Quick Links Configuration
const QUICK_LINKS = [
  {
    id: 1,
    icon: '🛍️',
    title: 'Browse Products',
    descKey: 'products_count',
    descTemplate: (count: number) => `${count} products available`,
    route: "/(administrator)/administrator/products"
  },
  {
    id: 2,
    icon: '🚚',
    title: 'Track Orders',
    descKey: 'order_count',
    descTemplate: (count: number) => `${count} total orders placed`,
    route: "/(administrator)/administrator/orders"
  },
];

export default function Dashboard() {
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

  const getQuickLinksWithData = () => {
    return QUICK_LINKS.map((link) => {
      let value: number = 0;

      if (link.descKey === "products_count") {
        value = dashboardData.products_count;
      } else if (link.descKey === "order_count") {
        value = dashboardData.order_count;
      }

      return {
        ...link,
        desc: link.descTemplate(value),
      };
    });
  };

  if (dashboardData.loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={dashboardData.refreshing} onRefresh={onRefresh} colors={["#2C3E50"]} />
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

      {/* Stats Grid - Horizontally Scrollable */}
      {/* <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsGridContainer}
        decelerationRate="fast"
        snapToInterval={width * 0.7 + 12}
        snapToAlignment="start"
      >
        <View style={styles.statsGrid}>
          {/* Products Card /}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconWrapper, styles.productsIcon]}>
                <Text style={styles.statIconEmoji}>📦</Text>
              </View>
              <View style={[styles.statBadge, styles.productsBadge]}>
                <Text style={styles.statBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.statMainNumber}>{dashboardData.products_count}</Text>
            <Text style={styles.statMainLabel}>Total Products</Text>
          </View>

          {/* Orders Card /}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconWrapper, styles.ordersIcon]}>
                <Text style={styles.statIconEmoji}>🛒</Text>
              </View>
              <View style={[styles.statBadge, styles.ordersBadge]}>
                <Text style={styles.statBadgeText}>All Time</Text>
              </View>
            </View>
            <Text style={styles.statMainNumber}>{dashboardData.order_count}</Text>
            <Text style={styles.statMainLabel}>Total Orders</Text>
          </View>

          {/* Revenue Card /}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconWrapper, styles.revenueIcon]}>
                <Text style={styles.statIconEmoji}>💰</Text>
              </View>
              <View style={[styles.statBadge, styles.revenueBadge]}>
                <Text style={styles.statBadgeText}>Lifetime</Text>
              </View>
            </View>
            <Text style={[styles.statMainNumber, styles.revenueNumber]} numberOfLines={1} adjustsFontSizeToFit>
              {formatPrice(dashboardData.total_sales)}
            </Text>
            <Text style={styles.statMainLabel}>Total Amount</Text>
          </View>
        </View>
      </ScrollView> */}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Manage Products</Text>
        <Text style={styles.actionDesc}>
          Add, update and monitor engine oil & spare parts
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(administrator)/administrator/products")}
        >
          <Text style={styles.buttonText}>Go to Products</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>View Orders</Text>
        <Text style={styles.actionDesc}>
          Track Administrator orders and approvals
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(administrator)/administrator/orders")}
        >
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  heroCard: {
    marginTop: 20,
    marginBottom: 24,
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
  statsGridContainer: {
    paddingHorizontal: 0,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  statCard: {
    width: width * 0.55,
    backgroundColor: Colors.global.white,
    borderRadius: 24,
    padding: 16,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productsIcon: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
  },
  ordersIcon: {
    backgroundColor: '#FEF3E2',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  revenueIcon: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  statIconEmoji: {
    fontSize: 24,
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productsBadge: {
    backgroundColor: '#DBEAFE',
  },
  ordersBadge: {
    backgroundColor: '#FEF3C7',
  },
  revenueBadge: {
    backgroundColor: '#D1FAE5',
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2933',
  },
  statMainNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2933',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  revenueNumber: {
    fontSize: 24,
  },
  statMainLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
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
    backgroundColor: Colors.administrator.button.buttonBg1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.administrator.button.buttonText1,
    fontWeight: "bold",
  },
});