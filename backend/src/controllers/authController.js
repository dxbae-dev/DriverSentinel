import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // Asegurarnos de importar nodemailer

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'conductor',
      isProfileComplete: false // Perfilado progresivo
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
  const { tokenId } = req.body; 

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(googleId + process.env.JWT_SECRET, salt);

      user = await User.create({
        email,
        password: randomPassword,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        googleId,
        avatar: picture,
        role: 'conductor',
        isProfileComplete: false
      });
    }

    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      avatar: user.avatar,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(401).json({ message: 'Token de Google inválido', error: error.message });
  }
};

// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No hay ningún usuario con ese correo' });

    // 1. Generar token aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hashear el token y guardarlo en la BD
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Expira en 10 minutos
    await user.save();

    // 3. Crear la URL de recuperación apuntando a tu Frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 4. Configurar el Transportador de Nodemailer usando Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Simplificado en lugar de host/port si usas Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Tu contraseña de aplicación de 16 caracteres
      }
    });

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F172A; color: #F8FAFC; padding: 20px; border-radius: 10px;">
        <h2 style="color: #06B6D4; text-align: center;">DriverSentinel</h2>
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva (este enlace expira en 10 minutos):</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #06B6D4; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="font-size: 12px; color: #94A3B8;">Si no solicitaste este cambio, ignora este correo.</p>
      </div>
    `;

    // 5. Enviar el correo
    await transporter.sendMail({
      from: `"DriverSentinel" <${process.env.EMAIL_USER}>`,
      to: user.email, 
      subject: 'Restablece tu contraseña - DriverSentinel',
      html: htmlMessage
    });

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error("Error al enviar correo: ", error);
    
    // Es buena práctica limpiar los tokens si falla el envío
    const user = await User.findOne({ email });
    if(user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    
    res.status(500).json({ message: 'Error en el servidor al solicitar recuperación' });
  }
};

// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    // 1. Hashear el token de la URL para compararlo
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Buscar al usuario y verificar que no haya expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'El enlace es inválido o ha expirado' });

    // 3. Hashear y guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    // Asumiendo que envías { password: "nueva_clave" } en el body
    user.password = await bcrypt.hash(req.body.password, salt);

    // 4. Limpiar los campos
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};