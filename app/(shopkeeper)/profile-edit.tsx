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

export default function EditProfileScreen() {
  const [businessName, setBusinessName] = useState("Ahmed Autos");
  const [owner, setOwner] = useState("Ahmed Raza");
  const [phone, setPhone] = useState("+92 321 7654321");
  const [location, setLocation] = useState("Clifton, Karachi");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Business Name */}
        <Text style={styles.label}>Business Name</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="business-outline" size={20} color="#666" />
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Business Name"
            style={styles.input}
          />
        </View>

        {/* Owner Name */}
        <Text style={styles.label}>Owner Name</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <TextInput
            value={owner}
            onChangeText={setOwner}
            placeholder="Owner Name"
            style={styles.input}
          />
        </View>

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => alert("Profile Updated (UI only)")}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F8",
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0F4C5C",
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
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#C62828",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
