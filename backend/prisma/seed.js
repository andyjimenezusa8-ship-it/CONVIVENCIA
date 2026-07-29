/**
 * Seed: Usuarios, Configuración y Catálogo completo de PQR
 * Estructura: Tipo → Área → Categoría → Motivo
 *
 * Reglas aplicadas:
 *  - Reemplaza catálogo anterior por completo
 *  - Cada categoría incluye el motivo "Otro"
 *  - Los motivos están ordenados alfabéticamente dentro de cada categoría
 *  - El catálogo se almacena en BD para administrarse desde el panel administrativo
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Catálogo completo ─────────────────────────────────────────────────────
const CATALOG = [
  // ═══════════════════════════════════════════════════════════════════════
  // PETICIONES
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Petición',
    areas: [
      {
        name: 'Información',
        categories: [
          {
            name: 'Información General',
            motives: [
              'Solicitud de información general',
              'Solicitud de reglamento de propiedad horizontal',
              'Solicitud del manual de convivencia',
              'Solicitud del reglamento interno',
              'Solicitud de horarios de atención',
              'Solicitud de directorio administrativo',
              'Solicitud de información jurídica',
              'Solicitud de información financiera',
              'Solicitud de información presupuestal',
              'Solicitud de información contractual',
            ],
          },
          {
            name: 'Documentos',
            motives: [
              'Copia de actas',
              'Copia de reglamento',
              'Copia de contrato',
              'Certificado de residencia',
              'Paz y salvo',
              'Estado de cuenta',
              'Certificación de pago',
              'Certificación administrativa',
              'Copia de comunicaciones',
              'Copia de resoluciones',
            ],
          },
          {
            name: 'Servicios',
            motives: [
              'Solicitud de poda',
              'Solicitud de jardinería',
              'Solicitud de fumigación',
              'Solicitud de lavado',
              'Solicitud de limpieza',
              'Solicitud de mantenimiento',
              'Solicitud de pintura',
              'Solicitud de reparación',
              'Solicitud de desinfección',
              'Solicitud de revisión eléctrica',
              'Solicitud de revisión hidráulica',
              'Solicitud de revisión de ascensor',
              'Solicitud de revisión de portón',
              'Solicitud de revisión de cámaras',
              'Solicitud de revisión de iluminación',
            ],
          },
          {
            name: 'Seguridad',
            motives: [
              'Solicitud de copia de video',
              'Solicitud de acompañamiento',
              'Solicitud de ingreso temporal',
              'Solicitud de autorización de visitante',
              'Solicitud de actualización de autorizados',
              'Solicitud de acceso vehicular',
              'Solicitud de revisión de seguridad',
              'Solicitud de control de acceso',
              'Solicitud de inspección de vigilancia',
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // QUEJAS
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Queja',
    areas: [
      {
        name: 'Administración',
        categories: [
          {
            name: 'Administración',
            motives: [
              'Mala atención',
              'Atención irrespetuosa',
              'Demora en responder',
              'No responden correos',
              'No responden llamadas',
              'Información incorrecta',
              'Incumplimiento de compromisos',
              'Mala gestión',
              'Falta de seguimiento',
              'Incumplimiento del reglamento',
              'Negligencia administrativa',
              'Trámite excesivamente demorado',
              'Pérdida de documentos',
              'Falta de comunicación',
            ],
          },
        ],
      },
      {
        name: 'Vigilancia',
        categories: [
          {
            name: 'Vigilancia',
            motives: [
              'Mal trato',
              'Vigilante grosero',
              'No registra visitantes',
              'Permite ingreso no autorizado',
              'No realiza rondas',
              'Uso excesivo del celular',
              'Dormido en turno',
              'Abandono del puesto',
              'Incumplimiento de protocolos',
              'Mala presentación',
            ],
          },
        ],
      },
      {
        name: 'Aseo',
        categories: [
          {
            name: 'Aseo',
            motives: [
              'Basuras acumuladas',
              'Mal olor',
              'Mala limpieza',
              'Canecas llenas',
              'Jardines descuidados',
              'Baños sucios',
              'Pasillos sucios',
              'Ascensores sucios',
              'Parqueaderos sucios',
              'Falta de aseo',
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // RECLAMOS
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Reclamo',
    areas: [
      {
        name: 'Facturación',
        categories: [
          {
            name: 'Facturación',
            motives: [
              'Cobro indebido',
              'Doble cobro',
              'Cobro duplicado',
              'Pago no registrado',
              'Pago duplicado',
              'Error en factura',
              'Error en extracto',
              'Error en saldo',
              'Error en intereses',
              'Cobro de mora injustificado',
              'Cobro de administración incorrecto',
              'Cobro extraordinario incorrecto',
              'Cobro de parqueadero',
              'Cobro de depósito',
              'Cobro por daños',
              'Cobro sin soporte',
              'Multa incorrecta',
              'Descuento no aplicado',
              'Liquidación incorrecta',
              'Inconsistencia en cartera',
            ],
          },
        ],
      },
      {
        name: 'Administración',
        categories: [
          {
            name: 'Administración',
            motives: [
              'Incumplimiento de contrato',
              'Reparación sin ejecutar',
              'Garantía incumplida',
              'Daño sin solucionar',
              'Incumplimiento de acuerdos',
              'Servicio no prestado',
              'Mala ejecución de mantenimiento',
              'Negación injustificada del servicio',
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SUGERENCIAS
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Sugerencia',
    areas: [
      {
        name: 'Seguridad',
        categories: [
          {
            name: 'Seguridad',
            motives: [
              'Más cámaras',
              'Más vigilancia',
              'Botón de pánico',
              'Alarmas comunitarias',
              'Mejor control de acceso',
              'Lector biométrico',
              'Mejor iluminación',
            ],
          },
        ],
      },
      {
        name: 'Bienestar',
        categories: [
          {
            name: 'Bienestar',
            motives: [
              'Eventos familiares',
              'Cine al parque',
              'Actividades infantiles',
              'Actividades para adultos mayores',
              'Clases deportivas',
              'Biblioteca',
              'Coworking',
              'Huerta comunitaria',
              'Zona de picnic',
            ],
          },
        ],
      },
      {
        name: 'Infraestructura',
        categories: [
          {
            name: 'Infraestructura',
            motives: [
              'Remodelación de zonas comunes',
              'Nuevos juegos infantiles',
              'Parque para mascotas',
              'Zona BBQ',
              'Bicicleteros',
              'Estaciones de carga para vehículos eléctricos',
              'WiFi en zonas comunes',
              'Gimnasio',
              'Mejorar salón comunal',
            ],
          },
        ],
      },
      {
        name: 'Ambiental',
        categories: [
          {
            name: 'Ambiental',
            motives: [
              'Programa de reciclaje',
              'Compostaje',
              'Más árboles',
              'Jardines',
              'Captación de agua lluvia',
              'Energía solar',
              'Puntos ecológicos',
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CONVIVENCIA
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Convivencia',
    areas: [
      {
        name: 'Ruido',
        categories: [
          {
            name: 'Ruido',
            motives: [
              'Música a alto volumen',
              'Fiestas',
              'Gritos',
              'Televisor alto volumen',
              'Instrumentos musicales',
              'Obras ruidosas',
              'Electrodomésticos ruidosos',
              'Reuniones nocturnas',
              'Ruido de vehículos',
              'Ruido constante',
            ],
          },
        ],
      },
      {
        name: 'Mascotas',
        categories: [
          {
            name: 'Mascotas',
            motives: [
              'Excrementos',
              'Ladridos constantes',
              'Mascota sin correa',
              'Mascota agresiva',
              'Daños ocasionados',
              'Maltrato animal',
              'Mascotas en zonas restringidas',
              'Incumplimiento del reglamento',
              'Alimentación de animales callejeros',
            ],
          },
        ],
      },
      {
        name: 'Parqueaderos',
        categories: [
          {
            name: 'Parqueaderos',
            motives: [
              'Parqueo indebido',
              'Ocupa parqueadero ajeno',
              'Vehículo abandonado',
              'Bloquea salida',
              'Parquea en zonas comunes',
              'Parquea sobre andén',
              'Motocicletas mal estacionadas',
              'Bicicletas mal ubicadas',
            ],
          },
        ],
      },
      {
        name: 'Basuras',
        categories: [
          {
            name: 'Basuras',
            motives: [
              'Basura fuera del horario',
              'Mala separación',
              'Escombros',
              'Muebles abandonados',
              'Basura en pasillos',
              'Basura en ascensor',
              'Basura en parqueadero',
              'Desechos de mascotas',
            ],
          },
        ],
      },
      {
        name: 'Comportamiento',
        categories: [
          {
            name: 'Comportamiento',
            motives: [
              'Agresión verbal',
              'Amenazas',
              'Acoso',
              'Discriminación',
              'Intimidación',
              'Violencia física',
              'Irrespeto',
              'Hostigamiento',
              'Peleas',
              'Escándalos',
            ],
          },
        ],
      },
      {
        name: 'Niños y adolescentes',
        categories: [
          {
            name: 'Niños y adolescentes',
            motives: [
              'Juegos peligrosos',
              'Balones en zonas prohibidas',
              'Patinetas',
              'Bicicletas en pasillos',
              'Daños a jardines',
              'Daños a zonas comunes',
              'Uso indebido del ascensor',
            ],
          },
        ],
      },
      {
        name: 'Obras',
        categories: [
          {
            name: 'Obras',
            motives: [
              'Obra sin autorización',
              'Obra fuera del horario',
              'Exceso de ruido',
              'Polvo',
              'Escombros',
              'Materiales en pasillos',
              'Contratistas sin registrar',
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ADMINISTRACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  {
    pqrType: 'Administración',
    areas: [
      {
        name: 'Facturación y Cartera',
        categories: [
          {
            name: 'Facturación y Cartera',
            motives: [
              'Cobro indebido',
              'Doble cobro',
              'Pago no aplicado',
              'Pago duplicado',
              'Error en extracto',
              'Error en intereses',
              'Error en saldo',
              'Error en factura',
              'Mora injustificada',
              'Cartera incorrecta',
              'Paz y salvo incorrecto',
              'Devolución de dinero',
              'Acuerdo de pago',
              'Refinanciación de deuda',
            ],
          },
        ],
      },
      {
        name: 'Documentación',
        categories: [
          {
            name: 'Documentación',
            motives: [
              'Certificados',
              'Copia de actas',
              'Reglamentos',
              'Contratos',
              'Estados de cuenta',
              'Paz y salvo',
              'Correspondencia',
            ],
          },
        ],
      },
      {
        name: 'Mantenimiento',
        categories: [
          {
            name: 'Mantenimiento',
            motives: [
              'Ascensores',
              'Portones',
              'Piscina',
              'Gimnasio',
              'Iluminación',
              'Jardines',
              'Tuberías',
              'Techos',
              'Fachadas',
              'Pintura',
              'Citófono',
              'CCTV',
            ],
          },
        ],
      },
      {
        name: 'Seguridad',
        categories: [
          {
            name: 'Seguridad',
            motives: [
              'Cámaras dañadas',
              'Vigilancia insuficiente',
              'Alarmas',
              'Control de acceso',
              'Puertas',
              'Rejas',
              'Objetos perdidos',
              'Hurto',
              'Intento de hurto',
            ],
          },
        ],
      },
      {
        name: 'Asambleas',
        categories: [
          {
            name: 'Asambleas',
            motives: [
              'Convocatorias',
              'Actas',
              'Consejo de Administración',
              'Comité de Convivencia',
              'Revisor Fiscal',
              'Presupuesto',
              'Rendición de cuentas',
            ],
          },
        ],
      },
      {
        name: 'Trámites',
        categories: [
          {
            name: 'Trámites',
            motives: [
              'Cambio de propietario',
              'Cambio de residente',
              'Registro de arrendatario',
              'Registro de mascota',
              'Registro de vehículo',
              'Mudanza',
              'Reserva de salón comunal',
              'Reserva de BBQ',
              'Solicitud de llave',
              'Solicitud de tarjeta',
              'Solicitud de control remoto',
              'Permisos especiales',
              'Actualización de datos',
            ],
          },
        ],
      },
    ],
  },
];

// ─── Función principal ─────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Iniciando sembrado de datos (Seed)...');

  // ── 1. Usuario Administrador ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@parquesdealejandria.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin2026!';
  const adminName = process.env.ADMIN_DEFAULT_NAME || 'Administrador Convivencia';

  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await prisma.user.create({
      data: { name: adminName, email: adminEmail, passwordHash, role: 'ADMIN', active: true },
    });
    console.log(`✅ Usuario administrador creado: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Usuario administrador ya existe: ${adminEmail}`);
  }

  // ── 2. Configuración del sistema ──────────────────────────────────────
  const existingSettings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
  if (!existingSettings) {
    await prisma.systemSettings.create({
      data: {
        id: 'default',
        ensembleName: 'Conjunto Residencial Parques de Alejandría',
        entityName: 'Comité de Convivencia',
        contactEmail: 'convivencia@parquesdealejandria.com',
        responseDaysLimit: 15,
        primaryRed: '#D32F2F',
        primaryGreen: '#4CAF50',
        primaryBlue: '#0288D1',
        primaryYellow: '#FBC02D',
      },
    });
    console.log('✅ Configuración del sistema inicializada.');
  } else {
    console.log('ℹ️  Configuración del sistema ya existe.');
  }

  // ── 3. Limpiar Catálogo anterior e Insertar Catálogo Oficial Ampliado ──
  console.log('\n📚 Limpiando catálogo previo e insertando catálogo oficial...');

  await prisma.pqrMotive.deleteMany({});
  await prisma.pqrCategory.deleteMany({});
  await prisma.pqrArea.deleteMany({});

  let totalAreas = 0;
  let totalCategories = 0;
  let totalMotives = 0;

  for (const typeBlock of CATALOG) {
    console.log(`\n  Tipo: ${typeBlock.pqrType}`);

    for (let aIdx = 0; aIdx < typeBlock.areas.length; aIdx++) {
      const areaDef = typeBlock.areas[aIdx];

      const area = await prisma.pqrArea.create({
        data: {
          name: areaDef.name,
          pqrType: typeBlock.pqrType,
          active: true,
          order: aIdx,
        },
      });
      totalAreas++;
      console.log(`    + Área: ${area.name}`);

      for (let cIdx = 0; cIdx < areaDef.categories.length; cIdx++) {
        const catDef = areaDef.categories[cIdx];

        const category = await prisma.pqrCategory.create({
          data: {
            name: catDef.name,
            areaId: area.id,
            active: true,
            order: cIdx,
          },
        });
        totalCategories++;

        // Garantizar que "Otro" esté incluido y los motivos estén ordenados alfabéticamente
        const motiveSet = new Set(catDef.motives);
        motiveSet.add('Otro');

        const motiveSorted = Array.from(motiveSet).sort((a, b) =>
          a.localeCompare(b, 'es', { sensitivity: 'base' })
        );

        for (let mIdx = 0; mIdx < motiveSorted.length; mIdx++) {
          const motiveName = motiveSorted[mIdx];

          await prisma.pqrMotive.create({
            data: {
              name: motiveName,
              categoryId: category.id,
              active: true,
              order: mIdx,
            },
          });
          totalMotives++;
        }
      }
    }
  }

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅ Áreas creadas:      ${totalAreas}`);
  console.log(`✅ Categorías creadas: ${totalCategories}`);
  console.log(`✅ Motivos creados:    ${totalMotives}`);
  console.log('🌱 Sembrado finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
