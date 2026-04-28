import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const notifications = [
  {
    icon: "cube-outline" as const,
    title: "Your last order is packed",
    subtitle: "Expected delivery tomorrow before 2 PM.",
    time: "10 min ago",
  },
  {
    icon: "pricetag-outline" as const,
    title: "Special pricing unlocked",
    subtitle: "You now qualify for partner rates on bulk engine oil.",
    time: "1 hour ago",
  },
  {
    icon: "receipt-outline" as const,
    title: "Invoice generated",
    subtitle: "Invoice for order #SO-3018 is ready to review.",
    time: "Yesterday",
  },
];

export default function ShopkeeperNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Notifications</Text>
        <Text style={styles.heroSubtitle}>
          Updates about deliveries, offers, and order progress.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        {notifications.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={20} color="#0F4C5C" />
            </View>
            <View style={styles.contentWrap}>
              <View style={styles.titleRow}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ))}
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
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E7ECEF",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E6F0F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  rowTitle: {
    flex: 1,
    color: "#1F2933",
    fontSize: 15,
    fontWeight: "700",
  },
  timeText: {
    color: "#7A8A91",
    fontSize: 12,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: "#6B7C85",
    marginTop: 4,
    lineHeight: 18,
  },
});
