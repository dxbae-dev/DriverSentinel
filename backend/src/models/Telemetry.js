import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Por ahora opcional mientras pruebas la calibración
  },
  bpm: Number,
  pitch: Number,
  estado: { type: String, enum: ['Normal', 'Alerta'], default: 'Normal' },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Telemetry', telemetrySchema);