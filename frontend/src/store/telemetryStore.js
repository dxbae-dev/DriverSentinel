import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useTelemetryStore = create((set, get) => ({
  dashboardStage: 'loading', 
  calibrationTimeLeft: 60,
  baselineBPM: null,
  isCalibrating: false,
  
  // --- ESTADOS DE TELEMETRÍA ---
  currentData: { bpm: 0, pitch: 0, isSleeping: false },
  isAlertActive: false,
  alertCause: null,
  socket: null,

  // --- ESTADOS DEL MODO DESCANSO ---
  isRestMode: false,
  restTimeLeft: 0, // Segundos restantes de descanso
  restInterval: null,

  initDashboard: (user) => {
    if (!user?.settings?.deviceId) {
      set({ dashboardStage: 'linking' });
    } else {
      set({ dashboardStage: 'calibrating' });
    }
  },

  setDashboardStage: (stage) => set({ dashboardStage: stage }),

  // --- LÓGICA DE MODO DESCANSO CON TEMPORIZADOR ---
  startRestMode: (minutes) => {
    // Si ya hay un intervalo, lo limpiamos
    if (get().restInterval) clearInterval(get().restInterval);

    set({ 
      isRestMode: true, 
      restTimeLeft: minutes * 60, // Convertimos a segundos
      isAlertActive: false // Apagamos cualquier alerta activa
    });

    const interval = setInterval(() => {
      const timeLeft = get().restTimeLeft;
      if (timeLeft > 0) {
        set({ restTimeLeft: timeLeft - 1 });
      } else {
        // Se acabó el tiempo
        clearInterval(interval);
        set({ isRestMode: false, restTimeLeft: 0, restInterval: null });
        // Opcional: Aquí podrías disparar un sonido suave para despertarlo
      }
    }, 1000);

    set({ restInterval: interval });
  },

  stopRestMode: () => {
    if (get().restInterval) clearInterval(get().restInterval);
    set({ isRestMode: false, restTimeLeft: 0, restInterval: null });
  },

  // --- LÓGICA DE ALERTAS ---
  checkAlerts: (data) => {
    const { baselineBPM, dashboardStage, isAlertActive, isRestMode } = get();
    
    // Filtro maestro: Si está en modo descanso, IGNORAMOS todo
    if (dashboardStage !== 'active' || !baselineBPM || isAlertActive || isRestMode) return;

    const threshold = baselineBPM * 0.85;
    
    const isBpmCritical = data.bpm > 0 && data.bpm < threshold;
    const isPitchCritical = parseFloat(data.pitch) > 15 || parseFloat(data.pitch) < -15;

    if (isBpmCritical || isPitchCritical) {
      let cause = isBpmCritical ? 'CAÍDA DE BPM' : 'CABECEO DETECTADO';
      if (isBpmCritical && isPitchCritical) cause = 'MÚLTIPLES SENSORES';

      set({ 
        isAlertActive: true,
        alertCause: cause 
      });
    }
  },

  dismissAlert: () => {
    set({ isAlertActive: false, alertCause: null });
  },

  connectSocket: () => {
    if (get().socket) return;
    const socket = io(SOCKET_URL);
    socket.on('telemetryUpdate', (data) => {
      set({ currentData: data });
      get().checkAlerts(data); 
    });
    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

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
        set({ baselineBPM: 75, isCalibrating: false, dashboardStage: 'active' });
      }
    }, 1000);
  },
  
  skipCalibration: () => set({ calibrationTimeLeft: 1 })
}));