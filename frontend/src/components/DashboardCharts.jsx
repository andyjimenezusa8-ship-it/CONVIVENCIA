import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const STATUS_COLORS = {
  'Nuevo': '#0288D1',       // Azul
  'En revisión': '#FBC02D', // Amarillo
  'En proceso': '#7E57C2',  // Púrpura
  'Pendiente': '#F57C00',   // Naranja
  'Resuelto': '#388E3C',    // Verde
  'Cerrado': '#607D8B'      // Gris
};

const TYPE_COLORS = ['#D32F2F', '#0288D1', '#388E3C', '#FBC02D', '#8E24AA', '#009688'];

export default function DashboardCharts({ monthlyData = [], byStatus = [], byType = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      
      {/* Gráfico 1: Evolución Mensual de PQRs */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
          Evolución Mensual de Radicaciones
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="count" name="PQRs Radicadas" fill="#0288D1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Distribución por Estado */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
          Distribución por Estado Actual
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byStatus}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Distribución por Tipo de Solicitud */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 lg:col-span-2">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span>
          Distribución por Tipo de Solicitud (Petición, Queja, Reclamo, Sugerencia, Convivencia)
        </h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={byType} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
              <Tooltip />
              <Bar dataKey="count" name="Total solicitudes" fill="#D32F2F" radius={[0, 4, 4, 0]}>
                {byType.map((entry, index) => (
                  <Cell key={`type-cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
