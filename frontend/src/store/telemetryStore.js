import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useTelemetryStore = create((set, get) => ({
  dashboardStage: 'loading', 
  calibrationTimeLeft: 60, //
  baselineBPM: null,
  isCalibrating: false,
  
  // --- NUEVOS ESTADOS DE TELEMETRÍA REAL ---
  currentData: { bpm: 0, pitch: 0, isSleeping: false },
  isAlertActive: false,
  socket: null,

  initDashboard: (user) => {
    if (!user?.settings?.deviceId) {
      set({ dashboardStage: 'linking' });
    } else {
      set({ dashboardStage: 'calibrating' });
    }
  },

  setDashboardStage: (stage) => set({ dashboardStage: stage }),

  // --- LÓGICA DE ALERTAS ---
  checkAlerts: (data) => {
    const { baselineBPM, dashboardStage, isAlertActive } = get();
    if (dashboardStage !== 'active' || !baselineBPM || isAlertActive) return;

    const threshold = baselineBPM * 0.85;
    
    // Condición 1: Caída de BPM
    const isBpmCritical = data.bpm > 0 && data.bpm < threshold;
    
    // Condición 2: Cabeceo detectado por Giroscopio (Ej: más de 15 grados o menos de -15)
    // Ajusta estos valores según las lecturas reales de tu MPU6050
    const isPitchCritical = parseFloat(data.pitch) > 15 || parseFloat(data.pitch) < -15;

    if (isBpmCritical || isPitchCritical) {
      let cause = isBpmCritical ? 'CAÍDA DE BPM' : 'CABECEO DETECTADO';
      if (isBpmCritical && isPitchCritical) cause = 'MÚLTIPLES SENSORES';

      set({ 
        isAlertActive: true,
        alertCause: cause // Guardamos la causa para mostrarla
      });
    }
  },

  // --- NUEVA FUNCIÓN PARA APAGAR LA ALARMA ---
  dismissAlert: () => {
    set({ isAlertActive: false, alertCause: null });
  },

  // --- CONEXIÓN DE SOCKETS ---
  connectSocket: () => {
    if (get().socket) return;
    const socket = io(SOCKET_URL);

    socket.on('telemetryUpdate', (data) => {
      set({ currentData: data });
      get().checkAlerts(data); // Verificamos alertas en cada pulso
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

    set({ isCalibrating: true, calibrationTimeLeft: 60 }); //

    const timer = setInterval(() => {
      const timeLeft = get().calibrationTimeLeft;
      
      if (timeLeft > 1) {
        set({ calibrationTimeLeft: timeLeft - 1 });
      } else {
        clearInterval(timer);
        // Aquí se definiría el rango normal
        set({ 
          baselineBPM: 75, 
          isCalibrating: false, 
          dashboardStage: 'active' 
        });
      }
    }, 1000);
  },
  skipCalibration: () => {
    // Ponemos el tiempo en 1 segundo para que el setInterval 
    // lo detecte en su siguiente ciclo y haga la transición limpia
    set({ calibrationTimeLeft: 1 }); 
  }
}));