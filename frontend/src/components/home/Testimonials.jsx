import { useEffect, useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Activity, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios"; // Usamos tu instancia de Axios

// Diccionario de íconos para mapear los tags
const tagIcons = {
  "Viaje Tranquilo": ThumbsUp,
  "Alerta Útil": ShieldCheck,
  "Falsa Alarma": AlertTriangle,
  "Sentí Cansancio": Activity,
};

export function Testimonials() {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatings = async () => {
      try {
        // Asumiendo que tu endpoint te devuelve todos, aquí agarramos los primeros 4 o 5 que sean de 4-5 estrellas
        const response = await api.get("/trips/ratings");
        const topRatings = response.data
          .filter(trip => trip.feedback.rating >= 4)
          .slice(0, 4); // Nos quedamos solo con los 4 mejores
        
        setRatings(topRatings);
      } catch (error) {
        console.error("Error al cargar testimonios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopRatings();
  }, []);

  if (isLoading || ratings.length === 0) return null; // No mostramos nada si no hay datos aún

  return (
    <section className="py-24 relative overflow-hidden bg-[#050B14]">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ds-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-ds-alert/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              Conductores <span className="text-ds-primary font-light italic">Protegidos</span>
            </h2>
            <p className="text-ds-muted text-sm md:text-base uppercase tracking-widest font-mono">
              Registros reales del impacto de DriverSentinel en ruta.
            </p>
          </div>
          <button 
            onClick={() => navigate('/opiniones')}
            className="flex items-center gap-2 text-ds-primary hover:text-white font-bold uppercase tracking-widest text-sm transition-colors group"
          >
            Ver Bitácora Completa
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid de Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ratings.map((trip) => (
            <div 
              key={trip._id} 
              className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.04] hover:border-ds-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < trip.feedback.rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-white/20"} 
                  />
                ))}
              </div>

              {/* Comentario */}
              <p className="text-white/80 text-sm italic mb-6 flex-grow">
                "{trip.feedback.comment || "Sesión registrada sin incidentes. El sistema funcionó de manera óptima."}"
              </p>

              {/* Tags del viaje */}
              {trip.feedback.tags && trip.feedback.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {trip.feedback.tags.map(tag => {
                    const Icon = tagIcons[tag] || ShieldCheck;
                    return (
                      <span key={tag} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-ds-primary bg-ds-primary/10 px-2 py-1 rounded-md border border-ds-primary/20">
                        <Icon size={12} />
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Conductor y Fecha */}
              <div className="pt-4 border-t border-white/10 mt-auto flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    {trip.driver?.firstName || "Conductor Anónimo"}
                  </span>
                  <span className="text-ds-muted text-[10px] font-mono">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}