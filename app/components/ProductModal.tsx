import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/app/constants/Colors";

interface ShopKeeper {
  CardCode: string;
  CardName: string;
}

interface Product {
  ItemCode: string;
  SalUnitMsr: string;
  ItemName: string;
  FrgnName: string;
  LastPurPrc: string;
  U_App_ImageURL?: string;
}

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number) => void;

  buttonBgColor?: string;
  buttonTextColor?: string;
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function ProductModal({
  visible,
  product,
  onClose,
  onConfirm,
  buttonBgColor = Colors.shopKeeper.button.buttonBg1,
  buttonTextColor = Colors.shopKeeper.button.buttonText1,
}: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    if (visible) {
      setQty(1);
      setErrorMessage("");
    }
  }, [visible]);

  if (!product) return null;

  const unitPrice = parseFloat(product.LastPurPrc || "0");
  const totalPrice = unitPrice * qty;
  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = () => {
    onConfirm(product, qty);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <TouchableOpacity onPress={onClose} style={[
              styles.closeBtn,
              { backgroundColor: Colors.global.danger }
            ]}>
            <Ionicons name="close-outline" size={20} color={Colors.global.dangerLight} />
          </TouchableOpacity>

          <Image
            source={{ uri: product.U_App_ImageURL || 'https://via.placeholder.com/150' }}
            style={styles.productImage}
            resizeMode="contain"
          />

          <Text style={styles.modalTitle}>{product.ItemName}</Text>

          <Text style={styles.unitPrice}>
            Unit Price: PKR {formatPrice(unitPrice)}
          </Text>

          <Text style={styles.modalPrice}>
            Total Price: PKR {formatPrice(totalPrice)}
          </Text>

          {/* Quantity Selector */}
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={decreaseQty} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{qty}</Text>

            <TouchableOpacity onPress={increaseQty} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Confirm Button */}
          <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: buttonBgColor }]} onPress={handleConfirm}>
            <Ionicons name="cart-outline" size={16} color={buttonTextColor} />
            <Text style={[styles.confirmBtnText, { color: buttonTextColor }]}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "92%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 12,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.storeManager.primary,
    marginTop: 4,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    gap: 16,
  },
  qtyBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    width: 44,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    minWidth: 40,
    textAlign: "center",
  },
  confirmBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnText: {
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    color: Colors.global.danger,
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});