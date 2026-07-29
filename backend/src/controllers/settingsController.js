const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSettings(req, res, next) {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: 'default',
          ensembleName: 'Conjunto Residencial Parques de Alejandría',
          entityName: 'Comité de Convivencia',
          contactEmail: 'convivencia@parquesdealejandria.com',
          responseDaysLimit: 15,
          primaryRed: '#D32F2F',
          primaryGreen: '#4CAF50',
          primaryBlue: '#0288D1',
          primaryYellow: '#FBC02D'
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const {
      ensembleName,
      entityName,
      contactEmail,
      responseDaysLimit,
      primaryRed,
      primaryGreen,
      primaryBlue,
      primaryYellow
    } = req.body;

    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(ensembleName && { ensembleName }),
        ...(entityName && { entityName }),
        ...(contactEmail && { contactEmail }),
        ...(responseDaysLimit && { responseDaysLimit: parseInt(responseDaysLimit, 10) }),
        ...(primaryRed && { primaryRed }),
        ...(primaryGreen && { primaryGreen }),
        ...(primaryBlue && { primaryBlue }),
        ...(primaryYellow && { primaryYellow }),
      },
      create: {
        id: 'default',
        ensembleName: ensembleName || 'Conjunto Residencial Parques de Alejandría',
        entityName: entityName || 'Comité de Convivencia',
        contactEmail: contactEmail || 'convivencia@parquesdealejandria.com',
        responseDaysLimit: responseDaysLimit ? parseInt(responseDaysLimit, 10) : 15,
        primaryRed: primaryRed || '#D32F2F',
        primaryGreen: primaryGreen || '#4CAF50',
        primaryBlue: primaryBlue || '#0288D1',
        primaryYellow: primaryYellow || '#FBC02D'
      }
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings
};
