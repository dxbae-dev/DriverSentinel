import { useState } from 'react';
import { Cpu, Link2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import Swal from 'sweetalert2';

export function DeviceLinker() {
  const { linkDevice, isLoading } = useAuthStore();
  const { setDashboardStage } = useTelemetryStore();
  const [deviceId, setDeviceId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId.trim()) return;

    try {
      // Llamamos a la función de tu authStore que conecta con el backend
      await linkDevice(deviceId);
      
      Swal.fire({
        icon: 'success',
        title: '¡Hardware Vinculado!',
        text: 'Iniciando protocolo de calibración biométrica.',
        background: '#0B1120',
        color: '#fff',
        confirmButtonColor: '#06B6D4',
        timer: 2000,
        showConfirmButton: false
      });

      // ¡Magia! Brincamos a la fase de los 60 segundos
      setTimeout(() => {
        setDashboardStage('calibrating');
      }, 2000);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error.message || 'No se pudo vincular el ESP32.',
        background: '#0B1120',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
        <Cpu className="text-amber-400" size={28} />
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Vincular Hardware DS-V1</h2>
      </div>
      
      <p className="text-ds-muted text-sm mb-6 leading-relaxed">
        El sistema detecta que aún no tienes un microcontrolador ESP32 asignado a tu perfil. 
        Ingresa el número de serie único de tu dispositivo para iniciar la telemetría.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="Ej. ESP-901M-XYZ"
          className="flex-1 bg-[#0B1120] border border-white/10 text-white text-sm rounded-xl px-5 py-4 focus:border-ds-primary outline-none focus:ring-1 focus:ring-ds-primary/50 uppercase font-mono tracking-wider transition-all"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-ds-primary text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[160px]"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Link2 size={20} />}
          {isLoading ? 'Conectando...' : 'Vincular'}
        </button>
      </form>
    </div>
  );
}