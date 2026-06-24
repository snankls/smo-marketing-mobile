import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

interface ShopKeeperProfile {
  CardCode: string;
  CardName: string;
  CardType: string;
  CntctPrsn: string;
  Phone1: string;
  Cellular: string;
  Address: string;
  City: string;
  Country: string;
  Balance: string;
  CreditLine: string;
  Currency: string;
  CreateDate: string;
  U_CustType: string;
  U_WhCode: string;
}

export default function EditProfileScreen() {
  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ShopKeeperProfile | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Form fields
  const [businessName, setBusinessName] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      if (!token) return;
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/shop-keeper`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let profileData = res.data?.data || res.data;
      
      if (profileData) {
        setProfile(profileData);
        // Set form values
        setBusinessName(profileData.CardName || "");
        setOwner(profileData.CntctPrsn || "");
        setPhone(profileData.Phone1 || "");
        setMobile(profileData.Cellular || "");
        setAddress(profileData.Address || "");
        setCity(profileData.City || "");
        setCountry(profileData.Country || "PK");
      }
    } catch (err) {
      console.log("Fetch error:", err);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) fetchProfile();
    }, [token])
  );

  // Update profile
  const handleUpdate = async () => {
    if (!businessName.trim()) {
      Alert.alert("Error", "Business name is required");
      return;
    }

    if (!owner.trim()) {
      Alert.alert("Error", "Owner name is required");
      return;
    }

    setSaving(true);

    try {
      const res = await axios.put(
        `${API_URL}/shop-keeper`,
        {
          CardName: businessName,
          CntctPrsn: owner,
          Phone1: phone,
          Cellular: mobile,
          Address: address,
          City: city,
          Country: country,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.data?.status === "success") {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        // Navigate to profile page after 1.5 seconds
        setTimeout(() => {
          router.push("/(shopkeeper)/shopkeeper/profile");
        }, 1500);
      } else {
        setMessage({ text: res.data?.message || "Update failed", type: "error" });
      }

    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.flexContainer}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      nestedScrollEnabled={true}
    >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
          </View>

          {/* Success/Error Message */}
          {message && (
            <View style={[
              styles.messageContainer,
              message.type === "success" ? styles.successContainer : styles.errorContainer
            ]}>
              <Ionicons 
                name={message.type === "success" ? "checkmark-circle" : "alert-circle"} 
                size={20} 
                color={message.type === "success" ? Colors.global.success : Colors.global.danger} 
              />
              <Text style={[
                styles.messageText,
                message.type === "success" ? styles.successText : styles.errorText
              ]}>
                {message.text}
              </Text>
            </View>
          )}
          
          {/* Business Name */}
          <Text style={styles.label}>Business Name *</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              style={styles.input}
            />
          </View>

          {/* Owner Name */}
          <Text style={styles.label}>Owner/Contact Person *</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              value={owner}
              onChangeText={setOwner}
              style={styles.input}
            />
          </View>

          {/* Phone Number */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          {/* City */}
          <Text style={styles.label}>City</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="navigate-outline" size={20} color="#666" />
            <TextInput
              value={city}
              onChangeText={setCity}
              style={styles.input}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton, { backgroundColor: Colors.shopKeeper.button.buttonBg1 }]}
              onPress={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/(shopkeeper)/shopkeeper/profile")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "android" ? 100 : 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: Colors.global.white,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    paddingLeft: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    marginLeft: 10,
    backgroundColor: Colors.global.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.global.white,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveText: {
    color: Colors.global.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  successContainer: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  messageText: {
    fontSize: 14,
    flex: 1,
  },
  successText: {
    color: "#10B981",
  },
  errorText: {
    color: "#DC2626",
  },
});