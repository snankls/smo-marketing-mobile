import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageSearch from "@/app/components/PageSearch";
import PerPageDropdown from "@/app/components/PerPageDropdown";
import Pagination from "@/app/components/Pagination";
import ProductCard from "@/app/components/ProductCard";
import ProductModal from "@/app/components/ProductModal";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

interface Product {
  ItemCode: string;
  SalUnitMsr: string;
  ItemName: string;
  FrgnName: string;
  LastPurPrc: string;
  U_App_ImageURL?: string;
}

interface CartItem extends Product {
  cartQuantity: number;
}

export default function ShopkeeperProductsScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('shopkeeper_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        // You can update a cart count state here if needed
      }
    } catch (err) {
      console.log("Error loading cart:", err);
    }
  };

  const addToCartLocally = (product: Product, quantity: number) => {
    try {
      AsyncStorage.getItem('shopkeeper_cart').then(async (savedCart) => {
        let cart: any[] = savedCart ? JSON.parse(savedCart) : [];
        
        const existingIndex = cart.findIndex(item => item.ItemCode === product.ItemCode);
        
        if (existingIndex !== -1) {
          cart[existingIndex].cartQuantity += quantity;
        } else {
          cart.push({
            ...product,
            cartQuantity: quantity,
          });
        }
        
        await AsyncStorage.setItem('shopkeeper_cart', JSON.stringify(cart));
      });
    } catch (err) {
      console.log("Error adding to cart:", err);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const fetchProducts = async (pageNumber = 1, searchText = "", perPageValue = perPage) => {
    try {
      if (pageNumber === 1 && !searchText) {
        setLoading(true);
      } else {
        setPageLoading(true);
      }

      const res = await fetch(
        `${API_URL}/products?page=${pageNumber}&per_page=${perPageValue}&search=${searchText}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const json = await res.json();

      setProducts(json.data || []);
      setPage(json.meta?.current_page || 1);
      setTotalPages(json.meta?.last_page || 1);
      setTotal(json.meta?.total || 0);

    } catch (err) {

      console.log(err);
      setError("Failed to load products");

    } finally {

      setLoading(false);
      setPageLoading(false);
      setSearching(false);
      setRefreshing(false);

    }
  };

  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProducts(1, search, perPage);
    }
  }, [perPage, search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(1, search);
  }, [search]);

  const handleSearch = () => {
    setSearching(true);
    setPage(1);
    setSearch(searchInput);
    fetchProducts(1, searchInput, perPage);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    fetchProducts(1, "", perPage);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.global.danger} />
        <Text>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts(1, search)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomSpacer }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Product Catalog</Text>
          <Text style={styles.heroSubtitle}>Browse products and add to order</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{total} Records</Text>
          </View>
        </View>

        <PageSearch
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search Products..."
          loading={searching}
          color={Colors.shopKeeper.primary}
        />

        {pageLoading ? (
          <View style={styles.listLoader}>
            <ActivityIndicator size="large" color={Colors.shopKeeper.primary} />
            <Text style={{ marginTop: 10 }}>Loading products...</Text>
          </View>
        ) : (
          <>
            <PerPageDropdown
              perPage={perPage}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setPerPage={setPerPage}
              setPage={setPage}
              fetchData={fetchProducts}
              search={search}
              color={Colors.shopKeeper.primary}
            />

            <FlatList
              data={products}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onAddToCart={handleAddToCart}
                  showAddToCart={true}
                  variant="default"
                  color={Colors.shopKeeper.primary}
                  buttonBgColor={Colors.shopKeeper.button.buttonBg1}
                  buttonTextColor={Colors.shopKeeper.button.buttonText1}
                />
              )}
              keyExtractor={(item) => item.ItemCode}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
            />
          </>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          perPage={perPage}
          onPageChange={(newPage) => fetchProducts(newPage, search)}
          color={Colors.shopKeeper.primary}
        />
      </ScrollView>

      <ProductModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
        onConfirm={addToCartLocally}
        color={Colors.shopKeeper.primary}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.global.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.global.background,
  },
  retryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#ffcc29",
    borderRadius: 8,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  heroCard: {
    marginBottom: 18,
    padding: 18,
    backgroundColor: Colors.shopKeeper.primary,
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
  listLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});