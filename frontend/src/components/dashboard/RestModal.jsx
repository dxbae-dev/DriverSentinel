import { useEffect } from "react";
import { Coffee, Play, Clock } from "lucide-react";
import { useTelemetryStore } from "../../store/telemetryStore";

export function RestModal() {
  const { isRestMode, restTimeLeft, stopRestMode } = useTelemetryStore();

  // Bloqueo de Scroll
  useEffect(() => {
    if (isRestMode) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [isRestMode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Si no está descansando, no renderizamos nada
  if (!isRestMode) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      
      {/* Contenedor principal con max-h y overflow para pantallas pequeñas */}
      <div className="bg-[#0B1120] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 md:p-14 w-full max-w-lg max-h-[95vh] overflow-y-auto flex flex-col items-center justify-center text-center shadow-[0_0_80px_rgba(99,102,241,0.15)]">
        
        {/* Ícono adaptable */}
        <div className="bg-indigo-500/10 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 border border-indigo-500/20 mt-2 sm:mt-0">
          <Coffee className="text-indigo-400 w-10 h-10 sm:w-14 sm:h-14" />
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-indigo-400 uppercase tracking-widest mb-2">
          Modo Descanso
        </h2>
        <p className="text-ds-muted mb-6 sm:mb-8 text-xs sm:text-sm px-2">
          El monitoreo de alertas está pausado para que puedas dormir tranquilo.
        </p>

        {/* Contenedor del reloj con padding dinámico */}
        <div className="bg-[#0B1120] border-2 border-indigo-500/50 w-full py-6 sm:py-8 rounded-2xl mb-6 sm:mb-8 shadow-inner flex flex-col items-center">
          {/* Tamaño de fuente escalable para el reloj */}
          <span className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-mono tabular-nums tracking-tighter">
            {formatTime(restTimeLeft)}
          </span>
          <span className="text-indigo-400 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-bold flex items-center gap-2">
            <Clock size={14} /> Tiempo Restante
          </span>
        </div>

        {/* Botón escalable */}
        <button
          onClick={stopRestMode}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500 px-6 py-4 sm:px-8 sm:py-5 rounded-xl font-bold text-sm sm:text-base uppercase tracking-widest transition-all"
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Terminar Descanso Ahora
        </button>
      </div>
    </div>
  );
}