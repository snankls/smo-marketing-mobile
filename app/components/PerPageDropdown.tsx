import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  perPage: number;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  setPerPage: (val: number) => void;
  setPage: (val: number) => void;
  fetchData: (page: number, search: string, perPage: number) => void;
  search: string;
  color?: string;
}

const PER_PAGE_OPTIONS = [10, 20, 50, 100, "All"];

export default function PerPageDropdown({
  perPage,
  showDropdown,
  setShowDropdown,
  setPerPage,
  setPage,
  fetchData,
  search,
  color = "#0F4C5C",
}: Props) {

  const isActive = (opt: any) => {
    if (opt === "All") return perPage === 999999;
    return perPage === Number(opt);
  };

  return (
    <>
      {/* Button */}
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.label}>Show:</Text>

          <TouchableOpacity
            style={[
              styles.dropdownBtn,
              { borderColor: color }
            ]}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={[styles.dropdownText, { color }]}>
              {perPage === 999999 ? "All" : perPage}
            </Text>

            <Ionicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={16}
              color={color}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <View style={styles.overlay}>
          <View style={styles.dropdownList}>
            {PER_PAGE_OPTIONS.map((opt, index) => {
              const active = isActive(opt);

              return (
                <TouchableOpacity
                  key={opt.toString()}
                  style={[
                    styles.item,
                    index === PER_PAGE_OPTIONS.length - 1 && styles.lastItem,
                    active && { backgroundColor: color },
                  ]}
                  onPress={() => {
                    const value = opt === "All" ? 999999 : Number(opt);

                    setPerPage(value);
                    setPage(1);
                    setShowDropdown(false);

                    fetchData(1, search, value);
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      active && styles.activeText,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 999,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },

  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
  },

  overlay: {
    position: "absolute",
    top: 260,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 20,
  },

  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },

  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
});