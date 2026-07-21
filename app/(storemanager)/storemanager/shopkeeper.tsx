import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/contexts/AuthContext";
import PageSearch from "@/app/components/PageSearch";
import PerPageDropdown from "@/app/components/PerPageDropdown";
import Pagination from "@/app/components/Pagination";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function ManagerShopkeepersScreen() {
  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const [shopkeepers, setShopkeepers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FETCH
  const fetchShopkeepers = async (
    pageNumber = 1,
    searchText = "",
    perPageValue = perPage
  ) => {
    try {
      if (pageNumber === 1 && !searchText) {
        setLoading(true);
      } else {
        setPageLoading(true);
      }

      const res = await fetch(
        `${API_URL}/store-manager/shop-keeper?page=${pageNumber}&per_page=${perPageValue}&search=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (res.ok) {
        setShopkeepers(json.data || []);
        setPage(json.current_page);
        setTotalPages(json.last_page);
        setTotal(json.total);
      } else {
        setError(json.message || "Failed to load shopkeepers");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load shopkeepers");
    } finally {
      setLoading(false);
      setPageLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShopkeepers(1, "");
  }, []);

  // REFRESH
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShopkeepers(1, search);
  }, [search]);

  // SEARCH
  const handleSearch = () => {
    setSearching(true);
    setPage(1);
    setSearch(searchInput);
    
    fetchShopkeepers(1, searchInput);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);

    fetchShopkeepers(1, "", perPage);
  };

  // ITEM
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.CardName?.charAt(0)}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.CardName}</Text>
          <Text style={styles.cardMeta}>
            {item.City} • {item.Cellular}
          </Text>
          <Text style={styles.cardSmall}>Code: {item.CardCode}</Text>
        </View>
      </View>

      <View
        style={[
          styles.statusBadge,
          item.U_Status === "Pending" && styles.statusPendingBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            item.U_Status === "Pending" && styles.statusPending,
          ]}
        >
          {item.U_Status || "Active"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  // ERROR
  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchShopkeepers(1, search)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>

      
      // <View style={styles.center}>
      //   <Text style={{ color: "red" }}>{error}</Text>
      //   <TouchableOpacity onPress={() => fetchShopkeepers()}>
      //     <Text style={styles.retry}>Retry</Text>
      //   </TouchableOpacity>
      // </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: bottomSpacer,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Shop Keepers</Text>
        <Text style={styles.heroSubtitle}>
          Manage onboarding and approvals
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{total} Records</Text>
        </View>
      </View>

      {/* SEARCH */}
      <PageSearch
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search Shop Keepers..."
        loading={searching}
        color={Colors.storeManager.primary}
      />

      {/* PER PAGE */}
      <PerPageDropdown
        perPage={perPage}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        setPerPage={setPerPage}
        setPage={setPage}
        fetchData={fetchShopkeepers}
        search={search}
        color={Colors.storeManager.primary}
      />

      {/* PRODUCTS LIST */}
      {pageLoading ? (
        <View style={styles.listLoader}>
          <ActivityIndicator size="large" color={Colors.storeManager.primary} />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : shopkeepers.length > 0 ? (
        <View style={styles.listContainer}>
          {shopkeepers.map((item, index) => (
            <View key={item.CardCode || index}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No shopkeepers found</Text>
        </View>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <View style={styles.paginationWrapper}>
          {/* PAGINATION */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            perPage={perPage}
            onPageChange={(newPage) => fetchShopkeepers(newPage, search)}
            color={Colors.storeManager.primary}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  listLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  heroCard: {
    backgroundColor: Colors.storeManager.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  heroSubtitle: {
    color: "#D7E6EA",
    fontSize: 13,
  },
  countBadge: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardInfo: {
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F0F2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.storeManager.primary,
    textTransform: "uppercase",
  },
  cardTitle: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardMeta: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 2,
  },
  cardSmall: {
    color: "#9CA3AF",
    fontSize: 11,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    color: "#10B981",
    fontWeight: "700",
    fontSize: 12,
  },
  statusPending: {
    color: "#F59E0B",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  paginationWrapper: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.storeManager.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
});