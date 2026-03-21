import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL)?.replace('/api', '') || 'http://localhost:5000';

export const useTelemetryStore = create((set, get) => ({
  dashboardStage: 'loading', 
  calibrationTimeLeft: 60,
  baselineBPM: null,
  isCalibrating: false,
  calibrationSamples: [], 
  
  currentData: { bpm: 0, pitch: 0, isSleeping: false },
  isAlertActive: false,
  alertCause: null,
  socket: null,

  isRestMode: false,
  restTimeLeft: 0,
  restInterval: null,

  // NUEVO: Contadores para evitar falsas alarmas
  consecutiveBadBPM: 0,
  consecutiveBadPitch: 0,

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
    const { 
      baselineBPM, 
      dashboardStage, 
      isAlertActive, 
      isRestMode,
      consecutiveBadBPM,
      consecutiveBadPitch 
    } = get();

    if (dashboardStage !== 'active' || !baselineBPM || isAlertActive || isRestMode) return;

    const threshold = baselineBPM * 0.85;
    
    // Evaluamos el estado en ESTE instante
    const isBpmCriticalNow = data.bpm > 0 && data.bpm < threshold;
    const isPitchCriticalNow = parseFloat(data.pitch) < -6.0;

    // Actualizamos contadores: sumamos 1 si es crítico, o reiniciamos a 0 si está normal
    const newBpmCount = isBpmCriticalNow ? consecutiveBadBPM + 1 : 0;
    const newPitchCount = isPitchCriticalNow ? consecutiveBadPitch + 1 : 0;

    // Evaluamos si llegamos al límite de tolerancia (ej. 3 lecturas = ~3 segundos)
    const TOLERANCIA = 3;

    if (newBpmCount >= TOLERANCIA || newPitchCount >= TOLERANCIA) {
      set({ 
        isAlertActive: true,
        alertCause: newBpmCount >= TOLERANCIA ? 'RITMO CARDÍACO BAJO' : 'INCLINACIÓN CRÍTICA',
        // Reiniciamos contadores al disparar la alarma
        consecutiveBadBPM: 0,
        consecutiveBadPitch: 0
      });
    } else {
      // Si no llegamos al límite, solo guardamos el progreso de los contadores
      set({ 
        consecutiveBadBPM: newBpmCount, 
        consecutiveBadPitch: newPitchCount 
      });
    }
  },

  // Importante: Reiniciar contadores también al descartar la alerta
  dismissAlert: () => set({ 
    isAlertActive: false, 
    alertCause: null,
    consecutiveBadBPM: 0,
    consecutiveBadPitch: 0
  }),

  connectSocket: () => {
    if (get().socket) return;
    const socket = io(SOCKET_URL);
    socket.on('telemetryUpdate', (data) => {
      set({ currentData: data });
      
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
        const samples = get().calibrationSamples;
        const average = samples.length > 0 
          ? Math.round(samples.reduce((a, b) => a + b) / samples.length) 
          : 75;

        set({ baselineBPM: average, isCalibrating: false, dashboardStage: 'active' });
      }
    }, 1000);
  },
  
  skipCalibration: () => set({ calibrationTimeLeft: 1 })
}));