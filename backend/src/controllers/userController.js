import User from '../models/User.js';

// @route   GET /api/users/profile
// @access  Privado
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @route   PUT /api/users/profile
// @access  Privado (Completar Progressive Profiling)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Actualizamos los datos enviados por el frontend
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phone = req.body.phone || user.phone;
      user.driverId = req.body.driverId || user.driverId;
      
      // Actualizamos sub-documentos si existen en el request
      if (req.body.medicalInfo) user.medicalInfo = req.body.medicalInfo;
      if (req.body.emergencyContacts) user.emergencyContacts = req.body.emergencyContacts;
      if (req.body.vehicle) user.vehicle = req.body.vehicle;

      // ¡Magia! Si llena sus datos, marcamos el perfil como completo
      user.isProfileComplete = true;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        isProfileComplete: updatedUser.isProfileComplete,
        message: 'Perfil actualizado y completado con éxito'
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando perfil', error: error.message });
  }
};

// @route   GET /api/users/admin/drivers
// @access  Privado/Admin
export const getDriversAdmin = async (req, res) => {
  try {
    // Obtenemos a todos excepto a los admins
    const drivers = await User.find({ role: 'conductor' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo conductores' });
  }
};
// @route   PUT /api/users/link-device
// @access  Privado
export const linkESP32 = async (req, res) => {
  try {
    const { deviceId } = req.body;
    
    // Usamos _id que es el estándar de Mongoose y tu middleware
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Guardamos el ID en la ruta correcta según tu esquema
    if (!user.settings) user.settings = {};
    user.settings.deviceId = deviceId;
    
    await user.save();

    res.json({
      message: 'Dispositivo vinculado correctamente',
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al vincular dispositivo', error: error.message });
  }
};

// @route   GET /api/users/device-status
// @access  Privado
export const getDeviceStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const deviceId = user.settings?.deviceId;
    
    // Lógica inteligente para la Top Bar:
    // Si no tiene ID -> 'linking' (Necesita vincular)
    // Si tiene ID -> 'connected' (Simulamos que está online por ahora)
    const status = deviceId ? 'connected' : 'linking';

    res.json({ deviceId, status });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo estado del dispositivo' });
  }
};