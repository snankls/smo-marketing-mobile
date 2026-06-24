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

interface ShopKeeper {
  CardCode: string;
  CardName: string;
}

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

export default function StoremanagerProductsScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shopkeepers, setShopkeepers] = useState<ShopKeeper[]>([]);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState<ShopKeeper | null>(null);
  const [loadingShopkeepers, setLoadingShopkeepers] = useState(false);
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

  const fetchShopkeepers = async () => {
    try {
      if (!token) {
        return;
      }

      setLoadingShopkeepers(true);
      
      console.log("Fetching shopkeepers from:", `${API_URL}/store-manager/shop-keeper`);
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token");
      
      const res = await fetch(
        `${API_URL}/store-manager/shop-keeper`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log("Shopkeepers response status:", res.status);
      
      const json = await res.json();
      console.log("Shopkeepers response full:", JSON.stringify(json, null, 2));

      // Try different response formats
      let shopkeepersData = [];
      
      // If response is an array directly
      if (Array.isArray(json)) {
        shopkeepersData = json;
      } 
      // If response has data property
      else if (json.data && Array.isArray(json.data)) {
        shopkeepersData = json.data;
      } 
      // If response has status and data
      else if (json.status && json.data && Array.isArray(json.data)) {
        shopkeepersData = json.data;
      }
      // If response has shopkeepers property
      else if (json.shopkeepers && Array.isArray(json.shopkeepers)) {
        shopkeepersData = json.shopkeepers;
      }
      
      console.log("Extracted shopkeepers count:", shopkeepersData.length);
      setShopkeepers(shopkeepersData);
      
    } catch (err) {
      console.log("Error fetching shopkeepers:", err);
      // Set mock data on error for testing
      setShopkeepers([
        { CardCode: "CFDirCSD0000001", CardName: "CSD bahawalpur-Bahawalpur" },
        { CardCode: "CFDirCSD0000002", CardName: "CSD Cod Khanewal-khanewal" },
      ]);
    } finally {
      setLoadingShopkeepers(false);
    }
  };

  useEffect(() => {
    fetchShopkeepers();
  }, []);

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

  const addToCartLocally = (product: Product, quantity: number, shopkeeper: ShopKeeper) => {
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
            shopkeeper: shopkeeper,
          });
        }
        
        await AsyncStorage.setItem('shopkeeper_cart', JSON.stringify(cart));
        Alert.alert("Success", "Item added to cart!");
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
          color={Colors.storeManager.primary}
        />

        {pageLoading ? (
          <View style={styles.listLoader}>
            <ActivityIndicator size="large" color={Colors.storeManager.primary} />
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
              color={Colors.storeManager.primary}
            />

            <FlatList
              data={products}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onAddToCart={handleAddToCart}
                  showAddToCart={true}
                  variant="default"
                  color={Colors.storeManager.primary}
                  buttonBgColor={Colors.storeManager.button.buttonBg1}
                  buttonTextColor={Colors.storeManager.button.buttonText1}
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
          color={Colors.storeManager.primary}
        />
      </ScrollView>

      <ProductModal
        visible={modalVisible}
        product={selectedProduct}
        shopkeepers={shopkeepers}
        loadingShopkeepers={loadingShopkeepers}
        selectedShopkeeper={selectedShopkeeper}
        setSelectedShopkeeper={setSelectedShopkeeper}
        onClose={() => setModalVisible(false)}
        onConfirm={addToCartLocally}
        buttonBgColor={Colors.storeManager.button.buttonBg1}
        buttonTextColor={Colors.storeManager.button.buttonText1}
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
  listLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});