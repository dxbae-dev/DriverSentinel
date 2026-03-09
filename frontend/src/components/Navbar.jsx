import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Activity, Menu, X, ChevronDown, LayoutDashboard, LogOut, 
  Settings, History, Cpu, WifiOff, Loader2, LogIn, UserPlus, ShieldAlert 
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- 🚨 INTEGRACIÓN CON ZUSTAND (ESTADO REAL) ---
  const { user, logout, espState, checkDeviceStatus } = useAuthStore(); 

  const userAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${user?.firstName || 'User'}&backgroundColor=0F172A&textColor=06B6D4`;

  // --- 🔄 VERIFICACIÓN DEL ESP32 AL CARGAR ---
  useEffect(() => {
    if (user) {
      checkDeviceStatus();
    }
  }, [user, checkDeviceStatus]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const statusConfig = {
    connected: { bg: "bg-ds-safe/70 border-ds-safe", text: "text-black", message: "SISTEMA ONLINE - MONITOREO ACTIVO", icon: <Cpu size={14} className="animate-pulse" /> },
    disconnected: { bg: "bg-ds-alert/70 border-ds-alert", text: "text-black", message: "SENSOR OFFLINE - REVISE HARDWARE", icon: <WifiOff size={14} /> },
    linking: { bg: "bg-amber-400/70 border-amber-400", text: "text-black", message: "VINCULANDO PROTOCOLO DS-V1...", icon: <Loader2 size={14} className="animate-spin" /> }
  };

  // Usamos el fallback a 'linking' por si Zustand tarda un milisegundo en cargar
  const currentStatus = statusConfig[espState] || statusConfig.linking;

  return (
    <>
      <div className="fixed top-0 w-full z-[120] flex flex-col">
        
        {/* --- 1. TOP STATUS BAR (Dinámica) --- */}
        {user && (
          <div className={`w-full h-8 flex items-center justify-center gap-2.5 border-b backdrop-blur-lg transition-colors duration-500 ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.icon}
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase font-black">
              {currentStatus.message}
            </span>
          </div>
        )}

        {/* --- 2. MAIN NAVBAR --- */}
        <header
          className={`transition-all duration-300 px-6 lg:px-12 border-b ${
            isScrolled
              ? "py-3 bg-ds-bg/95 backdrop-blur-xl border-white/5 shadow-2xl"
              : "py-5 bg-transparent border-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center relative">
            
            {/* LOGO */}
            <Link to="/" className="group flex items-center gap-3 relative z-[130]">
              <Activity className="h-7 w-7 text-ds-primary opacity-90 group-hover:scale-110 transition-transform duration-500" />
              <span className="font-display font-bold text-xl tracking-tight text-white uppercase italic">
                Driver<span className="text-ds-primary font-light not-italic">Sentinel</span>
              </span>
            </Link>

            {/* NAV PÚBLICA */}
            {!user && (
              <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                {['Inicio', 'El Sistema', 'Equipo'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[10px] uppercase tracking-[0.3em] font-black text-ds-muted hover:text-white transition-all relative group">
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-ds-primary transition-all duration-300 group-hover:w-full rounded-full opacity-60"></span>
                  </a>
                ))}
              </nav>
            )}

            {/* ACCIONES / PERFIL */}
            <div className="flex items-center gap-4 relative z-[130]">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-ds-primary/30 transition-all group"
                  >
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none">
                        {user.firstName || user.email.split('@')[0]}
                      </p>
                      <p className="text-[8px] text-ds-primary font-mono uppercase mt-1 opacity-70 italic">Protocol: {user.role}</p>
                    </div>
                    <img src={userAvatar} className="w-9 h-9 rounded-lg border border-white/10 group-hover:border-ds-primary/50 transition-colors" alt="User" />
                    <ChevronDown size={14} className={`text-ds-muted transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-ds-primary" : ""}`} />
                  </button>

                  {/* DROPDOWN MENU */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-60 bg-[#0B1120]/98 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 animate-in slide-in-from-top-3">
                      <div className="px-4 py-3 bg-white/5 border-b border-white/5 rounded-t-xl mb-1">
                        <p className="text-[9px] text-ds-primary font-black uppercase tracking-widest leading-none">Status: Autenticado</p>
                        <p className="text-[11px] text-ds-muted font-mono mt-2 opacity-60">{user.driverId || 'ID Pendiente'}</p>
                      </div>
                      
                      {/* Si el perfil no está completo, mostramos aviso */}
                      {!user.isProfileComplete && user.role !== 'admin' && (
                        <Link to="/complete-profile" className="flex items-center gap-3 px-4 py-3 text-amber-400 bg-amber-400/5 rounded-xl text-[10px] font-black uppercase mb-1">
                          <ShieldAlert size={14} /> Completar Perfil
                        </Link>
                      )}

                      <DropdownLink to="/dashboard" icon={LayoutDashboard} label="Telemetría Real-Time" />
                      <DropdownLink to="/settings" icon={Settings} label="Calibración Sensores" />
                      <div className="h-px bg-white/5 my-1 mx-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-ds-alert hover:bg-ds-alert/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <LogOut size={14} /> Terminar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-6">
                  <Link to="/login" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:text-ds-primary transition-colors">Entrar</Link>
                  <Link to="/register" className="bg-ds-primary text-slate-950 px-7 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5">
                    Registrarse
                  </Link>
                </div>
              )}

              <button className="md:hidden text-ds-muted hover:text-white p-2 transition-colors ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* --- MENÚ MÓVIL FULLSCREEN --- */}
      <div className={`fixed inset-0 z-[110] bg-[#0B1120]/98 backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col pt-32 px-10 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col flex-grow gap-10">
          {user ? (
             <div className="flex flex-col gap-8">
               <MobileLink to="/dashboard" label="Telemetría" onClick={() => setIsMobileMenuOpen(false)} />
               <MobileLink to="/history" label="Bitácora" onClick={() => setIsMobileMenuOpen(false)} />
               <MobileLink to="/settings" label="Configuración" onClick={() => setIsMobileMenuOpen(false)} />
               {!user.isProfileComplete && (
                 <MobileLink to="/complete-profile" label="Completar Registro" highlight onClick={() => setIsMobileMenuOpen(false)} />
               )}
             </div>
          ) : (
            <div className="flex flex-col gap-10">
              {['Inicio', 'El Sistema', 'Equipo'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-black text-white hover:text-ds-primary uppercase tracking-tighter transition-colors">{item}</a>
              ))}
            </div>
          )}
        </div>

        {!user && (
          <div className="pb-16 pt-10 border-t border-white/5 flex flex-col gap-5 mt-auto">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-center font-bold uppercase tracking-widest">Iniciar Sesión</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-ds-primary text-slate-950 text-center font-black uppercase tracking-widest">Crear Cuenta</Link>
          </div>
        )}
      </div>
    </>
  );
}

function DropdownLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold text-ds-muted uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
      <Icon size={14} /> {label}
    </Link>
  );
}

function MobileLink({ to, label, onClick, highlight }) {
  return (
    <Link to={to} onClick={onClick} className={`text-4xl font-black uppercase tracking-tighter transition-all ${highlight ? 'text-ds-primary animate-pulse' : 'text-white hover:text-ds-primary'}`}>
      {label}
    </Link>
  );
}