import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DocumentPlusIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center my-6"
      >
        <div className="inline-block p-4 rounded-3xl bg-white shadow-card border border-slate-100 mb-6">
          <img 
            src="/logo.png" 
            alt="Logo Oficial Comité de Convivencia" 
            className="h-44 sm:h-52 w-auto mx-auto object-contain drop-shadow-sm"
          />
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-red-50 text-brand-red border border-red-200 tracking-wide uppercase mb-3">
          Plataforma Oficial de Gestión
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          COMITÉ DE CONVIVENCIA
        </h1>
        <p className="text-lg sm:text-xl font-bold text-slate-600 mt-2">
          Conjunto Residencial Parques de Alejandría
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
          Canal directo e institucional para la radicación y seguimiento de Peticiones, Quejas, Reclamos y Sugerencias (PQR). Promoviendo la sana convivencia y el diálogo armónico.
        </p>
      </motion.div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        
        {/* Card 1: Crear PQR */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/crear-pqr"
            className="h-full bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DocumentPlusIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-red transition-colors">
                Crear PQR
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Radique una nueva petición, queja, reclamo o sugerencia con generación automática de comprobante oficial en PDF y código QR.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-brand-red group-hover:translate-x-1 transition-transform">
              Radicar Solicitud &rarr;
            </div>
          </Link>
        </motion.div>

        {/* Card 2: Consultar Radicado */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/consultar"
            className="h-full bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MagnifyingGlassIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors">
                Consultar Radicado
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Consulte el estado actual de su trámite por número de radicado, correo electrónico o número de apartamento.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-brand-blue group-hover:translate-x-1 transition-transform">
              Buscar Estado &rarr;
            </div>
          </Link>
        </motion.div>

        {/* Card 3: Acceso Administrador */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/admin/login"
            className="h-full bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-green transition-colors">
                Administrador
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Acceso restringido para los miembros del Comité de Convivencia y Administración para gestionar y dar respuesta a las PQRs.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-brand-green group-hover:translate-x-1 transition-transform">
              Ingresar al Panel &rarr;
            </div>
          </Link>
        </motion.div>

      </div>

      {/* Feature Highlights */}
      <div className="my-8 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center">
          <ShieldCheckIcon className="w-7 h-7 text-brand-green mb-2" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Trazabilidad Inmutable</h4>
          <p className="text-xs text-slate-500 mt-1">Auditoría completa de estados, fechas e IP de registro</p>
        </div>
        <div className="flex flex-col items-center">
          <ClockIcon className="w-7 h-7 text-brand-blue mb-2" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Respuesta Oportuna</h4>
          <p className="text-xs text-slate-500 mt-1">Control de tiempos de respuesta según reglamento interno</p>
        </div>
        <div className="flex flex-col items-center">
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-brand-red mb-2" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Notificación Automática</h4>
          <p className="text-xs text-slate-500 mt-1">Notificaciones instantáneas por correo electrónico</p>
        </div>
      </div>

    </div>
  );
}
