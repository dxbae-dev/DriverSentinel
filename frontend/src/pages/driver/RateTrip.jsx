import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Send, ShieldCheck, AlertTriangle, ThumbsUp, Activity } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTripStore } from "../../store/tripStore";
import { useTelemetryStore } from "../../store/telemetryStore";
import Swal from "sweetalert2";

export function RateTrip() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitTripRating, isLoading } = useTripStore();
  const { setDashboardStage } = useTelemetryStore();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const MAX_CHARS = 250;

  // NUEVO: Diccionario de etiquetas dinámicas para las estrellas
  const ratingLabels = {
    1: "Pésimo / Fallo Crítico",
    2: "Malo / Inexacto",
    3: "Regular / Aceptable",
    4: "Bueno / Confiable",
    5: "Excelente / Muy Preciso"
  };

  const availableTags = [
    { id: "tranquilo", label: "Viaje Tranquilo", icon: ThumbsUp },
    { id: "alerta_util", label: "Alerta Útil", icon: ShieldCheck },
    { id: "falsa_alarma", label: "Falsa Alarma", icon: AlertTriangle },
    { id: "cansancio", label: "Sentí Cansancio", icon: Activity },
  ];

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Doble validación por seguridad
    if (rating === 0) return;

    try {
      await submitTripRating({
        driverId: user._id, 
        rating,
        comment,
        tags: selectedTags,
      });

      Swal.fire({
        icon: "success",
        title: "¡Sesión Registrada!",
        text: "Tu retroalimentación ayuda a calibrar el sistema.",
        background: "#1E293B",
        color: "#fff",
        timer: 2500,
        showConfirmButton: false,
      }).then(() => {
        setDashboardStage('linking'); 
        navigate("/dashboard");
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de Sincronización",
        text: "No se pudo guardar la calificación. Intenta de nuevo.",
        background: "#1E293B",
        color: "#fff",
      });
    }
  };

  // Calculamos qué etiqueta mostrar debajo de las estrellas
  const currentLabel = ratingLabels[hoverRating || rating] || "Selecciona una calificación";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-[#0B1120] border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        
        {/* Efecto de fondo brillante */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-ds-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Resumen del <span className="text-ds-primary">Viaje</span>
          </h2>
          <p className="text-ds-muted mt-2 text-sm uppercase tracking-widest font-mono">
            Evalúa el desempeño del sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          
          {/* SECCIÓN DE ESTRELLAS MEJORADA */}
          <div className="flex flex-col items-center gap-2 bg-white/5 py-6 rounded-2xl border border-white/5">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-125 focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={48}
                    className={`transition-all duration-300 ${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                        : "fill-transparent text-white/20 hover:text-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            {/* Etiqueta dinámica */}
            <span className={`text-xs uppercase tracking-widest font-bold mt-2 transition-colors duration-300 ${rating > 0 || hoverRating > 0 ? "text-ds-primary" : "text-ds-muted"}`}>
              {currentLabel}
            </span>
          </div>

          {/* SECCIÓN DE TAGS */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-ds-muted font-bold block">
              Etiquetas Rápidas
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTag(label)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 border ${
                    selectedTags.includes(label)
                      ? "bg-ds-primary/20 border-ds-primary text-ds-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      : "bg-[#1E293B]/50 border-white/5 text-ds-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN DE COMENTARIOS MEJORADA */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs uppercase tracking-widest text-ds-muted font-bold block">
                Notas del Viaje
              </label>
              {/* Contador de caracteres */}
              <span className={`text-[10px] font-mono ${comment.length >= MAX_CHARS ? 'text-red-400' : 'text-ds-muted'}`}>
                {comment.length} / {MAX_CHARS}
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Ej: El sensor detectó un falso positivo al mirar el retrovisor..."
              className="w-full bg-[#1E293B]/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-ds-primary focus:border-ds-primary transition-all min-h-[100px] resize-none"
            />
          </div>

          {/* BOTÓN DE ENVÍO INTELIGENTE */}
          <button
            type="submit"
            disabled={isLoading || rating === 0}
            className={`w-full font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 
              ${rating === 0 
                ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10" 
                : "bg-ds-primary text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              }`}
          >
            {isLoading ? (
              <span className="animate-pulse">Procesando...</span>
            ) : (
              <>
                <Send size={18} className={rating === 0 ? "opacity-50" : ""} />
                {rating === 0 ? "Selecciona Estrellas" : "Guardar Calificación"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}