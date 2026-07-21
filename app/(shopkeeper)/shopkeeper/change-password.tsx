import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import axios from "axios";
import { Colors } from "@/app/constants/Colors";

export default function ShopkeeperChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 40;
  const { token } = useAuth();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleUpdatePassword = async () => {
    // Clear previous message
    setMessage(null);

    // Validation
    if (!currentPassword.trim()) {
      setMessage({ text: "Current password is required", type: "error" });
      return;
    }

    if (!newPassword.trim()) {
      setMessage({ text: "New password is required", type: "error" });
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage({ text: passwordError, type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ text: "New password must be different from current password", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/shop-keeper/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data?.status === "success") {
        setMessage({ text: "Password changed successfully!", type: "success" });
        
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Navigate back after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setMessage({ 
          text: response.data?.message || "Failed to change password", 
          type: "error" 
        });
      }
    } catch (err: any) {
      console.log("Password change error:", err);
      const errorMessage = err?.response?.data?.message || 
        err?.response?.data?.error ||
        "Failed to change password. Please try again.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomSpacer },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Change Password</Text>
          <Text style={styles.heroSubtitle}>
            Update your password to keep your account secure.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Success/Error Message */}
          {message && (
            <View style={[
              styles.messageContainer,
              message.type === "success" ? styles.successContainer : styles.errorContainer
            ]}>
              <Ionicons 
                name={message.type === "success" ? "checkmark-circle" : "alert-circle"} 
                size={20} 
                color={message.type === "success" ? "#10B981" : "#DC2626"} 
              />
              <Text style={[
                styles.messageText,
                message.type === "success" ? styles.successText : styles.errorText
              ]}>
                {message.text}
              </Text>
            </View>
          )}

          {/* Current Password */}
          <Text style={styles.label}>Current Password *</Text>
          <View style={styles.inputWrap}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={16} color="#0F4C5C" />
            </View>

            <TextInput
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              editable={!loading}
            />

            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Ionicons 
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <Text style={styles.label}>New Password *</Text>
          <View style={styles.inputWrap}>
            <View style={styles.iconContainer}>
              <Ionicons name="key-outline" size={16} color="#0F4C5C" />
            </View>

            <TextInput
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              editable={!loading}
            />

            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons 
                name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm New Password *</Text>
          <View style={styles.inputWrap}>
            {/* Icon with background */}
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#0F4C5C" />
            </View>

            <TextInput
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              editable={!loading}
            />

            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementItem}>• Minimum 6 characters</Text>
            <Text style={styles.requirementItem}>• Should be different from current password</Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  contentContainer: {
    padding: 16,
  },
  heroCard: {
    marginBottom: 18,
    padding: 18,
    backgroundColor: Colors.shopKeeper.primary,
    borderRadius: 20,
    shadowColor: Colors.global.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.global.white,
    marginTop: 20,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: Colors.global.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 60,
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
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
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
    marginBottom: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: Colors.global.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#E6F0F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  requirementsContainer: {
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#0F4C5C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#0F4C5C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "bold",
    color: Colors.global.white,
    fontSize: 16,
  },
});