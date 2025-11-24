import axios from 'axios';
import router from '@/router'; // Importamos o router para poder redirecionar

const API_URL = 'http://localhost:40000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 1. Interceptor de Requisição: Coloca o token no cabeçalho se ele existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Resposta: Verifica se o Backend recusou o token
api.interceptors.response.use(
  (response) => {
    // O seu backend retorna status 200 mesmo com erro, mas manda "auth: false"
    if (response.data && response.data.auth === false) {
      console.warn('Token expirado ou inválido detetado pelo interceptor.');
      
      // Limpa o token vencido
      localStorage.removeItem('token');
      
      // Redireciona o usuário para o Login imediatamente
      router.push('/');
      
      // Retorna um erro para o componente não tentar processar dados inexistentes
      return Promise.reject(new Error(response.data.message || 'Sessão expirada'));
    }
    return response;
  },
  (error) => {
    // Caso o backend retornasse 401 ou 403 (padrão REST), cairia aqui
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      router.push('/');
    }
    return Promise.reject(error);
  }
);

export default api;