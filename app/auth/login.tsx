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
  Cellular?: string;
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
  const [loginUserType, setloginUserType] = useState("shop_keeper");
  const [userTypeOptions, setUserTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchloginUserType();
  }, []);

  // remove this on production - only for testing convenience
  useEffect(() => {
    if (loginUserType === "shop_keeper") {
      //setIdentifier("923319345493");
      setIdentifier("923336164045");
      //setIdentifier("923018087407");
      setPassword("8lfgcO");
    }

    // if (loginUserType === "store_manager") {
    //   setIdentifier("FtBannA1");
    //   setPassword("2ADEA366");
    // }
    if (loginUserType === "store_manager") {
      setIdentifier("FsCSDBP1");
      setPassword("654321");
    }

    if (loginUserType === "administrator") {
      setIdentifier("923000000000");
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

        if (statusArray.length > 0) {
          const exists = statusArray.find(item => item.key === loginUserType);
          if (!exists) {
            setloginUserType(statusArray[0].key);
          }
        }
      }
    } catch (err: any) {
      console.error('Fetch user type error:', err);
      setUserTypeOptions([
        { id: 'shop_keeper', key: 'shop_keeper', value: 'Shop Keeper' },
        { id: 'store_manager', key: 'store_manager', value: 'Store Manager' },
        { id: 'administrator', key: 'administrator', value: 'Administrator' },
      ]);
    }
  };

  const handleLogin = async () => {

    console.log("API_URL =", API_URL);
    
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
    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("API URL:", `${API_URL}/login`);
    console.log("User Type:", loginUserType);
    console.log("Identifier:", identifier);
    console.log("=================================");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        mobile: identifier,
        password: password,
        user_type: loginUserType,
      }),
    });

    console.log("HTTP STATUS:", response.status);
    console.log("CONTENT TYPE:", response.headers.get("content-type"));

    // Read as text first so we can see Laravel errors/HTML too
    const responseText = await response.text();

    console.log("RAW RESPONSE:", responseText);

    let data: any = {};

    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("JSON PARSE ERROR:", jsonError);

      setMessage({
        text: `Server returned invalid response (${response.status})`,
        type: "error",
      });

      return;
    }

    console.log("PARSED RESPONSE:", data);

    if (response.ok && data?.data?.authorisation?.token) {
      const token = data.data.authorisation.token;
      let userData: any = {};

      if (loginUserType === "shop_keeper") {
        userData = {
          id: data.data.user.CardCode,
          CardCode: data.data.user.CardCode,
          CardName: data.data.user.CardName,
          CntctPrsn: data.data.user.CntctPrsn,
          Cellular: data.data.user.Cellular,
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
          role: data.data.user.role || "administrator",
        };
      }

      await login(token, userData, loginUserType);

      if (loginUserType === "shop_keeper") {
        router.replace("/(shopkeeper)/shopkeeper/dashboard");
      } else if (loginUserType === "store_manager") {
        router.replace("/(storemanager)/storemanager/dashboard");
      } else if (loginUserType === "administrator") {
        router.replace("/(administrator)/administrator/dashboard");
      }

    } else {
      setMessage({
        text: data?.message || `Login failed (${response.status})`,
        type: "error",
      });
    }

  } catch (err: any) {
    console.error("=================================");
    console.error("LOGIN EXCEPTION");
    console.error("Error:", err);
    console.error("Message:", err?.message);
    console.error("=================================");

    setMessage({
      text: err?.message || "Unable to connect to server.",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};
  // const handleLogin = async () => {
  //   if (!identifier || !password) {
  //     setMessage({ text: "Please fill in all fields", type: "error" });
  //     return;
  //   }

  //   if (!loginUserType) {
  //     setMessage({ text: "Please select user type", type: "error" });
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage({ text: "", type: null });

  //   try {
  //     const response = await fetch(`${API_URL}/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify({
  //         mobile: identifier,
  //         password,
  //         user_type: loginUserType,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok && data?.data?.authorisation?.token) {
  //       const token = data.data.authorisation.token;
  //       let userData: any = {};

  //       if (loginUserType === "shop_keeper") {
  //         userData = {
  //           id: data.data.user.CardCode,
  //           CardCode: data.data.user.CardCode,
  //           CardName: data.data.user.CardName,
  //           CntctPrsn: data.data.user.CntctPrsn,
  //           Cellular: data.data.user.Cellular,
  //         };
  //       } else if (loginUserType === "store_manager") {
  //         userData = {
  //           id: data.data.user.WhsCode,
  //           WhsCode: data.data.user.WhsCode,
  //           WhsName: data.data.user.WhsName,
  //           Location: data.data.user.Location,
  //           City: data.data.user.City,
  //           Country: data.data.user.Country,
  //           U_plist: data.data.user.U_plist,
  //         };
  //       } else if (loginUserType === "administrator") {
  //         userData = {
  //           id: data.data.user.id,
  //           fullname: data.data.user.fullname,
  //           username: data.data.user.username,
  //           mobile: data.data.user.mobile,
  //           email: data.data.user.email,
  //           role: data.data.user.role || 'administrator',
  //         };
  //       }

  //       await login(token, userData, loginUserType);

  //       if (loginUserType === "shop_keeper") {
  //         router.replace("/(shopkeeper)/shopkeeper/dashboard");
  //       } else if (loginUserType === "store_manager") {
  //         router.replace("/(storemanager)/storemanager/dashboard");
  //       } else if (loginUserType === "administrator") {
  //         router.replace("/(administrator)/administrator/dashboard");
  //       }

  //       setMessage({ text: "Login successful!", type: "success" });
  //     } else {
  //       setMessage({
  //         text: data?.message || "Login failed",
  //         type: "error",
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setMessage({
  //       text: "Unable to connect to server. Please check your internet connection.",
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      case 'store_manager':
        return Colors.storeManager.primary;
      case 'administrator':
        return Colors.administrator.primary;
      default:
        return '#6B7280';
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
                        onPress={() => setloginUserType(option.key)}
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

              {/* Identifier */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Phone Number / Username <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="923XXXXXXXXX"
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
                  onPress={() => router.push("./forgot-password")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  userTypeContainer: {
    marginBottom: 24,
    width: "100%",
  },
  cardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  userTypeCard: {
    width: "31%",
    height: 120,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
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
});