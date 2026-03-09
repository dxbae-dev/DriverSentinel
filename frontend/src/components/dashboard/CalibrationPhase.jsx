import { useEffect } from 'react';
import { HeartPulse } from 'lucide-react';
import { useTelemetryStore } from '../../store/telemetryStore';

export function CalibrationPhase() {
  const { calibrationTimeLeft, startCalibration } = useTelemetryStore();

  // Al montarse este componente, inicia el temporizador automáticamente
  useEffect(() => {
    startCalibration();
  }, [startCalibration]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-700">
      <div className="relative flex items-center justify-center w-56 h-56 mb-10">
        {/* Círculos animados tipo radar (Glassmorphism) */}
        <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border-4 border-amber-500/30 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 border-4 border-amber-500/10 rounded-full"></div>
        
        <div className="bg-[#0B1120] w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.25)] z-10">
          <HeartPulse size={36} className="text-amber-500 mb-2 animate-bounce" />
          <span className="text-5xl font-black text-white font-mono tracking-tighter">
            {calibrationTimeLeft}s
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-3">Calibrando Sensores</h2>
      <p className="text-ds-muted max-w-md mx-auto text-sm leading-relaxed">
        Estableciendo línea base de frecuencia cardíaca. Por favor, manténgase en reposo con el sensor MAX30102 colocado durante los próximos segundos antes de iniciar su viaje.
      </p>
    </div>
  );
}