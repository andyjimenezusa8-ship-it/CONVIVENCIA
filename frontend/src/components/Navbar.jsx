import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  DocumentPlusIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Colors */}
      <div className="h-1.5 w-full grid grid-cols-4">
        <div className="bg-brand-red"></div>
        <div className="bg-brand-green"></div>
        <div className="bg-brand-blue"></div>
        <div className="bg-brand-yellow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <RouterLink to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Logo Comité de Convivencia" 
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Conjunto Residencial
              </span>
              <span className="block text-lg font-extrabold text-slate-900 leading-tight">
                Parques de Alejandría
              </span>
              <span className="block text-xs font-semibold text-brand-red">
                Comité de Convivencia
              </span>
            </div>
          </RouterLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <RouterLink
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-slate-100 text-brand-blue font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              Inicio
            </RouterLink>

            <RouterLink
              to="/crear-pqr"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/crear-pqr') 
                  ? 'bg-red-50 text-brand-red font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <DocumentPlusIcon className="w-4 h-4" />
              Crear PQR
            </RouterLink>

            <RouterLink
              to="/consultar"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/consultar') 
                  ? 'bg-sky-50 text-brand-blue font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Consultar Radicado
            </RouterLink>

            {user ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <RouterLink
                  to="/admin/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin') 
                      ? 'bg-emerald-50 text-brand-green font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheckIcon className="w-4 h-4 text-brand-green" />
                  Panel Admin
                </RouterLink>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Cerrar Sesión"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <RouterLink
                to="/admin/login"
                className={`ml-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin/login')
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Administrador
              </RouterLink>
            )}

            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="ml-2 flex items-center gap-1.5 bg-brand-yellow/10 text-amber-800 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all animate-pulse"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-amber-700" />
                Instalar App
              </button>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
