import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; 
import { Server } from 'socket.io'; 
import { connectDB } from './src/database.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();
const app = express();

const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('DriverSentinel API 1.0 Running with Sockets...');
});

// --- 🛰️ LÓGICA DE SOCKETS Y SIMULADOR ESP32 ---
io.on('connection', (socket) => {
  console.log('✅ Dispositivo conectado al flujo de datos:', socket.id);

  // Simulador: Se envian datos falsos cada 2 segundos
  const telemetryInterval = setInterval(() => {
    
    // 20% de probabilidad de que el conductor se quede dormido
    const isSleeping = Math.random() < 0.20;
    
    // Si se duerme, 50% de probabilidad de que baje el pulso
    const simulatedBPM = isSleeping && Math.random() > 0.5
      ? Math.floor(Math.random() * (60 - 55 + 1)) + 55 
      : Math.floor(Math.random() * (85 - 70 + 1)) + 70;

    // Si se duerme, 50% de probabilidad de que cabecee bruscamente (entre 20 y 30 grados, o -20 y -30)
    let simulatedPitch;
    if (isSleeping && Math.random() > 0.5) {
        const sign = Math.random() > 0.5 ? 1 : -1; // Cabeceo hacia adelante o atrás
        simulatedPitch = (sign * (Math.random() * (30 - 20) + 20)).toFixed(2);
    } else {
        // Manejo normal (postura estable entre -5 y 5 grados)
        simulatedPitch = (Math.random() * 10 - 5).toFixed(2); 
    }

    const fakeData = {
      bpm: simulatedBPM, 
      pitch: simulatedPitch, 
      timestamp: new Date().toISOString()
    };
    
    socket.emit('telemetryUpdate', fakeData);
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(telemetryInterval);
    console.log('❌ Conexión de telemetría cerrada');
  });
});
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor y Sockets activos en puerto ${PORT}`);
  });
}

export default server; 