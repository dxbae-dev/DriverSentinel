import express from 'express';
import { getUserProfile, updateUserProfile, getDriversAdmin, linkESP32, getDeviceStatus } from '../controllers/userController.js';
import { protect, admin, checkProfileComplete } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas Generales de Usuario
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Rutas de Hardware (ESP32)
router.put('/link-device', protect, linkESP32);
router.get('/device-status', protect, getDeviceStatus);

// Ruta protegida de Telemetría (Solo pasa si isProfileComplete es true)
router.get('/telemetry', protect, checkProfileComplete, (req, res) => {
  res.json({ message: 'Acceso a telemetría del ESP32 concedido.' });
});

// Rutas de Administrador
router.get('/admin/drivers', protect, admin, getDriversAdmin);

export default router;