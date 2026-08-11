// Catálogo por defecto para PQR (Fallback si la BD aún no ha sido poblada)
export const DEFAULT_CATALOG = {
  Petición: {
    areas: [
      {
        id: 'pet-inf',
        name: 'Información',
        categories: [
          {
            id: 'pet-inf-gen',
            name: 'Información General',
            motives: [
              { id: 'm1', name: 'Solicitud de información general' },
              { id: 'm2', name: 'Solicitud de reglamento de propiedad horizontal' },
              { id: 'm3', name: 'Solicitud del manual de convivencia' },
              { id: 'm4', name: 'Solicitud de horarios de atención' },
              { id: 'm5', name: 'Solicitud de directorio administrativo' },
              { id: 'm6', name: 'Solicitud de información financiera' },
              { id: 'm7', name: 'Otro' },
            ],
          },
          {
            id: 'pet-inf-doc',
            name: 'Documentos',
            motives: [
              { id: 'm8', name: 'Copia de actas' },
              { id: 'm9', name: 'Copia de reglamento' },
              { id: 'm10', name: 'Certificado de residencia' },
              { id: 'm11', name: 'Paz y salvo' },
              { id: 'm12', name: 'Estado de cuenta' },
              { id: 'm13', name: 'Certificación administrativa' },
              { id: 'm14', name: 'Otro' },
            ],
          },
          {
            id: 'pet-inf-serv',
            name: 'Servicios',
            motives: [
              { id: 'm15', name: 'Solicitud de mantenimiento' },
              { id: 'm16', name: 'Solicitud de poda o jardinería' },
              { id: 'm17', name: 'Solicitud de fumigación' },
              { id: 'm18', name: 'Solicitud de reparación de ascensores' },
              { id: 'm19', name: 'Solicitud de revisión de portón' },
              { id: 'm20', name: 'Solicitud de revisión de citofonía / iluminación' },
              { id: 'm21', name: 'Otro' },
            ],
          },
          {
            id: 'pet-inf-seg',
            name: 'Seguridad',
            motives: [
              { id: 'm22', name: 'Solicitud de copia de video de cámaras (CCTV)' },
              { id: 'm23', name: 'Solicitud de actualización de autorizados' },
              { id: 'm24', name: 'Solicitud de acceso vehicular / chips' },
              { id: 'm25', name: 'Solicitud de inspección de vigilancia' },
              { id: 'm26', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
  Queja: {
    areas: [
      {
        id: 'que-admin',
        name: 'Administración',
        categories: [
          {
            id: 'que-admin-cat',
            name: 'Gestión Administrativa',
            motives: [
              { id: 'mq1', name: 'Mala atención o atención irrespetuosa' },
              { id: 'mq2', name: 'Demora en responder solicitudes o correos' },
              { id: 'mq3', name: 'Incumplimiento de compromisos' },
              { id: 'mq4', name: 'Falta de seguimiento a casos de convivencia' },
              { id: 'mq5', name: 'Trámite excesivamente demorado' },
              { id: 'mq6', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'que-vig',
        name: 'Vigilancia',
        categories: [
          {
            id: 'que-vig-cat',
            name: 'Servicio de Vigilancia',
            motives: [
              { id: 'mq7', name: 'Mal trato por parte del vigilante' },
              { id: 'mq8', name: 'No registro o descuido en ingreso de visitantes' },
              { id: 'mq9', name: 'Permite ingreso no autorizado' },
              { id: 'mq10', name: 'Abandono del puesto o distraído con celular' },
              { id: 'mq11', name: 'Incumplimiento de protocolos de seguridad' },
              { id: 'mq12', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'que-aseo',
        name: 'Aseo y Limpieza',
        categories: [
          {
            id: 'que-aseo-cat',
            name: 'Aseo de Zonas Comunes',
            motives: [
              { id: 'mq13', name: 'Basuras acumuladas o mala disposición' },
              { id: 'mq14', name: 'Pasillos o ascensores sucios' },
              { id: 'mq15', name: 'Falta de aseo en parqueaderos' },
              { id: 'mq16', name: 'Jardines o zonas verdes descuidadas' },
              { id: 'mq17', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
  Reclamo: {
    areas: [
      {
        id: 'rec-fact',
        name: 'Facturación y Cartera',
        categories: [
          {
            id: 'rec-fact-cat',
            name: 'Facturación',
            motives: [
              { id: 'mr1', name: 'Cobro indebido o doble cobro de cuota' },
              { id: 'mr2', name: 'Pago realizado no registrado en estado de cuenta' },
              { id: 'mr3', name: 'Error en cálculo de intereses de mora' },
              { id: 'mr4', name: 'Cobro extraordinario o multa incorrecta' },
              { id: 'mr5', name: 'Inconsistencia en saldo de cartera' },
              { id: 'mr6', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'rec-admin',
        name: 'Mantenimiento y Reparaciones',
        categories: [
          {
            id: 'rec-admin-cat',
            name: 'Reparaciones',
            motives: [
              { id: 'mr7', name: 'Reparación en zona común no ejecutada' },
              { id: 'mr8', name: 'Garantía de obra/mantenimiento incumplida' },
              { id: 'mr9', name: 'Daño en zona común o fachada sin solucionar' },
              { id: 'mr10', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
  Sugerencia: {
    areas: [
      {
        id: 'sug-seg',
        name: 'Seguridad',
        categories: [
          {
            id: 'sug-seg-cat',
            name: 'Mejoras de Seguridad',
            motives: [
              { id: 'ms1', name: 'Instalación de más cámaras de seguridad' },
              { id: 'ms2', name: 'Mejora en control de acceso vehicular o peatonal' },
              { id: 'ms3', name: 'Refuerzo de iluminación en parqueaderos o zonas oscuras' },
              { id: 'ms4', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'sug-inf',
        name: 'Infraestructura y Zonas Comunes',
        categories: [
          {
            id: 'sug-inf-cat',
            name: 'Remodelación y Zonas Verdes',
            motives: [
              { id: 'ms5', name: 'Mejora o adecuación del parque infantil / zona mascotas' },
              { id: 'ms6', name: 'Adecuación de bicicleteros' },
              { id: 'ms7', name: 'Mejoras en salón social o zona BBQ' },
              { id: 'ms8', name: 'Proyectos ambientales / reciclaje' },
              { id: 'ms9', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
  Convivencia: {
    areas: [
      {
        id: 'conv-ruido',
        name: 'Ruido y Perturbación',
        categories: [
          {
            id: 'conv-ruido-cat',
            name: 'Perturbación de la Tranquilidad',
            motives: [
              { id: 'mc1', name: 'Música o televisor a alto volumen en horario nocturno' },
              { id: 'mc2', name: 'Fiestas o reuniones ruidosas hasta altas horas' },
              { id: 'mc3', name: 'Obras o trabajos ruidosos fuera del horario permitido' },
              { id: 'mc4', name: 'Gritos o discusiones constantes' },
              { id: 'mc5', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'conv-masc',
        name: 'Mascotas',
        categories: [
          {
            id: 'conv-masc-cat',
            name: 'Tenencia Responsable de Mascotas',
            motives: [
              { id: 'mc6', name: 'No recolección de excrementos en zonas comunes' },
              { id: 'mc7', name: 'Ladridos o ruidos continuos de mascotas' },
              { id: 'mc8', name: 'Mascota suelta sin correa o bozal' },
              { id: 'mc9', name: 'Mascota agresiva o molestando en ascensores' },
              { id: 'mc10', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'conv-parq',
        name: 'Parqueaderos y Vehículos',
        categories: [
          {
            id: 'conv-parq-cat',
            name: 'Uso de Parqueaderos',
            motives: [
              { id: 'mc11', name: 'Parqueo indebido en celda ajena' },
              { id: 'mc12', name: 'Bloqueo de vías internas o parqueo sobre andén' },
              { id: 'mc13', name: 'Motocicletas o bicicletas mal estacionadas' },
              { id: 'mc14', name: 'Uso de parqueadero como depósito' },
              { id: 'mc15', name: 'Otro' },
            ],
          },
        ],
      },
      {
        id: 'conv-comp',
        name: 'Comportamiento y Zonas Comunes',
        categories: [
          {
            id: 'conv-comp-cat',
            name: 'Normas de Convivencia',
            motives: [
              { id: 'mc16', name: 'Dejar basuras o escombros en pasillos o áreas comunes' },
              { id: 'mc17', name: 'Arrojar colillas o elementos por balcones' },
              { id: 'mc18', name: 'Agresión verbal o falta de respeto entre vecinos' },
              { id: 'mc19', name: 'Filtraciones o humedades causadas por apartamento vecino' },
              { id: 'mc20', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
  Administración: {
    areas: [
      {
        id: 'adm-gen',
        name: 'Gestión General',
        categories: [
          {
            id: 'adm-gen-cat',
            name: 'Asuntos Administrativos',
            motives: [
              { id: 'ma1', name: 'Solicitud de mantenimiento preventivo' },
              { id: 'ma2', name: 'Revisión de citofonía / bombas / tuberías comunes' },
              { id: 'ma3', name: 'Inconformidad con proveedores o contratistas' },
              { id: 'ma4', name: 'Trámites de mudanza (ingreso/salida)' },
              { id: 'ma5', name: 'Otro' },
            ],
          },
        ],
      },
    ],
  },
};
