import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/app/constants/Colors";

export default function ManagerChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = insets.bottom + 40;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: bottomSpacer },
      ]}
      showsVerticalScrollIndicator={false}
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
        {/* Current Password */}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
          />
        </View>

        {/* New Password */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="key-outline" size={20} color="#666" />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (newPassword !== confirmPassword) {
              alert("Passwords do not match");
              return;
            }
            alert("Password updated (UI only)");
          }}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
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
  },
  heroCard: {
    backgroundColor: Colors.storeManager.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  heroSubtitle: {
    color: "#fff",
    marginTop: 5,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 60,
  },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#ffcc29",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
});
