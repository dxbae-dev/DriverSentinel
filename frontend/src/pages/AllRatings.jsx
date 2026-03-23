import { useEffect, useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Activity, AlertTriangle, Filter } from "lucide-react";
import api from "../config/axios";

const tagIcons = {
  "Viaje Tranquilo": ThumbsUp,
  "Alerta Útil": ShieldCheck,
  "Falsa Alarma": AlertTriangle,
  "Sentí Cansancio": Activity,
};

export function AllRatings() {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0); // 0 significa 'mostrar todas'

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get("/trips/ratings");
        setRatings(response.data);
      } catch (error) {
        console.error("Error al cargar calificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRatings();
  }, []);

  const filteredRatings = filterRating === 0 
    ? ratings 
    : ratings.filter(r => r.feedback.rating === filterRating);

  return (
    <div className="min-h-screen pt-7 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Cabecera */}
      <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Bitácora de <span className="text-ds-primary font-light italic">Sesiones</span>
          </h1>
          <p className="text-ds-muted mt-2 font-mono text-sm uppercase tracking-widest">
            Historial de retroalimentación de la red DriverSentinel
          </p>
        </div>
        
        {/* Filtro por Estrellas */}
        <div className="flex items-center gap-3 bg-[#1E293B]/50 border border-white/10 p-2 rounded-xl">
          <Filter size={16} className="text-ds-muted ml-2" />
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(Number(e.target.value))}
            className="bg-transparent text-white text-sm focus:outline-none focus:ring-0 cursor-pointer pr-4"
          >
            <option value={0} className="bg-[#1E293B]">Todas las calificaciones</option>
            <option value={5} className="bg-[#1E293B]">5 Estrellas</option>
            <option value={4} className="bg-[#1E293B]">4 Estrellas</option>
            <option value={3} className="bg-[#1E293B]">3 Estrellas</option>
            <option value={2} className="bg-[#1E293B]">2 Estrellas</option>
            <option value={1} className="bg-[#1E293B]">1 Estrella</option>
          </select>
        </div>
      </div>

      {/* Grid de Resultados */}
      {isLoading ? (
        <div className="text-center text-ds-muted py-20 animate-pulse uppercase tracking-widest font-mono text-sm">
          Descargando datos de telemetría...
        </div>
      ) : filteredRatings.length === 0 ? (
        <div className="text-center text-white/50 py-20 font-mono text-sm uppercase">
          No se encontraron registros.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRatings.map((trip) => (
            <div key={trip._id} className="bg-[#0B1120] border border-white/10 p-6 rounded-2xl hover:border-ds-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < trip.feedback.rating ? "fill-ds-primary text-ds-primary" : "fill-transparent text-white/20"} 
                    />
                  ))}
                </div>
                <span className="text-ds-muted text-[10px] font-mono">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-white text-sm mb-6 leading-relaxed">
                "{trip.feedback.comment || "Sin comentarios adicionales."}"
              </p>

              {/* Tags */}
              {trip.feedback.tags && trip.feedback.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {trip.feedback.tags.map(tag => {
                    const Icon = tagIcons[tag] || ShieldCheck;
                    return (
                      <span key={tag} className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-white/70 bg-white/5 px-2 py-1 rounded">
                        <Icon size={10} />
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <span className="text-ds-primary text-xs font-bold uppercase tracking-wider">
                  {trip.driver?.firstName || "Anónimo"} {trip.driver?.lastName || ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}