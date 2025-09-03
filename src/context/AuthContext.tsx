"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  type: "user" | "admin" | "seller" | "affiliate";
}

interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful login
      const mockUser: UserType = {
        id: "1",
        firstName: "محمد",
        lastName: "أحمد",
        email: email,
        type: "seller",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful signup
      const mockUser: UserType = {
        id: "1",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        type: "user",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
