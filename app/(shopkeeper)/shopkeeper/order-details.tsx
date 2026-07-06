import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Linking,
  FlatList,
} from "react-native";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

type OrderItem = {
  id: number;
  Order_id: string;
  Oitm_id: string;
  ItemName: string;
  SalUnitMsr?: string;
  Quantity: string;
  UnitPrice: string;
  TotalUnitPrice: string;
  createDate?: string;
  isNew?: boolean;
  U_Image?: string;
};

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

export default function OrderDetailsScreen() {
  const { id, invoice } = useLocalSearchParams();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [shopkeeper, setShopkeeper] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const imageUri = (image?: string) => IMAGE_URL && image ? `${IMAGE_URL}/${image.trim()}` : undefined;

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
    return () => {
      setOrderInfo(null);
      setItems([]);
    };
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!token) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok || json.status !== true) {
        throw new Error(json.message || "Failed to load order");
      }

      const order = json.order;

      setOrderInfo({
        id: order.id,
        InvoiceNo: order.InvoiceNo,
        Orcd_Id: order.createBy || order.Orcd_Id,
        TotalQuantity: parseFloat(order.TotalQuantity || "0"),
        TotalPrice: parseFloat(order.TotalPrice || "0"),
        status: order.status,
        createDate: order.createDate,
      });

      setShopkeeper(json.shopkeeper || null);

      const normalizedItems = Array.isArray(json.items)
        ? json.items.map((item: any) => ({
            id: Number(item.id),
            Order_id: item.Order_id,
            Oitm_id: item.Oitm_id,
            productCode: item.productCode,
            ItemName: item.ItemName || "",
            SalUnitMsr: item.SalUnitMsr || item.Packing || "N/A",
            Quantity: parseFloat(item.Quantity || "0").toString(),
            UnitPrice: parseFloat(item.UnitPrice || "0").toString(),
            TotalUnitPrice: parseFloat(item.TotalUnitPrice || "0").toString(),
            U_Image: item.U_Image,
            isNew: false,
          }))
        : [];

      setItems(normalizedItems);

    } catch (err) {
      console.log("Order load error:", err);
      Alert.alert("Error", "Failed to load order details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProducts = async (search: string = "", pageNo = 1, append = false) => {
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

      const newData =
        json?.data && Array.isArray(json.data) ? json.data : [];

      setProducts(prev =>
        append ? [...prev, ...newData] : newData
      );

      setHasMore(newData.length === 20);
      setPage(pageNo);

    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProducts(false);
      setLoadingMore(false);
    }
  };

  const addProduct = (product: Product) => {
    const existsIndex = items.findIndex(
      (item) => item.Oitm_id === product.ItemCode
    );

    if (existsIndex !== -1) {
      // Show alert when product already exists
      Alert.alert(
        "Product Already Added",
        `${product.ItemName} is already in this order. You can update the quantity from the order items list.`,
        [{ text: "OK" }]
      );
      
      // Highlight the existing item in the main list
      setHighlightId(product.ItemCode);

      requestAnimationFrame(() => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: existsIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      });

      setTimeout(() => setHighlightId(null), 1500);
      return;
    }

    const price = product.LastPurPrc || "0";

    const newItem: OrderItem = {
      id: Date.now(),
      Order_id: id as string,
      Oitm_id: product.ItemCode,
      SalUnitMsr: product.SalUnitMsr,
      ItemName: product.ItemName,
      U_Image: product.U_Image,
      Quantity: "1",
      UnitPrice: price,
      TotalUnitPrice: price,
      isNew: true,
    };

    setItems((prev) => {
      const updated = [...prev, newItem];

      requestAnimationFrame(() => {
        const index = updated.length - 1;

        setHighlightId(product.ItemCode);

        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 150);

        setTimeout(() => setHighlightId(null), 1500);
      });

      return updated;
    });

    setShowProductModal(false);
    setSearchProduct("");
  };

  const updateQuantity = (itemId: number, newQuantity: string) => {
    const qty = parseFloat(newQuantity);

    if (isNaN(qty)) return;

    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const unitPrice = parseFloat(item.UnitPrice || "0");
          return {
            ...item,
            Quantity: qty.toString(),
            TotalUnitPrice: (qty * unitPrice).toString(),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const updateOrder = async () => {
    if (orderInfo?.status !== "Pending") {
      console.log("Info", "Only pending orders can be updated");
      return;
    }

    if (items.length === 0) {
      console.log("Error", "Order must have at least one item");
      return;
    }

    setUpdating(true);

    try {
      const totalQuantity = items.reduce(
        (sum, item) => sum + parseFloat(item.Quantity || "0"),
        0
      );
      const totalPrice = items.reduce(
        (sum, item) => sum + parseFloat(item.TotalUnitPrice || "0"),
        0
      );

      const payload = {
        items: items.map(item => ({
          Oitm_id: item.Oitm_id,
          Quantity: parseFloat(item.Quantity),
          UnitPrice: parseFloat(item.UnitPrice),
          isNew: item.isNew || false,
          id: item.id > 0 ? item.id : undefined
        })),
        total_quantity: totalQuantity.toString(),
        total_price: totalPrice.toString(),
      };

      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.status === true) {
        console.log("Success", "Order updated successfully");
        fetchOrderDetails();
      } else {
        console.log("Error", json.message || "Failed to update order");
      }
    } catch (err) {
      console.log(err);
      console.log("Error", "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "0.00";
    return new Intl.NumberFormat("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice);
  };

  const totalQuantity = items.reduce(
    (sum, item) => sum + (parseFloat(item.Quantity) || 0),
    0
  );

  const totalAmount = items.reduce(
    (sum, item) => sum + (parseFloat(item.TotalUnitPrice) || 0),
    0
  );

  const subtotal = totalAmount;
  const grandTotal = subtotal;

  if (loading) {
    return <LoadingScreen />;
  }

  const isPending = (orderInfo?.status ?? "").toLowerCase() === "pending";

  // Header component for FlatList
  const ListHeaderComponent = () => (
    <>
      {/* Order Header Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroTitle}>{orderInfo?.InvoiceNo}</Text>
            <Text style={styles.heroSubtitle}>
              Order #{orderInfo?.id ?? "-"} •{" "}
              {orderInfo?.createDate
                ? new Date(orderInfo.createDate).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          <View style={[styles.statusBadge, isPending ? styles.statusPending : styles.statusCompleted]}>
            <Text style={styles.statusText}>{orderInfo?.status}</Text>
          </View>
        </View>

        <View style={styles.heroStats}>
          <View style={styles.statItem}>
            <Ionicons name="cube-outline" size={18} color="#fff" />
            <Text style={styles.statText}>Total Items: {items.length}</Text>
          </View>
        </View>
      </View>

      {/* Items Section Header with Add Button */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <Text style={styles.sectionSubtitle}>Manage products in this order</Text>
        </View>
        {isPending && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              fetchProducts(searchProduct);
              setShowProductModal(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={22} color={Colors.shopKeeper.primary} />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  // Footer component for FlatList
  const ListFooterComponent = () => (
    <>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Quantity</Text>
          <Text style={styles.summaryValue}>{totalQuantity} items</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>PKR {formatPrice(grandTotal)}</Text>
        </View>
      </View>

      {/* Update Button */}
      {isPending && (
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: Colors.shopKeeper.button.buttonBg1 } ]}
          onPress={updateOrder}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={ Colors.shopKeeper.button.buttonText1 } />
              <Text style={[styles.updateButtonText, { color: Colors.shopKeeper.button.buttonText1 }]}>Update Order</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.deviderButton}></Text>
    </>
  );

  // Empty component
  const ListEmptyComponent = () => (
    <View style={styles.emptyItems}>
      <Ionicons name="cart-outline" size={60} color="#cbd5e1" />
      <Text style={styles.emptyText}>No items in this order</Text>
      {isPending && (
        <TouchableOpacity
          style={styles.emptyAddButton}
          onPress={() => {
            fetchProducts(searchProduct);
            setShowProductModal(true);
          }}
        >
          <Text style={styles.emptyAddButtonText}>Add Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemCard,
              highlightId === item.Oitm_id && styles.highlightCard,
            ]}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemImageInfo}>
                <Image
                  source={
                    item.U_Image
                      ? { uri: imageUri(item.U_Image) }
                      : { uri: `${IMAGE_URL}/placeholder.png` }
                  }
                  style={styles.itemImage}
                />
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemCode}>{item.ItemName}</Text>
                <Text style={styles.productCode}>Packing: {item.SalUnitMsr}</Text>
                <Text style={styles.itemPrice}>
                  Unit: PKR {formatPrice(item.UnitPrice)}
                </Text>
              </View>

              {isPending && (
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.itemDetails}>
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Quantity</Text>

                {isPending ? (
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => {
                        const newQty = Math.max(
                          1,
                          parseFloat(item.Quantity) - 1
                        );
                        updateQuantity(item.id, newQty.toString());
                      }}
                    >
                      <Ionicons name="remove" size={16} color={Colors.shopKeeper.primary} />
                    </TouchableOpacity>

                    <TextInput
                      style={styles.quantityInput}
                      value={item.Quantity}
                      onChangeText={(text) =>
                        updateQuantity(item.id, text)
                      }
                      keyboardType="numeric"
                    />

                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => {
                        const newQty =
                          parseFloat(item.Quantity) + 1;
                        updateQuantity(item.id, newQty.toString());
                      }}
                    >
                      <Ionicons name="add" size={16} color={Colors.shopKeeper.primary} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.quantityValue}>
                    {item.Quantity}
                  </Text>
                )}
              </View>

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  PKR {formatPrice(item.TotalUnitPrice)}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchOrderDetails}
            colors={[Colors.shopKeeper.primary]}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.index * 120,
              animated: true,
            });
          }, 300);
        }}
        getItemLayout={(_, index) => ({
          length: 160,
          offset: 160 * index,
          index,
        })}
      />

      {/* Product Selection Modal */}
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
                const isAlreadyAdded = items.some(orderItem => orderItem.Oitm_id === item.ItemCode);
                
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
                            ₨ {formatPrice(item.LastPurPrc || "0")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loaderText: {
    marginTop: 10,
    color: "#6B7280",
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
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  heroTitle: {
    color: Colors.global.white,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "#F9A825",
  },
  statusCompleted: {
    backgroundColor: "#2E7D32",
  },
  statusText: {
    color: Colors.global.white,
    fontSize: 12,
    fontWeight: "700",
  },
  heroStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: Colors.global.white,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  callButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e6f4fb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.shopKeeper.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  itemCard: {
    backgroundColor: Colors.global.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  newItemCard: {
    borderWidth: 1,
    borderColor: Colors.shopKeeper.primary,
    backgroundColor: "#f0f9ff",
  },
  highlightCard: {
    borderWidth: 2,
    borderColor: Colors.shopKeeper.primary,
    backgroundColor: "#e6f7ff",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImageInfo: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    width: 70,
    height: 70,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: Colors.global.white,
    padding: 6,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  itemCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
    width: '90%',
  },
  newBadge: {
    backgroundColor: Colors.shopKeeper.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: Colors.global.white,
    fontSize: 9,
    fontWeight: "700",
  },
  itemPrice: {
    fontSize: 12,
    color: "#6b7280",
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  quantitySection: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e6f4fb",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityInput: {
    width: 60,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 6,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.shopKeeper.primary,
  },
  summaryCard: {
    backgroundColor: Colors.global.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.shopKeeper.primary,
  },
  updateButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  deviderButton: {
    marginBottom: 70,
  },
  emptyItems: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: Colors.global.white,
    borderRadius: 16,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 12,
  },
  emptyAddButton: {
    marginTop: 16,
    backgroundColor: Colors.shopKeeper.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: Colors.global.white,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.global.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1f2937",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.global.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1f2937",
  },
  modalLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 14,
  },
  productList: {
    padding: 16,
    paddingTop: 0,
  },
  productCard: {
    backgroundColor: Colors.global.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  productCardContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  productCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },
  addedButtonText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  productCardActiveBorder: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.shopKeeper.primary,
    backgroundColor: '#f0f9ff',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  productPacking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  packingText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  productRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.shopKeeper.primary,
    flex: 1,
  },
  addButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  productDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 12,
  },
  noProducts: {
    padding: 60,
    alignItems: "center",
  },
  noProductsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
    marginTop: 12,
  },
  noProductsSubtext: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  loadingMoreFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: Colors.shopKeeper.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});