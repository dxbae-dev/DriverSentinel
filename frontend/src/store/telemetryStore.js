import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL)?.replace('/api', '') || 'http://localhost:5000';

export const useTelemetryStore = create((set, get) => ({
  dashboardStage: 'loading', 
  calibrationTimeLeft: 60,
  baselineBPM: null,
  isCalibrating: false,
  calibrationSamples: [], // Nueva lista para promediar el pulso real
  
  currentData: { bpm: 0, pitch: 0, isSleeping: false },
  isAlertActive: false,
  alertCause: null,
  socket: null,

  isRestMode: false,
  restTimeLeft: 0,
  restInterval: null,

  initDashboard: (user) => {
    if (!user?.settings?.deviceId) {
      set({ dashboardStage: 'linking' });
    } else {
      set({ dashboardStage: 'calibrating' });
    }
  },

  setDashboardStage: (stage) => set({ dashboardStage: stage }),

  startRestMode: (minutes) => {
    if (get().restInterval) clearInterval(get().restInterval);
    set({ isRestMode: true, restTimeLeft: minutes * 60, isAlertActive: false });
    const interval = setInterval(() => {
      const timeLeft = get().restTimeLeft;
      if (timeLeft > 0) {
        set({ restTimeLeft: timeLeft - 1 });
      } else {
        clearInterval(interval);
        set({ isRestMode: false, restTimeLeft: 0, restInterval: null });
      }
    }, 1000);
    set({ restInterval: interval });
  },

  stopRestMode: () => {
    if (get().restInterval) clearInterval(get().restInterval);
    set({ isRestMode: false, restTimeLeft: 0, restInterval: null });
  },

  checkAlerts: (data) => {
    const { baselineBPM, dashboardStage, isAlertActive, isRestMode } = get();
    if (dashboardStage !== 'active' || !baselineBPM || isAlertActive || isRestMode) return;

    // Umbral dinámico: 85% de tu ritmo cardíaco en reposo calibrado
    const threshold = baselineBPM * 0.85;
    
    // Alerta si el BPM cae o si el ángulo X es mayor a -6.0 (según tu .ino)
    const isBpmCritical = data.bpm > 0 && data.bpm < threshold;
    const isPitchCritical = parseFloat(data.pitch) > -6.0;

    if (isBpmCritical || isPitchCritical) {
      set({ 
        isAlertActive: true,
        alertCause: isBpmCritical ? 'RITMO CARDÍACO BAJO' : 'INCLINACIÓN CRÍTICA' 
      });
    }
  },

  dismissAlert: () => set({ isAlertActive: false, alertCause: null }),

  connectSocket: () => {
    if (get().socket) return;
    const socket = io(SOCKET_URL);
    socket.on('telemetryUpdate', (data) => {
      set({ currentData: data });
      
      // Si estamos calibrando, guardamos la muestra para el promedio
      if (get().isCalibrating && data.bpm > 0) {
        set((state) => ({ calibrationSamples: [...state.calibrationSamples, data.bpm] }));
      }

      get().checkAlerts(data); 
    });
    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) { socket.disconnect(); set({ socket: null }); }
  },

  startCalibration: () => {
    if (get().isCalibrating) return;
    set({ isCalibrating: true, calibrationTimeLeft: 60, calibrationSamples: [] }); 
    
    const timer = setInterval(() => {
      const timeLeft = get().calibrationTimeLeft;
      if (timeLeft > 1) {
        set({ calibrationTimeLeft: timeLeft - 1 });
      } else {
        clearInterval(timer);
        
        // CALCULAR PROMEDIO REAL DE SAUL
        const samples = get().calibrationSamples;
        const average = samples.length > 0 
          ? Math.round(samples.reduce((a, b) => a + b) / samples.length) 
          : 75; // Fallback si no hubo lecturas

        set({ baselineBPM: average, isCalibrating: false, dashboardStage: 'active' });
      }
    }, 1000);
  },
  
  skipCalibration: () => set({ calibrationTimeLeft: 1 })
}));