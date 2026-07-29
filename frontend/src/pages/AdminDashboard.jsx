import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import DashboardCharts from '../components/DashboardCharts';
import AdminPqrDetail from './AdminPqrDetail';
import { 
  DocumentArrowDownIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderOpenIcon,
  Cog6ToothIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pqrs, setPqrs] = useState([]);
  const [totalPqrs, setTotalPqrs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPqr, setSelectedPqr] = useState(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas
      const statsRes = await api.get('/admin/dashboard/stats', {
        params: { month: monthFilter, year: yearFilter, type: typeFilter, status: statusFilter }
      });
      setStats(statsRes.data.data);

      // Cargar tabla PQRs
      const pqrRes = await api.get('/admin/pqrs', {
        params: { search, status: statusFilter, type: typeFilter, page: 1, limit: 100 }
      });
      setPqrs(pqrRes.data.data);
      setTotalPqrs(pqrRes.data.total);
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, typeFilter, monthFilter, yearFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportExcel = () => {
    window.open('/api/admin/export/excel', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Dashboard & Admin Submenu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Panel de Control Administrativo</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión integral de PQRs - Comité de Convivencia</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/catalogo')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            <FolderOpenIcon className="w-4 h-4 text-brand-green" />
            <span>Catálogo PQR</span>
          </button>

          <button
            onClick={() => navigate('/admin/usuarios')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            <UsersIcon className="w-4 h-4 text-brand-blue" />
            <span>Usuarios Comité</span>
          </button>

          <button
            onClick={() => navigate('/admin/configuracion')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            <Cog6ToothIcon className="w-4 h-4 text-brand-red" />
            <span>Configuración</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Total PQRs</span>
            <span className="block text-2xl font-black text-slate-900 mt-1">{stats.cards.totalPqr}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-700">Pendientes</span>
            <span className="block text-2xl font-black text-amber-800 mt-1">{stats.cards.pendientes}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-700">En Proceso</span>
            <span className="block text-2xl font-black text-indigo-800 mt-1">{stats.cards.enProceso}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">Resueltas</span>
            <span className="block text-2xl font-black text-emerald-800 mt-1">{stats.cards.resueltas}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/40 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-red-700">Vencidas</span>
            <span className="block text-2xl font-black text-red-800 mt-1">{stats.cards.vencidas}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sky-200 bg-sky-50/40 shadow-xs">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-sky-700">Prom. Respuesta</span>
            <span className="block text-xl font-black text-sky-800 mt-1">{stats.cards.avgResponseDays} días</span>
          </div>
        </div>
      )}

      {/* Gráficas Estadísticas */}
      {stats && (
        <DashboardCharts
          monthlyData={stats.charts.monthlyData}
          byStatus={stats.charts.byStatus}
          byType={stats.charts.byType}
        />
      )}

      {/* Tabla de PQRs y Filtros */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden">
        
        {/* Barra de Filtros */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderOpenIcon className="w-5 h-5 text-brand-blue" />
              Gestión de Solicitudes ({totalPqrs})
            </h2>

            <button
              onClick={fetchData}
              className="self-start md:self-auto p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar Tabla</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por radicado, solicitante, apto, asunto..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">Todos los Estados</option>
              <option value="Nuevo">Nuevo</option>
              <option value="En revisión">En revisión</option>
              <option value="En proceso">En proceso</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Resuelto">Resuelto</option>
              <option value="Cerrado">Cerrado</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">Todos los Tipos</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Convivencia">Convivencia</option>
              <option value="Administración">Administración</option>
            </select>

            <button
              type="submit"
              className="bg-brand-blue text-white font-bold py-2 px-4 rounded-xl text-xs hover:bg-sky-700 transition-all flex items-center justify-center gap-1.5"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
          </form>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Radicado</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Solicitante</th>
                <th className="py-3.5 px-4">Ubicación</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Asunto</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pqrs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron registros de PQR.
                  </td>
                </tr>
              ) : (
                pqrs.map((pqr) => (
                  <tr
                    key={pqr.id}
                    onClick={() => setSelectedPqr(pqr)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-black text-brand-blue">{pqr.radicado}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(pqr.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{pqr.residentName}</td>
                    <td className="py-3 px-4">Torre {pqr.tower} - Apto {pqr.apartment}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{pqr.type}</td>
                    <td className="py-3 px-4 truncate max-w-xs">{pqr.subject}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={pqr.status} />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-brand-blue">
                      Gestionar &rarr;
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Drawer / Modal de Detalle y Gestión */}
      {selectedPqr && (
        <AdminPqrDetail
          pqrId={selectedPqr.id}
          onClose={() => setSelectedPqr(null)}
          onUpdated={fetchData}
        />
      )}

    </div>
  );
}
