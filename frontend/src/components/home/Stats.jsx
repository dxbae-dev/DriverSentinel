export function Stats() {
  const stats = [
    { number: "< 15", label: "Milisegundos de Respuesta" },
    { number: "98%", label: "Precisión de Sensores" },
    { number: "24/7", label: "Monitoreo Continuo" },
    { number: "0", label: "Dependencia de Red para Alertas" }
  ];

  return (
    <section className="py-16 relative bg-[#0B1120]">
      <div className="absolute inset-0 bg-ds-primary/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ds-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ds-primary/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                {stat.number}
              </span>
              <span className="text-sm md:text-base text-ds-primary font-medium tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}