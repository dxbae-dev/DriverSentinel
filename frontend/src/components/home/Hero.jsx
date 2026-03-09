import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-4 py-15 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
      {/* Efectos de luz Glassmorphism */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-ds-primary/10 rounded-full blur-[100px] sm:blur-[150px] -z-10 pointer-events-none"></div>
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ds-card/40 backdrop-blur-md border border-white/10 text-sm text-ds-primary mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <ShieldCheck className="w-4 h-4" />
        <span className="font-medium tracking-wide">Protegiendo vidas en el camino</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight">
        La prevención que <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-primary to-blue-400">
          despierta tus sentidos.
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-ds-muted max-w-2xl mb-10 leading-relaxed">
        Detección temprana de somnolencia utilizando tecnología IoT en el borde. Monitoreo biométrico en tiempo real para un viaje más seguro.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-5">
        <Link to="/register" className="bg-ds-primary hover:bg-cyan-400 text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] text-lg">
          Comenzar Ahora
        </Link>
        <a href="#about" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded-xl font-medium transition-all text-lg">
          Conoce cómo funciona
        </a>
      </div>
    </section>
  );
}