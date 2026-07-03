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
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
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
  U_App_ImageURL?: string;
};

export default function OrderDetailsScreen() {
  const { id, invoice } = useLocalSearchParams();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [storemanager, setStoremanager] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      setStoremanager(json.storemanager || null);

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
            U_App_ImageURL: item.U_App_ImageURL,
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

      {/* Items Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <Text style={styles.sectionSubtitle}>View products in this order</Text>
        </View>
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

      <Text style={styles.deviderButton}></Text>
    </>
  );

  // Empty component
  const ListEmptyComponent = () => (
    <View style={styles.emptyItems}>
      <Ionicons name="cart-outline" size={60} color="#cbd5e1" />
      <Text style={styles.emptyText}>No items in this order</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemImageInfo}>
                <Image
                  source={{ uri: item.U_App_ImageURL }}
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
            </View>

            <View style={styles.itemDetails}>
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Quantity</Text>
                <Text style={styles.quantityValue}>
                  {item.Quantity}
                </Text>
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
            colors={[Colors.storeManager.primary]}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: 160,
          offset: 160 * index,
          index,
        })}
      />
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
    backgroundColor: Colors.storeManager.primary,
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
  itemCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
    width: '90%',
  },
  productCode: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: "#6b7280",
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
  quantityValue: {
    fontSize: 16,
    fontWeight: "700",
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
    fontSize: 16,
    fontWeight: "700",
    color: Colors.storeManager.primary,
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
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.storeManager.primary,
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
});