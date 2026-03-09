import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthInput({ icon: Icon, type, label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {label && (
        <label className="text-[10px] uppercase font-black tracking-[0.15em] text-ds-muted ml-1 transition-colors group-focus-within:text-ds-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Ícono de la izquierda */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-ds-primary transition-colors z-10">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        
        <input
          type={inputType}
          className={`w-full bg-[#0B1120] border ${
            error ? "border-ds-alert focus:border-ds-alert" : "border-slate-800 focus:border-ds-primary/50"
          } rounded-xl py-3.5 pl-11 pr-10 text-sm text-white placeholder:text-slate-600 outline-none transition-all shadow-sm focus:bg-ds-primary/[0.02]
          ${type === 'date' ? 'scheme-dark' : ''} 
          /* scheme-dark hace que el picker de fecha sea oscuro en navegadores modernos */
          `}
          {...props}
        />

        {/* Botón para mostrar/ocultar contraseña */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {/* Mensaje de error */}
      {error && <span className="text-[10px] text-ds-alert font-bold uppercase tracking-wider pl-1 mt-0.5">{error}</span>}
    </div>
  );
}