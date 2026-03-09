// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../config/axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Acción: Iniciar Sesión Tradicional
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          set({ 
            user: response.data, 
            token: response.data.token, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error al iniciar sesión', 
            isLoading: false 
          });
          throw error; // Lanzamos el error para que el componente (UI) lo caché
        }
      },

      // Acción: Registrar Usuario
      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', { email, password });
          set({ 
            user: response.data, 
            token: response.data.token, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error al registrar', 
            isLoading: false 
          });
          throw error;
        }
      },

      // Acción: Iniciar Sesión con Google
      googleLogin: async (tokenId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/google', { tokenId });
          set({ 
            user: response.data, 
            token: response.data.token, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error con Google Auth', 
            isLoading: false 
          });
          throw error;
        }
      },

      // Acción: Cerrar Sesión
      logout: () => {
        set({ user: null, token: null, error: null });
      },

      // Completar Perfil
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/users/profile', profileData);
          // Actualizamos el usuario en el estado global para que isProfileComplete sea true
          set((state) => ({ 
            user: { ...state.user, ...response.data }, 
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error al actualizar el perfil', 
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'ds-auth-storage', 
    }
  )
);