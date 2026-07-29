const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPqrs,
  updatePqrStatus,
  addObservation,
  reopenPqr,
  exportExcel,
  getUsers,
  createUser,
  updateUser,
  getCatalogAdmin,
  createArea,
  updateArea,
  deleteArea,
  createCategory,
  updateCategory,
  deleteCategory,
  createMotive,
  updateMotive,
  deleteMotive
} = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

// Dashboard & PQRs
router.get('/dashboard/stats', getDashboardStats);
router.get('/pqrs', getPqrs);
router.patch('/pqrs/:pqrId/status', requireRole(['ADMIN', 'COMMITTEE']), updatePqrStatus);
router.post('/pqrs/:pqrId/observations', requireRole(['ADMIN', 'COMMITTEE']), addObservation);
router.post('/pqrs/:pqrId/reopen', requireRole(['ADMIN']), reopenPqr);
router.get('/export/excel', exportExcel);

// Gestión de Usuarios
router.get('/users', requireRole(['ADMIN']), getUsers);
router.post('/users', requireRole(['ADMIN']), createUser);
router.put('/users/:userId', requireRole(['ADMIN']), updateUser);

// Catálogo
router.get('/catalog', requireRole(['ADMIN']), getCatalogAdmin);
router.post('/catalog/areas', requireRole(['ADMIN']), createArea);
router.put('/catalog/areas/:id', requireRole(['ADMIN']), updateArea);
router.delete('/catalog/areas/:id', requireRole(['ADMIN']), deleteArea);
router.post('/catalog/categories', requireRole(['ADMIN']), createCategory);
router.put('/catalog/categories/:id', requireRole(['ADMIN']), updateCategory);
router.delete('/catalog/categories/:id', requireRole(['ADMIN']), deleteCategory);
router.post('/catalog/motives', requireRole(['ADMIN']), createMotive);
router.put('/catalog/motives/:id', requireRole(['ADMIN']), updateMotive);
router.delete('/catalog/motives/:id', requireRole(['ADMIN']), deleteMotive);

module.exports = router;
