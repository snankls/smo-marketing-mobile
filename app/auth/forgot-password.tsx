import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Colors } from "@/app/constants/Colors";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  
  const router = useRouter();
  const [userTypeOptions, setUserTypeOptions] = useState<any[]>([]);
  const [loginUserType, setLoginUserType] = useState("shop_keeper");
  const [mobile, setMobile] = useState("");
  const [barcode, setBarcode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success" | null;
  }>({
    text: "",
    type: null,
  });

  // Animation values
  //const fadeAnim = useRef(new Animated.Value(0)).current;
  //const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchloginUserType();
    // Entrance animation
    // Animated.parallel([
    //   Animated.timing(fadeAnim, {
    //     toValue: 1,
    //     duration: 600,
    //     useNativeDriver: true,
    //   }),
    //   Animated.timing(slideAnim, {
    //     toValue: 0,
    //     duration: 600,
    //     useNativeDriver: true,
    //   }),
    // ]).start();
  }, []);

  const fetchloginUserType = async () => {
    try {
      const res = await axios.get(`${API_URL}/login-user-type`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.data && typeof res.data.data === "object") {

        const statusData = res.data.data;

        const statusArray = Object.entries(statusData)
          .map(([key, value]) => ({
            id: key,
            key: key,
            value: value
          }))
          // Remove Store Manager
          .filter(item => item.key !== "store_manager");


        setUserTypeOptions(statusArray);

        if (statusArray.length > 0) {

          const exists = statusArray.find(
            item => item.key === loginUserType
          );

          if (!exists) {
            setLoginUserType(statusArray[0].key);
          }

        }

      }

    } catch (err: any) {

      console.error("Fetch user type error:", err);

      setUserTypeOptions([
        {
          id: "shop_keeper",
          key: "shop_keeper",
          value: "Shop Keeper"
        },
        {
          id: "administrator",
          key: "administrator",
          value: "Administrator"
        },
      ]);

    }
  };

  const getUserTypeIcon = (key: string) => {
    switch(key) {
      case 'shop_keeper':
        return 'storefront-outline';
      case 'store_manager':
        return 'business-outline';
      case 'administrator':
        return 'shield-outline';
      default:
        return 'person-outline';
    }
  };

  const getUserTypeColor = (key: string) => {
    switch(key) {
      case 'shop_keeper':
        return Colors.shopKeeper.primary;
      case 'administrator':
        return Colors.administrator.primary;
      default:
        return '#6B7280';
    }
  };

  const handleVerifyAccount = async () => {

    const isAdministrator = loginUserType === "administrator";
    const isShopKeeper = loginUserType === "shop_keeper";

    // User type validation
    if (!loginUserType) {
      setMessage({
        text: "Please select user type",
        type: "error",
      });
      return;
    }


    // Shop Keeper validation
    if (isShopKeeper) {

      if (!mobile) {
        setMessage({
          text: "Please enter your mobile number",
          type: "error",
        });
        return;
      }

      if (!barcode) {
        setMessage({
          text: "Please enter your barcode",
          type: "error",
        });
        return;
      }

    }

    // Administrator validation
    if (isAdministrator) {
      if (!email) {
        setMessage({
          text: "Please enter your email address",
          type: "error",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setMessage({
          text: "Please enter a valid email address",
          type: "error",
        });
        return;
      }
    }

    try {

      setLoading(true);

      setMessage({
        text: "",
        type: null,
      });

      const response = await axios.post(
        `${API_URL}/forgot-password`,
        {
          mobile: isShopKeeper ? mobile : undefined,
          barcode: isShopKeeper ? barcode : undefined,
          email: email,
          user_type: loginUserType,
        }
      );

      if (response.data.success === true) {

        setMessage({
          text:
            response.data.message ||
            "Password reset successfully. Please check your email.",
          type: "success",
        });

        setMobile("");
        setBarcode("");
        setEmail("");

      } else {

        setMessage({
          text:
            response.data.message ||
            "Account verification failed",
          type: "error",
        });

      }

    } catch (error: any) {

      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );

      setMessage({
        text:
          error.response?.data?.message ||
          "Unable to verify account. Please try again.",
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
          <Animated.View 
            style={[
              styles.innerContainer,
              {
                //opacity: fadeAnim,
                //transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.welcomeText}>
                Forgot Password?
              </Text>
              <Text style={styles.subtitle}>
                Verify your account to reset password
              </Text>
            </View>

            {/* User Type - Card Selection */}
            <View style={styles.userTypeContainer}>
              <View style={styles.cardGrid}>
                {userTypeOptions.map((option) => {
                  const isSelected = loginUserType === option.key;
                  const iconName = getUserTypeIcon(option.key);
                  const color = getUserTypeColor(option.key);
                  
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.userTypeCard,
                        isSelected && styles.userTypeCardSelected,
                        { borderColor: isSelected ? color : '#E5E7EB' }
                      ]}
                      onPress={() => setLoginUserType(option.key)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.cardIconContainer, { backgroundColor: isSelected ? color : '#F3F4F6' }]}>
                        <Ionicons 
                          name={iconName} 
                          size={24} 
                          color={isSelected ? '#FFFFFF' : '#6B7280'} 
                        />
                      </View>
                      <Text style={[
                        styles.cardTitle,
                        isSelected && styles.cardTitleSelected,
                        { color: isSelected ? color : '#374151' }
                      ]}>
                        {option.value}
                      </Text>
                      {isSelected && (
                        <View style={[styles.checkmarkBadge, { backgroundColor: color }]}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {loginUserType !== "administrator" && (
              <>
                {/* Mobile */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Mobile Number <Text style={styles.requiredStar}>*</Text>
                  </Text>

                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color="#9CA3AF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="923XXXXXXXXX"
                      keyboardType="phone-pad"
                      editable={!loading}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Barcode */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Barcode <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="barcode-outline"
                      size={20}
                      color="#9CA3AF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={barcode}
                      onChangeText={setBarcode}
                      placeholder="Enter your barcode"
                      autoCapitalize="characters"
                      editable={!loading}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </>
            )}

            {/* Email Address */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email Address <Text style={styles.requiredStar}>*</Text>
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Message */}
              {message.text ? (
                <View
                  style={[
                    styles.messageContainer,
                    message.type === "error"
                      ? styles.errorContainer
                      : styles.successContainer
                  ]}
                >
                  <Ionicons
                    name={
                      message.type === "error"
                        ? "alert-circle"
                        : "checkmark-circle"
                    }
                    size={22}
                    color={
                      message.type === "error"
                        ? "#DC2626"
                        : "#16A34A"
                    }
                  />

                  <Text
                    style={[
                      styles.messageText,
                      message.type === "error"
                        ? styles.errorText
                        : styles.successText
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ) : null}

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                loading && styles.verifyButtonDisabled
              ]}
              onPress={handleVerifyAccount}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.verifyButtonText}>
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backContainer}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    backgroundColor: "#FEF3F3",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: '#ED3237',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  userTypeContainer: {
    marginBottom: 24,
    width: "100%",
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
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: -6,
  },
  userTypeCard: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '33.33%',
    margin: 6,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeCardSelected: {
    backgroundColor: '#F8FAFC',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardTitleSelected: {
    fontWeight: '700',
  },
  checkmarkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
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
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  successContainer: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    color: "#DC2626",
  },
  successText: {
    color: "#16A34A",
  },
  verifyButton: {
    backgroundColor: Colors.auth.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.auth.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  backContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  backText: {
    color: Colors.auth.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});