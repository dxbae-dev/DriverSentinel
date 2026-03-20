import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldAlert, Loader2, Activity, HeartPulse, ShieldCheck } from "lucide-react";
import { AuthInput } from "../../components/auth/AuthInput";
import { useAuthStore } from "../../store/authStore"; // IMPORTAMOS EL STORE

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Ya no necesitamos estados locales de loading y error, los tomamos del store
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Limpiamos errores previos del store
    setMessage('');

    if (!email) {
       // Si quieres manejar este error localmente sin pasarlo por el store
       return alert("Por favor ingresa tu correo electrónico."); 
    }

    try {
      // LLAMAMOS A ZUSTAND
      await requestPasswordReset(email);
      
      setMessage('Instrucciones enviadas. Revisa tu bandeja de entrada.');
      setEmail('');
    } catch (err) {
      // El error ya se guarda en el store, no necesitamos hacer nada aquí 
      // porque el JSX de abajo renderiza `error` directamente del store.
      console.error("Fallo la solicitud de recuperación", err);
    }
  };

  return (
    <div className="min-h-screen md:h-screen bg-ds-bg flex flex-col md:flex-row relative overflow-hidden">
      
      {/* ===== LADO IZQUIERDO: FORMULARIO ===== */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col px-6 sm:px-12 lg:px-16 py-8 z-10 relative bg-ds-bg h-full overflow-y-auto">
        
        {/* Glow de fondo */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-ds-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <Link to="/login" onClick={clearError} className="inline-flex items-center gap-2 text-sm font-medium text-ds-muted hover:text-white transition-colors w-max relative z-20">
          <ArrowLeft size={16} /> Volver al login
        </Link>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="flex flex-col mb-6">
            <div className="w-12 h-12 bg-ds-card border border-white/10 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <ShieldAlert className="text-ds-primary" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Recuperar Acceso</h1>
            <p className="text-ds-muted text-sm mt-1">Ingresa tu correo para restablecer tu contraseña de monitoreo.</p>
          </div>

          {/* Renderizamos el error del STORE */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-ds-alert/10 border border-ds-alert/20 text-ds-alert text-sm text-center font-medium animate-in fade-in">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 rounded-xl bg-ds-safe/10 border border-ds-safe/20 text-ds-safe text-sm text-center font-medium animate-in fade-in">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 bg-ds-primary hover:bg-cyan-400 disabled:bg-ds-primary/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> Procesando...</>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ===== LADO DERECHO: VISUAL ===== */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 bg-ds-card relative flex-col justify-center items-center overflow-hidden h-full">
        {/* ... (Se mantiene igual, no lo pongo para no alargar) ... */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] to-[#1E293B] opacity-90 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ds-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg">
          <Activity className="text-white/20 w-40 h-40 mb-8" />
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Mantén tu conexión <br/> <span className="text-ds-primary">segura</span>
          </h2>
          <p className="text-ds-muted text-lg mb-8">
            El acceso a las métricas del ESP32 está protegido. Restablece tu contraseña para volver a la plataforma.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full opacity-50">
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
};

export default ForgotPassword;