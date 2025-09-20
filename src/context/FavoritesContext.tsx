"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { Product } from "./CartContext";

interface FavoritesContextType {
  favorites: Product[];
  loading: boolean;
  error: string | null;
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: false,
  error: null,
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) fetchFavorites();
  }, [authLoading]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        const response = await apiFetch("/favorites");

        setFavorites(response.favorites.map((item: any) => item.product));
        setLoading(false);
      } else {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        if (localFavorites.length > 0) {
          setFavorites(localFavorites);
        }
        setLoading(false);
      }
    } catch (err) {
      setError("فشل تحميل المفضلة");
      toast.error("فشل تحميل المفضلة");
    } finally {
    }
  };

  const addToFavorites = async (product: Product) => {
    // Optimistic update
    setFavorites((prev) => [...prev, product]);

    try {
      if (user) {
        await apiFetch("/favorites", {
          method: "POST",
          body: JSON.stringify({ productId: product.id }),
        });
      } else {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        if (
          !localFavorites.find(
            (localProduct: Product) => product.id === localProduct.id
          )
        ) {
          localFavorites.push(product);
          localStorage.setItem("favorites", JSON.stringify(localFavorites));
        }
      }
      toast.success("تمت الإضافة إلى المفضلة");
    } catch (err) {
      // Rollback
      setFavorites((prev) => prev.filter((item) => item.id !== product.id));
      toast.error("فشل إضافة المنتج إلى المفضلة");
    }
  };

  const removeFromFavorites = async (productId: string) => {
    // Optimistic update
    const prevFavorites = favorites;
    setFavorites((prev) => prev.filter((item) => item.id !== productId));

    try {
      if (user) {
        await apiFetch(`/favorites/${productId}`, { method: "DELETE" });
      } else {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        const updatedFavorites = localFavorites.filter(
          (product: Product) => product.id !== productId
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }
      toast.success("تمت الإزالة من المفضلة");
    } catch (err) {
      // Rollback
      setFavorites(prevFavorites);
      toast.error("فشل إزالة المنتج من المفضلة");
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
