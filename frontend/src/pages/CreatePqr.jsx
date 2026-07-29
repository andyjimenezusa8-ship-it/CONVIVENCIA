import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import QRModal from '../components/QRModal';
import SearchableSelect from '../components/SearchableSelect';
import { 
  PaperClipIcon, 
  XMarkIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TYPES = [
  { value: 'Petición', label: 'Petición', desc: 'Solicitud de información o gestión general' },
  { value: 'Queja', label: 'Queja', desc: 'Inconformidad por ruidos, mascotas o comportamiento' },
  { value: 'Reclamo', label: 'Reclamo', desc: 'Exigencia por incumplimiento del reglamento' },
  { value: 'Sugerencia', label: 'Sugerencia', desc: 'Propuesta de mejora para la convivencia' },
  { value: 'Convivencia', label: 'Convivencia', desc: 'Conflicto o mediación entre vecinos' },
  { value: 'Administración', label: 'Administración', desc: 'Asunto administrativo o zonas comunes' },
];

export default function CreatePqr() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    document: '',
    tower: '',
    apartment: '',
    email: '',
    phone: '',
    type: 'Petición',
    area: '',
    category: '',
    motive: '',
    subject: '',
    description: '',
  });

  const [catalog, setCatalog] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdPqr, setCreatedPqr] = useState(null);

  useEffect(() => {
    api.get('/pqr/catalog')
      .then(res => {
        const typesData = res.data?.data?.types || res.data?.types;
        if (typesData) {
          setCatalog(typesData);
        }
      })
      .catch(err => {
        console.error('Error fetching catalog:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData({ ...formData, type: value, area: '', category: '', motive: '' });
    } else if (name === 'area') {
      setFormData({ ...formData, area: value, category: '', motive: '' });
    } else if (name === 'category') {
      setFormData({ ...formData, category: value, motive: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validar tamaño máximo de 20 MB por archivo
    const invalidFile = selectedFiles.find(f => f.size > 20 * 1024 * 1024);
    if (invalidFile) {
      setError(`El archivo ${invalidFile.name} supera el límite máximo de 20 MB.`);
      return;
    }

    if (files.length + selectedFiles.length > 5) {
      setError('Puede adjuntar un máximo de 5 archivos por PQR.');
      return;
    }

    setError(null);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.area || !formData.category || !formData.motive) {
      setError('Por favor complete todos los campos de clasificación: Área, Categoría y Motivo Específico.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      data.append('residentName', fullName);

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      files.forEach((file) => {
        data.append('attachments', file);
      });

      const res = await api.post('/pqr', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCreatedPqr(res.data.data);
      // Limpiar formulario
      setFormData({
        firstName: '',
        lastName: '',
        document: '',
        tower: '',
        apartment: '',
        email: '',
        phone: '',
        type: 'Petición',
        area: '',
        category: '',
        motive: '',
        subject: '',
        description: '',
      });
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al radicar la PQR. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Helper arrays para cascading
  const currentAreas = catalog && catalog[formData.type] ? catalog[formData.type].areas || [] : [];
  const selectedAreaObj = currentAreas.find(a => a.name === formData.area);
  const currentCategories = selectedAreaObj ? selectedAreaObj.categories || [] : [];
  const selectedCategoryObj = currentCategories.find(c => c.name === formData.category);
  const currentMotives = selectedCategoryObj ? selectedCategoryObj.motives || [] : [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden"
      >
        {/* Header Decorativo */}
        <div className="bg-gradient-to-r from-brand-red via-brand-green to-brand-blue p-6 sm:p-8 text-white relative">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white inline-block mb-2">
            Formulario Oficial de Radicación
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Crear PQR</h1>
          <p className="text-sm text-slate-100 mt-1">
            Complete la información para generar su número de radicado oficial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Sección 1: Datos del Residente */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
              1. Datos del Solicitante
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ej. Juan Carlos"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ej. Pérez"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula / Documento *</label>
                <input
                  type="text"
                  name="document"
                  required
                  value={formData.document}
                  onChange={handleChange}
                  placeholder="Ej. 1020304050"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Torre *</label>
                <input
                  type="text"
                  name="tower"
                  required
                  value={formData.tower}
                  onChange={handleChange}
                  placeholder="Ej. Torre 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apartamento *</label>
                <input
                  type="text"
                  name="apartment"
                  required
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Ej. 402"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Celular / Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej. 3001234567"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Tipo de Solicitud */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
              2. Clasificación de la Solicitud
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`p-3.5 rounded-2xl border cursor-pointer text-left transition-all ${
                    formData.type === t.value
                      ? 'border-brand-red bg-red-50/60 ring-2 ring-brand-red/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={formData.type === t.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`block font-bold text-sm ${formData.type === t.value ? 'text-brand-red' : 'text-slate-800'}`}>
                    {t.label}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight">{t.desc}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SearchableSelect
                label="Área / Dependencia"
                required
                name="area"
                value={formData.area}
                onChange={handleChange}
                options={currentAreas}
                placeholder="Seleccione un área..."
                disabled={!currentAreas.length}
              />

              <SearchableSelect
                label="Categoría"
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={currentCategories}
                placeholder="Seleccione una categoría..."
                disabled={!currentCategories.length}
              />

              <SearchableSelect
                label="Motivo Específico"
                required
                name="motive"
                value={formData.motive}
                onChange={handleChange}
                options={currentMotives}
                placeholder="Seleccione un motivo..."
                disabled={!currentMotives.length}
              />
            </div>
          </div>

          {/* Sección 3: Asunto y Descripción */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span>
              3. Detalle de la Solicitud
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asunto *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Resumen breve del caso"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Detallada *</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describa claramente los hechos, fechas, antecedentes o peticiones concretas..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                ></textarea>
              </div>

              {/* Adjuntar Archivos */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adjuntar Archivos (Fotos, PDF, Word - Máx. 20MB cada uno)
                </label>
                
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-blue transition-colors">
                  <div className="space-y-1 text-center">
                    <PaperClipIcon className="mx-auto h-10 w-10 text-slate-400" />
                    <div className="flex text-xs text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-brand-blue hover:text-sky-700 focus-within:outline-none">
                        <span>Seleccionar archivos</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">o arrastre aquí</p>
                    </div>
                    <p className="text-[11px] text-slate-400">Imágenes (JPG, PNG), PDF, Word</p>
                  </div>
                </div>

                {/* Lista de archivos seleccionados */}
                {files.length > 0 && (
                  <ul className="mt-3 divide-y divide-slate-100 bg-slate-50 rounded-xl p-2 border border-slate-200">
                    {files.map((file, idx) => (
                      <li key={idx} className="py-2 px-3 flex items-center justify-between text-xs">
                        <span className="truncate font-medium text-slate-700">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>

          {/* Botón Guardar / Generar Radicado */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Generando Radicado Oficial...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-6 h-6" />
                  <span>Generar Radicado Oficial</span>
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>

      {/* Modal de Confirmación y Código QR */}
      {createdPqr && (
        <QRModal pqr={createdPqr} onClose={() => setCreatedPqr(null)} />
      )}

    </div>
  );
}
