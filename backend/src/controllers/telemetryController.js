const Telemetry = require('../models/Telemetry');

// Esta función procesa los datos que envía el ESP32
exports.createReading = async (req, res) => {
    try {
        const { userId, bpm, anguloX, estado } = req.body;

        // 1. Creamos el nuevo registro con los datos de Saul
        const newReading = new Telemetry({
            userId,
            bpm: parseFloat(bpm),
            anguloX: parseFloat(anguloX),
            estado: estado || 'Normal'
        });

        // 2. Guardamos en MongoDB
        const savedReading = await newReading.save();

        // 3. Respondemos al ESP32 que todo salió bien
        res.status(201).json({
            success: true,
            message: "Lectura guardada correctamente",
            data: savedReading
        });

        console.log(`>>> Datos recibidos de Saul: BPM: ${bpm}, Ángulo: ${anguloX}, Estado: ${estado}`);

    } catch (error) {
        console.error("Error al guardar telemetría:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al procesar datos"
        });
    }
};

// Esta función servirá para que tu Frontend de React (Vite) consulte los datos
exports.getLatestReadings = async (req, res) => {
    try {
        const readings = await Telemetry.find()
            .sort({ fecha: -1 }) // Los más recientes primero
            .limit(20);          // Solo los últimos 20 para no saturar la gráfica
            
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial" });
    }
};