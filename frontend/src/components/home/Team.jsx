import { Github, Linkedin, Mail } from "lucide-react";

export function Team() {
  const team = [
    {
      name: "Saúl Gutiérrez Meráz",
      role: "Scrum Master / IoT",
      img: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Saul"
    },
    {
      name: "Gerardo Daniel Ramírez Baena",
      role: "Fullstack / Cloud Architecture",
      img: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Baena"
    },
    {
      name: "Samuel",
      role: "Hardware & Sensors",
      img: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Samy"
    },
    {
      name: "Daniela ",
      role: "Frontend Designer",
      img: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Dany"
    }
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">El Equipo</h2>
          <p className="text-ds-muted max-w-2xl mx-auto text-lg">Estudiantes de la carrera ITIC comprometidos con la innovación tecnológica para la seguridad vial.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="bg-ds-card/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors group">
              <div className="w-24 h-24 mb-5 rounded-full p-1 border-2 border-transparent group-hover:border-ds-primary transition-colors">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-full bg-slate-800" />
              </div>
              <h4 className="text-lg font-display font-bold text-white mb-1">{member.name}</h4>
              <span className="text-sm text-ds-primary font-medium mb-4">{member.role}</span>
              
              <div className="flex items-center gap-3 text-ds-muted">
                <button className="hover:text-white transition-colors"><Github size={18} /></button>
                <button className="hover:text-blue-400 transition-colors"><Linkedin size={18} /></button>
                <button className="hover:text-white transition-colors"><Mail size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}