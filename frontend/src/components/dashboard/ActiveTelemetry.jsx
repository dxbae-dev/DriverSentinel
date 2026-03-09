import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Activity, Vibrate, BrainCircuit, AlertTriangle, BellOff, Volume2 } from 'lucide-react';
import { useTelemetryStore } from '../../store/telemetryStore';

export function ActiveTelemetry() {
  const { 
    baselineBPM, 
    currentData, 
    isAlertActive, 
    alertCause, 
    connectSocket, 
    disconnectSocket,
    dismissAlert 
  } = useTelemetryStore();

  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'));
  const [audioBlocked, setAudioBlocked] = useState(false);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  // --- LÓGICA DE AUDIO ROBUSTA ---
  useEffect(() => {
    const alarm = audioRef.current;
    alarm.loop = true;
    alarm.volume = 1.0;

    if (isAlertActive) {
      const playPromise = alarm.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.warn("Autoplay bloqueado. El usuario debe interactuar.");
          setAudioBlocked(true);
        });
      }
    } else {
      alarm.pause();
      alarm.currentTime = 0;
      setAudioBlocked(false);
    }

    return () => { alarm.pause(); };
  }, [isAlertActive]);

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isAlertActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAlertActive]);

  return (
    <>
      {/* =========================================
          MODAL DE ALERTA A PANTALLA COMPLETA
          ========================================= */}
      {isAlertActive && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-300">
          
          {/* Contenedor del Modal */}
          <div className="bg-[#0B1120] border-2 border-ds-alert rounded-3xl p-8 md:p-14 w-full max-w-2xl flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] animate-in zoom-in-95 duration-500">
            
            {/* Ícono animado */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-ds-alert rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-ds-alert rounded-full animate-pulse opacity-40"></div>
              <div className="relative bg-ds-alert p-6 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                 <AlertTriangle className="text-white" size={64} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 animate-pulse">
              ¡ALERTA DE SEGURIDAD!
            </h1>
            
            <p className="text-ds-muted text-xl md:text-2xl font-light mb-8">
              Posible estado de <strong className="font-bold text-ds-alert">somnolencia</strong> detectado.
            </p>
            
            {/* Información del Sensor */}
            <div className="bg-white/5 w-full rounded-2xl p-6 border border-white/10 mb-10 flex flex-col md:flex-row items-center justify-around gap-4">
              <div>
                <p className="text-ds-muted text-xs uppercase tracking-widest font-bold mb-1">Causa del Disparo</p>
                <p className="text-ds-alert text-xl font-black uppercase">{alertCause || 'ANÁLISIS BIOMÉTRICO'}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10"></div>
              <div>
                <p className="text-ds-muted text-xs uppercase tracking-widest font-bold mb-1">Ritmo Actual</p>
                <p className="text-white text-xl font-mono">{currentData.bpm} <span className="text-sm">BPM</span></p>
              </div>
            </div>

            {/* Botón Fallback Audio */}
            {audioBlocked && (
               <button onClick={() => { audioRef.current.play(); setAudioBlocked(false); }} className="flex items-center gap-2 text-amber-400 mb-6 hover:underline text-sm font-bold uppercase animate-bounce">
                 <Volume2 size={20}/> Toca aquí para activar la sirena
               </button>
            )}

            {/* Botón de Confirmación */}
            <button 
              onClick={dismissAlert}
              className="w-full group relative inline-flex items-center justify-center gap-3 bg-ds-alert hover:bg-red-600 text-white px-10 py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <BellOff size={24} />
              CONFIRMAR QUE ESTOY DESPIERTO
            </button>
            <p className="text-ds-muted text-xs font-mono uppercase mt-4 opacity-50">Pulse para detener la alarma sonora y visual</p>
          </div>
        </div>
      )}

      {/* =========================================
          DASHBOARD NORMAL (Fondo)
          ========================================= */}
      <div className={`animate-in slide-in-from-bottom-8 duration-700 fade-in transition-all duration-500 ${isAlertActive ? 'blur-md opacity-40 grayscale pointer-events-none' : ''}`}>
        
        {/* BANNER DE ESTADO NORMAL */}
        <div className="bg-ds-safe/10 border border-ds-safe/30 rounded-2xl p-6 mb-8 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ds-safe/20 rounded-xl">
              <ShieldCheck className="text-ds-safe" size={28} />
            </div>
            <div>
              <h2 className="text-ds-safe font-black uppercase tracking-[0.2em] text-lg">SISTEMA PROTEGIDO</h2>
              <p className="text-ds-muted text-sm font-mono mt-1 uppercase">Línea Base Calibrada: {baselineBPM} BPM</p>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS DETALLADAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* TARJETA BPM */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-ds-primary">
              <Activity size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Pulso en Vivo</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
              <span className="text-7xl font-black text-white font-mono tabular-nums">
                {currentData.bpm || '--'}
              </span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">Latidos por Minuto</span>
            </div>
          </div>

          {/* TARJETA GIROSCOPIO */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Vibrate size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Inclinación (Pitch)</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
               <span className="text-7xl font-black text-white font-mono tabular-nums">
                 {currentData.pitch || '--'}°
               </span>
               <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">Grados de Cabeceo</span>
            </div>
          </div>

          {/* TARJETA ESTADO GLOBAL */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 text-ds-safe">
              <BrainCircuit size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Análisis Constante</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
              <span className="text-4xl font-black uppercase tracking-tighter text-ds-safe">
                ÓPTIMO
              </span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">
                Monitoreando variables
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}