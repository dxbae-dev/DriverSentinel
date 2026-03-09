import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Verifica que el usuario tenga un Token válido (Sesión iniciada)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscamos al usuario pero NO traemos su contraseña por seguridad
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, sin token' });
  }
};

// 2. Verifica si el usuario es Administrador
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de Administrador' });
  }
};

// 3. Verifica si el conductor ya llenó sus datos médicos/vehículo
export const checkProfileComplete = (req, res, next) => {
  // Los admins no necesitan completar perfil de conductor
  if (req.user && (req.user.isProfileComplete || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Acceso denegado: Debes completar tu perfil de conductor primero.',
      code: 'PROFILE_INCOMPLETE'
    });
  }
};