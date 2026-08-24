const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Determinar la ruta absoluta o relativa de la base de datos SQLite dev.db
const dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')
  ? process.env.DATABASE_URL
  : 'file:./dev.db';

process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

module.exports = prisma;
