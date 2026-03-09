// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  ActivitySquare,
  BellRing,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { AuthInput } from "../../components/auth/AuthInput";
import { useAuthStore } from "../../store/authStore";

// Pre-configuramos el Toast global igual que en el Login
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

export function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Extraemos funciones y estados del store
  const { register, isLoading, error, clearError, user } = useAuthStore();

  // useEffect central para redirección con Toasts
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        Toast.fire({ icon: "success", title: "¡Cuenta creada! Bienvenido Admin." });
        navigate("/admin-panel");
      }
      else if (user.isProfileComplete) {
        Toast.fire({ icon: "success", title: "¡Registro exitoso!" });
        navigate("/dashboard"); 
      }
      else {
        // El escenario normal para un registro nuevo
        Toast.fire({
          icon: "info",
          title: "¡Cuenta Creada!",
          text: "Solo un paso más: completa tu perfil."
        });
        navigate("/complete-profile");
      }
    }
  }, [user, navigate]);

  // Limpiamos errores del backend al montar/desmontar
  useEffect(() => {
    clearError();
    useAuthStore.setState({ isLoading: false });
  }, [clearError]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Limpiamos errores de peticiones previas

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    try {
      // Llamada real al backend para registrar
      // (Quitamos el Swal gigante de aquí, el useEffect lo manejará limpiamente)
      await register(formData.email, formData.password);
    } catch (err) {
      console.error("Fallo el registro", err);
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-ds-bg flex flex-col md:flex-row relative overflow-hidden">
      {/* ===== LADO IZQUIERDO: FORMULARIO ===== */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col px-6 sm:px-12 lg:px-16 py-8 z-10 relative bg-ds-bg h-full overflow-y-auto">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-ds-safe/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ds-muted hover:text-white transition-colors w-max relative z-20"
        >
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        {/* Contenedor del formulario centrado */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="flex flex-col mb-6">
            <div className="w-12 h-12 bg-ds-safe/10 border border-ds-safe/20 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="text-ds-safe" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-ds-muted text-sm mt-1">
              Protege tu vida y la de los demás en el camino
            </p>
          </div>

          {/* Mostrar error del Backend si existe */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-ds-alert/10 border border-ds-alert/20 text-ds-alert text-sm text-center font-bold tracking-wide uppercase animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={formErrors.email}
            />
            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={formErrors.password}
            />
            <AuthInput
              icon={Lock}
              type="password"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={formErrors.confirmPassword}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-ds-primary hover:bg-cyan-400 disabled:bg-ds-primary/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Creando
                  cuenta...
                </>
              ) : (
                "Registrarme"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[11px] text-ds-muted uppercase tracking-widest font-semibold">
              O regístrate con
            </span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-all"
          >
            {/* SVG Google */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-sm text-ds-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-ds-primary hover:text-cyan-400 font-semibold transition-colors"
            >
              Inicia sesión
            </Link>
          </p>

          <p className="mt-4 text-center text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
            Al registrarte, aceptas nuestros{" "}
            <a href="#" className="underline hover:text-slate-300">
              Términos
            </a>{" "}
            y{" "}
            <a href="#" className="underline hover:text-slate-300">
              Política de Privacidad
            </a>
            .
          </p>
        </div>
      </div>

      {/* ===== LADO DERECHO ===== */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 bg-[#0B1120] relative flex-col justify-center items-center overflow-hidden h-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-ds-primary/20 via-[#0B1120] to-[#0B1120] z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ds-safe/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-md px-8">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Únete a la nueva era <br />
              de <span className="text-ds-safe">seguridad vial</span>
            </h2>
            <p className="text-ds-muted text-lg">
              Conecta tu dispositivo y comienza a registrar métricas vitales
              para prevenir accidentes antes de que ocurran.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ActivitySquare className="text-ds-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">
                  Detección Inmediata
                </h3>
                <p className="text-ds-muted text-sm leading-relaxed">
                  El microcontrolador procesa los datos en milisegundos sin
                  necesidad de internet.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <BellRing className="text-amber-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">
                  Alertas Físicas y Digitales
                </h3>
                <p className="text-ds-muted text-sm leading-relaxed">
                  Activación del Buzzer local y registro de incidentes en tu
                  historial de conductor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}