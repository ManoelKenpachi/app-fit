import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.101.151:3333',  // IP da sua máquina na porta 3333
  // baseURL: 'http://localhost:4000',  // Para iOS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 