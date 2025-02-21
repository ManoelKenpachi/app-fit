import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      setUser(response.data.userId);
    } catch (error) {
      console.error("Erro no login:", error.response ? error.response.data : error.message);
      throw new Error("Credenciais inválidas.");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
