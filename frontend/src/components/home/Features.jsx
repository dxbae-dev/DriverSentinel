import { HeartPulse, ActivitySquare, BellRing } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <HeartPulse className="w-10 h-10 text-ds-alert" />,
      title: "Sensor MAX30102",
      description: "Monitorea la frecuencia cardíaca y la oxigenación en sangre para detectar caídas bruscas asociadas a la somnolencia."
    },
    {
      icon: <ActivitySquare className="w-10 h-10 text-blue-400" />,
      title: "Giroscopio MPU6050",
      description: "Identifica patrones de movimiento erráticos y la inclinación de la cabeza (cabeceo) con precisión milimétrica."
    },
    {
      icon: <BellRing className="w-10 h-10 text-amber-400" />,
      title: "Alertas en Borde",
      description: "Procesamiento local que activa un Buzzer instantáneo en milisegundos para despertar al conductor ante el menor riesgo."
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Tecnología de Vanguardia</h2>
          <p className="text-ds-muted max-w-2xl mx-auto text-lg">Nuestro sistema utiliza un microcontrolador ESP32 procesando datos críticos al instante, sin depender de internet.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-ds-card/40 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 hover:border-ds-primary/30 transition-all group hover:-translate-y-1">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-ds-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}