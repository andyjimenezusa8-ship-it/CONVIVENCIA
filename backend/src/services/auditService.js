const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Registra una entrada inmutable de auditoría en la base de datos
 */
async function createAuditLog({
  pqrId,
  userId = null,
  userName = 'Sistema / Residente',
  userRole = 'RESIDENT',
  action,
  previousState = null,
  newState = null,
  notes = null,
  ipAddress = null,
}) {
  try {
    const log = await prisma.historyLog.create({
      data: {
        pqrId,
        userId,
        userName,
        userRole,
        action,
        previousState,
        newState,
        notes,
        ipAddress,
      },
    });
    return log;
  } catch (error) {
    console.error('Error registrando auditoría:', error.message);
  }
}

module.exports = {
  createAuditLog,
};
