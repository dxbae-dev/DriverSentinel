// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Activity, ShieldCheck, HeartPulse, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { AuthInput } from "../../components/auth/AuthInput";
import { useAuthStore } from "../../store/authStore";

// Pre-configuramos un Toast global para que se vea moderno y no estorbe
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

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { login, isLoading, error, clearError, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.isProfileComplete || user.role === 'admin') {
        Toast.fire({
          icon: "success",
          title: "¡Sesión iniciada correctamente!"
        });
        navigate('/dashboard');
      } else {
        // AQUÍ ESTÁ LA MAGIA: El aviso de perfil incompleto
        Toast.fire({
          icon: "info",
          title: "Acción Requerida",
          text: "Por favor completa tu perfil para continuar."
        });
        navigate('/complete-profile');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
    useAuthStore.setState({ isLoading: false });
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); 
    let newErrors = {};

    if (!formData.email) newErrors.email = "El correo es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});

    try {
      // Solo esperamos a que termine el login. 
      // Las alertas y redirecciones ahora las maneja el useEffect de arriba de forma limpia.
      await login(formData.email, formData.password);
    } catch (err) {
      console.error("Fallo el login", err);
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-ds-bg flex flex-col md:flex-row relative overflow-hidden">
      
      {/* ===== LADO IZQUIERDO: FORMULARIO ===== */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col px-6 sm:px-12 lg:px-16 py-8 z-10 relative bg-ds-bg h-full overflow-y-auto">
        
        <div className="absolute top-0 left-0 w-full h-[500px] bg-ds-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-ds-muted hover:text-white transition-colors w-max relative z-20">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="flex flex-col mb-6">
            <div className="w-12 h-12 bg-ds-card border border-white/10 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Activity className="text-ds-primary" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Bienvenido</h1>
            <p className="text-ds-muted text-sm mt-1">Ingresa a tu panel de control y monitoreo</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-ds-alert/10 border border-ds-alert/20 text-ds-alert text-sm text-center font-medium animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
            />
            
            <div>
              <AuthInput
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={formErrors.password}
              />
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-xs font-medium text-ds-primary hover:text-cyan-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 bg-ds-primary hover:bg-cyan-400 disabled:bg-ds-primary/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2"
            >
              {isLoading ? <><Loader2 className="animate-spin" size={20} /> Conectando...</> : "Iniciar Sesión"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[11px] text-ds-muted uppercase tracking-widest font-semibold">O continúa con</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-sm text-ds-muted">
            ¿No tienes cuenta? <Link to="/register" className="text-ds-primary hover:text-cyan-400 font-semibold transition-colors">Regístrate</Link>
          </p>
        </div>
      </div>

      {/* ===== LADO DERECHO ===== */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 bg-ds-card relative flex-col justify-center items-center overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] to-[#1E293B] opacity-90 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ds-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg">
          <Activity className="text-white/20 w-40 h-40 mb-8" />
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Monitoreo Inteligente <br/> <span className="text-ds-primary">en el Borde</span>
          </h2>
          <p className="text-ds-muted text-lg mb-8">
            Accede a las métricas de tu ESP32 en tiempo real. Analiza frecuencias cardíacas e inclinación para prevenir accidentes.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
              <HeartPulse className="text-ds-alert" size={20} />
              <span className="text-sm font-medium text-white text-left">MAX30102<br/><span className="text-xs text-ds-muted">BPM & SpO2</span></span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
              <ShieldCheck className="text-blue-400" size={20} />
              <span className="text-sm font-medium text-white text-left">MPU6050<br/><span className="text-xs text-ds-muted">Giroscopio</span></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}