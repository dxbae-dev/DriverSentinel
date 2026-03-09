import { ShieldCheck, Activity, Vibrate, BrainCircuit } from 'lucide-react';
import { useTelemetryStore } from '../../store/telemetryStore';

export function ActiveTelemetry() {
  const { baselineBPM } = useTelemetryStore();

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in">
      {/* Banner de Estado Seguro */}
      <div className="bg-ds-safe/10 border border-ds-safe/30 rounded-2xl p-6 mb-8 flex items-center justify-between backdrop-blur-md">
        <div>
          <h2 className="text-ds-safe font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={22} /> Monitoreo Activo
          </h2>
          <p className="text-ds-muted text-sm mt-1">
            Línea base establecida en <strong className="text-white font-mono">{baselineBPM} BPM</strong>. Sistema operando con normalidad.
          </p>
        </div>
        <div className="bg-ds-safe/20 p-3 rounded-xl">
          <Activity className="text-ds-safe animate-pulse" size={28} />
        </div>
      </div>

      {/* Grid de Tarjetas de Sensores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta BPM */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
          <div className="flex items-center gap-3 mb-4 text-ds-primary">
            <Activity size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm text-white">Frecuencia Cardíaca</h3>
          </div>
          <div className="h-32 flex flex-col justify-center">
            <span className="text-5xl font-black text-white font-mono">--</span>
            <span className="text-ds-muted text-xs uppercase tracking-widest mt-1">BPM Actuales</span>
          </div>
        </div>

        {/* Tarjeta Giroscopio */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <Vibrate size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm text-white">Inclinación (MPU6050)</h3>
          </div>
          <div className="h-32 flex flex-col justify-center">
             <span className="text-5xl font-black text-white font-mono">--°</span>
             <span className="text-ds-muted text-xs uppercase tracking-widest mt-1">Eje Pitch (Cabeceo)</span>
          </div>
        </div>

        {/* Tarjeta Alerta de Sueño */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4 text-ds-alert">
            <BrainCircuit size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm text-white">Estado de Alerta</h3>
          </div>
          <div className="h-32 flex flex-col justify-center">
            <span className="text-3xl font-black text-ds-safe uppercase">Óptimo</span>
            <span className="text-ds-muted text-xs uppercase tracking-widest mt-2">Nivel de Somnolencia: Bajo</span>
          </div>
        </div>

      </div>
    </div>
  );
}