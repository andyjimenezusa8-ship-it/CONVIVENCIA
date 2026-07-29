function errorHandler(err, req, res, next) {
  console.error('❌ Error capturado:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo excede el tamaño máximo permitido (20 MB).'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Error al subir archivo: ${err.message}`
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

module.exports = errorHandler;
