import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const orders = [
  {
    id: "#SO-3021",
    status: "Pending",
    total: "PKR 18,400",
    items: "6 items",
  },
  {
    id: "#SO-3018",
    status: "Approved",
    total: "PKR 27,950",
    items: "9 items",
  },
  {
    id: "#SO-3013",
    status: "Delivered",
    total: "PKR 12,780",
    items: "4 items",
  },
];

export default function ShopkeeperOrdersScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>My Orders</Text>
        <Text style={styles.heroSubtitle}>
          Track active restocks, approvals, and delivered inventory in one queue.
        </Text>
      </View>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderTopRow}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderItems}>{order.items}</Text>
            </View>

            <View style={styles.statusPill}>
              <Text
                style={[
                  styles.statusText,
                  order.status === "Pending" && styles.statusPending,
                  order.status === "Delivered" && styles.statusDelivered,
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>

          <View style={styles.orderMetaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="cash-outline" size={16} color="#0F4C5C" />
              <Text style={styles.metaText}>{order.total}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={styles.trackButton}>
              <Text style={styles.trackButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F8",
  },
  contentContainer: {
    padding: 15,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#0F4C5C",
    borderRadius: 20,
    padding: 18,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#D7E6EA",
    marginTop: 8,
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    color: "#1F2933",
    fontSize: 17,
    fontWeight: "800",
  },
  orderItems: {
    color: "#7A8A91",
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: "#F4F7F8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#0F4C5C",
    fontSize: 12,
    fontWeight: "700",
  },
  statusPending: {
    color: "#D97706",
  },
  statusDelivered: {
    color: "#15803D",
  },
  orderMetaRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F0F2",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaText: {
    color: "#0F4C5C",
    fontWeight: "700",
  },
  trackButton: {
    backgroundColor: "#F4B942",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  trackButtonText: {
    color: "#1F2933",
    fontWeight: "800",
  },
});
