// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backhogele.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo limpiar si NO es la ruta de login
      if (!error.config.url.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login - ⚠️ CORREGIDO: Ahora usa POST correctamente
  async login(email, contrasena) {
    try {
      console.log('🔐 Intentando login:', { email, url: `${API_URL}/api/usuarios/login` });
      
      const response = await api.post('/api/usuarios/login', {
        email,
        contrasena
      });
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Error al iniciar sesión' };
    }
  },

  // Registro
  async registro(nombre, email, contrasena, rol) {
    try {
      console.log('📝 Intentando registro:', { nombre, email, rol });
      
      const response = await api.post('/api/usuarios/registro', {
        nombre,
        email,
        contrasena,
        rol
      });
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      throw error.response?.data || { success: false, message: 'Error al registrar usuario' };
    }
  },

  // Verificar sesión
  async verificarSesion() {
    try {
      const response = await api.get('/api/usuarios/verificar');
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  }
};

export default api;