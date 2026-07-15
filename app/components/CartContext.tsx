import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  ItemCode: string;
  SalUnitMsr: string;
  ItemName: string;
  FrgnName: string;
  LastPurPrc: string;
  U_Image?: string;
  cartQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (itemCode: string, quantity: number) => void;
  removeItem: (itemCode: string) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
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
  }, []);

  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  const saveCart = async (cart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('shopkeeper_cart', JSON.stringify(cart));
      setCartItems(cart);
    } catch (err) {
      console.log("Error saving cart:", err);
    }
  };

  // Rename this function from addToCart to addItem
  const addItem = async (item: CartItem) => {
    try {
      const currentCart = [...cartItems];
      const existingIndex = currentCart.findIndex(i => i.ItemCode === item.ItemCode);
      
      if (existingIndex !== -1) {
        // If exists, add to existing quantity
        currentCart[existingIndex].cartQuantity += item.cartQuantity;
      } else {
        // If new, add the item
        currentCart.push(item);
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
  }, [loadCart]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addItem,
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