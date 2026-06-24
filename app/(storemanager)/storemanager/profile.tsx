import { Colors } from "@/app/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const quickActions = [
  {
    icon: "create-outline" as const,
    title: "Edit Profile",
    subtitle: "Update your personal and branch information.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Security",
    subtitle: "Change password and review sign-in activity.",
  },
  {
    icon: "notifications-outline" as const,
    title: "Notifications",
    subtitle: "Control order alerts and manager reminders.",
  },
];

const summaryStats = [
  { label: "Managed Shops", value: "24" },
  { label: "Pending Orders", value: "08" },
  { label: "Team Members", value: "12" },
];

const infoRows = [
  { label: "Full Name", value: "Hamza Tariq" },
  { label: "Role", value: "Store Manager" },
  { label: "Phone", value: "+92 300 1234567" },
  { label: "Email", value: "manager@servomotor.com" },
  { label: "Branch", value: "Karachi Central Warehouse" },
  { label: "Employee ID", value: "SM-2048" },
];

export default function ProfileDashboard() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.statusPill}>
            <Ionicons name="checkmark-circle" size={16} color="#1B5E20" />
            <Text style={styles.statusText}>Active Manager</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Hamza Tariq</Text>
        <Text style={styles.role}>Store Manager, AW Marketing</Text>
        <Text style={styles.metaText}>
          Overseeing inventory flow, shopkeeper support, and daily order approvals.
        </Text>
      </View>

      <View style={styles.statsRow}>
        {summaryStats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        <Text style={styles.sectionSubtitle}>
          Primary information used across the manager portal.
        </Text>

        {infoRows.map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
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
    gap: 16,
  },
  heroCard: {
    backgroundColor: Colors.storeManager.primary,
    borderRadius: 20,
    padding: 18,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3CD",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    color: "#1B5E20",
    fontWeight: "700",
    fontSize: 12,
  },
  name: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  role: {
    color: "#FFE5E5",
    fontSize: 15,
    marginTop: 6,
    fontWeight: "600",
  },
  metaText: {
    color: "#FDECEC",
    marginTop: 10,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.storeManager.primary,
  },
  statLabel: {
    marginTop: 4,
    color: "#616161",
    fontSize: 12,
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
    color: "#212121",
  },
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: "#757575",
    lineHeight: 19,
  },
  infoRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  infoLabel: {
    color: "#9E9E9E",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoValue: {
    color: "#212121",
    fontSize: 15,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FCEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    color: "#212121",
    fontSize: 15,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: "#757575",
    marginTop: 3,
    lineHeight: 18,
  },
  highlightBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFF4F4",
    borderRadius: 16,
    padding: 14,
  },
  highlightTextWrap: {
    flex: 1,
  },
  highlightTitle: {
    color: "#7F1D1D",
    fontSize: 15,
    fontWeight: "800",
  },
  highlightSubtitle: {
    color: "#8A5B5B",
    marginTop: 4,
    lineHeight: 18,
  },
});
