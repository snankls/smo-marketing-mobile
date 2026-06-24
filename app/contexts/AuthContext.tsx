import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from 'expo-router';

interface User {
  id: string | number;
  full_name?: string;
  CardName?: string;
  CntctPrsn?: string;
  Phone1?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  userType: string | null;
  isLoading: boolean;
  login: (token: string, user: User, type: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const api = axios.create({
    baseURL: API_URL,
  });

  // ✅ RESTORE SESSION (CRITICAL FIX)
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken");
        const savedUser = await AsyncStorage.getItem("userData");
        const savedType = await AsyncStorage.getItem("userType");

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedType) setUserType(savedType);
      } catch (e) {
        console.log("Auth restore error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (token: string, userData: any, type: string) => {
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    setUserType(type);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["authToken", "userData", "userType"]);

    setToken(null);
    setUser(null);
    setUserType(null);

    router.replace("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userType,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};