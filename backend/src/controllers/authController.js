import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// Necesitarás crear credenciales en Google Cloud Console después
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