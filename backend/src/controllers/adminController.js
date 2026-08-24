const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');
const { createAuditLog } = require('../services/auditService');
const { sendPqrStatusUpdatedNotification } = require('../services/emailService');

/**
 * Estadísticas e indicadores para el Dashboard
 */
async function getDashboardStats(req, res, next) {
  try {
    const { month, year, type, status } = req.query;

    const whereClause = {};

    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    if (year) {
      const yr = parseInt(year, 10);
      const start = new Date(yr, 0, 1);
      const end = new Date(yr + 1, 0, 1);
      whereClause.createdAt = { gte: start, lt: end };
    }

    if (month && year) {
      const yr = parseInt(year, 10);
      const mth = parseInt(month, 10) - 1;
      const start = new Date(yr, mth, 1);
      const end = new Date(yr, mth + 1, 1);
      whereClause.createdAt = { gte: start, lt: end };
    }

    const totalPqr = await prisma.pqr.count({ where: whereClause });

    const pendientes = await prisma.pqr.count({
      where: { ...whereClause, status: { in: ['Nuevo', 'En revisión', 'Pendiente'] } }
    });

    const enProceso = await prisma.pqr.count({
      where: { ...whereClause, status: 'En proceso' }
    });

    const resueltas = await prisma.pqr.count({
      where: { ...whereClause, status: { in: ['Resuelto', 'Cerrado'] } }
    });

    const now = new Date();
    const vencidas = await prisma.pqr.count({
      where: {
        ...whereClause,
        status: { notIn: ['Resuelto', 'Cerrado'] },
        responseDeadline: { lt: now }
      }
    });

    // Tiempo promedio de respuesta en días
    const closedPqrs = await prisma.pqr.findMany({
      where: { status: { in: ['Resuelto', 'Cerrado'] } },
      select: { createdAt: true, updatedAt: true }
    });

    let avgResponseDays = 0;
    if (closedPqrs.length > 0) {
      const totalDiffMs = closedPqrs.reduce((acc, curr) => {
        return acc + (new Date(curr.updatedAt) - new Date(curr.createdAt));
      }, 0);
      avgResponseDays = (totalDiffMs / (closedPqrs.length * 1000 * 60 * 60 * 24)).toFixed(1);
    }

    // Distribución por Tipo
    const byTypeRaw = await prisma.pqr.groupBy({
      by: ['type'],
      _count: { type: true },
      where: whereClause
    });

    const byType = byTypeRaw.map((item) => ({
      name: item.type,
      count: item._count.type
    }));

    // Distribución por Estado
    const byStatusRaw = await prisma.pqr.groupBy({
      by: ['status'],
      _count: { status: true },
      where: whereClause
    });

    const byStatus = byStatusRaw.map((item) => ({
      name: item.status,
      count: item._count.status
    }));

    // Gráfico de evolución mensual (Últimos 12 meses)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth();

      const startMonth = new Date(y, m, 1);
      const endMonth = new Date(y, m + 1, 1);

      const count = await prisma.pqr.count({
        where: {
          createdAt: { gte: startMonth, lt: endMonth }
        }
      });

      const monthName = startMonth.toLocaleString('es-CO', { month: 'short' });
      monthlyData.push({
        label: `${monthName.toUpperCase()} ${y}`,
        count
      });
    }

    res.json({
      success: true,
      data: {
        cards: {
          totalPqr,
          pendientes,
          enProceso,
          resueltas,
          vencidas,
          avgResponseDays: parseFloat(avgResponseDays)
        },
        charts: {
          byType,
          byStatus,
          monthlyData
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener lista filtrable de PQRs con paginación
 */
async function getPqrs(req, res, next) {
  try {
    const { search, status, type, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;

    if (search) {
      const s = search.trim();
      where.OR = [
        { radicado: { contains: s, mode: 'insensitive' } },
        { residentName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { apartment: { contains: s, mode: 'insensitive' } },
        { tower: { contains: s, mode: 'insensitive' } },
        { subject: { contains: s, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [pqrs, total] = await Promise.all([
      prisma.pqr.findMany({
        where,
        include: {
          attachments: true,
          observations: { orderBy: { createdAt: 'desc' } },
          historyLogs: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      }),
      prisma.pqr.count({ where })
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / take),
      data: pqrs
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cambiar estado de una PQR
 */
async function updatePqrStatus(req, res, next) {
  try {
    const { pqrId } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Nuevo', 'En revisión', 'En proceso', 'Pendiente', 'Resuelto', 'Cerrado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Estado no válido.' });
    }

    const pqr = await prisma.pqr.findUnique({ where: { id: pqrId } });
    if (!pqr) {
      return res.status(404).json({ success: false, error: 'PQR no encontrada.' });
    }

    const previousState = pqr.status;

    const updatedPqr = await prisma.pqr.update({
      where: { id: pqrId },
      data: { status }
    });

    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    // Registrar en auditoría
    await createAuditLog({
      pqrId: pqr.id,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CAMBIO_ESTADO',
      previousState,
      newState: status,
      notes: note || `Estado actualizado a ${status}`,
      ipAddress: clientIp
    });

    // Enviar correo de notificación
    sendPqrStatusUpdatedNotification(updatedPqr, previousState, status, note).catch((err) => console.error('Email error:', err));

    res.json({ success: true, data: updatedPqr });
  } catch (error) {
    next(error);
  }
}

/**
 * Agregar Observación (Pública o Privada)
 */
async function addObservation(req, res, next) {
  try {
    const { pqrId } = req.params;
    const { content, isPrivate } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'El contenido de la observación es obligatorio.' });
    }

    const pqr = await prisma.pqr.findUnique({ where: { id: pqrId } });
    if (!pqr) {
      return res.status(404).json({ success: false, error: 'PQR no encontrada.' });
    }

    const observation = await prisma.observation.create({
      data: {
        pqrId,
        authorName: req.user.name,
        content: content.trim(),
        isPrivate: Boolean(isPrivate)
      }
    });

    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    // Registrar auditoría
    await createAuditLog({
      pqrId,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: isPrivate ? 'OBSERVACION_PRIVADA' : 'RESPUESTA_OFICIAL',
      notes: content.trim(),
      ipAddress: clientIp
    });

    res.status(201).json({ success: true, data: observation });
  } catch (error) {
    next(error);
  }
}

/**
 * Reabrir un caso cerrado
 */
async function reopenPqr(req, res, next) {
  try {
    const { pqrId } = req.params;
    const { reason } = req.body;

    const pqr = await prisma.pqr.findUnique({ where: { id: pqrId } });
    if (!pqr) {
      return res.status(404).json({ success: false, error: 'PQR no encontrada.' });
    }

    const previousState = pqr.status;

    const updatedPqr = await prisma.pqr.update({
      where: { id: pqrId },
      data: { status: 'En proceso' }
    });

    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    await createAuditLog({
      pqrId,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'REAPERTURA_CASO',
      previousState,
      newState: 'En proceso',
      notes: reason || 'Reapertura del caso por el administrador',
      ipAddress: clientIp
    });

    res.json({ success: true, data: updatedPqr });
  } catch (error) {
    next(error);
  }
}

/**
 * Exportar PQRs a Excel (.xlsx)
 */
async function exportExcel(req, res, next) {
  try {
    const pqrs = await prisma.pqr.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PQRs Comité Convivencia');

    worksheet.columns = [
      { header: 'Radicado', key: 'radicado', width: 22 },
      { header: 'Fecha Radicación', key: 'createdAt', width: 20 },
      { header: 'Solicitante', key: 'residentName', width: 25 },
      { header: 'Torre', key: 'tower', width: 10 },
      { header: 'Apartamento', key: 'apartment', width: 14 },
      { header: 'Correo', key: 'email', width: 28 },
      { header: 'Teléfono', key: 'phone', width: 16 },
      { header: 'Tipo', key: 'type', width: 16 },
      { header: 'Asunto', key: 'subject', width: 30 },
      { header: 'Estado', key: 'status', width: 16 },
      { header: 'Fecha Límite', key: 'responseDeadline', width: 20 },
    ];

    // Estilo para el encabezado
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0288D1' }
    };

    pqrs.forEach((pqr) => {
      worksheet.addRow({
        radicado: pqr.radicado,
        createdAt: new Date(pqr.createdAt).toLocaleString('es-CO'),
        residentName: pqr.residentName,
        tower: pqr.tower,
        apartment: pqr.apartment,
        email: pqr.email,
        phone: pqr.phone,
        type: pqr.type,
        subject: pqr.subject,
        status: pqr.status,
        responseDeadline: pqr.responseDeadline ? new Date(pqr.responseDeadline).toLocaleDateString('es-CO') : 'N/A'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Reporte_PQRs_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * Gestión de Usuarios del Comité
 */
async function getUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Ya existe un usuario con este correo electrónico.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role || 'COMMITTEE',
        active: true
      },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { name, role, active, password } = req.body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name.trim();
    if (role) dataToUpdate.role = role;
    if (typeof active === 'boolean') dataToUpdate.active = active;

    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
}

/**
 * Gestión del Catálogo (Admin)
 */
async function getCatalogAdmin(req, res, next) {
  try {
    const areas = await prisma.pqrArea.findMany({
      include: {
        categories: {
          include: {
            motives: { orderBy: { order: 'asc' } }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    res.json({ success: true, data: areas });
  } catch (error) {
    next(error);
  }
}

async function createArea(req, res, next) {
  try {
    const { name, pqrType, order } = req.body;
    const area = await prisma.pqrArea.create({
      data: { name, pqrType, order: order || 0 }
    });
    res.status(201).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
}

async function updateArea(req, res, next) {
  try {
    const { id } = req.params;
    const { name, pqrType, active, order } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (pqrType !== undefined) data.pqrType = pqrType;
    if (typeof active === 'boolean') data.active = active;
    if (order !== undefined) data.order = order;

    const area = await prisma.pqrArea.update({
      where: { id },
      data
    });
    res.json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
}

async function deleteArea(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.pqrArea.delete({ where: { id } });
    res.json({ success: true, message: 'Área eliminada' });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, areaId, order } = req.body;
    const category = await prisma.pqrCategory.create({
      data: { name, areaId, order: order || 0 }
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, active, order } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (typeof active === 'boolean') data.active = active;
    if (order !== undefined) data.order = order;

    const category = await prisma.pqrCategory.update({
      where: { id },
      data
    });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.pqrCategory.delete({ where: { id } });
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) {
    next(error);
  }
}

async function createMotive(req, res, next) {
  try {
    const { name, categoryId, order } = req.body;
    const motive = await prisma.pqrMotive.create({
      data: { name, categoryId, order: order || 0 }
    });
    res.status(201).json({ success: true, data: motive });
  } catch (error) {
    next(error);
  }
}

async function updateMotive(req, res, next) {
  try {
    const { id } = req.params;
    const { name, active, order } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (typeof active === 'boolean') data.active = active;
    if (order !== undefined) data.order = order;

    const motive = await prisma.pqrMotive.update({
      where: { id },
      data
    });
    res.json({ success: true, data: motive });
  } catch (error) {
    next(error);
  }
}

async function deleteMotive(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.pqrMotive.delete({ where: { id } });
    res.json({ success: true, message: 'Motivo eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
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
};
