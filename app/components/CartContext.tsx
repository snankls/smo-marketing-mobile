import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface CartItem {
  ItemCode: string;
  SalUnitMsr: string;
  ItemName: string;
  FrgnName: string;
  LastPurPrc: string;
  U_App_ImageURL?: string;
  cartQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalAmount: number;
  addToCart: (product: any, quantity: number) => Promise<void>;
  updateQuantity: (itemCode: string, newQty: number) => Promise<void>;
  removeItem: (itemCode: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  refreshCart: () => Promise<void>; // Add refresh function
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('shopkeeper_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setCartItems(cart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.log("Error loading cart:", err);
    }
  };

  const refreshCart = async () => {
    // Force refresh cart from storage
    await loadCart();
  };

  const saveCart = async (cart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('shopkeeper_cart', JSON.stringify(cart));
      setCartItems(cart);
    } catch (err) {
      console.log("Error saving cart:", err);
    }
  };

  const addToCart = async (product: any, quantity: number) => {
    try {
      const currentCart = [...cartItems];
      const existingIndex = currentCart.findIndex(item => item.ItemCode === product.ItemCode);
      
      if (existingIndex !== -1) {
        currentCart[existingIndex].cartQuantity += quantity;
      } else {
        currentCart.push({
          ...product,
          cartQuantity: quantity,
        });
      }
      
      await saveCart(currentCart);
    } catch (err) {
      console.log("Error adding to cart:", err);
      throw err;
    }
  };

  const updateQuantity = async (itemCode: string, newQty: number) => {
    if (newQty < 1) {
      await removeItem(itemCode);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.ItemCode === itemCode ? { ...item, cartQuantity: newQty } : item
    );
    await saveCart(updatedCart);
  };

  const removeItem = async (itemCode: string) => {
    const updatedCart = cartItems.filter(item => item.ItemCode !== itemCode);
    await saveCart(updatedCart);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  // Calculate cart count and total
  const cartCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.LastPurPrc || "0");
    return sum + price * item.cartQuantity;
  }, 0);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      totalAmount,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      loadCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}