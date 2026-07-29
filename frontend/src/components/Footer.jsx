import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto opacity-80" />
          <div>
            <p className="text-slate-200 font-semibold">Conjunto Residencial Parques de Alejandría</p>
            <p className="text-slate-500">Comité de Convivencia © {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="text-center md:text-right text-slate-500 space-y-1">
          <p>Gestión Integral de Peticiones, Quejas, Reclamos y Sugerencias (PQR)</p>
          <p className="text-slate-600">Sistema Optimizado para Railway & PWA Instalable</p>
        </div>

      </div>
    </footer>
  );
}
