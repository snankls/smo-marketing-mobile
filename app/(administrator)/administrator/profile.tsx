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

// Administrator Interface
interface AdministratorProfile {
  fullname: string;
  username: string;
  mobile: string;
  email: string;
  status: string;
  createBy: string;
  createOn: string;
}

export default function AdministratorProfileScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;

  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [profile, setProfile] = useState<AdministratorProfile | null>(null);
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

      const res = await axios.get(`${API_URL}/administrator/profile`, {
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
        <View style={styles.avatar}>
          <Ionicons name="storefront" size={34} color="#fff" />
        </View>

        <Text style={styles.name}>{profile?.fullname}</Text>
        {/* <Text style={styles.meta}>
          {profile?.U_CustType} Customer • {profile?.CardCode}
        </Text> */}
      </View>

      {/* BUSINESS INFORMATION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Business Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{profile?.fullname}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile Number</Text>
          <Text style={styles.infoValue}>{profile?.mobile}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Address</Text>
          <Text style={styles.infoValue}>{profile?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>{profile?.status}</Text>
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
    backgroundColor: Colors.administrator.primary,
    borderRadius: 20,
    padding: 18,
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
