import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

interface StoreManager {
  WhsCode: string;
  WhsName: string;
  City?: string;
  Country?: string;
  Location?: string;
  Phone?: string;
  Email?: string;
  U_plist?: string;
  Inactive?: string;
  createDate?: string;
}

export default function ProfileDashboard() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState<StoreManager | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/store-manager`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setManager(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!manager) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="person-circle-outline"
          size={60}
          color={Colors.global.danger}
        />
        <Text style={styles.emptyText}>Unable to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomSpacer }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.avatar}>
            <Ionicons name="storefront" size={32} color="#fff" />
          </View>

          {/* <TouchableOpacity activeOpacity={0.8} style={styles.statusPill}>
            <Ionicons name="checkmark-circle" size={16} color="#1B5E20" />
            <Text style={styles.statusText}>Active Manager</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.name}>{manager?.WhsName}</Text>
        <Text style={styles.role}>Store Manager, AW Marketing</Text>
        <Text style={styles.metaText}>
          Overseeing inventory flow, shopkeeper support, and daily order approvals.
        </Text>
      </View>

      {/* <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Profile Details</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{manager?.WhsName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{manager?.Phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{manager?.Email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Branch</Text>
          <Text style={styles.infoValue}>{manager?.Branch}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Employee ID</Text>
          <Text style={styles.infoValue}>{manager?.EmployeeId}</Text>
        </View>
      </View> */}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B7280",
  },
});
