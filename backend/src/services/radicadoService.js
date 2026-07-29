const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Genera un código de radicado único, correlativo por día y seguro ante concurrencia.
 * Formato: PPA-YYYYMMDD-000001
 */
async function generateRadicado() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const result = await prisma.$transaction(async (tx) => {
    // Buscar o crear la secuencia del día
    const seqRecord = await tx.dailySequence.upsert({
      where: { date: dateStr },
      update: { seq: { increment: 1 } },
      create: { date: dateStr, seq: 1 }
    });

    const paddedSeq = String(seqRecord.seq).padStart(6, '0');
    return `PPA-${dateStr}-${paddedSeq}`;
  });

  return result;
}

module.exports = {
  generateRadicado
};
