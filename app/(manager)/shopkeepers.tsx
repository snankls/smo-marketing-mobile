import { ScrollView, StyleSheet, Text, View } from "react-native";

const shopkeepers = [
  { name: "Al-Madina Auto Store", area: "Gulshan", status: "Verified" },
  { name: "Khan Lubricants", area: "Saddar", status: "Pending" },
  { name: "Star Parts House", area: "Korangi", status: "Verified" },
];

export default function ManagerShopkeepersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Shopkeepers</Text>
        <Text style={styles.subtitle}>
          Manage onboarding, approvals, and territory coverage from one place.
        </Text>
      </View>

      {shopkeepers.map((shopkeeper) => (
        <View key={shopkeeper.name} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{shopkeeper.name}</Text>
            <Text style={styles.cardMeta}>{shopkeeper.area}</Text>
          </View>
          <Text
            style={[
              styles.statusText,
              shopkeeper.status === "Pending" && styles.statusPending,
            ]}
          >
            {shopkeeper.status}
          </Text>
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
  statusText: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  statusPending: {
    color: "#EF6C00",
  },
});
