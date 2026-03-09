import { useEffect, useRef, useState } from "react";
import { AlertTriangle, BellOff, Volume2 } from "lucide-react";
import { useTelemetryStore } from "../../store/telemetryStore";

export function AlertModal() {
  const { isAlertActive, isRestMode, alertCause, currentData, dismissAlert } = useTelemetryStore();
  
  const audioRef = useRef(new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"));
  const [audioBlocked, setAudioBlocked] = useState(false);

  // Lógica del Audio
  useEffect(() => {
    const alarm = audioRef.current;
    alarm.loop = true;
    alarm.volume = 1.0;

    if (isAlertActive && !isRestMode) {
      const playPromise = alarm.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setAudioBlocked(true));
      }
    } else {
      alarm.pause();
      alarm.currentTime = 0;
      setAudioBlocked(false);
    }
    return () => alarm.pause();
  }, [isAlertActive, isRestMode]);

  // Bloqueo de Scroll
  useEffect(() => {
    if (isAlertActive && !isRestMode) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [isAlertActive, isRestMode]);

  if (!isAlertActive || isRestMode) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-300">
      
      {/* Añadimos max-h-[95vh] y overflow-y-auto para evitar desbordamientos en móviles muy pequeños */}
      <div className="bg-[#0B1120] border-2 border-ds-alert rounded-3xl p-6 sm:p-8 md:p-14 w-full max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] animate-in zoom-in-95 duration-500">
        
        {/* Ícono más pequeño en móvil */}
        <div className="relative mb-4 sm:mb-8 mt-2 sm:mt-0">
          <div className="absolute inset-0 bg-ds-alert rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-ds-alert p-4 sm:p-6 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)]">
            {/* Controlamos el tamaño con clases de Tailwind para que sea responsivo */}
            <AlertTriangle className="text-white w-10 h-10 sm:w-16 sm:h-16" />
          </div>
        </div>

        {/* Textos escalables */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 sm:mb-4 animate-pulse">
          ¡ALERTA DE SEGURIDAD!
        </h1>
        <p className="text-ds-muted text-base sm:text-xl md:text-2xl font-light mb-6 sm:mb-8">
          Posible estado de <strong className="font-bold text-ds-alert">somnolencia</strong> detectado.
        </p>

        {/* Caja de estadísticas más compacta */}
        <div className="bg-white/5 w-full rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-0">
          <div>
            <p className="text-ds-muted text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1">Causa del Disparo</p>
            <p className="text-ds-alert text-lg sm:text-xl font-black uppercase">{alertCause || "ANÁLISIS BIOMÉTRICO"}</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/10"></div>
          <div>
            <p className="text-ds-muted text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-1">Ritmo Actual</p>
            <p className="text-white text-lg sm:text-xl font-mono">{currentData.bpm} <span className="text-xs sm:text-sm">BPM</span></p>
          </div>
        </div>

        {audioBlocked && (
          <button
            onClick={() => {
              audioRef.current.play();
              setAudioBlocked(false);
            }}
            className="flex items-center gap-2 text-amber-400 mb-4 sm:mb-6 hover:underline text-xs sm:text-sm font-bold uppercase animate-bounce"
          >
            <Volume2 size={16} sm:size={20} /> Toca aquí para activar la sirena
          </button>
        )}

        {/* Botón con padding reducido en móvil */}
        <button
          onClick={dismissAlert}
          className="w-full group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-ds-alert hover:bg-red-600 text-white px-6 py-4 sm:px-10 sm:py-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <BellOff className="w-5 h-5 sm:w-6 sm:h-6" /> CONFIRMAR QUE ESTOY DESPIERTO
        </button>
      </div>
    </div>
  );
}