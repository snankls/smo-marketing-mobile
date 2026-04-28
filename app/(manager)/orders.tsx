import { ScrollView, StyleSheet, Text, View } from "react-native";

const orders = [
  { id: "#OD-1024", shopkeeper: "Al-Madina Auto Store", total: "PKR 28,500" },
  { id: "#OD-1025", shopkeeper: "Khan Lubricants", total: "PKR 14,200" },
  { id: "#OD-1026", shopkeeper: "Star Parts House", total: "PKR 33,750" },
];

export default function ManagerOrdersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>
          Track incoming orders and stay on top of approvals and dispatch.
        </Text>
      </View>

      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{order.id}</Text>
            <Text style={styles.cardMeta}>{order.shopkeeper}</Text>
          </View>
          <Text style={styles.total}>{order.total}</Text>
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
  total: {
    color: "#C62828",
    fontWeight: "700",
  },
});
