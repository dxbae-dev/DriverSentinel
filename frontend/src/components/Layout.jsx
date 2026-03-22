import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuthStore } from "../store/authStore"; // 🚨 Ya podemos usar tu store real
import { DriverAssistant } from "./dashboard/DriverAssistant";

export function Layout({ children }) {
  const location = useLocation();

  // Traemos el usuario real de tu store
  const { user } = useAuthStore(); 

  // Reset de scroll al cambiar de página
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" 
    });
  }, [location.pathname]);

  // Lista de rutas base donde queremos ocultar la navegación
  const hideNavigationPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  
  // SOLUCIÓN: Usamos .some() y .startsWith() para atrapar las rutas dinámicas
  const shouldHideNavigation = hideNavigationPaths.some(path => 
    location.pathname.startsWith(path)
  );

  // Cálculo dinámico del padding superior para compensar la altura de la Navbar
  const paddingTop = shouldHideNavigation 
    ? "" 
    : user 
      ? "pt-28 md:pt-32" // Mayor espacio si existe la Top Bar de la ESP32
      : "pt-20 md:pt-24"; // Espacio estándar para la vista pública

  return (
    <div className="flex flex-col min-h-screen bg-ds-bg text-ds-text selection:bg-ds-primary selection:text-[#0B1120]">
      
      {!shouldHideNavigation && <Navbar />}
      
      <main className={`flex-grow transition-all duration-300 ${paddingTop} min-h-screen`}>
        {children}
        <DriverAssistant />
      </main>
      
      {!shouldHideNavigation && <Footer />}
      
    </div>
  );
}