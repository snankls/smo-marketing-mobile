import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  color?: string;
}

const getPages = (current: number, total: number) => {
  const pages: (number | string)[] = [];

  const delta = 1;

  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  pages.push("prev");

  // first page
  pages.push(1);

  // left dots
  if (rangeStart > 2) {
    pages.push("...");
  }

  // middle pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // last page
  if (total > 1 && rangeEnd < total) {
    pages.push(total);
  }

  pages.push("next");

  return pages;
};

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  color = "#0F4C5C", // default theme
}: Props) {
  const pages = getPages(page, totalPages);

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {pages.map((p, index) => {
          // PREV
          if (p === "prev") {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPageChange(page - 1)}
                disabled={page === 1}
                style={[
                  styles.navBtn,
                  { borderColor: color },
                  page === 1 && styles.disabled,
                ]}
              >
                <Ionicons name="chevron-back" size={16} color={color} />
                <Text style={[styles.navText, { color }]}>Prev</Text>
              </TouchableOpacity>
            );
          }

          // NEXT
          if (p === "next") {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                style={[
                  styles.navBtn,
                  { borderColor: color },
                  page === totalPages && styles.disabled,
                ]}
              >
                <Text style={[styles.navText, { color }]}>Next</Text>
                <Ionicons name="chevron-forward" size={16} color={color} />
              </TouchableOpacity>
            );
          }

          // DOTS
          if (p === "...") {
            return (
              <Text key={index} style={styles.dots}>
                ...
              </Text>
            );
          }

          // PAGE NUMBER
          const isActive = page === p;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPageChange(p as number)}
              style={[
                styles.page,
                isActive && { backgroundColor: color },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isActive && styles.activeText,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TOTAL */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Showing {start}–{end} of {total} items
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 20,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },

  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    gap: 2,
    backgroundColor: "#fff",
  },

  navText: {
    fontSize: 12,
  },

  disabled: {
    opacity: 0.4,
  },

  page: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },

  text: {
    color: "#333",
  },

  activeText: {
    color: "#fff",
    fontWeight: "700",
  },

  dots: {
    paddingHorizontal: 6,
    color: "#999",
  },

  totalContainer: {
    marginTop: 10,
    alignItems: "center",
  },

  totalText: {
    fontSize: 13,
    color: "#666",
  },
});