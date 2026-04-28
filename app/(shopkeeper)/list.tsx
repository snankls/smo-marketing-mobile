import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Order = {
  id: string;
  customer: string;
  status: "Pending" | "Completed" | "Cancelled";
  amount: number;
  date: string;
};

export default function ListScreen() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-1001",
      customer: "Ahmed Autos",
      status: "Pending",
      amount: 12500,
      date: "2026-04-15",
    },
    {
      id: "ORD-1002",
      customer: "Ali Workshop",
      status: "Completed",
      amount: 8900,
      date: "2026-04-14",
    },
    {
      id: "ORD-1003",
      customer: "Hassan Motors",
      status: "Cancelled",
      amount: 5400,
      date: "2026-04-13",
    },
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return "#2E7D32";
      case "Pending":
        return "#F9A825";
      case "Cancelled":
        return "#D32F2F";
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Ionicons name="receipt-outline" size={22} color="#0F4C5C" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.customer}>{item.customer}</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.date}>{item.date}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.amount}>Rs {item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Orders List</Text>
        <Text style={styles.subtitle}>Manage all shop orders</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F8",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F4C5C",
  },
  subtitle: {
    fontSize: 13,
    color: "#7A8A91",
    marginTop: 2,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F4C5C",
  },
  statLabel: {
    fontSize: 12,
    color: "#7A8A91",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E7F3F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2933",
  },
  customer: {
    fontSize: 12,
    color: "#7A8A91",
    marginTop: 2,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  date: {
    fontSize: 11,
    color: "#9AA6AC",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },

  amount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F4C5C",
    marginLeft: 10,
  },
});
