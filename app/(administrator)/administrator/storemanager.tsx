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
import { router } from "expo-router";

export default function ManagerStoreManagerScreen() {
  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const [storemanager, setStoreManager] = useState<any[]>([]);
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
  const fetchStoreManager = async (
    pageNumber = 1,
    searchText = "",
    perPageValue = perPage
  ) => {
    try {

      setError(null);

      if (pageNumber === 1 && !searchText) {
        setLoading(true);
      } else {
        setPageLoading(true);
      }

      const res = await fetch(
        `${API_URL}/administrator/store-manager?page=${pageNumber}&per_page=${perPageValue}&search=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (res.ok) {

        setStoreManager(json.data || []);
        setPage(json.current_page || 1);
        setTotalPages(json.last_page || 1);
        setTotal(json.total || 0);

      } else {

        setError(json.message || "Failed to load storemanager");

      }

    } catch (err) {

      console.log(err);
      setError("Failed to load storemanager");

    } finally {

      setLoading(false);
      setPageLoading(false);
      setRefreshing(false);
      setSearching(false);

    }
  };

  useEffect(() => {
    fetchStoreManager(1, "");
  }, []);

  // REFRESH
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStoreManager(1, search);
  }, [search]);

  // SEARCH
  const handleSearch = () => {
    setSearching(true);
    setPage(1);
    setSearch(searchInput);
    
    fetchStoreManager(1, searchInput);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);

    fetchStoreManager(1, "", perPage);
  };

  // ITEM
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(administrator)/administrator/storemanager-details",
          params: {
            WhsCode: item.WhsCode,
          },
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.WhsName?.charAt(0) || "S"}
            </Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              {item.WhsName || "Store Manager"}
            </Text>

            <Text style={styles.cardMeta}>
              Warehouse Code: {item.WhsCode}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            fetchStoreManager(1, search);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.heroTitle}>Store Manager</Text>
        <Text style={styles.heroSubtitle}>
          Manage warehouse store managers
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
        placeholder="Search Store Manager..."
        loading={searching}
        color={Colors.administrator.primary}
      />

      {/* PER PAGE */}
      <PerPageDropdown
        perPage={perPage}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        setPerPage={setPerPage}
        setPage={setPage}
        fetchData={fetchStoreManager}
        search={search}
        color={Colors.administrator.primary}
      />

      {/* PRODUCTS LIST */}
      {pageLoading ? (
        <View style={styles.listLoader}>
          <ActivityIndicator size="large" color={Colors.administrator.primary} />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : storemanager.length > 0 ? (
        <View style={styles.listContainer}>
          {storemanager.map((item, index) => (
            <View key={item.CardCode || index}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No storemanager found</Text>
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
            onPageChange={(newPage) => fetchStoreManager(newPage, search)}
            color={Colors.administrator.primary}
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
    backgroundColor: Colors.administrator.primary,
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
    color: Colors.administrator.primary,
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
  statusPendingBadge: {
    backgroundColor: "#FEF3C7",
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
    backgroundColor: Colors.administrator.primary,
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