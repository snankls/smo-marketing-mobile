import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Colors } from "@/app/constants/Colors";

interface Product {
  ItemCode: string;
  SalUnitMsr: string;
  ItemName: string;
  FrgnName: string;
  LastPurPrc: string;
  U_App_ImageURL?: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  showAddToCart?: boolean;
  onAddToCart?: (product: Product) => void;
  variant?: "default" | "compact" | "detailed";
  color?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function ProductCard({ 
  product, 
  onPress, 
  showAddToCart = true,
  onAddToCart,
  variant = "default",
  color = '',
  buttonBgColor = Colors.shopKeeper.button.buttonBg1,
  buttonTextColor = Colors.shopKeeper.button.buttonText1
}: ProductCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case "compact":
        return styles.compactCard;
      case "detailed":
        return styles.detailedCard;
      default:
        return styles.defaultCard;
    }
  };

  const getImageStyle = () => {
    switch (variant) {
      case "compact":
        return styles.compactImage;
      case "detailed":
        return styles.detailedImage;
      default:
        return styles.defaultImage;
    }
  };

  const getInnerStyle = () => {
    switch (variant) {
      case "compact":
        return styles.compactInner;
      case "detailed":
        return styles.detailedInner;
      default:
        return styles.defaultInner;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, getCardStyle()]} 
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Image
        source={{ uri: product.U_App_ImageURL }}
        style={getImageStyle()}
        resizeMode="contain"
      />

      <View style={getInnerStyle()}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.ItemName}
        </Text>

        <Text style={styles.productCode}>{product.SalUnitMsr}</Text>

        <Text style={styles.productPrice}>
          PKR {formatPrice(parseFloat(product.LastPurPrc || "0"))}
        </Text>

        {showAddToCart && onAddToCart && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: buttonBgColor }
            ]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={16} color={buttonTextColor} />
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>Add to Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  
  // Default variant styles
  defaultCard: {
    width: "48%",
    marginBottom: 12,
  },
  defaultImage: {
    width: "100%",
    height: 100,
    marginVertical: 10,
  },
  defaultInner: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    gap: 8,
  },

  // Compact variant styles
  compactCard: {
    flexDirection: "row",
    marginBottom: 8,
    padding: 10,
  },
  compactImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  compactInner: {
    flex: 1,
    gap: 4,
  },

  // Detailed variant styles
  detailedCard: {
    marginBottom: 16,
  },
  detailedImage: {
    width: "100%",
    height: 200,
  },
  detailedInner: {
    padding: 16,
    gap: 8,
  },

  // Common styles
  productName: {
    fontSize: 15,
    fontWeight: "700",
    minHeight: 34,
  },
  productFrgnName: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  productCode: {
    fontSize: 11,
    color: "#6B7280",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
});