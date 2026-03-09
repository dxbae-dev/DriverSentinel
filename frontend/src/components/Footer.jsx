import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B1120] border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Info de la marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-ds-primary" />
              <span className="font-display font-bold text-lg text-white">
                Driver<span className="text-ds-primary">Sentinel</span>
              </span>
            </div>
            <p className="text-ds-muted text-sm leading-relaxed max-w-xs">
              Ecosistema tecnológico de seguridad vial diseñado para la detección temprana de somnolencia al volante mediante sensores en el borde.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-ds-muted">
              <li><a href="#" className="hover:text-ds-primary transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-ds-primary transition-colors">Características</a></li>
              <li><a href="#" className="hover:text-ds-primary transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-ds-muted">
              <li>Universidad Tecnológica de Nezahualcóyotl</li>
              <li>Cto. Rey Nezahualcóyotl Mz 010, Benito Juárez</li>
              <li>Estado de México, C.P. 57000</li>
              <li className="text-ds-primary mt-2">driver.sentinel@utn.edu.mx</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-ds-muted">
          <p>© {new Date().getFullYear()} NovaTech. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}