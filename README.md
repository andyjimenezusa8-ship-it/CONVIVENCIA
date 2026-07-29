# PWA Gestión de PQR – Comité de Convivencia Parques de Alejandría

Plataforma Web Progresiva (PWA) completa e institucional desarrollada para la gestión integral de Peticiones, Quejas, Reclamos y Sugerencias (PQR) del **Conjunto Residencial Parques de Alejandría**.

---

## 🚀 Características Principales

- **Diseño Institucional e Identidad Visual**: Basado exactamente en los colores institucionales extraídos del logo oficial (`#D32F2F` Rojo, `#388E3C` Verde, `#0288D1` Azul, `#FBC02D` Amarillo).
- **Formatos de Radicado Únicos**: Formato correlativo atómico e irrepetible por día (`PPA-YYYYMMDD-000001`).
- **Generación Automática de Comprobante PDF con QR**: Emisión instantánea de comprobante en PDF con código QR escaneable para consulta inmediata desde cualquier dispositivo móvil.
- **Sin Dependencias de Firebase**: Toda la persistencia reside en una base de datos relacional **PostgreSQL** mediante **Prisma ORM**.
- **Panel Administrativo Avanzado**:
  - Indicadores clave y tarjetas de resumen (Total, Pendientes, En Proceso, Resueltas, Vencidas).
  - Tiempo promedio de respuesta y control de cumplimiento de plazos legales/internos.
  - Gráficas interactivas con Recharts (Tendencias mensuales, distribución por estado y tipo).
  - Tabla con búsqueda global, filtros avanzados y ordenación.
  - Exportación de listados a **Excel (.xlsx)**.
  - Trazabilidad e historial de auditoría inmutable (cambios de estado, autor, fecha/hora e IP).
  - Respuestas oficiales públicas para el residente y observaciones privadas exclusivas del comité.
- **PWA Instalable**: Preparado con `manifest.json`, iconos y Service Worker para uso en teléfonos móviles y escritorios.
- **Despliegue Directo en Railway**: Incluye `Dockerfile`, `docker-compose.yml` y `railway.json`.

---

## 📁 Estructura del Proyecto

```
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Modelo de datos PostgreSQL
│   │   └── seed.js              # Script de inicio de usuario admin y parámetros
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio (PQR, Auth, Admin, Settings)
│   │   ├── middlewares/         # JWT, Multer, Rate Limiter, Error Handler
│   │   ├── services/            # PDF (pdf-lib), Email (Nodemailer), Radicado, Audit
│   │   ├── routes/              # Endpoints API REST
│   │   └── index.js             # Servidor principal Express
│   └── uploads/                 # Almacenamiento seguro de adjuntos
├── frontend/
│   ├── public/                  # Logo institucional, manifest.json, sw.js
│   ├── src/
│   │   ├── components/          # Navbar, Footer, StatusBadge, QRModal, Charts
│   │   ├── pages/               # Home, CreatePqr, TrackPqr, Login, AdminDashboard
│   │   ├── context/             # AuthContext para sesión JWT
│   │   ├── services/            # Cliente Axios API
│   │   ├── App.jsx
│   │   └── index.css            # Estilos TailwindCSS institucionales
│   └── vite.config.js
├── Dockerfile                   # Dockerfile multi-etapa para producción
├── docker-compose.yml           # Postgres + App web lista para entorno local
├── railway.json                 # Configuración de despliegue en Railway
├── README.md
└── .env.example
```

---

## ⚡ Ejecución Local con Docker Compose

Para iniciar toda la aplicación (PostgreSQL + Backend + Frontend compilado) en un solo comando:

```bash
docker compose up --build
```

La aplicación estará disponible en: **http://localhost:3000**

### 🔑 Credenciales por Defecto del Administrador
- **Correo**: `admin@parquesdealejandria.com`
- **Contraseña**: `Admin2026!`

---

## 🚂 Despliegue en Railway

1. Conecte este repositorio a su proyecto en **Railway**.
2. Añada un servicio de **PostgreSQL** desde el panel de Railway.
3. En el servicio Web de Railway, configure las siguientes variables de entorno:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET`: *(Cadena secreta segura)*
   - `APP_URL`: *(URL generada por Railway)*
   - `PORT`: `3000`
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`: *(Opcional para envío de correos real)*
4. Railway utilizará el `Dockerfile` y `railway.json` para compilar y ejecutar automáticamente la aplicación.

---

## 🛡️ Seguridad y Buenas Prácticas

- Protección de cabeceras HTTP con **Helmet**.
- Limitación de tasa de solicitudes con **express-rate-limit** para prevenir spam.
- Hash de contraseñas con **bcrypt**.
- Autenticación mediante **JWT**.
- Validación de archivos adjuntos (máximo 20 MB, tipos permitidos: `.jpg`, `.jpeg`, `.png`, `.pdf`, `.doc`, `.docx`).
