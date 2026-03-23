import { create } from "zustand";
import api from "../config/axios";

export const useTripStore = create((set) => ({
  isLoading: false,
  error: null,
  successMessage: null,

  // Función para guardar la calificación del viaje
  submitTripRating: async (ratingData) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      // ratingData debe contener: driverId, rating, comment, tags
      const response = await api.post("/trips/rate", ratingData);
      
      set({ 
        isLoading: false, 
        successMessage: "¡Viaje calificado exitosamente!" 
      });
      return response.data;
      
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error al guardar la calificación",
      });
      throw error;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null })
}));