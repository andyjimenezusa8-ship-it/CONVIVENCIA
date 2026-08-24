const prisma = require('../prisma');
const path = require('path');
const fs = require('fs');
const { generateRadicado } = require('../services/radicadoService');
const { generatePqrPdf } = require('../services/pdfService');
const { sendPqrCreatedNotification } = require('../services/emailService');
const { createAuditLog } = require('../services/auditService');

/**
 * Crear nueva PQR (Público)
 */
async function createPqr(req, res, next) {
  try {
    let {
      residentName,
      firstName,
      lastName,
      tower,
      apartment,
      email,
      phone,
      type,
      subject,
      description,
    } = req.body;

    if (!residentName && (firstName || lastName)) {
      residentName = `${firstName || ''} ${lastName || ''}`.trim();
    }

    if (!residentName || !tower || !apartment || !email || !phone || !type || !subject || !description) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos obligatorios deben ser diligenciados.'
      });
    }

    // Generar código de radicado único
    const radicado = await generateRadicado();

    // Obtener días límites de la configuración
    const settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    const limitDays = settings ? settings.responseDaysLimit : 15;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + limitDays);

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Desconocido';

    // Preparar adjuntos si existen
    const files = req.files || [];
    const attachmentData = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      filepath: file.path,
    }));

    // Crear PQR en transacción con adjuntos y auditoría
    const pqr = await prisma.pqr.create({
      data: {
        radicado,
        residentName: residentName.trim(),
        tower: tower.trim(),
        apartment: apartment.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        type,
        subject: subject.trim(),
        description: description.trim(),
        status: 'Nuevo',
        ipAddress: clientIp,
        userAgent: userAgent,
        responseDeadline: deadline,
        attachments: {
          create: attachmentData
        }
      },
      include: {
        attachments: true
      }
    });

    // Registrar en auditoría
    await createAuditLog({
      pqrId: pqr.id,
      userName: pqr.residentName,
      userRole: 'RESIDENTE',
      action: 'CREACION',
      newState: 'Nuevo',
      notes: `PQR creada por el residente desde IP: ${clientIp}`,
      ipAddress: clientIp
    });

    // Generar PDF y notificar por correo
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const pdfBuffer = await generatePqrPdf(pqr, appUrl);

    // Enviar correos en segundo plano para no bloquear respuesta al cliente
    sendPqrCreatedNotification(pqr, pdfBuffer).catch((err) => console.error('Error background email:', err));

    res.status(201).json({
      success: true,
      data: {
        id: pqr.id,
        radicado: pqr.radicado,
        status: pqr.status,
        createdAt: pqr.createdAt,
        responseDeadline: pqr.responseDeadline,
        attachmentsCount: pqr.attachments.length
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Buscar PQR por Radicado, Correo o Apartamento (Público)
 */
async function searchPqr(req, res, next) {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Debe ingresar un criterio de búsqueda (Radicado, Correo o Apartamento).' });
    }

    const searchTerm = query.trim();

    const pqrs = await prisma.pqr.findMany({
      where: {
        OR: [
          { radicado: { equals: searchTerm, mode: 'insensitive' } },
          { email: { equals: searchTerm, mode: 'insensitive' } },
          { apartment: { equals: searchTerm, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        radicado: true,
        residentName: true,
        tower: true,
        apartment: true,
        email: true,
        type: true,
        subject: true,
        description: true,
        status: true,
        createdAt: true,
        responseDeadline: true,
        attachments: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        },
        observations: {
          where: { isPrivate: false },
          select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        historyLogs: {
          select: {
            id: true,
            action: true,
            previousState: true,
            newState: true,
            notes: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: pqrs.length, data: pqrs });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener PQR individual por Radicado (Público)
 */
async function getPqrByRadicado(req, res, next) {
  try {
    const { radicado } = req.params;

    const pqr = await prisma.pqr.findUnique({
      where: { radicado: radicado.trim() },
      include: {
        attachments: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        },
        observations: {
          where: { isPrivate: false },
          orderBy: { createdAt: 'desc' }
        },
        historyLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!pqr) {
      return res.status(404).json({ success: false, error: 'No se encontró ninguna PQR con el radicado proporcionado.' });
    }

    res.json({ success: true, data: pqr });
  } catch (error) {
    next(error);
  }
}

/**
 * Descargar PDF Oficial de la PQR
 */
async function downloadPqrPdf(req, res, next) {
  try {
    const { radicado } = req.params;

    const pqr = await prisma.pqr.findUnique({
      where: { radicado: radicado.trim() },
      include: { attachments: true }
    });

    if (!pqr) {
      return res.status(404).json({ success: false, error: 'Radicado no encontrado.' });
    }

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const pdfBuffer = await generatePqrPdf(pqr, appUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Comprobante-${pqr.radicado}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

/**
 * Descargar archivo adjunto por ID
 */
async function downloadAttachment(req, res, next) {
  try {
    const { attachmentId } = req.params;

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId }
    });

    if (!attachment) {
      return res.status(404).json({ success: false, error: 'Archivo no encontrado.' });
    }

    const absolutePath = path.resolve(attachment.filepath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: 'El archivo físico no existe en el servidor.' });
    }

    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.originalName)}"`);
    res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener catálogo jerárquico de PQRs
 */
async function getCatalog(req, res, next) {
  try {
    const areas = await prisma.pqrArea.findMany({
      where: { active: true },
      include: {
        categories: {
          where: { active: true },
          include: {
            motives: {
              where: { active: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    const types = {};
    areas.forEach(area => {
      if (!types[area.pqrType]) {
        types[area.pqrType] = { areas: [] };
      }
      types[area.pqrType].areas.push({
        id: area.id,
        name: area.name,
        categories: area.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          motives: cat.motives.map(mot => ({
            id: mot.id,
            name: mot.name
          }))
        }))
      });
    });

    // Fallback si la base de datos no tiene catálogo registrado aún
    if (Object.keys(types).length === 0) {
      const defaultCatalog = {
        Petición: {
          areas: [
            {
              id: 'def-1',
              name: 'Información y Trámites',
              categories: [
                {
                  id: 'def-cat-1',
                  name: 'Información General',
                  motives: [
                    { id: 'm1', name: 'Solicitud de información general' },
                    { id: 'm2', name: 'Solicitud de manual de convivencia' },
                    { id: 'm3', name: 'Certificado de residencia / Paz y salvo' },
                    { id: 'm4', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        },
        Queja: {
          areas: [
            {
              id: 'def-2',
              name: 'Administración y Servicios',
              categories: [
                {
                  id: 'def-cat-2',
                  name: 'Atención al Residente',
                  motives: [
                    { id: 'm5', name: 'Demora en respuesta a solicitudes' },
                    { id: 'm6', name: 'Atención en portería o vigilancia' },
                    { id: 'm7', name: 'Inconformidad con aseo o zonas comunes' },
                    { id: 'm8', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        },
        Reclamo: {
          areas: [
            {
              id: 'def-3',
              name: 'Facturación y Mantenimiento',
              categories: [
                {
                  id: 'def-cat-3',
                  name: 'Cuentas y Reparaciones',
                  motives: [
                    { id: 'm9', name: 'Inconsistencia o error en factura de administración' },
                    { id: 'm10', name: 'Daño en zona común sin solucionar' },
                    { id: 'm11', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        },
        Sugerencia: {
          areas: [
            {
              id: 'def-4',
              name: 'Mejoras de la Copropiedad',
              categories: [
                {
                  id: 'def-cat-4',
                  name: 'Propuestas de Mejora',
                  motives: [
                    { id: 'm12', name: 'Propuesta para seguridad o iluminación' },
                    { id: 'm13', name: 'Propuesta para zonas verdes / parque infantil' },
                    { id: 'm14', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        },
        Convivencia: {
          areas: [
            {
              id: 'def-5',
              name: 'Ruido y Perturbación',
              categories: [
                {
                  id: 'def-cat-5',
                  name: 'Convivencia Ciudadana',
                  motives: [
                    { id: 'm15', name: 'Música o ruidos a alto volumen en horario nocturno' },
                    { id: 'm16', name: 'Obras ruidosas fuera de horario' },
                    { id: 'm17', name: 'Otro' },
                  ]
                }
              ]
            },
            {
              id: 'def-6',
              name: 'Mascotas',
              categories: [
                {
                  id: 'def-cat-6',
                  name: 'Tenencia de Mascotas',
                  motives: [
                    { id: 'm18', name: 'No recolección de excrementos' },
                    { id: 'm19', name: 'Mascota suelta sin correa' },
                    { id: 'm20', name: 'Ladridos continuos' },
                    { id: 'm21', name: 'Otro' },
                  ]
                }
              ]
            },
            {
              id: 'def-7',
              name: 'Parqueaderos',
              categories: [
                {
                  id: 'def-cat-7',
                  name: 'Uso de Parqueaderos',
                  motives: [
                    { id: 'm22', name: 'Parqueo en celda ajena' },
                    { id: 'm23', name: 'Bloqueo de vías de circulación' },
                    { id: 'm24', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        },
        Administración: {
          areas: [
            {
              id: 'def-8',
              name: 'Zonas Comunes',
              categories: [
                {
                  id: 'def-cat-8',
                  name: 'Gestión de Áreas Comunes',
                  motives: [
                    { id: 'm25', name: 'Reserva de salón social / BBQ' },
                    { id: 'm26', name: 'Permisos de mudanza' },
                    { id: 'm27', name: 'Otro' },
                  ]
                }
              ]
            }
          ]
        }
      };
      return res.json({ success: true, data: { types: defaultCatalog } });
    }

    res.json({ success: true, data: { types } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPqr,
  searchPqr,
  getPqrByRadicado,
  downloadPqrPdf,
  downloadAttachment,
  getCatalog
};
