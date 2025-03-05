import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração base do axios
export const api = axios.create({
  baseURL: "http://localhost:4000", // Usando localhost ao invés do IP específico
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("❌ Erro ao recuperar token:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("❌ Erro do servidor:", error.response.data);
      if (error.response.status === 401) {
        // Token inválido ou expirado
        await AsyncStorage.removeItem("token");
        // Aqui você pode adicionar lógica para redirecionar para a tela de login
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("❌ Sem resposta do servidor:", error.request);
    } else {
      // Erro na configuração da requisição
      console.error("❌ Erro de configuração:", error.message);
    }
    return Promise.reject(error);
  }
);
