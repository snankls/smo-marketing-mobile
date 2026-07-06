import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  FlatList,
  TextInput,
  RefreshControl
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/app/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "@/app/components/CartContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

interface CartItem {
  ItemCode: string;
  ItemName: string;
  SalUnitMsr: string;
  LastPurPrc: string;
  U_Image?: string;
  cartQuantity: number;
}

type Product = {
  id: number;
  FrgnName: string;
  ItemCode: string;
  ItemName: string;
  Price?: string;
  SalUnitMsr?: string;
  LastPurPrc?: string;
  UnitPrice?: string;
  U_Image?: string;
};

export default function ShopkeeperCartScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const { token } = useAuth();

  // Get everything from CartContext
  //const { cartItems, updateQuantity, removeItem, clearCart, loadCart, refreshCart } = useCart();
  const { cartItems, addItem, updateQuantity, removeItem, clearCart, loadCart, refreshCart } = useCart();
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [originalCartItems, setOriginalCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [changedItems, setChangedItems] = useState<Set<string>>(new Set());
  
  // Load cart on screen focus
  useFocusEffect(
    useCallback(() => {
      loadCartData();
    }, [])
  );

  const imageUri = (image?: string) => IMAGE_URL && image ? `${IMAGE_URL}/${image.trim()}` : undefined;

  const addProduct = (product: Product) => {
    const exists = cartItems.find(
      (item) => item.ItemCode === product.ItemCode
    );

    if (exists) {
      Alert.alert("Already in Cart", `${product.ItemName} already exists in cart`);
      return;
    }

    // Add FrgnName property
    addItem({
      ItemCode: product.ItemCode,
      ItemName: product.ItemName,
      FrgnName: product.FrgnName || product.ItemName || "",  // <-- Add this
      SalUnitMsr: product.SalUnitMsr || "N/A",
      LastPurPrc: product.LastPurPrc || "0",
      U_Image: product.U_Image,
      cartQuantity: 1,
    });

    setShowProductModal(false);
    setSearchProduct("");
  };

  const fetchProducts = async (
    search: string = "",
    pageNo = 1,
    append = false
  ) => {
    if (!token) return;

    try {
      if (pageNo === 1) setLoadingProducts(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("per_page", "20");
      params.append("page", pageNo.toString());

      const res = await fetch(`${API_URL}/products?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      const newData = Array.isArray(json?.data) ? json.data : [];

      setProducts((prev) => (append ? [...prev, ...newData] : newData));
      setHasMore(newData.length === 20);
      setPage(pageNo);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProducts(false);
      setLoadingMore(false);
    }
  };

  const loadCartData = async () => {
    try {
      setLoading(true);
      await loadCart(); // Load from context
      const savedCart = await AsyncStorage.getItem('shopkeeper_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setOriginalCartItems(JSON.parse(JSON.stringify(cart)));
      } else {
        setOriginalCartItems([]);
      }
      setChangedItems(new Set()); // Clear changed items on load
    } catch (err) {
      console.log("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (itemCode: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(itemCode);
      return;
    }
    updateQuantity(itemCode, newQty);
    
    // Mark this item as changed
    setChangedItems(prev => new Set(prev).add(itemCode));
  };

  const handleRemoveItem = (itemCode: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeItem(itemCode);
            // Mark as changed (will be removed from cart)
            setChangedItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(itemCode);
              return newSet;
            });
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear all items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearCart();
            setOriginalCartItems([]);
            setChangedItems(new Set());
          },
        },
      ]
    );
  };

  const handleUpdateCart = async () => {
    const hasChanges = changedItems.size > 0;

    if (!hasChanges) return;

    try {
      setUpdating(true);

      // small delay so loader becomes visible
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save cart
      await AsyncStorage.setItem(
        "shopkeeper_cart",
        JSON.stringify(cartItems)
      );

      setOriginalCartItems(
        JSON.parse(JSON.stringify(cartItems))
      );

      // Clear changed items
      setChangedItems(new Set());

      // Refresh header/cart count
      await refreshCart();

    } catch (err) {
      console.log("Error updating cart:", err);
      Alert.alert("Error", "Failed to update cart");
    } finally {
      setUpdating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart Empty", "No items to place order");
      return;
    }

    if (changedItems.size > 0) {
      Alert.alert(
        "Unsaved Changes",
        "Please update your cart before placing order.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        items: cartItems.map((item) => ({
          Oitm_id: item.ItemCode,
          ItemCode: item.ItemCode,
          qty: item.cartQuantity,
          UnitPrice: parseFloat(item.LastPurPrc || "0"),
          ItemName: item.ItemName,
          SalUnitMsr: item.SalUnitMsr,
          U_Image: item.U_Image,
        })),
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (e) {
        console.log("Parse error:", e);
        if (responseText.includes("success") || responseText.includes("created")) {
          await clearCart();
          await AsyncStorage.removeItem('shopkeeper_cart');
          setOriginalCartItems([]);
          setChangedItems(new Set());
          await refreshCart();
          Alert.alert("Success", responseText || "Order placed successfully!");
          router.back(); // Navigate back or to orders screen
          return;
        }
        throw new Error("Invalid response from server");
      }

      if (json.status === true || json.status === "success") {
        await clearCart();
        await AsyncStorage.removeItem('shopkeeper_cart');
        setOriginalCartItems([]);
        setChangedItems(new Set());
        await refreshCart();
        router.back();
      } else {
        Alert.alert("Error", json?.message || json?.error || "Order failed");
      }
    } catch (err: any) {
      console.log("Order error:", err);
      Alert.alert(
        "Error",
        err?.message ?? "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.LastPurPrc || "0");
      return sum + price * item.cartQuantity;
    }, 0);
  };

  // Check if an item has unsaved changes
  const hasItemChanged = (itemCode: string) => {
    return changedItems.has(itemCode);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>My Cart</Text>
        <Text style={styles.heroSubtitle}>
          Review items before placing order
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Items */}
      <TouchableOpacity
        onPress={() => {
          setProducts([]);
          fetchProducts("", 1, false);
          setShowProductModal(true);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color="#000" />
        <Text style={{ marginLeft: 6, fontWeight: "600" }}>
          Add Items
        </Text>
      </TouchableOpacity>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>
            Add products from the Products screen
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push("./products");
            }}
            style={[styles.shoppingButton, { backgroundColor: Colors.shopKeeper.button.buttonBg1 }]}
          >
            <Text style={[styles.shoppingButtonText, { color: Colors.shopKeeper.button.buttonText1 }]}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cartItems.map((item) => {
            const isChanged = hasItemChanged(item.ItemCode);
            return (
              <View key={item.ItemCode} style={[styles.cartCard, isChanged && styles.unsavedCard]}>
                <Image
                  source={
                    item.U_Image
                    ? { uri: imageUri(item.U_Image) }
                    : { uri: `${IMAGE_URL}/placeholder.png` }
                  }
                  style={styles.productImage}
                  resizeMode="contain"
                />

                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.ItemName}
                  </Text>
                  <Text style={styles.productUnit}>{item.SalUnitMsr}</Text>
                  <Text style={styles.productPrice}>
                    PKR {formatPrice(parseFloat(item.LastPurPrc || "0"))}
                  </Text>

                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.ItemCode, item.cartQuantity - 1)}
                      style={styles.qtyButton}
                    >
                      <Ionicons name="remove-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.cartQuantity}</Text>

                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.ItemCode, item.cartQuantity + 1)}
                      style={styles.qtyButton}
                    >
                      <Ionicons name="add-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.ItemCode)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemTotal}>
                    Total: PKR {formatPrice(parseFloat(item.LastPurPrc || "0") * item.cartQuantity)}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.summaryCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalValue}>
                {cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)} items
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotal}>
                PKR {formatPrice(calculateTotal())}
              </Text>
            </View>

            {/* Warning if changes are not saved */}
            {changedItems.size > 0 && (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
                <Text style={styles.warningText}>
                  You have {changedItems.size} item(s) with unsaved changes. Click "Update Cart" to save.
                </Text>
              </View>
            )}

            {/* Update Cart Button */}
            <TouchableOpacity 
              onPress={handleUpdateCart} 
              style={[styles.updateCartButton, { backgroundColor: Colors.shopKeeper.button.buttonBg2 }]}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color={Colors.shopKeeper.button.buttonText2} />
                  <Text style={[styles.updateCartButtonText, { color: Colors.shopKeeper.button.buttonText2 }]}>Update Cart</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Place Order Button */}
            <TouchableOpacity
              style={[styles.placeOrderButton, placingOrder && styles.disabledButton, , { backgroundColor: Colors.shopKeeper.button.buttonBg1 }]}
              onPress={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={Colors.shopKeeper.button.buttonText1} />
                  <Text style={[styles.placeOrderText, { color: Colors.shopKeeper.button.buttonText1 }]}>Place Order</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal
        visible={showProductModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select Products</Text>
              <Text style={styles.modalSubtitle}>Browse and add items to this order</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowProductModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products by name or code..."
              placeholderTextColor="#9ca3af"
              value={searchProduct}
              onChangeText={(text) => {
                setSearchProduct(text);
                setPage(1);
                setHasMore(true);
                fetchProducts(text, 1, false);
              }}
            />
            {searchProduct !== "" && (
              <TouchableOpacity onPress={() => {
                setSearchProduct("");
                fetchProducts("", 1, false);
              }}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {loadingProducts && products.length === 0 ? (
            <View style={styles.modalLoader}>
              <ActivityIndicator size="large" color={Colors.shopKeeper.primary} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item, index) => `${item.ItemCode}-${index}`}
              renderItem={({ item }) => {
                const isAlreadyAdded = cartItems.some(orderItem => orderItem.ItemCode === item.ItemCode);
                
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => !isAlreadyAdded && addProduct(item)}
                    style={[
                      styles.productCard,
                      isAlreadyAdded && styles.productCardDisabled,
                      isAlreadyAdded && styles.productCardActiveBorder
                    ]}
                    disabled={isAlreadyAdded}
                  >
                    <View style={styles.productCardContent}>
                      {/* LEFT: Image */}
                      <Image
                        source={
                          item.U_Image
                            ? { uri: imageUri(item.U_Image) }
                            : { uri: `${IMAGE_URL}/placeholder.png` }
                        }
                        style={styles.productImage}
                      />

                      {/* MIDDLE: Product Details */}
                      <View style={styles.productDetails}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {item.ItemName || item.FrgnName}
                        </Text>

                        <View style={styles.productPacking}>
                          <Ionicons name="cube-outline" size={12} color={Colors.shopKeeper.primary} />
                          <Text style={styles.packingText}>
                            Packing: {item.SalUnitMsr || "N/A"}
                          </Text>
                        </View>

                        {/* RIGHT: Price & Add Button */}
                        <View style={styles.productRight}>
                          <Text style={styles.productPrice}>
                            ₨ {formatPrice(parseFloat(item.LastPurPrc || "0"))}
                          </Text>

                          <View style={styles.addButtonWrapper}>
                            {isAlreadyAdded ? (
                              <>
                                <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                                <Text style={styles.addedButtonText}>Added</Text>
                              </>
                            ) : (
                              <>
                                <Ionicons name="add-circle-outline" size={22} color={Colors.shopKeeper.primary} />
                                <Text style={styles.addButtonText}>Add Items</Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.productDivider} />
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.productList}
              showsVerticalScrollIndicator={false}
              
              // Load more when scroll reaches end
              onEndReached={() => {
                if (!loadingMore && hasMore && !loadingProducts) {
                  const nextPage = page + 1;
                  fetchProducts(searchProduct, nextPage, true);
                }
              }}
              
              onEndReachedThreshold={0.3}
              
              // Loading footer
              ListFooterComponent={
                loadingMore ? (
                  <View style={styles.loadingMoreFooter}>
                    <ActivityIndicator size="small" color={Colors.shopKeeper.primary} />
                    <Text style={styles.loadingMoreText}>Loading more products...</Text>
                  </View>
                ) : null
              }
              
              // Empty component
              ListEmptyComponent={
                !loadingProducts && products.length === 0 ? (
                  <View style={styles.noProducts}>
                    <Ionicons name="search-outline" size={60} color={Colors.shopKeeper.primary} />
                    <Text style={styles.noProductsText}>No products found</Text>
                    <Text style={styles.noProductsSubtext}>
                      {searchProduct ? "Try searching with different keywords" : "Pull to refresh or add products first"}
                    </Text>
                    {!searchProduct && (
                      <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={() => fetchProducts("", 1, false)}
                      >
                        <Ionicons name="refresh-outline" size={20} color={Colors.shopKeeper.primary} />
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null
              }
              
              // Refresh control
              refreshControl={
                <RefreshControl
                  refreshing={loadingProducts && products.length > 0}
                  onRefresh={() => {
                    setPage(1);
                    setHasMore(true);
                    fetchProducts(searchProduct, 1, false);
                  }}
                  colors={[Colors.shopKeeper.primary]}
                />
              }
              
              // Optimize performance
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.global.background,
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
    color: Colors.global.white,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#D7E6EA",
    marginBottom: 12,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: "#EF4444",
    fontWeight: "500",
  },
  unsavedCard: {
    borderWidth: 1,
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
  },
  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: Colors.global.white,
    borderRadius: 16,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  shoppingButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  shoppingButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: Colors.global.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.shopKeeper.primary,
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.shopKeeper.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  summaryCard: {
    backgroundColor: Colors.global.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.shopKeeper.primary,
  },
  updateCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffcc29",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  updateCartButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
  },
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
  },
  placeOrderText: {
    color: Colors.global.white,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },





  // Add these styles to your StyleSheet
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  modalLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
  },
  productList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productCardDisabled: {
    opacity: 0.7,
    backgroundColor: '#f9fafb',
  },
  productCardActiveBorder: {
    borderColor: '#10b981',
  },
  productCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPacking: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  packingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  productRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  addButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.shopKeeper.primary,
    marginLeft: 4,
  },
  addedButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
    marginLeft: 4,
  },
  productDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginTop: 12,
  },
  loadingMoreFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  noProducts: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  noProductsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.shopKeeper.primary,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.shopKeeper.primary,
    marginLeft: 8,
  },
});