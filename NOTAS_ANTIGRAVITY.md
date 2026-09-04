# 📌 NOTAS DE TRANSFERENCIA PARA ANTIGRAVITY EN CASA

**Proyecto:** Sistema de PQR - Comité de Convivencia Parques de Alejandría P. H.  
**Fecha de actualización:** 4 de Septiembre, 2026  
**Estado:** Código 100% arreglado, compilado y sincronizado en la rama `main` de GitHub.

---

## 📁 1. Ubicación y Repositorios

- **Repositorio en GitHub:** [https://github.com/andyjimenezusa8-ship-it/CONVIVENCIA.git](https://github.com/andyjimenezusa8-ship-it/CONVIVENCIA.git)
- **Usuario de GitHub:** `andyjimenezusa8-ship-it`
- **Rama principal:** `main`

---

## 🛠️ 2. Resumen de Cambios y Correcciones Realizadas

1. **Activación de Listas Desplegables Encadenadas:**
   - Se implementó `DEFAULT_CATALOG` en [`frontend/src/data/defaultCatalog.js`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/frontend/src/data/defaultCatalog.js).
   - En [`frontend/src/pages/CreatePqr.jsx`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/frontend/src/pages/CreatePqr.jsx), si el servidor no entrega catálogo o la BD está vacía, se aplica el fallback local. **Las listas desplegables (Área ➔ Categoría ➔ Motivo) están 100% activas y funcionales.**

2. **Base de Datos Autónoma SQLite:**
   - Se migró el proveedor de Prisma en [`backend/prisma/schema.prisma`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/backend/prisma/schema.prisma) de `postgresql` a `sqlite`.
   - Se creó el cliente centralizado [`backend/src/prisma.js`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/backend/src/prisma.js) con `datasources: { db: { url: 'file:./dev.db' } }`, garantizando que la app no busque un servidor PostgreSQL externo.
   - En [`backend/src/index.js`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/backend/src/index.js), la base de datos se sincroniza (`prisma db push`) y puebla (`seed.js`) de forma automática y no bloqueante.

3. **Compatibilidad para Despliegue en Namecheap (cPanel):**
   - Se creó el archivo de entrada raíz [`app.js`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/app.js) (`require('./backend/src/index.js')`) requerido por Phusion Passenger / cPanel Setup Node.js App.
   - Se creó el [`package.json`](file:///C:/Users/ajimenezz/OneDrive%20-%20Secretaria%20de%20Educaci%C3%B3n%20Distrital/Escritorio/CONVIVENCIA/package.json) en la raíz para habilitar construcciones automáticas de Nixpacks/cPanel.

---

## 📜 3. Historial de Commits en GitHub (`main`)

- `e218a7c` Add app.js entry point for Namecheap cPanel deployment
- `52bc7f4` Fix non-blocking server startup for Railway healthcheck
- `317fee0` Fix Docker host binding to 0.0.0.0 and railway.json startCommand
- `c55100b` Add root package.json and multi-path frontend static resolution
- `3c13d25` Fix database connection by switching to auto-initialized SQLite
- `37462ba` Fix dropdown lists activation with fallback catalog

---

## 💻 4. Cómo Continuar el Trabajo en Antigravity (Casa)

En el equipo de tu casa, cuando abras **Antigravity**, solo debes pedirle lo siguiente:

### Comando inicial sugerido para Antigravity en casa:
> *"Abre el proyecto CONVIVENCIA, haz un `git pull origin main` y lee las notas de transferencia en `NOTAS_ANTIGRAVITY.md`."*

### Para ejecutar y probar en casa:
```bash
# 1. Traer los últimos cambios de GitHub
git pull origin main

# 2. Instalar y compilar el frontend
cd frontend
npm install
npm run build
cd ..

# 3. Instalar y preparar el backend
cd backend
npm install
npx prisma generate
npx prisma db push

# 4. Iniciar el servidor unificado (Frontend + Backend)
node src/index.js
```
*La app estará disponible localmente en `http://localhost:3000/crear-pqr`.*

---

## 🚀 5. Instrucciones para Desplegar en Namecheap (cPanel)

1. En tu cPanel de Namecheap, abre **"Setup Node.js App"**.
2. Crear aplicación:
   - **Node.js:** `20.x`
   - **App Root:** `convivencia`
   - **Startup File:** `app.js`
3. En **"Git Version Control"**, clona el repo: `https://github.com/andyjimenezusa8-ship-it/CONVIVENCIA.git` en la carpeta `convivencia`.
4. En la Terminal de cPanel ejecuta:
   ```bash
   source /home/.../nodevenv/convivencia/20/bin/activate && cd /home/.../convivencia
   cd backend && npm install && npx prisma generate && cd ..
   ```
5. En **Setup Node.js App**, haz clic en **`Restart Application`**.
