import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PageSearch from "@/app/components/PageSearch";
import Pagination from "@/app/components/Pagination";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";

type Order = {
  id: number;
  order_id?: number;
  InvoiceNo?: string;
  invoice_no?: string;
  Orcd_Id?: string;
  orcd_id?: string;
  TotalQuantity?: string;
  total_quantity?: string;
  TotalPrice?: string;
  total_price?: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createDate?: string;
  created_at?: string;
  created_date?: string;
  items?: any[];
};

export default function StoreManagerOrdersScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  
  useFocusEffect(
    useCallback(() => {
      fetchOrders(1, "", perPage);
    }, [])
  );

  const handleSearch = async () => {
    setSearching(true);
    setPage(1);
    setSearch(searchInput);

    await fetchOrders(1, searchInput, perPage);
  };

  const handleClearSearch = async () => {
    setSearchInput("");
    setSearch("");
    setPage(1);

    await fetchOrders(1, "", perPage);
  };

  const fetchOrders = async (
    currentPage = page,
    currentSearch = search,
    currentPerPage = perPage
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: currentPerPage.toString(),
      });

      if (currentSearch) {
        params.append("search", currentSearch);
      }

      const res = await fetch(`${API_URL}/orders/store-manager?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      
      // Check if response is an array (direct data) or paginated object
      let ordersData = [];
      if (Array.isArray(json)) {
        // Direct array response
        ordersData = json;
        setTotal(ordersData.length);
        setTotalPages(1);
      } else if (json.data && Array.isArray(json.data)) {
        // Paginated response
        ordersData = json.data;
        setPage(json.current_page || 1);
        setTotalPages(json.last_page || 1);
        setPerPage(Number(json.per_page) || 10);
        setTotal(json.total || 0);
      } else {
        ordersData = [];
      }

      const normalizedOrders = ordersData.map((order: any) => ({
        id: order.id,
        InvoiceNo: order.InvoiceNo || `ORD-${order.id}`,
        Orcd_Id: order.Orcd_Id || "N/A",
        TotalQuantity: order.TotalQuantity || "0",
        TotalPrice: order.TotalPrice || "0",
        status: order.status || "Pending",
        createDate: order.createDate || new Date().toISOString(),
      }));

      setOrders(normalizedOrders);

    } catch (err) {
      console.log("Fetch orders error:", err);
      Alert.alert("Error", "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSearching(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    if (selectedFilter === "All") return orders;
    return orders.filter(o => o.status?.toLowerCase() === selectedFilter.toLowerCase());
  };

  const formatCount = (count: number) => {
    return count > 99 ? "99+" : count.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#F59E0B";

      case "processing":
        return "#2563EB";

      case "completed":
        return "#16A34A";

      case "cancelled":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  };

  const getStatusLightColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FEF3C7";

      case "processing":
        return "#DBEAFE";

      case "completed":
        return "#DCFCE7";

      case "cancelled":
        return "#FEE2E2";

      default:
        return "#F3F4F6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      default:
        return "receipt";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      const now = new Date();

      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Show only "1 day ago", "2 days ago", etc.
      if (diffDays >= 1) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      }

      // Same day -> show date only
      return date.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString.split(" ")[0];
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice || 0);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/(storemanager)/storemanager/order-details",
          params: {
            id: item.id.toString(),
            invoice: item.InvoiceNo,
          },
        });
      }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <View style={[styles.statusIconCircle, { backgroundColor: getStatusLightColor(item.status) }]}>
            <Ionicons name={getStatusIcon(item.status)} size={22} color={getStatusColor(item.status)} />
          </View>
          <View>
            <Text style={styles.orderId}>{item.InvoiceNo}</Text>
            <View style={styles.footerItem}>
              <Ionicons name="cube-outline" size={14} color="#6c757d" />
              <Text style={styles.footerText}>Qty: {item.TotalQuantity}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color="#6c757d" />
          <Text style={styles.footerText}>{formatDate(item.createDate)}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>PKR</Text>
          <Text style={styles.amount}>{formatPrice(item.TotalPrice || "0")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStats = () => {
    return {
      pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
      processing: orders.filter(o => o.status?.toLowerCase() === "processing").length,
      completed: orders.filter(o => o.status?.toLowerCase() === "completed").length,
      cancelled: orders.filter(o => o.status?.toLowerCase() === "cancelled").length,
      total: orders.length,
    };
  };

  const stats = getStats();
  const filteredOrders = getFilteredOrders();

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: bottomSpacer }}
      //contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.storeManager.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Orders List</Text>
        <Text style={styles.heroSubtitle}>Browse your orders and manage them</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{total} Records</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: getStatusLightColor("pending") },
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              { color: getStatusColor("pending") },
            ]}
          >
            {formatCount(stats.pending)}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: getStatusLightColor("processing") },
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              { color: getStatusColor("processing") },
            ]}
          >
            {formatCount(stats.processing)}
          </Text>
          <Text style={styles.statLabel}>Processing</Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: getStatusLightColor("completed") },
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              { color: getStatusColor("completed") },
            ]}
          >
            {formatCount(stats.completed)}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: getStatusLightColor("cancelled") },
          ]}
        >
          <Text
            style={[
              styles.statNumber,
              { color: getStatusColor("cancelled") },
            ]}
          >
            {formatCount(stats.cancelled)}
          </Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>

      <PageSearch
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search invoice number..."
        loading={searching}
        color={Colors.storeManager.primary}
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {["All", "Pending", "Processing", "Completed", "Cancelled"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}>
                {filter}
                {filter !== "All" && (
                  <Text style={styles.filterCount}>
                    {" "}({filter === "Pending" ? stats.pending : filter === "Processing" ? stats.processing : filter === "Completed" ? stats.completed : stats.cancelled})
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          onPress={() => fetchOrders(page, search, perPage)}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh-outline" size={18} color={Colors.storeManager.primary} />
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyText}>No Orders Found</Text>
          <Text style={styles.emptySubtext}>
            Orders will appear here once customers place orders
          </Text>
        </View>
      ) : (
        <View style={styles.ordersList}>
          {filteredOrders.map((item) => (
            <View key={item.id?.toString() || Math.random().toString()}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onPageChange={(newPage) => fetchOrders(newPage, search, perPage)}
        color={Colors.storeManager.primary}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.global.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  heroCard: {
    marginBottom: 18,
    padding: 18,
    backgroundColor: Colors.storeManager.primary,
    borderRadius: 20,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.global.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#D7E6EA",
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  countText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  filterScroll: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: Colors.storeManager.primary,
    borderColor: Colors.storeManager.primary,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  filterCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ordersList: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 5,
  },
  customerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  customer: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  currencySymbol: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.global.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});