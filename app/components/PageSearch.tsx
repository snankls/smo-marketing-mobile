import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder?: string;
  loading?: boolean;
  color?: string;
}

export default function PageSearch({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  loading = false,
  color
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
          style={styles.input}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          clearButtonMode="never"
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color={Colors.storeManager.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.searchBtn, { backgroundColor: color }]} onPress={onSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1E293B",
  },
  searchBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clearBtn: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});