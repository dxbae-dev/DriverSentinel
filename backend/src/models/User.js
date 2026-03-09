import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // --- CREDENCIALES ---
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // --- PERFIL DE CONDUCTOR ---
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  driverId: { type: String, unique: true, sparse: true },
  birthDate: { type: Date },
  phone: { type: String },

  // --- DATOS MÉDICOS (Críticos para emergencias) ---
  medicalInfo: {
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    conditions: [{ type: String }], // Ej: "Diabetes", "Apnea del sueño"
    allergies: [{ type: String }],
    medications: [{ type: String }]
  },

  // --- MÚLTIPLES CONTACTOS DE EMERGENCIA ---
  emergencyContacts: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String },
    priority: { type: Number, default: 1 } // Para saber a quién llamar primero
  }],

  // --- VEHÍCULO E INFORMACIÓN LEGAL ---
  vehicle: {
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    plates: { type: String },
    insurance: {
      company: { type: String },
      policyNumber: { type: String },
      expiryDate: { type: Date }
    }
  },

  // --- CONFIGURACIÓN IOT (Útil para tu ESP32) ---
  settings: {
    alertSensitivity: { type: Number, default: 5 }, // 1-10
    preferredAlertSound: { type: String, default: "buzzer_1" },
    deviceId: { type: String } // El ID único de tu ESP32
  },

  // --- METADATOS DE CONTROL ---
  role: { type: String, enum: ['conductor', 'admin'], default: 'conductor' },
  isProfileComplete: { type: Boolean, default: false },
  lastSession: { type: Date }
}, {
  timestamps: true 
});

export default mongoose.model('User', userSchema);