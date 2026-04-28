import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const infoRows = [
  { label: "Business Name", value: "Ahmed Autos" },
  { label: "Owner", value: "Ahmed Raza" },
  { label: "Phone", value: "+92 321 7654321" },
  { label: "Location", value: "Clifton, Karachi" },
  { label: "Customer Tier", value: "Gold Partner" },
];

export default function ShopkeeperProfileScreen() {
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
      {/* EDIT BUTTON */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/(shopkeeper)/(tabs)/profile-edit")}
      >
        <Ionicons name="create-outline" size={18} color="#fff" />
      </TouchableOpacity>

      <View style={styles.heroCard}>
        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(shopkeeper)/(tabs)/profile-edit")}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Ionicons name="person" size={34} color="#fff" />
        </View>

        <Text style={styles.name}>Ahmed Autos</Text>
        <Text style={styles.role}>Trusted shopkeeper partner</Text>
        <Text style={styles.meta}>
          Reordering inventory, tracking deliveries, and managing branch demand.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>34</Text>
          <Text style={styles.summaryLabel}>Completed Orders</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>4.8</Text>
          <Text style={styles.summaryLabel}>Partner Rating</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        {infoRows.map((row) => (
          <View key={row.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.actionRow}>
          <Ionicons name="create-outline" size={20} color="#0F4C5C" />
          <Text style={styles.actionText}>Update Business Information</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.actionRow}>
          <Ionicons name="call-outline" size={20} color="#0F4C5C" />
          <Text style={styles.actionText}>Contact Account Manager</Text>
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
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#0F4C5C",
    borderRadius: 20,
    padding: 18,
  },
  editButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 10,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  role: {
    color: "#D7E6EA",
    marginTop: 6,
    fontWeight: "600",
  },
  meta: {
    color: "#D7E6EA",
    marginTop: 10,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  summaryValue: {
    color: "#0F4C5C",
    fontSize: 22,
    fontWeight: "800",
  },
  summaryLabel: {
    color: "#6B7C85",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2933",
    marginBottom: 10,
  },
  infoRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E7ECEF",
  },
  infoLabel: {
    color: "#7A8A91",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    color: "#1F2933",
    fontSize: 15,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E7ECEF",
  },
  actionText: {
    color: "#1F2933",
    fontWeight: "700",
  },
});
