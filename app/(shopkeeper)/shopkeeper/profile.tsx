import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

// Shop Keeper Interface
interface ShopKeeperProfile {
  CardCode: string;
  CardName: string;
  CntctPrsn: string;
  Phone1: string;
  City: string;
  Balance: string;
  CreditLine: number | string;
  DebtLine: number | string;
  Currency: string;
  CreateDate: string;
  U_CustType: string;
  U_WhCode: string;
}

export default function ShopkeeperProfileScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [profile, setProfile] = useState<ShopKeeperProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const toNumber = (value: number | string | null | undefined) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num as number) || num == null ? 0 : (num as number);
  };

  // Fetch fresh data from API
  const fetchProfile = async () => {
    try {
      if (!token) return;

      setLoading(true);

      const res = await axios.get(`${API_URL}/shop-keeper`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setProfile(res.data);

    } catch (err) {
      console.log("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load on screen focus
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomSpacer },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO CARD */}
      <View style={styles.heroCard}>
        {/* <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(shopkeeper)/shopkeeper/profile-edit")}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
        </TouchableOpacity> */}

        <View style={styles.avatar}>
          <Ionicons name="storefront" size={34} color="#fff" />
        </View>

        <Text style={styles.name}>{profile?.CardName}</Text>
        <Text style={styles.meta}>
          Shop Keeper Type: {profile?.U_CustType}
        </Text>
      </View>

      {/* Balance CARDS */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {toNumber(profile?.Balance).toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>Balance ({profile?.Currency})</Text>
        </View>
      </View>

      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {toNumber(profile?.CreditLine).toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>Credit Limit ({profile?.Currency})</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {toNumber(profile?.DebtLine).toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>Debit Limit ({profile?.Currency})</Text>
        </View>
      </View>

      {/* BUSINESS INFORMATION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Business Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Business Name</Text>
          <Text style={styles.infoValue}>{profile?.CardName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop Keeper Type</Text>
          <Text style={styles.infoValue}>{profile?.U_CustType}</Text>
        </View>
      </View>

      {/* CONTACT INFORMATION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Owner Name</Text>
          <Text style={styles.infoValue}>{profile?.CntctPrsn}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <Text style={styles.infoValue}>{profile?.Phone1}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City</Text>
          <Text style={styles.infoValue}>{profile?.City}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.global.background,
  },
  contentContainer: {
    padding: 15,
    gap: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
  },
  heroCard: {
    backgroundColor: Colors.shopKeeper.primary,
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
    color: Colors.global.white,
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
    backgroundColor: Colors.global.white,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  summaryValue: {
    color: Colors.shopKeeper.primary,
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
    backgroundColor: Colors.global.white,
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
