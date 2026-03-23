import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    
    // --- SISTEMA DE CALIFICACIÓN ---
    feedback: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, trim: true },
      tags: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);