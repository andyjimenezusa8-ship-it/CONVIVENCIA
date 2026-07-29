import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FolderIcon, 
  TagIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const TYPES = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Convivencia', 'Administración'];

export default function AdminCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Todas');
  const [search, setSearch] = useState('');
  const [newMotiveInputs, setNewMotiveInputs] = useState({}); // { [categoryId]: 'Nombre motivo' }
  const [editingMotiveId, setEditingMotiveId] = useState(null);
  const [editingMotiveName, setEditingMotiveName] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/catalog');
      if (res.data.success) {
        setCatalog(res.data.data);
      }
    } catch (err) {
      console.error('Error cargando catálogo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleMotive = async (motiveId, currentActive) => {
    try {
      const newActive = !currentActive;
      // Actualización optimista en interfaz
      setCatalog((prevAreas) =>
        prevAreas.map((area) => ({
          ...area,
          categories: area.categories.map((cat) => ({
            ...cat,
            motives: cat.motives.map((mot) =>
              mot.id === motiveId ? { ...mot, active: newActive } : mot
            ),
          })),
        }))
      );

      await api.put(`/admin/catalog/motives/${motiveId}`, { active: newActive });
      showToast(newActive ? 'Motivo activado' : 'Motivo desactivado');
    } catch (err) {
      console.error('Error al cambiar estado del motivo:', err);
      fetchCatalog(); // Revertir en caso de error
    }
  };

  const handleAddMotive = async (categoryId) => {
    const motiveName = (newMotiveInputs[categoryId] || '').trim();
    if (!motiveName) return;

    try {
      await api.post('/admin/catalog/motives', {
        name: motiveName,
        categoryId: categoryId,
      });

      setNewMotiveInputs((prev) => ({ ...prev, [categoryId]: '' }));
      showToast(`Motivo "${motiveName}" creado con éxito.`);
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creando motivo.');
    }
  };

  const handleSaveEditMotive = async (motiveId) => {
    if (!editingMotiveName.trim()) return;
    try {
      await api.put(`/admin/catalog/motives/${motiveId}`, { name: editingMotiveName.trim() });
      setEditingMotiveId(null);
      setEditingMotiveName('');
      showToast('Motivo actualizado.');
      fetchCatalog();
    } catch (err) {
      alert(err.response?.data?.error || 'Error actualizando motivo.');
    }
  };

  // Filtrado de áreas
  const filteredAreas = catalog.filter((area) => {
    if (selectedType !== 'Todas' && area.pqrType !== selectedType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FolderIcon className="w-8 h-8 text-brand-red" />
            Gestión del Catálogo PQR
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administre, active o desactive motivos de PQR en tiempo real sin modificar código fuente.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Catálogo</span>
        </button>
      </div>

      {/* Notificación Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filtros por Tipo y Buscador */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200 space-y-4">
        
        {/* Pestañas de Tipos */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
          <button
            onClick={() => setSelectedType('Todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'Todas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({catalog.length} áreas)
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Buscador de Motivos */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar motivos en pantalla..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Listado Jerárquico */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
          <ArrowPathIcon className="w-6 h-6 animate-spin text-brand-blue" />
          <span className="text-xs font-medium">Cargando catálogo oficial...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAreas.map((area) => {
            // Filtrado por buscador
            const matchingCategories = area.categories.map((cat) => {
              const matchingMotives = cat.motives.filter((m) =>
                m.name.toLowerCase().includes(search.toLowerCase().trim())
              );
              return { ...cat, motives: matchingMotives };
            }).filter((cat) => cat.motives.length > 0 || !search);

            if (search && matchingCategories.length === 0) return null;

            return (
              <div key={area.id} className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden">
                
                {/* Header Área */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-brand-blue/10 text-brand-blue">
                      {area.pqrType}
                    </span>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Área: {area.name}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {area.categories.length} categorías
                  </span>
                </div>

                {/* Categorías */}
                <div className="p-6 space-y-6">
                  {matchingCategories.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40">
                      
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <TagIcon className="w-4 h-4 text-brand-green" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Categoría: {category.name}
                          </h3>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400">
                          {category.motives.length} motivos
                        </span>
                      </div>

                      {/* Lista de Motivos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {category.motives.map((motive) => (
                          <div
                            key={motive.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                              motive.active
                                ? 'bg-white border-slate-200 shadow-2xs'
                                : 'bg-slate-100/70 border-slate-200 opacity-60'
                            }`}
                          >
                            {editingMotiveId === motive.id ? (
                              <div className="flex items-center gap-1.5 w-full">
                                <input
                                  type="text"
                                  value={editingMotiveName}
                                  onChange={(e) => setEditingMotiveName(e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-brand-blue rounded-lg focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveEditMotive(motive.id)}
                                  className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                >
                                  <CheckIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingMotiveId(null)}
                                  className="p-1 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300"
                                >
                                  <XMarkIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 truncate">
                                  <span className={`text-xs font-semibold truncate ${motive.active ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                                    {motive.name}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingMotiveId(motive.id);
                                      setEditingMotiveName(motive.name);
                                    }}
                                    className="text-slate-300 hover:text-slate-600 p-0.5"
                                    title="Editar nombre"
                                  >
                                    <PencilSquareIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleMotive(motive.id, motive.active)}
                                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    motive.active ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                  title={motive.active ? 'Desactivar motivo' : 'Activar motivo'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      motive.active ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Agregar nuevo motivo a la categoría */}
                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                        <input
                          type="text"
                          value={newMotiveInputs[category.id] || ''}
                          onChange={(e) =>
                            setNewMotiveInputs({
                              ...newMotiveInputs,
                              [category.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddMotive(category.id);
                          }}
                          placeholder="Agregar nuevo motivo a esta categoría..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddMotive(category.id)}
                          className="flex items-center gap-1 bg-brand-blue text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-sky-700 transition-all shadow-xs"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
