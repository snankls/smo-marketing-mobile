import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Constants from "expo-constants";

export default function Version() {
  const version =
    Constants.expoConfig?.version ||
    Constants.manifest2?.extra?.expoClient?.version ||
    "1.0.0";

  return (
    <View style={styles.versionFooter}>
      <Text style={styles.versionText}>
        App Version {version}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  versionFooter: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  versionText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});