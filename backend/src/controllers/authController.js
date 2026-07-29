const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Correo y contraseña son requeridos.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user || !user.active) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas o cuenta desactivada.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_alejandria_2026_change_in_production';
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado.' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getProfile
};
