import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const notificationGroups = [
  {
    title: "Today",
    items: [
      {
        icon: "receipt-outline" as const,
        title: "8 new orders need review",
        subtitle: "Orders from Karachi Central and Clifton shops are waiting.",
        time: "5 min ago",
        tone: "alert",
      },
      {
        icon: "cube-outline" as const,
        title: "Low stock warning",
        subtitle: "Brake Fluid DOT 4 dropped below your alert threshold.",
        time: "22 min ago",
        tone: "warning",
      },
    ],
  },
  {
    title: "Earlier",
    items: [
      {
        icon: "people-outline" as const,
        title: "New shopkeeper request",
        subtitle: "A new reseller profile is pending approval in Saddar.",
        time: "Yesterday",
        tone: "default",
      },
      {
        icon: "cash-outline" as const,
        title: "Weekly sales summary ready",
        subtitle: "Your branch performance report has been generated.",
        time: "Yesterday",
        tone: "default",
      },
    ],
  },
];

export default function NotificationsDashboard() {
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
            <Ionicons name="notifications" size={28} color="#fff" />
          </View>

          <View style={styles.unreadPill}>
            <Text style={styles.unreadPillText}>12 unread</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Notifications</Text>
        <Text style={styles.heroSubtitle}>
          Stay on top of approvals, stock alerts, and team activity from one place.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>08</Text>
          <Text style={styles.summaryLabel}>Order Alerts</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>03</Text>
          <Text style={styles.summaryLabel}>Stock Warnings</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>01</Text>
          <Text style={styles.summaryLabel}>Approvals</Text>
        </View>
      </View>

      {notificationGroups.map((group) => (
        <View key={group.title} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{group.title}</Text>
          <Text style={styles.sectionSubtitle}>
            Important manager-side updates grouped by activity time.
          </Text>

          {group.items.map((item) => (
            <TouchableOpacity key={item.title} activeOpacity={0.85} style={styles.notificationRow}>
              <View
                style={[
                  styles.notificationIconWrap,
                  item.tone === "alert" && styles.notificationIconAlert,
                  item.tone === "warning" && styles.notificationIconWarning,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    item.tone === "alert"
                      ? "#B71C1C"
                      : item.tone === "warning"
                        ? "#E65100"
                        : "#C62828"
                  }
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeadingRow}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          Tune what reaches you first during the working day.
        </Text>

        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceTitle}>Instant order approval alerts</Text>
          <Text style={styles.preferenceState}>Enabled</Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceTitle}>Low stock reminders</Text>
          <Text style={styles.preferenceState}>Enabled</Text>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceTitle}>Weekly branch summary</Text>
          <Text style={styles.preferenceState}>Every Monday</Text>
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
  unreadPill: {
    backgroundColor: "#FFF3CD",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unreadPillText: {
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
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  summaryValue: {
    color: "#C62828",
    fontSize: 22,
    fontWeight: "800",
  },
  summaryLabel: {
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
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  notificationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FCEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationIconAlert: {
    backgroundColor: "#FDEBEB",
  },
  notificationIconWarning: {
    backgroundColor: "#FFF2E6",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  notificationTitle: {
    flex: 1,
    color: "#212121",
    fontSize: 15,
    fontWeight: "700",
  },
  notificationTime: {
    color: "#9E9E9E",
    fontSize: 12,
    fontWeight: "600",
  },
  notificationSubtitle: {
    color: "#757575",
    marginTop: 4,
    lineHeight: 18,
  },
  preferenceRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  preferenceTitle: {
    color: "#212121",
    fontSize: 15,
    fontWeight: "700",
  },
  preferenceState: {
    color: "#C62828",
    marginTop: 4,
    fontWeight: "600",
  },
});
