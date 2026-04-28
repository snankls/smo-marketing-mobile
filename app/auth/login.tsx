import { useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Basic validation
    // if (!mobile.trim() || !password.trim()) {
    //   Alert.alert("Error", "Please fill in all fields");
    //   return;
    // }
    // Mobile number format validation
    // const mobileRegex = /^[0-9]{10}$/;
    // if (!mobileRegex.test(mobile)) {
    //   Alert.alert("Error", "Please enter a valid mobile number");
    //   return;
    // }
    //setLoading(true);
    // Simulate API call
    // setTimeout(() => {
    //   // Demo credentials: 1234567890 / password123
    //   if (mobile === "1234567890" && password === "password123") {
    //     setLoading(false);
    //     navigation.replace("Home");
    //   } else {
    //     setLoading(false);
    //     Alert.alert("Login Failed", "Invalid mobile number or password");
    //   }
    // }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.subtitle}>
            Welcome back! Log in to your account.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#999"
              value="1234567890"
              onChangeText={setMobile}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholderTextColor="#999"
                value="password123"
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              // <Text style={styles.loginButtonText}>Sign In</Text>
              <TouchableOpacity
                onPress={() => router.push("/(shopkeeper)/dashboard")}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Reset Password Link */}
          <View style={styles.signupContainer}>
            <TouchableOpacity onPress={() => router.push("./reset-password")}>
              <Text style={styles.signupLink}>Reset Password ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoImage: {
    width: 150,
    height: (206 / 283) * 180,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  eyeText: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: "#C62828",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    color: "#C62828",
    fontWeight: "600",
  },
});
