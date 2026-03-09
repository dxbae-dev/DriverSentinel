import { create } from 'zustand';

export const useTelemetryStore = create((set, get) => ({
  // Fases: 'loading', 'linking' (Falta ID), 'calibrating' (60s), 'active' (Monitoreo)
  dashboardStage: 'loading', 
  
  // Datos de Calibración
  calibrationTimeLeft: 60,
  baselineBPM: null,
  isCalibrating: false,

  // Inicializar el estado del dashboard
  initDashboard: (user) => {
    if (!user?.settings?.deviceId) {
      set({ dashboardStage: 'linking' });
    } else {
      // Si ya tiene ID, pasa a calibración para establecer la línea base
      set({ dashboardStage: 'calibrating' });
    }
  },

  // Cambiar de fase manualmente (útil tras vincular el ESP32)
  setDashboardStage: (stage) => set({ dashboardStage: stage }),

  // Iniciar los 60 segundos de calibración
  startCalibration: () => {
    const state = get();
    if (state.isCalibrating) return;

    set({ isCalibrating: true, calibrationTimeLeft: 60 });

    const timer = setInterval(() => {
      const timeLeft = get().calibrationTimeLeft;
      
      if (timeLeft > 1) {
        set({ calibrationTimeLeft: timeLeft - 1 });
      } else {
        clearInterval(timer);
        // Terminó el tiempo: Establecemos línea base (simulada por ahora) y pasamos a activo
        set({ 
          baselineBPM: 75, // Esto vendrá del ESP32 real después
          isCalibrating: false, 
          dashboardStage: 'active' 
        });
      }
    }, 1000);
  }
}));