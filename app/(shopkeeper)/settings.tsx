import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const sections = [
  {
    title: "Store Preferences",
    items: [
      {
        icon: "notifications-outline" as const,
        title: "Order Alerts",
        value: "Enabled",
      },
      {
        icon: "time-outline" as const,
        title: "Delivery Window",
        value: "Morning",
      },
      {
        icon: "card-outline" as const,
        title: "Payment Preference",
        value: "Credit cycle",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        icon: "shield-checkmark-outline" as const,
        title: "Password & Security",
        value: "Updated",
      },
      {
        icon: "globe-outline" as const,
        title: "Language",
        value: "English",
      },
    ],
  },
];

export default function ShopkeeperSettingsScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Settings</Text>
        <Text style={styles.heroSubtitle}>
          Control notifications, delivery preferences, and account basics.
        </Text>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <TouchableOpacity key={item.title} activeOpacity={0.85} style={styles.row}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color="#0F4C5C" />
              </View>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{item.title}</Text>
              </View>
              <Text style={styles.rowValue}>{item.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
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
  sectionTitle: {
    color: "#1F2933",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E7ECEF",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E6F0F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: "#1F2933",
    fontWeight: "700",
  },
  rowValue: {
    color: "#0F4C5C",
    fontSize: 12,
    fontWeight: "700",
  },
});
