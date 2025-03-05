import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      return response.data;
    } catch (error) {
      console.error("❌ Erro no registro:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("🔹 Token recebido do backend:", response.data.token);
  
      if (!response.data.token) {
        console.error("❌ Nenhum token retornado do backend!");
        return;
      }
  
      await AsyncStorage.setItem("token", response.data.token);
      setUser(response.data.userId);
    } catch (error) {
      console.error("❌ Erro no login:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      // Limpar o token do interceptor do axios
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
