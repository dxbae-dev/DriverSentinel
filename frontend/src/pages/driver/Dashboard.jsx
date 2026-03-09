import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/authStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import { Loader2 } from 'lucide-react';

// Importamos los minicomponentes de la carpeta dashboard
import { DeviceLinker } from '../../components/dashboard/DeviceLinker';
import { CalibrationPhase } from '../../components/dashboard/CalibrationPhase';
import { ActiveTelemetry } from '../../components/dashboard/ActiveTelemetry';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  background: "#1E293B",
  color: "#fff",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export function Dashboard() {
  const { user } = useAuthStore();
  const { dashboardStage, initDashboard } = useTelemetryStore();
  const navigate = useNavigate();

  // Al cargar la vista, el store decide si pedir el ID o empezar a calibrar
  useEffect(() => {
    if (user) {
      if(!user.isProfileComplete) {
        Toast.fire({
          icon: "info",
          title: "Acceso Restringido",
          text: "Debes completar tu perfil de conductor primero."
        });
        navigate('/complete-profile');
        return;
      }
      initDashboard(user);
    }
  }, [user, initDashboard, navigate]);

  // Función limpiadora que decide qué componente dibujar
  const renderStage = () => {
    switch (dashboardStage) {
      case 'loading':     return <LoaderSpinner />;
      case 'linking':     return <DeviceLinker />;
      case 'calibrating': return <CalibrationPhase />;
      case 'active':      return <ActiveTelemetry />;
      default:            return null;
    }
  };

  return (
    <div className="min-h-screen pt-10 pb-10 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="mb-10 animate-in fade-in duration-500">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Panel de <span className="text-ds-primary font-light italic">Telemetría</span>
        </h1>
        <p className="text-ds-muted mt-2 font-mono text-sm uppercase tracking-widest">
          Protocolo de Seguridad Vial
        </p>
      </div>

      {/* Aquí inyectamos mágicamente la fase actual */}
      {renderStage()} 
    </div>
  );
}

// Mini-componente interno solo para la rueda de carga inicial
const LoaderSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-5 animate-in fade-in">
    <Loader2 className="animate-spin text-ds-primary" size={48} />
    <p className="text-ds-muted font-mono animate-pulse text-sm uppercase tracking-widest">
      Sincronizando Sistema...
    </p>
  </div>
);