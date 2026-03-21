import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, KeyRound, Activity, HeartPulse, ShieldCheck } from "lucide-react";
import { AuthInput } from "../../components/auth/AuthInput";
import { useAuthStore } from "../../store/authStore"; // IMPORTAMOS EL STORE

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(''); // Error para validar contraseñas antes de enviar
  const [success, setSuccess] = useState(false);

  // Traemos lo necesario del store
  const { resetPassword, isLoading, error: storeError, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    
    // Validación local
    if (password !== confirmPassword) {
      return setLocalError('Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return setLocalError('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      // LLAMAMOS A ZUSTAND
      await resetPassword(token, password);
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      console.error("Fallo el reseteo de contraseña", err);
    }
  };

  // Mostramos el error local (validación) o el del store (respuesta del backend)
  const displayError = localError || storeError;

  return (
    <div className="min-h-screen md:h-screen bg-ds-bg flex flex-col md:flex-row relative overflow-hidden">
      
      {/* ===== LADO IZQUIERDO: FORMULARIO ===== */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col px-6 sm:px-12 lg:px-16 py-8 z-10 relative bg-ds-bg h-full overflow-y-auto">
        
        <div className="absolute top-0 left-0 w-full h-[500px] bg-ds-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="flex flex-col mb-6">
            <div className="w-12 h-12 bg-ds-card border border-white/10 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <KeyRound className="text-ds-primary" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Nueva Contraseña</h1>
            <p className="text-ds-muted text-sm mt-1">Crea una credencial segura para acceder al panel.</p>
          </div>

          {success ? (
            <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="mx-auto w-16 h-16 bg-ds-safe/10 text-ds-safe rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h3>
              <p className="text-ds-muted text-sm mb-6">
                Tu acceso ha sido restaurado exitosamente.
              </p>
              <Loader2 className="animate-spin text-ds-primary mx-auto mb-4" size={24} />
              <p className="text-xs text-ds-muted">Redirigiendo al login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {displayError && (
                <div className="mb-4 p-3 rounded-xl bg-ds-alert/10 border border-ds-alert/20 text-ds-alert text-sm text-center font-medium animate-in fade-in">
                  {displayError}
                </div>
              )}

              <AuthInput
                icon={Lock}
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <AuthInput
                icon={Lock}
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-6 bg-ds-primary hover:bg-cyan-400 disabled:bg-ds-primary/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="animate-spin" size={20} /> Guardando...</>
                ) : (
                  "Restablecer Acceso"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ===== LADO DERECHO: VISUAL ===== */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 bg-ds-card relative flex-col justify-center items-center overflow-hidden h-full">
         <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] to-[#1E293B] opacity-90 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ds-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg">
          <Activity className="text-white/20 w-40 h-40 mb-8" />
          <h2 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Último paso para <br/> <span className="text-ds-primary">retomar el control</span>
          </h2>
          <p className="text-ds-muted text-lg mb-8">
            Establece una contraseña fuerte. Recuerda que la seguridad de los datos biométricos es fundamental.
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

export default ResetPassword;