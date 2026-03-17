import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; 
import { Server } from 'socket.io'; 
import { connectDB } from './src/database.js';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// --- 1. CONFIGURACIÓN DE SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- 2. CONFIGURACIÓN DEL PUERTO SERIAL (USB) ---
// Asegúrate de que 'COM3' coincida con tu Administrador de Dispositivos
const arduinoPort = new SerialPort({ path: 'COM6', baudRate: 115200 }); 
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('DriverSentinel API 1.0 Running with Serial USB Data...');
});

// --- 🛰️ LÓGICA DE FLUJO DE DATOS REALES ---
io.on('connection', (socket) => {
  console.log('✅ Dashboard conectado al flujo USB:', socket.id);

  // Escuchamos lo que llega del ESP32 por el cable
  parser.on('data', (data) => {
    // El código de Arduino envía: "BPM:xx.xx, AnguloX:xx.xx"
    if (data.includes("BPM:")) {
      try {
        const partes = data.split(',');
        const bpmValue = parseFloat(partes[0].split(':')[1]);
        const angleValue = parseFloat(partes[1].split(':')[1]);

        const realData = {
          bpm: bpmValue, 
          pitch: angleValue, 
          timestamp: new Date().toISOString()
        };
        
        // Enviamos los datos reales del sensor al Dashboard de Saul
        socket.emit('telemetryUpdate', realData);

      } catch (error) {
        console.error("Error procesando datos seriales:", error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Sesión de monitoreo cerrada');
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando USB en COM3 y Sockets en puerto ${PORT}`);
  });
}

export default server;