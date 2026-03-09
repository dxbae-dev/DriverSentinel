import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Droplet,
  HeartPulse,
  AlertCircle,
  CarFront,
  Fingerprint,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import { AuthInput } from "../../components/auth/AuthInput"; // Asegúrate de importar tu AuthInput

export function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();

  // useEffect para Login.jsx y Register.jsx
  useEffect(() => {
    if (user) {
      // 1. Prioridad: Administrador
      if (user.role === "admin") {
        navigate("/admin-panel");
      }
      // 2. Usuario Normal: Verificar si ya completó su perfil técnico
      else if (user.isProfileComplete) {
        navigate("/dashboard"); // Aquí verá la telemetría del ESP32
      }
      // 3. Usuario Normal con perfil incompleto
      else {
        navigate("/complete-profile");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    driverId: "",
    bloodType: "O+",
    medicalNotes: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    vehicleBrand: "",
    vehiclePlates: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profilePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      driverId: formData.driverId || `DS-${Math.floor(Math.random() * 10000)}`,
      medicalInfo: {
        bloodType: formData.bloodType,
        conditions: formData.medicalNotes ? [formData.medicalNotes] : [],
      },
      emergencyContacts: [
        {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relationship: formData.emergencyRelation,
        },
      ],
      vehicle: {
        brand: formData.vehicleBrand,
        plates: formData.vehiclePlates,
      },
    };

    try {
      await updateProfile(profilePayload);
      Swal.fire({
        icon: "success",
        title: "¡Protocolo Activado!",
        text: "Tu perfil ha sido configurado. Iniciando telemetría...",
        background: "#1E293B",
        color: "#fff",
        confirmButtonColor: "#06B6D4",
        timer: 3000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-ds-bg relative overflow-y-auto py-12 px-4 sm:px-6">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-ds-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-ds-safe/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ds-safe/10 border border-ds-safe/20 rounded-2xl mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <ShieldAlert className="text-ds-safe" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight uppercase mb-2">
            Configuración de Protocolo
          </h1>
          <p className="text-ds-muted max-w-lg mx-auto">
            Para activar la telemetría y el monitoreo del ESP32, necesitamos tus
            datos de seguridad vial y emergencia.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-ds-alert/10 border border-ds-alert/20 text-ds-alert text-center font-bold tracking-widest uppercase text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- SECCIÓN 1: DATOS PERSONALES --- */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Fingerprint className="text-ds-primary" size={20} />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                  Identidad
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <AuthInput
                    icon={User}
                    label="Nombre"
                    name="firstName"
                    placeholder="Ej. Gerardo"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <AuthInput
                    icon={User}
                    label="Apellido"
                    name="lastName"
                    placeholder="Ej. Ramirez"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <AuthInput
                  icon={Phone}
                  label="Teléfono Personal"
                  name="phone"
                  placeholder="10 dígitos"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <AuthInput
                  icon={Fingerprint}
                  label="ID de Conductor"
                  name="driverId"
                  placeholder="Opcional"
                  value={formData.driverId}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* --- SECCIÓN 2: DATOS MÉDICOS --- */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <HeartPulse className="text-ds-alert" size={20} />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                  Perfil Médico
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ds-muted pl-1">
                    Tipo de Sangre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ds-alert/80">
                      <Droplet size={18} />
                    </div>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="w-full bg-[#0B1120] border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:border-ds-primary outline-none transition-all"
                    >
                      <option value="O+">O Positivo (O+)</option>
                      <option value="O-">O Negativo (O-)</option>
                      <option value="A+">A Positivo (A+)</option>
                      <option value="A-">A Negativo (A-)</option>
                      <option value="B+">B Positivo (B+)</option>
                      <option value="B-">B Negativo (B-)</option>
                      <option value="AB+">AB Positivo (AB+)</option>
                      <option value="AB-">AB Negativo (AB-)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ds-muted pl-1">
                    Alergias o Condiciones
                  </label>
                  <textarea
                    name="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    placeholder="Ej. Alergia a la penicilina..."
                    className="w-full bg-[#0B1120] border border-slate-700 text-white text-sm rounded-xl p-3 focus:border-ds-primary outline-none transition-all resize-none h-24"
                  />
                </div>
              </div>
            </div>

            {/* --- SECCIÓN 3: CONTACTO DE EMERGENCIA --- */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <AlertCircle className="text-amber-400" size={20} />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                  Contacto de Emergencia
                </h2>
              </div>
              <div className="space-y-4">
                <AuthInput
                  icon={User}
                  label="Nombre del Contacto"
                  name="emergencyName"
                  placeholder="¿A quién llamamos?"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  required
                />
                <AuthInput
                  icon={Phone}
                  label="Teléfono de Emergencia"
                  name="emergencyPhone"
                  placeholder="10 dígitos"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  required
                />
                <AuthInput
                  icon={User}
                  label="Parentesco"
                  name="emergencyRelation"
                  placeholder="Ej. Madre, Amigo"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* --- SECCIÓN 4: VEHÍCULO --- */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <CarFront className="text-slate-300" size={20} />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                  Vehículo Asignado
                </h2>
              </div>
              <div className="space-y-4">
                <AuthInput
                  icon={CarFront}
                  label="Marca y Modelo"
                  name="vehicleBrand"
                  placeholder="Ej. Nissan Versa"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  required
                />
                <AuthInput
                  icon={Fingerprint}
                  label="Placas"
                  name="vehiclePlates"
                  placeholder="Ej. ABC-123"
                  value={formData.vehiclePlates}
                  onChange={handleChange}
                  required
                />

                <div className="mt-6 bg-ds-safe/10 border border-ds-safe/20 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2
                    className="text-ds-safe mt-0.5 shrink-0"
                    size={16}
                  />
                  <p className="text-[10px] font-mono text-ds-safe uppercase tracking-wider leading-relaxed">
                    VINCULANDO PROTOCOLO DE SEGURIDAD VIAL AL ESP32...
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-4 bg-ds-primary hover:bg-cyan-400 disabled:bg-ds-primary/50 text-slate-900 font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Procesando...
                </>
              ) : (
                <>
                  <ShieldAlert size={20} /> Activar Protocolo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
