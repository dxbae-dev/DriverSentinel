import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Activity,
  Vibrate,
  BrainCircuit,
  Coffee,
  History,
} from "lucide-react";
import { useTelemetryStore } from "../../store/telemetryStore";
import { AlertModal } from "./AlertModal";
import { RestModal } from "./RestModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useNavigate } from "react-router-dom";

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

  // NUEVO: Estado para guardar el historial de la gráfica (últimos 60 puntos)
  const [history, setHistory] = useState([]);

  // Conexión del Socket
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  // NUEVO: Cada vez que llega un dato nuevo, lo guardamos en el historial
  useEffect(() => {
    if (currentData.bpm > 0 || currentData.pitch !== 0) {
      setHistory((prevHistory) => {
        const now = new Date();
        const timeString = `${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

        const newDataPoint = {
          time: timeString,
          bpm: currentData.bpm,
          pitch: currentData.pitch,
        };

        // Mantenemos solo los últimos 60 registros (1 minuto aprox)
        const updatedHistory = [...prevHistory, newDataPoint];
        return updatedHistory.length > 60
          ? updatedHistory.slice(1)
          : updatedHistory;
      });
    }
  }, [currentData]);

  // Calculamos el umbral de peligro para dibujarlo en la gráfica
  const dangerThresholdBPM = baselineBPM ? baselineBPM * 0.85 : 60;

  const navigate = useNavigate();

  return (
    <>
      {/* Modales Inyectados */}
      <AlertModal />
      <RestModal />

      {/* DASHBOARD NORMAL (Fondo) */}
      <div
        className={`animate-in slide-in-from-bottom-8 duration-700 fade-in transition-all duration-500 pb-10 ${isAlertActive || isRestMode ? "blur-md opacity-40 grayscale pointer-events-none" : ""}`}
      >
        {/* BANNER DE ESTADO NORMAL */}
        <div className="bg-ds-safe/10 border border-ds-safe/30 rounded-2xl p-6 mb-6 flex items-center justify-between backdrop-blur-md relative">
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

          <div className="relative z-50 flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                disconnectSocket();
                navigate("/rate-trip");
              }}
              title="Terminar Viaje"
              className="group flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white p-3.5 sm:px-6 sm:py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] text-xs sm:text-sm"
            >
              <Activity size={20} className="group-hover:animate-pulse" /> 
              <span className="hidden sm:inline">Terminar Viaje</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRestMenu(!showRestMenu)}
                title="Tomar Descanso"
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 p-3.5 sm:px-6 sm:py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 text-xs sm:text-sm w-full"
              >
                <Coffee size={20} /> 
                <span className="hidden sm:inline">Tomar Descanso</span>
              </button>
              
              {showRestMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0B1120] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                    <p className="text-[10px] uppercase font-black tracking-widest text-ds-muted">
                      Selecciona el tiempo
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      startRestMode(10);
                      setShowRestMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors"
                  >
                    10 Minutos (Power Nap)
                  </button>
                  <button
                    onClick={() => {
                      startRestMode(20);
                      setShowRestMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors border-t border-white/5"
                  >
                    20 Minutos
                  </button>
                  <button
                    onClick={() => {
                      startRestMode(30);
                      setShowRestMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-indigo-500/20 hover:text-indigo-400 font-bold transition-colors border-t border-white/5"
                  >
                    30 Minutos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS DETALLADAS (Grid normal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Activity size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">
                Pulso en Vivo
              </h3>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span className="text-6xl font-black text-white font-mono tabular-nums">
                {currentData.bpm || "--"}
              </span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Vibrate size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">
                Inclinación (Pitch)
              </h3>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span className="text-6xl font-black text-white font-mono tabular-nums">
                {currentData.pitch || "--"}°
              </span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 text-ds-safe">
              <BrainCircuit size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs text-white">
                Análisis Constante
              </h3>
            </div>
            <div className="h-24 flex flex-col justify-center">
              <span className="text-3xl font-black uppercase tracking-tighter text-ds-safe">
                ÓPTIMO
              </span>
              <span className="text-ds-muted text-[10px] uppercase tracking-widest mt-2 font-bold">
                Monitoreando variables
              </span>
            </div>
          </div>
        </div>

        {/* NUEVO: SECCIÓN DE GRÁFICAS EN TIEMPO REAL */}
        <div className="bg-[#0B1120]/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-ds-muted">
            <History size={20} />
            <h3 className="font-bold uppercase tracking-widest text-xs text-white">
              Historial de Sesión (Últimos 60s)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfica de BPM */}
            <div className="h-64 w-full">
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-4">
                Ritmo Cardíaco (BPM)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    tickMargin={10}
                    minTickGap={20}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#22d3ee" }}
                  />
                  {/* Línea roja del umbral */}
                  <ReferenceLine
                    y={dangerThresholdBPM}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      position: "insideTopLeft",
                      value: "UMBRAL",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bpm"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica de Inclinación */}
            <div className="h-64 w-full">
              <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-4">
                Inclinación de Cabeza (Pitch)
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    tickMargin={10}
                    minTickGap={20}
                  />
                  <YAxis
                    domain={[-15, 15]}
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#a855f7" }}
                  />
                  {/* Línea roja del umbral */}
                  <ReferenceLine
                    y={-6.0}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      position: "insideTopLeft",
                      value: "ZONA CRÍTICA",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pitch"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
