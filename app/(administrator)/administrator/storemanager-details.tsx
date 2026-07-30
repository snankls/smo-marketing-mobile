import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/app/constants/Colors";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function AdministratorStoreManagerDetailsScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const { WhsCode } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 120;
  const [manager, setManager] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setError(null);
      const res = await fetch(
        `${API_URL}/administrator/store-manager/${WhsCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (res.ok) {
        setManager(json.data);
      } else {
        setError(
          json.message || "Failed to load store manager"
        );
      }
    } catch (error) {
      console.log(error);
      setError(
        "Failed to load store manager"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDetails();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="red"
        />

        <Text>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchDetails}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleChangePassword = async () => {

    if (!password || !confirmPassword) {
      Alert.alert(
        "Validation",
        "Please enter password and confirm password"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validation",
        "Password does not match"
      );
      return;
    }

    try {
      setSavingPassword(true);

      const res = await fetch(
        `${API_URL}/administrator/store-manager/change-password`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            WhsCode: manager?.WhsCode,
            password: password,
          }),
        }
      );

      const json = await res.json();

      if (res.ok) {
        Alert.alert(
          "Success",
          "Password changed successfully"
        );

        setPassword("");
        setConfirmPassword("");
        setPasswordModal(false);

      } else {

        Alert.alert(
          "Error",
          json.message || "Password update failed"
        );

      }

    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: bottomSpacer,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

      {/* HEADER */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="business"
            size={32}
            color="#fff"
          />
        </View>

        <Text 
          style={styles.heroTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {manager?.WhsName}
        </Text>

        <Text style={styles.heroSubtitle}>
          Warehouse Code : {manager?.WhsCode}
        </Text>
      </View>

      {/* DETAILS CARD */}
      <View style={styles.card}>
        <Text style={styles.heading}>
          Store Information
        </Text>

        <Detail
          label="Warehouse Code"
          value={manager?.WhsCode}
        />

        <Detail
          label="Warehouse Name"
          value={manager?.WhsName}
        />
      </View>

      {/* CHANGE PASSWORD BUTTON */}
      <TouchableOpacity
        style={styles.passwordButton}
        onPress={() => setPasswordModal(true)}
      >
        <Ionicons
          name="key-outline"
          size={22}
          color="#fff"
        />
        <Text style={styles.passwordText}>
          Change Password
        </Text>
      </TouchableOpacity>

      </ScrollView>

      {/* MOVE MODAL HERE */}
      <Modal
        visible={passwordModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModal}>
            <View style={styles.modalHeader}>
              <Ionicons
                name="key-outline"
                size={24}
                color={Colors.administrator.primary}
              />
              <Text style={styles.modalTitle}>
                Change Password
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setPassword("");
                  setConfirmPassword("");
                  setPasswordModal(false);
                }}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleChangePassword}
                disabled={savingPassword}
              >
                <Text style={styles.saveText}>
                  {savingPassword ? "Saving..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <View style={styles.row}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {value || "-"}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: Colors.administrator.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: Colors.administrator.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "#D7E6EA",
    fontSize: 13,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    color: "#6B7280",
    width: "45%",
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
    color: "#111",
    fontSize: 14,
  },
  passwordButton: {
    marginTop: 20,
    backgroundColor: Colors.administrator.primary,
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  passwordText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },


    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  passwordModal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#F9FAFB",
    marginBottom: 14,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },

  saveButton: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    backgroundColor: Colors.administrator.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});