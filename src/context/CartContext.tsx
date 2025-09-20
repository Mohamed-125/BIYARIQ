"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface LocalizedText {
  ar: string;
  en: string;
}

interface ProductImage {
  url: string;
  public_id: string;
  id: string;
}

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  priceAfterDiscount?: number;
  thumbnail: { url: string; public_id: string };
  images: ProductImage[];
  type: "physical" | "digital" | "course";
  category?: {
    name: LocalizedText;
  };
  ratingAverage?: number;
  ratingQuantity?: number;
  stock?: number;
  options?: {
    colors?: {
      name: LocalizedText;
      values: string[];
    };
    sizes?: {
      name: LocalizedText;
      values: string[];
    };
  };
}

export type CartItem = { id: string; quantity: number; product: Product };

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    size?: string
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (id: string) => boolean;
  getCartItemById: (id: string) => CartItem | undefined;
  dummyProducts: [];
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  loading: false,
  error: null,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isInCart: () => false,
  getCartItemById: () => undefined,
  dummyProducts: [],
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dummyProducts, setDummyProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (!authLoading) fetchCartItems();
  }, [user, authLoading]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        const response = await apiFetch("/cart", { cache: "no-store" });
        setCartItems(response.cart);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      }
    } catch (err) {
      setError("فشل تحميل سلة التسوق");
      toast.error("فشل تحميل سلة التسوق");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      // Optimistic update
      const newItem: CartItem = {
        id: product.id,
        quantity,
        product,
      };

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );
      const updatedItems = [...cartItems];

      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems.push(newItem);
      }

      setCartItems(updatedItems);

      if (user) {
        await apiFetch("/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: product.id,
            quantity,
          }),
        });
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      }

      toast.success("تمت الإضافة إلى سلة التسوق");
    } catch (err) {
      // Revert optimistic update
      await fetchCartItems();
      toast.error("فشل إضافة المنتج إلى سلة التسوق");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // Optimistic update
      const previousItems = [...cartItems];
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      if (user) {
        await apiFetch(`/cart/${itemId}`, {
          method: "DELETE",
        });
      } else {
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      }

      toast.success("تم إزالة المنتج من السلة");
    } catch (err) {
      // Revert optimistic update
      toast.error("فشل إزالة المنتج من السلة");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      // Optimistic update
      const previousItems = [...cartItems];
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );

      if (user) {
        await apiFetch(`/cart/${itemId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity }),
        });
      } else {
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      }

      toast.success("تم تحديث الكمية");
    } catch (err) {
      // Revert optimistic update
      toast.error("فشل تحديث الكمية");
    }
  };

  const clearCart = async () => {
    try {
      // Optimistic update
      const previousItems = [...cartItems];
      setCartItems([]);

      if (user) {
        await apiFetch("/cart", { method: "DELETE" });
      } else {
        localStorage.removeItem("cart");
      }

      toast.success("تم مسح سلة التسوق");
    } catch (err) {
      // Revert optimistic update
      toast.error("فشل مسح سلة التسوق");
    }
  };

  const isInCart = (id: string) => {
    return cartItems.some((item) => item.id === id);
  };

  const getCartItemById = (id: string) => {
    return cartItems.find((item) => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItemById,
        dummyProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
