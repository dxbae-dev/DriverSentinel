import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthInput({ icon: Icon, type, label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
<div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-ds-muted">{label}</label>}
      <div className="relative group">
        {/* Ícono de la izquierda */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-ds-primary transition-colors">
          <Icon size={18} />
        </div>
        
        <input
          type={inputType}
          className={`w-full bg-[#0B1120] border ${
            error ? "border-ds-alert focus:border-ds-alert" : "border-slate-700 focus:border-ds-primary"
          } rounded-xl py-3 pl-10 pr-10 text-white placeholder:text-slate-600 outline-none transition-all shadow-sm focus:shadow-[0_0_10px_rgba(6,182,212,0.15)]`}
          {...props}
        />

        {/* Botón para mostrar/ocultar contraseña */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {/* Mensaje de error */}
      {error && <span className="text-xs text-ds-alert font-medium pl-1">{error}</span>}
    </div>
  );
}