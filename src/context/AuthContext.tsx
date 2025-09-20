"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  syncLocalData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const checkAuth = async () => {
    try {
      const response = await apiFetch("/auth/my-profile");
      setUser(response.data);
      // Sync local cart and favorites data when user logs in
      await syncLocalData();
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const syncLocalData = async () => {
    try {
      // Sync cart items
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        for (const item of localCart) {
          try {
            await apiFetch("/cart", {
              method: "POST",
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
              }),
            });
          } catch (err) {
            console.error("Error syncing cart item:", err);
          }
        }
        localStorage.removeItem("cart");
      }

      // Sync favorites
      const localFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      if (localFavorites.length > 0) {
        for (const productId of localFavorites) {
          try {
            await apiFetch("/favorites", {
              method: "POST",
              body: JSON.stringify({ productId }),
            });
          } catch (err) {
            console.error("Error syncing favorite:", err);
          }
        }
        localStorage.removeItem("favorites");
      }
    } catch (err) {
      console.error("Error syncing local data:", err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(response.user);
      // Sync local cart and favorites data when user logs in
      await syncLocalData();
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (err: any) {
      setError(err.message || "Failed to login");
      toast.error(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setUser(response.user);
      // Sync local cart and favorites data when user registers
      await syncLocalData();
      toast.success("تم إنشاء الحساب بنجاح");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      toast.error(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiFetch("/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (err: any) {
      setError(err.message || "Failed to logout");
      toast.error(err.message || "فشل تسجيل الخروج");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        syncLocalData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
