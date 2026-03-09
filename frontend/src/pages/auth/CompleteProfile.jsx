import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, Droplet, HeartPulse, AlertCircle, CarFront, Fingerprint, 
  ShieldAlert, Loader2, CheckCircle2, Plus, Trash2, Calendar, FileText,
  Activity, ShieldCheck, CreditCard, ChevronDown
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import { AuthInput } from "../../components/auth/AuthInput"; 

export function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin-panel");
      else if (user.isProfileComplete) navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", driverId: "", birthDate: "",
    bloodType: "O+", conditions: "", allergies: "",
    vehicleBrand: "", vehicleModel: "", vehicleYear: "", vehiclePlates: "",
    insuranceCompany: "", insurancePolicy: ""
  });

  const [contacts, setContacts] = useState([{ name: "", phone: "", relationship: "", priority: 1 }]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContactChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const addContact = () => setContacts([...contacts, { name: "", phone: "", relationship: "", priority: contacts.length + 1 }]);
  const removeContact = (index) => contacts.length > 1 && setContacts(contacts.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profilePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      driverId: formData.driverId || `DS-${Math.floor(Math.random() * 10000)}`,
      birthDate: formData.birthDate,
      medicalInfo: {
        bloodType: formData.bloodType,
        conditions: formData.conditions ? formData.conditions.split(',').map(i => i.trim()) : [],
        allergies: formData.allergies ? formData.allergies.split(',').map(i => i.trim()) : []
      },
      emergencyContacts: contacts.filter(c => c.name && c.phone),
      vehicle: {
        brand: formData.vehicleBrand,
        model: formData.vehicleModel,
        year: formData.vehicleYear ? parseInt(formData.vehicleYear) : null,
        plates: formData.vehiclePlates,
        insurance: { company: formData.insuranceCompany, policyNumber: formData.insurancePolicy }
      }
    };

    try {
      await updateProfile(profilePayload);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#0B1120',
        color: '#fff'
      });
      Toast.fire({ icon: 'success', title: 'Perfil configurado con éxito' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-ds-bg text-slate-200 selection:bg-ds-primary/30 py-10 px-4">
      {/* Efectos de fondo sutiles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ds-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ds-safe/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Compacto */}
        <header className="mb-12 text-center">
          <div className="inline-flex p-3 bg-white/[0.03] border border-white/10 rounded-2xl mb-4">
            <ShieldCheck className="text-ds-primary" size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.2em]">
            Perfil de <span className="text-ds-primary">Seguridad</span>
          </h1>
          <p className="text-[10px] font-mono text-ds-muted uppercase tracking-[0.3em] mt-2">
            Verificación de protocolo Driver Sentinel
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMNA 1: OPERADOR & MÉDICO */}
            <div className="space-y-6">
              
              {/* SECCIÓN IDENTIDAD */}
              <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                  <Fingerprint size={18} className="text-ds-primary" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/90">Identidad del Operador</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AuthInput icon={User} label="Nombre" name="firstName" placeholder="Gerardo" value={formData.firstName} onChange={handleChange} required />
                    <AuthInput icon={User} label="Apellidos" name="lastName" placeholder="Ramirez Baena" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AuthInput icon={Phone} label="Teléfono" name="phone" placeholder="55 1234 5678" value={formData.phone} onChange={handleChange} required />
                    <AuthInput icon={Calendar} type="date" label="F. Nacimiento" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                  </div>
                  <AuthInput icon={CreditCard} label="No. Licencia" name="driverId" placeholder="Ej. B123456789" value={formData.driverId} onChange={handleChange} />
                </div>
              </section>

              {/* SECCIÓN MÉDICA */}
              <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                  <HeartPulse size={18} className="text-ds-alert" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/90">Ficha Médica</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ds-muted ml-1">Tipo de Sangre</label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ds-alert/60 group-focus-within:text-ds-alert transition-colors pointer-events-none">
                        <Droplet size={18} />
                      </div>
                      <select name="bloodType" value={formData.bloodType} onChange={handleChange} className="w-full bg-[#0B1120] border border-slate-800 text-white text-sm rounded-xl pl-11 pr-10 py-3.5 focus:border-ds-primary outline-none transition-all appearance-none cursor-pointer">
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-ds-primary pointer-events-none" size={16} />
                    </div>
                  </div>
                  <AuthInput icon={AlertCircle} label="Alergias" name="allergies" placeholder="Penicilina, polen... (separar por comas)" value={formData.allergies} onChange={handleChange} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ds-muted ml-1">Condiciones Médicas</label>
                    <div className="relative group">
                        <FileText className="absolute left-3.5 top-4 text-slate-500 group-focus-within:text-ds-primary transition-colors" size={18} />
                        <textarea 
                            name="conditions" 
                            value={formData.conditions} 
                            onChange={handleChange} 
                            placeholder="Diabetes, asma, etc... (separar por comas)" 
                            className="w-full bg-[#0B1120] border border-slate-800 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:border-ds-primary outline-none transition-all resize-none h-28 placeholder:text-slate-600" 
                        />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* COLUMNA 2: VEHÍCULO & EMERGENCIAS */}
            <div className="space-y-6">
              
              {/* SECCIÓN VEHÍCULO */}
              <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                  <CarFront size={18} className="text-slate-400" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/90">Datos de la Unidad</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AuthInput icon={CarFront} label="Marca" name="vehicleBrand" placeholder="Ej. Nissan" value={formData.vehicleBrand} onChange={handleChange} required />
                  <AuthInput icon={CarFront} label="Modelo" name="vehicleModel" placeholder="Ej. NP300" value={formData.vehicleModel} onChange={handleChange} required />
                  <AuthInput icon={Calendar} label="Año" name="vehicleYear" type="number" placeholder="2024" value={formData.vehicleYear} onChange={handleChange} />
                  <AuthInput icon={Fingerprint} label="Placas" name="vehiclePlates" placeholder="ABC-1234" value={formData.vehiclePlates} onChange={handleChange} required />
                  <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <AuthInput icon={ShieldCheck} label="Aseguradora" name="insuranceCompany" placeholder="Ej. Qualitas" value={formData.insuranceCompany} onChange={handleChange} />
                    <AuthInput icon={FileText} label="No. Póliza" name="insurancePolicy" placeholder="Ej. 99887766" value={formData.insurancePolicy} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* SECCIÓN CONTACTOS */}
              <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-white/90">Contactos de Emergencia</h2>
                  </div>
                  <button type="button" onClick={addContact} className="text-[9px] font-black uppercase bg-ds-primary/10 text-ds-primary px-3 py-1.5 rounded-lg border border-ds-primary/20 hover:bg-ds-primary/20 transition-all flex items-center gap-1.5">
                    <Plus size={12} strokeWidth={3} /> Añadir
                  </button>
                </div>
                
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="relative bg-[#070b14] p-5 rounded-2xl border border-white/5 group/contact animate-in zoom-in-95">
                      {index > 0 && (
                        <button type="button" onClick={() => removeContact(index)} className="absolute -top-2 -right-2 w-7 h-7 bg-[#0B1120] border border-ds-alert/40 text-ds-alert rounded-full flex items-center justify-center hover:bg-ds-alert hover:text-white transition-all shadow-xl opacity-100 lg:opacity-0 group-hover/contact:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 gap-4">
                        <AuthInput icon={User} label={`S.O.S #${index + 1}`} placeholder="Nombre del contacto" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AuthInput icon={Phone} label="Teléfono" placeholder="55 0000 0000" value={contact.phone} onChange={(e) => handleContactChange(index, 'phone', e.target.value)} required />
                          <AuthInput icon={User} label="Relación" placeholder="Ej. Padre, Jefe" value={contact.relationship} onChange={(e) => handleContactChange(index, 'relationship', e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Footer Responsivo */}
          <footer className="pt-10 flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full sm:w-auto min-w-[280px] py-4 bg-ds-primary text-slate-950 font-black uppercase tracking-[0.25em] text-xs rounded-2xl transition-all shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldAlert size={18} />}
                {isLoading ? "Validando Datos..." : "Finalizar Configuración"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}