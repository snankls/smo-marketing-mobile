import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import { Colors } from "@/app/constants/Colors";

interface User {
  id: string | number;
  CardCode?: string;
  CardName?: string;
  CntctPrsn?: string;
  Phone1?: string;
  WhsCode?: string;
  WhsName?: string;
  Location?: string;
  City?: string;
  Country?: string;
  U_plist?: string;
  fullname?: string;
  username?: string;
  mobile?: string;
  email?: string;
  role?: string;
}

export default function LoginScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [typeModalVisible, settypeModalVisible] = useState(false);
  const [loginUserType, setloginUserType] = useState("shop_keeper");
  const [userTypeOptions, setUserTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchloginUserType();
  }, []);

  // remove this on production - only for testing convenience
  useEffect(() => {
    if (loginUserType === "shop_keeper") {
      setIdentifier("0622-500096");
      setPassword("1-Dir-csdbahawa");
    }

    // if (loginUserType === "store_manager") {
    //   setIdentifier("LtChakA1");
    //   setPassword("2E967340");
    // }
    if (loginUserType === "store_manager") {
      setIdentifier("FsCSDBP1");
      setPassword("0EF9C453");
    }

    if (loginUserType === "administrator") {
      setIdentifier("admin");
      setPassword("admin123");
    }
  }, [loginUserType]);

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success" | null;
  }>({
    text: "",
    type: null,
  });

  const router = useRouter();
  const { login } = useAuth();

  const fetchloginUserType = async () => {
    try {
      const res = await axios.get(`${API_URL}/login-user-type`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.data && typeof res.data.data === 'object') {
        const statusData = res.data.data;
        const statusArray = Object.entries(statusData).map(([key, value]) => ({
          id: key,
          key: key,
          value: value
        }));
        setUserTypeOptions(statusArray);

        // Always sync selected value with API
        if (statusArray.length > 0) {
          const exists = statusArray.find(item => item.key === loginUserType);
          if (!exists) {
            setloginUserType(statusArray[0].key);
          }
        }
      }
    } catch (err: any) {
      console.error('Fetch user type error:', err);
      // Set default options if API fails
      setUserTypeOptions([
        { id: 'shop_keeper', key: 'shop_keeper', value: 'Shop Keeper' },
        { id: 'store_manager', key: 'store_manager', value: 'Store Manager' },
        { id: 'administrator', key: 'administrator', value: 'Administrator' },
      ]);
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    if (!loginUserType) {
      setMessage({ text: "Please select user type", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: null });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          mobile: identifier,
          password,
          user_type: loginUserType,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.data?.authorisation?.token) {
        const token = data.data.authorisation.token;

        // Initialize userData with a default structure
        let userData: any = {};

        if (loginUserType === "shop_keeper") {
          userData = {
            id: data.data.user.CardCode,
            CardCode: data.data.user.CardCode,
            CardName: data.data.user.CardName,
            CntctPrsn: data.data.user.CntctPrsn,
            Phone1: data.data.user.Phone1,
          };
        } else if (loginUserType === "store_manager") {
          userData = {
            id: data.data.user.WhsCode,
            WhsCode: data.data.user.WhsCode,
            WhsName: data.data.user.WhsName,
            Location: data.data.user.Location,
            City: data.data.user.City,
            Country: data.data.user.Country,
            U_plist: data.data.user.U_plist,
          };
        } else if (loginUserType === "administrator") {
          userData = {
            id: data.data.user.id,
            fullname: data.data.user.fullname,
            username: data.data.user.username,
            mobile: data.data.user.mobile,
            email: data.data.user.email,
            role: data.data.user.role || 'administrator',
          };
        }

        // Now userData is guaranteed to be defined
        await login(token, userData, loginUserType);

        if (loginUserType === "shop_keeper") {
          router.replace("/(shopkeeper)/shopkeeper/dashboard");
        } else if (loginUserType === "store_manager") {
          router.replace("/(storemanager)/storemanager/dashboard");
        } else if (loginUserType === "administrator") {
          router.replace("/(administrator)/administrator/dashboard");
        }

        setMessage({ text: "Login successful!", type: "success" });
      } else {
        setMessage({
          text: data?.message || "Login failed",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({
        text: "Unable to connect to server. Please check your internet connection.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to your account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Identifier */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Phone Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Password <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* User Type */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  User Type <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.modalTrigger}
                  onPress={() => settypeModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalTriggerLeft}>
                    <Ionicons name="people-outline" size={20} color="#9CA3AF" />
                    <Text style={loginUserType ? styles.modalTriggerText : styles.modalTriggerPlaceholder}>
                      {loginUserType 
                      ? (userTypeOptions.find(opt => opt.key === loginUserType)?.value || loginUserType)
                      : 'Select User Type'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Message */}
              {message.text ? (
                <View style={[
                  styles.messageContainer,
                  message.type === "error" ? styles.errorContainer : styles.successContainer
                ]}>
                  <Ionicons 
                    name={message.type === "error" ? "alert-circle" : "checkmark-circle"} 
                    size={20} 
                    color={message.type === "error" ? "#DC2626" : "#10B981"} 
                  />
                  <Text style={[
                    styles.messageText,
                    message.type === "error" ? styles.errorText : styles.successText,
                  ]}>
                    {message.text}
                  </Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Reset Password */}
              <View style={styles.resetContainer}>
                <TouchableOpacity 
                  onPress={() => router.push("./reset-password")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* User Type Selection Modal */}
      <Modal 
        visible={typeModalVisible} 
        transparent 
        animationType="slide" 
        onRequestClose={() => settypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => settypeModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select User Type</Text>
              <TouchableOpacity 
                onPress={() => settypeModalVisible(false)} 
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {userTypeOptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>No user type options available</Text>
              </View>
            ) : (
              <FlatList
                data={userTypeOptions}
                extraData={loginUserType}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, loginUserType === item.key && styles.selectedModalItem]}
                    onPress={() => {
                      setloginUserType(item.key);
                      settypeModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalItemText, loginUserType === item.key && styles.selectedModalItemText]}>
                      {item.value}
                    </Text>
                    {loginUserType === item.key && (
                      <Ionicons name="checkmark-circle" size={22} color="#ed3237" />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#FEF3F3",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  requiredStar: {
    color: Colors.global.danger,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  modalTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
  },
  modalTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTriggerText: {
    color: "#1F2937",
    fontSize: 16,
  },
  modalTriggerPlaceholder: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  successContainer: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  messageText: {
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    color: "#DC2626",
  },
  successText: {
    color: "#10B981",
  },
  loginButton: {
    backgroundColor: Colors.auth.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Colors.auth.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resetLink: {
    fontSize: 14,
    color: Colors.auth.primary,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedModalItem: {
    backgroundColor: "#FEF3F3",
  },
  modalItemText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedModalItemText: {
    color: Colors.auth.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});