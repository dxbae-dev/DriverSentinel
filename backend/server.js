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
import tripRoutes from './src/routes/tripRoutes.js';


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

// --- 2. CONFIGURACIÓN DEL PUERTO SERIAL Y MOCK MODE ---
let isMockMode = false;

// Evitamos que crashee apagando el autoOpen
const arduinoPort = new SerialPort({ 
  path: 'COM6', 
  baudRate: 115200, 
  autoOpen: false 
}); 
const parser = new ReadlineParser({ delimiter: '\r\n' });

// Intentamos abrir el puerto manualmente para capturar el error
arduinoPort.open((err) => {
  if (err) {
    console.log(`⚠️ No se encontró el hardware en COM6: ${err.message}`);
    console.log('🛠️ Iniciando en [MOCK MODE] - Generando telemetría simulada...');
    isMockMode = true;
  } else {
    console.log('✅ Conexión serial establecida en COM6');
    arduinoPort.pipe(parser);
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
app.use('/api/trips', tripRoutes);

app.get('/', (req, res) => {
  res.send(`DriverSentinel API 1.0 Running... (Mock Mode: ${isMockMode})`);
});

// --- 🛰️ LÓGICA DE FLUJO DE DATOS (REAL Y SIMULADO) ---
io.on('connection', (socket) => {
  console.log('✅ Dashboard conectado:', socket.id);

  let mockInterval;

  if (isMockMode) {
    // ------------------------------------
    // MODO SIMULADO CON ALERTAS AUTOMÁTICAS
    // ------------------------------------
    let secondsCounter = 0;
    let criticalTicks = 0; // Cuántos segundos durará la alerta
    let currentAlertMode = 0; // 1 = Pitch, 2 = BPM, 3 = Ambos

    mockInterval = setInterval(() => {
      secondsCounter++;
      
      // Valores por defecto (Saludables)
      let bpm = Math.floor(Math.random() * (85 - 70 + 1)) + 70; 
      let pitch = parseFloat((Math.random() * 4 - 2).toFixed(2)); 

      // Cada x segundos, disparamos la ventana de crisis
      if (secondsCounter >= 10) {
        secondsCounter = 0; // Reiniciamos el reloj
        criticalTicks = 4;  // Mandamos datos malos por 4 segundos para vencer la tolerancia del frontend
        currentAlertMode = Math.floor(Math.random() * 3) + 1; // Elegimos al azar qué fallará
        
        const alertName = currentAlertMode === 1 ? 'CABECEO' : currentAlertMode === 2 ? 'BPM BAJO' : 'FALLO TOTAL (Ambos)';
        console.log(`[Mock Mode] 🚨 Simulando anomalía: ${alertName}`);
      }

      // Si estamos en la ventana de crisis, sobreescribimos los datos saludables con datos peligrosos
      if (criticalTicks > 0) {
        criticalTicks--;
        
        if (currentAlertMode === 1 || currentAlertMode === 3) {
          // Simulamos que la cabeza cae hacia adelante (Pitch entre -7.0 y -10.0)
          pitch = parseFloat((-7.0 - (Math.random() * 3)).toFixed(2)); 
        }
        if (currentAlertMode === 2 || currentAlertMode === 3) {
          // Simulamos pulso muy bajo (BPM entre 45 y 55)
          bpm = Math.floor(Math.random() * (55 - 45 + 1)) + 45; 
        }
      }
      
      const mockData = {
        bpm: bpm, 
        pitch: pitch, 
        timestamp: new Date().toISOString()
      };
      
      socket.emit('telemetryUpdate', mockData);
    }, 1000); // 1 actualización por segundo

  } else {
    // ------------------------------------
    // MODO REAL: Escuchamos el ESP32
    // ------------------------------------
    const handleSerialData = (data) => {
      if (data.includes("BPM:")) {
        try {
          const partes = data.split(',');
          const bpmValue = parseFloat(partes[0].split(':')[1]);
          const angleValue = parseFloat(partes[1].split(':')[1]);

          socket.emit('telemetryUpdate', {
            bpm: bpmValue, 
            pitch: angleValue, 
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error procesando datos seriales:", error);
        }
      }
    };

    parser.on('data', handleSerialData);

    socket.on('disconnect', () => {
      parser.off('data', handleSerialData);
    });
  }

  socket.on('disconnect', () => {
    console.log('❌ Sesión de monitoreo cerrada:', socket.id);
    if (mockInterval) clearInterval(mockInterval);
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  });
}

export default server;