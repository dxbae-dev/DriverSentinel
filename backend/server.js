import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/database.js'; // Asegúrate de tener tu archivo database.js

// Importamos las rutas
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: '*', //Posterior poner solo el link del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Montar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de Salud / Test
app.get('/', (req, res) => {
  res.send('DriverSentinel API 1.0 Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});