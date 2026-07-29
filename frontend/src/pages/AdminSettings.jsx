import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Cog6ToothIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    ensembleName: '',
    entityName: '',
    contactEmail: '',
    responseDaysLimit: 15,
    primaryRed: '#D32F2F',
    primaryGreen: '#4CAF50',
    primaryBlue: '#0288D1',
    primaryYellow: '#FBC02D'
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.data) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    try {
      await api.put('/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar configuración.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Cog6ToothIcon className="w-7 h-7 text-brand-red" />
          Configuración Institucional del Sistema
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Personalice el nombre del conjunto, correo institucional, plazos de respuesta y colores corporativos.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200">
        
        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            <span>Configuración actualizada con éxito.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Información de la Copropiedad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre de la Copropiedad</label>
                <input
                  type="text"
                  required
                  value={settings.ensembleName}
                  onChange={(e) => setSettings({ ...settings, ensembleName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entidad Encargada</label>
                <input
                  type="text"
                  required
                  value={settings.entityName}
                  onChange={(e) => setSettings({ ...settings, entityName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico de Contacto</label>
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Límite Días Máximos de Respuesta</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={90}
                  value={settings.responseDaysLimit}
                  onChange={(e) => setSettings({ ...settings, responseDaysLimit: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Paleta de Colores Institucionales</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color Rojo</label>
                <input
                  type="color"
                  value={settings.primaryRed}
                  onChange={(e) => setSettings({ ...settings, primaryRed: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color Verde</label>
                <input
                  type="color"
                  value={settings.primaryGreen}
                  onChange={(e) => setSettings({ ...settings, primaryGreen: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color Azul</label>
                <input
                  type="color"
                  value={settings.primaryBlue}
                  onChange={(e) => setSettings({ ...settings, primaryBlue: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color Amarillo</label>
                <input
                  type="color"
                  value={settings.primaryYellow}
                  onChange={(e) => setSettings({ ...settings, primaryYellow: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer border border-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-brand-red text-white font-bold px-6 py-3 rounded-2xl text-xs hover:bg-red-700 transition-all shadow-md"
            >
              Guardar Configuración
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
