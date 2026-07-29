import React from 'react';

const statusConfig = {
  'Nuevo': {
    bg: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
    dot: 'bg-sky-500'
  },
  'En revisión': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    dot: 'bg-amber-500'
  },
  'En proceso': {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    dot: 'bg-indigo-500'
  },
  'Pendiente': {
    bg: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20',
    dot: 'bg-orange-500'
  },
  'Resuelto': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  'Cerrado': {
    bg: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    dot: 'bg-slate-500'
  }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Nuevo'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}
