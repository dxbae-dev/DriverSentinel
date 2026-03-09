import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children }) {
  const location = useLocation();

  // 🚨 MOCK DE USUARIO (Debe ser igual al de tu Navbar)
  // Cuando tengas tu AuthContext, simplemente usa: const { user } = useAuth();
  const user = null; 

  // Reset de scroll al cambiar de página
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" 
    });
  }, [location.pathname]);

  const hideNavigationPaths = ["/login", "/register"];
  const shouldHideNavigation = hideNavigationPaths.includes(location.pathname);

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
      </main>
      
      {!shouldHideNavigation && <Footer />}
      
    </div>
  );
}