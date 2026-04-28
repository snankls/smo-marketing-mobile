import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ManagerDashboard() {
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
      <View style={styles.header}>
        <Text style={styles.title}>Servo Motor Oil</Text>
        <Text style={styles.subtitle}>Store Manager Dashboard</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Manage Products</Text>
        <Text style={styles.actionDesc}>
          Add, update and monitor engine oil & spare parts
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/products")}
        >
          <Text style={styles.buttonText}>Go to Products</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>View Orders</Text>
        <Text style={styles.actionDesc}>
          Track shopkeeper orders and approvals
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/orders")}
        >
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Shopkeepers</Text>
        <Text style={styles.actionDesc}>Manage your shopkeeper network</Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/shopkeepers")}
        >
          <Text style={styles.buttonText}>Manage Users</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Manage Products</Text>
        <Text style={styles.actionDesc}>
          Add, update and monitor engine oil & spare parts
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/products")}
        >
          <Text style={styles.buttonText}>Go to Products</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>View Orders</Text>
        <Text style={styles.actionDesc}>
          Track shopkeeper orders and approvals
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/orders")}
        >
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Shopkeepers</Text>
        <Text style={styles.actionDesc}>Manage your shopkeeper network</Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push("/(manager)/(tabs)/shopkeepers")}
        >
          <Text style={styles.buttonText}>Manage Users</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#C62828",
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C62828",
  },
  statLabel: {
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#212121",
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionDesc: {
    color: "#666",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FBC02D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
