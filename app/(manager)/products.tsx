import { ScrollView, StyleSheet, Text, View } from "react-native";

const products = [
  { name: "Servo Engine Oil 20W-50", stock: "128 in stock", status: "Active" },
  { name: "Brake Fluid DOT 4", stock: "42 in stock", status: "Low Stock" },
  { name: "Air Filter Premium", stock: "76 in stock", status: "Active" },
];

export default function ManagerProductsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>
          Review stock health and keep the catalog ready for shopkeepers.
        </Text>
      </View>

      {products.map((product) => (
        <View key={product.name} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardMeta}>{product.stock}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              product.status === "Low Stock" && styles.statusBadgeWarning,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                product.status === "Low Stock" && styles.statusTextWarning,
              ]}
            >
              {product.status}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    backgroundColor: "#C62828",
    borderRadius: 16,
    padding: 18,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#FDECEC",
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "700",
  },
  cardMeta: {
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeWarning: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  statusTextWarning: {
    color: "#EF6C00",
  },
});
