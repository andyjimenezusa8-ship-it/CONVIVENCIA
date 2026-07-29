const rateLimit = require('express-rate-limit');

// Limitador de tasa para creación de PQR (Previene spam)
const createPqrLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 PQR por IP cada 15 minutos
  message: {
    success: false,
    error: 'Ha superado el límite de solicitudes de radicación. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador de tasa para inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de login
  message: {
    success: false,
    error: 'Demasiados intentos fallidos de inicio de sesión. Intente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createPqrLimiter,
  loginLimiter
};
