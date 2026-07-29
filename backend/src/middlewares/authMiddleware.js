const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Acceso no autorizado. Token requerido.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_alejandria_2026_change_in_production';

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'No tiene permisos suficientes para realizar esta acción.' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
};
