import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const settingSections = [
  {
    title: "Branch Controls",
    subtitle: "Core settings that affect operations and approvals.",
    items: [
      {
        icon: "business-outline" as const,
        title: "Branch Profile",
        subtitle: "Manage warehouse name, region, and address details.",
        value: "Karachi Central",
      },
      {
        icon: "time-outline" as const,
        title: "Working Hours",
        subtitle: "Define order cut-off and dispatch windows.",
        value: "9:00 AM - 7:00 PM",
      },
      {
        icon: "people-circle-outline" as const,
        title: "Approval Roles",
        subtitle: "Set who can approve orders and stock requests.",
        value: "3 approvers",
      },
    ],
  },
  {
    title: "Account Preferences",
    subtitle: "Personal controls for your manager workspace.",
    items: [
      {
        icon: "notifications-outline" as const,
        title: "Notification Rules",
        subtitle: "Choose when alerts should interrupt your workflow.",
        value: "Priority only",
      },
      {
        icon: "shield-checkmark-outline" as const,
        title: "Security",
        subtitle: "Password, device sessions, and access history.",
        value: "Protected",
      },
      {
        icon: "globe-outline" as const,
        title: "Language & Region",
        subtitle: "Set language, date, and currency formats.",
        value: "English / PKR",
      },
    ],
  },
];

export default function SettingsDashboard() {
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
          <View style={styles.heroIconWrap}>
            <Ionicons name="settings" size={28} color="#fff" />
          </View>

          <View style={styles.systemPill}>
            <Text style={styles.systemPillText}>System Ready</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Settings</Text>
        <Text style={styles.heroSubtitle}>
          Configure branch operations, account preferences, and daily manager controls.
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusCard}>
          <Text style={styles.statusValue}>03</Text>
          <Text style={styles.statusLabel}>Active Policies</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusValue}>02</Text>
          <Text style={styles.statusLabel}>Security Checks</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusValue}>01</Text>
          <Text style={styles.statusLabel}>Pending Update</Text>
        </View>
      </View>

      {settingSections.map((section) => (
        <View key={section.title} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>

          {section.items.map((item) => (
            <TouchableOpacity key={item.title} activeOpacity={0.85} style={styles.settingRow}>
              <View style={styles.settingIconWrap}>
                <Ionicons name={item.icon} size={20} color="#C62828" />
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.settingMeta}>
                <Text style={styles.settingValue}>{item.value}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Environment</Text>
        <Text style={styles.sectionSubtitle}>
          Current manager workspace and platform defaults.
        </Text>

        <View style={styles.environmentBox}>
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Theme</Text>
            <Text style={styles.environmentValue}>Light</Text>
          </View>
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Currency</Text>
            <Text style={styles.environmentValue}>PKR</Text>
          </View>
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Sync Status</Text>
            <Text style={styles.environmentValue}>Connected</Text>
          </View>
        </View>
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
    backgroundColor: "#C62828",
    borderRadius: 20,
    padding: 18,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  systemPill: {
    backgroundColor: "#FFF3CD",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  systemPillText: {
    color: "#7A4D00",
    fontWeight: "800",
    fontSize: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#FDECEC",
    marginTop: 8,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statusValue: {
    color: "#C62828",
    fontSize: 22,
    fontWeight: "800",
  },
  statusLabel: {
    color: "#616161",
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
    color: "#212121",
  },
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: "#757575",
    lineHeight: 19,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  settingIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FCEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: "#212121",
    fontSize: 15,
    fontWeight: "700",
  },
  settingSubtitle: {
    color: "#757575",
    marginTop: 3,
    lineHeight: 18,
  },
  settingMeta: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  settingValue: {
    color: "#C62828",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  environmentBox: {
    backgroundColor: "#FFF4F4",
    borderRadius: 16,
    padding: 14,
  },
  environmentRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2D9D9",
  },
  environmentLabel: {
    color: "#8A5B5B",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  environmentValue: {
    color: "#7F1D1D",
    fontSize: 15,
    fontWeight: "700",
  },
});
