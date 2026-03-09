import { useEffect, useState } from "react";
import { ShieldCheck, Activity, Vibrate, BrainCircuit, Coffee } from "lucide-react";
import { useTelemetryStore } from "../../store/telemetryStore";
import { AlertModal } from "./AlertModal";
import { RestModal } from "./RestModal";

export function ActiveTelemetry() {
  const {
    baselineBPM,
    currentData,
    isAlertActive,
    isRestMode,
    startRestMode,
    connectSocket,
    disconnectSocket,
  } = useTelemetryStore();

  const [showRestMenu, setShowRestMenu] = useState(false);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  return (
    <>
      {/* Modales Inyectados */}
      <AlertModal />
      <RestModal />

      {/* DASHBOARD NORMAL (Fondo) */}
      <div className={`animate-in slide-in-from-bottom-8 duration-700 fade-in transition-all duration-500 ${isAlertActive || isRestMode ? "blur-md opacity-40 grayscale pointer-events-none" : ""}`}>
        
        {/* BANNER DE ESTADO NORMAL */}
        <div className="bg-ds-safe/10 border border-ds-safe/30 rounded-2xl p-6 mb-8 flex items-center justify-between backdrop-blur-md relative">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-ds-safe/20 rounded-xl">
              <ShieldCheck className="text-ds-safe" size={28} />
            </div>
            <div>
              <h2 className="text-ds-safe font-black uppercase tracking-[0.2em] text-lg">
                SISTEMA PROTEGIDO
              </h2>
              <p className="text-ds-muted text-sm font-mono mt-1 uppercase">
                Línea Base Calibrada: {baselineBPM} BPM
              </p>
            </div>
          </div>

          {/* BOTÓN PARA ABRIR MENÚ DE DESCANSO */}
          <div className="relative">
            <button
              onClick={() => setShowRestMenu(!showRestMenu)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all"
            >
              <Coffee size={18} /> Tomar Descanso
            </button>

            {/* MENÚ DESPLEGABLE DE TIEMPOS */}
            {showRestMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0B1120] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                  <p className="text-[10px] uppercase font-black tracking-widest text-ds-muted">Selecciona el tiempo</p>
                </div>
                <button onClick={() => { startRestMode(10); setShowRestMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors">
                  10 Minutos (Power Nap)
                </button>
                <button onClick={() => { startRestMode(20); setShowRestMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors border-t border-white/5">
                  20 Minutos
                </button>
                <button onClick={() => { startRestMode(30); setShowRestMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors border-t border-white/5">
                  30 Minutos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ESTADÍSTICAS DETALLADAS (Grid normal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-ds-primary">
              <Activity size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Pulso en Vivo</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
              <span className="text-7xl font-black text-white font-mono tabular-nums">{currentData.bpm || "--"}</span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">Latidos por Minuto</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Vibrate size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Inclinación (Pitch)</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
              <span className="text-7xl font-black text-white font-mono tabular-nums">{currentData.pitch || "--"}°</span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">Grados de Cabeceo</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 text-ds-safe">
              <BrainCircuit size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">Análisis Constante</h3>
            </div>
            <div className="h-32 flex flex-col justify-center">
              <span className="text-4xl font-black uppercase tracking-tighter text-ds-safe">ÓPTIMO</span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">Monitoreando variables</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}