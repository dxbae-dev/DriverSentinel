import Trip from "../models/Trip.js";
// Agregar una nueva calificación (Crea el registro del viaje)
export const addTripRating = async (req, res) => {
  try {
    const { driverId, rating, comment, tags, startTime, endTime } = req.body;

    // Validación básica
    if (!driverId || !rating) {
      return res.status(400).json({ 
        message: "El ID del conductor y la calificación son obligatorios." 
      });
    }

    const newTrip = new Trip({
      driver: driverId,
      startTime: startTime || Date.now(),
      endTime: endTime || Date.now(),
      feedback: {
        rating,
        comment,
        tags: tags || [],
      },
    });

    const savedTrip = await newTrip.save();
    res.status(201).json({ 
      message: "Calificación guardada exitosamente", 
      trip: savedTrip 
    });
  } catch (error) {
    console.error("Error al guardar la calificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Consultar todas las calificaciones
export const getAllRatings = async (req, res) => {
  try {
    // Buscamos los viajes y traemos los datos básicos del conductor con .populate()
    const trips = await Trip.find({ "feedback.rating": { $exists: true } })
      .populate("driver", "firstName lastName email")
      .sort({ createdAt: -1 }); // Ordenamos de más reciente a más antiguo

    res.status(200).json(trips);
  } catch (error) {
    console.error("Error al obtener las calificaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};