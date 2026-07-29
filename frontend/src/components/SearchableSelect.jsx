import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({
  options = [],
  value = '',
  onChange,
  placeholder = 'Seleccione una opción...',
  disabled = false,
  label = '',
  required = false,
  name = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofoco en el buscador al abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Resetear búsqueda cuando cambia options o se cierra
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  // Normalización de opciones (pueden ser strings u objetos {id, name})
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { id: opt.id || opt.name, name: opt.name, raw: opt };
    }
    return { id: opt, name: opt, raw: opt };
  });

  // Filtrado de opciones
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  // Obtener nombre de la opción seleccionada
  const selectedObj = normalizedOptions.find((opt) => opt.name === value || opt.id === value);
  const displayLabel = selectedObj ? selectedObj.name : '';

  const handleSelect = (optName) => {
    onChange({ target: { name, value: optName } });
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
    setSearch('');
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input simulado / Botón activador */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-white'
            : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
        }`}
      >
        <span className={`truncate ${!displayLabel ? 'text-slate-400' : 'text-slate-800 font-semibold'}`}>
          {displayLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0 text-slate-400">
          {displayLabel && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Limpiar selección"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
        </div>
      </button>

      {/* Panel desplegable con buscador */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Buscador interno */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar opción..."
                className="w-full pl-8 pr-7 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de opciones filtradas */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-slate-400">
                No se encontraron opciones coincidentes.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.name === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-50 text-brand-blue font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="truncate">{opt.name}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 text-brand-blue flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}
