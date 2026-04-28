import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomSpacer },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.title}>Ahmed Autos</Text>
        <Text style={styles.subtitle}>Shopkeeper Dashboard</Text>
        <Text style={styles.heroMeta}>
          Review fast-moving stock, place orders quickly, and track active
          deliveries.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Products Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>03</Text>
          <Text style={styles.statLabel}>Open Orders</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Browse Products</Text>
        <Text style={styles.actionDesc}>
          Check latest catalog items and prepare your next stock order.
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.push("/(shopkeeper)/products")}
        >
          <Text style={styles.buttonText}>Open Catalog</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Track Orders</Text>
        <Text style={styles.actionDesc}>
          See pending, approved, and delivered orders in one place.
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => router.push("/(shopkeeper)/orders")}
        >
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>
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
  },
  heroCard: {
    marginBottom: 18,
    padding: 18,
    backgroundColor: "#0F4C5C",
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "800",
  },
  subtitle: {
    color: "#D7E6EA",
    marginTop: 6,
    fontWeight: "600",
  },
  heroMeta: {
    color: "#D7E6EA",
    marginTop: 10,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F4C5C",
  },
  statLabel: {
    marginTop: 4,
    color: "#6B7C85",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2933",
    marginBottom: 10,
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2933",
  },
  actionDesc: {
    color: "#6B7C85",
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#F4B942",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#1F2933",
    fontWeight: "800",
  },
});
