import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      console.log("✅ Token enviado na requisição:", token);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Nenhum token encontrado no AsyncStorage.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);
