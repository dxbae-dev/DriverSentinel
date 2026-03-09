import { MapPin, Phone, Mail, Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 relative bg-[#0B1120]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Contacto</h2>
          <p className="text-ds-muted max-w-2xl mx-auto text-lg">¿Tienes dudas sobre la implementación del sistema? Escríbenos.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-ds-card/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="text-ds-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Dirección</h3>
                <p className="text-ds-muted text-sm leading-relaxed">Universidad Tecnológica de Nezahualcóyotl<br/>Cto. Rey Nezahualcóyotl Mz 010, Benito Juárez, 57000 Cdad. Nezahualcóyotl, Méx.</p>
              </div>
            </div>

            <div className="bg-ds-card/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="text-ds-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Llámanos</h3>
                <p className="text-ds-muted text-sm">+52 55 5441 3182</p>
              </div>
            </div>

            <div className="bg-ds-card/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="text-ds-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Correo Electrónico</h3>
                <p className="text-ds-muted text-sm">driver.sentinel@utn.edu.mx</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form className="bg-ds-card/40 backdrop-blur-2xl border border-white/5 p-8 rounded-3xl flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Tu Nombre" className="w-full bg-[#0B1120] border border-white/10 focus:border-ds-primary rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all" />
              <input type="email" placeholder="Tu Correo" className="w-full bg-[#0B1120] border border-white/10 focus:border-ds-primary rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all" />
            </div>
            <input type="text" placeholder="Asunto" className="w-full bg-[#0B1120] border border-white/10 focus:border-ds-primary rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all" />
            <textarea placeholder="Mensaje" rows="5" className="w-full bg-[#0B1120] border border-white/10 focus:border-ds-primary rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all resize-none"></textarea>
            
            <button type="button" className="mt-2 flex items-center justify-center gap-2 bg-ds-primary hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Send size={18} />
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}