import express from "express";
import { addTripRating, getAllRatings } from "../controllers/tripController.js";

const router = express.Router();

// POST /api/trips/rate - Guarda el viaje y la calificación
router.post("/rate", addTripRating);

// GET /api/trips/ratings - Obtiene el historial de calificaciones
router.get("/ratings", getAllRatings);

export default router;