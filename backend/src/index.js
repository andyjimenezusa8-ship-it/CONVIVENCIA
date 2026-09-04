const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const fs = require('fs');
const { execSync } = require('child_process');

dotenv.config();

// Auto-inicialización de la base de datos SQLite autónoma
function ensureDatabaseReady() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
    process.env.DATABASE_URL = 'file:./dev.db';
  }
  try {
    const backendDir = path.join(__dirname, '..');
    console.log('🔄 Verificando e inicializando base de datos SQLite autónoma...');
    execSync('npx prisma db push --accept-data-loss', { cwd: backendDir, stdio: 'inherit' });
    console.log('🌱 Poblando datos por defecto si es necesario...');
    execSync('node prisma/seed.js', { cwd: backendDir, stdio: 'inherit' });
    console.log('✅ Base de datos lista.');
  } catch (err) {
    console.warn('⚠️ Nota sobre inicialización de BD:', err.message);
  }
}

// Ejecutar sincronización inicial de la BD antes de cargar las rutas
ensureDatabaseReady();

const authRoutes = require('./routes/authRoutes');
const pqrRoutes = require('./routes/pqrRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Seguridad con Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Permitir carga de recursos frontend en producción
  })
);

// Habilitar CORS
app.use(cors());

// Parseo de cuerpo de petición
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Servir archivos estáticos subidos
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Endpoint de Salud para Railway / Docker / Monitoreo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    system: 'Comité de Convivencia Parques de Alejandría PWA',
    timestamp: new Date().toISOString()
  });
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/pqr', pqrRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Servir Frontend compilado en Producción si existe
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`🏢 Comité de Convivencia - Parques de Alejandría`);
  console.log(`====================================================`);
});
