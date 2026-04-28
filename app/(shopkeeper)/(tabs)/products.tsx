import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const products = [
  {
    name: "Servo Engine Oil 20W-50",
    price: "PKR 3,250",
    detail: "Best seller for routine engine service",
    stock: "In stock",
  },
  {
    name: "Brake Fluid DOT 4",
    price: "PKR 1,180",
    detail: "Reliable stock for premium brake systems",
    stock: "In stock",
  },
  {
    name: "Air Filter Premium",
    price: "PKR 920",
    detail: "High-demand consumable for workshop clients",
    stock: "Low stock",
  },
];

export default function ShopkeeperProductsScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Product Catalog</Text>
        <Text style={styles.heroSubtitle}>
          Browse fast-moving items and add restock quantities to your next order.
        </Text>
      </View>

      {products.map((product) => (
        <View key={product.name} style={styles.productCard}>
          <View style={styles.productTopRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="cube-outline" size={22} color="#0F4C5C" />
            </View>
            <View style={styles.stockPill}>
              <Text
                style={[
                  styles.stockText,
                  product.stock === "Low stock" && styles.stockTextWarning,
                ]}
              >
                {product.stock}
              </Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDetail}>{product.detail}</Text>
          <Text style={styles.priceText}>{product.price}</Text>

          <TouchableOpacity activeOpacity={0.85} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add to Order</Text>
          </TouchableOpacity>
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
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  productTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E6F0F2",
    alignItems: "center",
    justifyContent: "center",
  },
  stockPill: {
    backgroundColor: "#F4F7F8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stockText: {
    color: "#0F4C5C",
    fontSize: 12,
    fontWeight: "700",
  },
  stockTextWarning: {
    color: "#D97706",
  },
  productName: {
    color: "#1F2933",
    fontSize: 17,
    fontWeight: "800",
  },
  productDetail: {
    color: "#6B7C85",
    marginTop: 6,
    lineHeight: 18,
  },
  priceText: {
    color: "#0F4C5C",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
  },
  actionButton: {
    marginTop: 14,
    backgroundColor: "#F4B942",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#1F2933",
    fontWeight: "800",
  },
});
