import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { 
  MagnifyingGlassIcon, 
  DocumentArrowDownIcon, 
  PaperClipIcon, 
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function TrackPqr() {
  const [searchParams, setSearchParams] = useSearchParams();
  const radicadoParam = searchParams.get('radicado') || '';
  
  const [query, setQuery] = useState(radicadoParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copiedRadicado, setCopiedRadicado] = useState(null);

  useEffect(() => {
    if (radicadoParam) {
      performSearch(radicadoParam);
    }
  }, [radicadoParam]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/pqr/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setResults(res.data.data);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ radicado: query.trim() });
      performSearch(query.trim());
    }
  };

  const copyShareLink = (radicado) => {
    const url = `${window.location.origin}/consultar?radicado=${radicado}`;
    navigator.clipboard.writeText(url);
    setCopiedRadicado(radicado);
    setTimeout(() => setCopiedRadicado(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-brand-blue flex items-center justify-center mx-auto mb-4">
          <MagnifyingGlassIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Consulta de Radicado</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ingrese el número de radicado (ej: PPA-20260728-000001), correo electrónico o número de apartamento
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="PPA-20260728-000001, correo@ejemplo.com o Apto 402"
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm font-medium transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-blue text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky-700 transition-all flex items-center gap-2 text-sm shadow-md active:scale-[0.98]"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>{loading ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </form>
      </motion.div>

      {/* Results List */}
      {searched && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs">
              <p className="text-slate-500 font-medium">No se encontraron solicitudes que coincidan con la búsqueda.</p>
              <p className="text-xs text-slate-400 mt-1">Verifique que el número de radicado esté escrito correctamente.</p>
            </div>
          ) : (
            results.map((pqr) => (
              <motion.div
                key={pqr.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden"
              >
                {/* Header Card */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Radicado</span>
                      <StatusBadge status={pqr.status} />
                    </div>
                    <h2 className="text-2xl font-black text-brand-blue tracking-wide mt-1">{pqr.radicado}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`/api/pqr/${pqr.radicado}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-brand-red text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-red-700 transition-all"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4" />
                      Descargar PDF
                    </a>

                    <button
                      onClick={() => copyShareLink(pqr.radicado)}
                      className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                      {copiedRadicado === pqr.radicado ? (
                        <>
                          <ClipboardDocumentCheckIcon className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600">Enlace copiado</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4 text-slate-500" />
                          <span>Copiar enlace</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-6">
                  
                  {/* Grid de Información Básica */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <UserIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="block text-slate-400 font-semibold uppercase">Solicitante</span>
                        <span className="font-bold text-slate-800">{pqr.residentName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="block text-slate-400 font-semibold uppercase">Ubicación</span>
                        <span className="font-bold text-slate-800">Torre {pqr.tower} - Apto {pqr.apartment}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <CalendarIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="block text-slate-400 font-semibold uppercase">Fecha Radicación</span>
                        <span className="font-bold text-slate-800">
                          {new Date(pqr.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Asunto y Descripción */}
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider mb-2">
                      {pqr.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{pqr.subject}</h3>
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      {pqr.description}
                    </p>
                  </div>

                  {/* Archivos Adjuntos */}
                  {pqr.attachments && pqr.attachments.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <PaperClipIcon className="w-4 h-4 text-slate-400" />
                        Archivos Adjuntos ({pqr.attachments.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {pqr.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={`/api/pqr/attachment/${att.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                          >
                            <PaperClipIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate max-w-xs">{att.originalName}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Respuestas del Comité */}
                  {pqr.observations && pqr.observations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                        Respuestas Oficiales del Comité
                      </h4>

                      <div className="space-y-3">
                        {pqr.observations.map((obs) => (
                          <div key={obs.id} className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl">
                            <div className="flex items-center justify-between text-xs text-sky-800 font-bold mb-1">
                              <span>{obs.authorName}</span>
                              <span className="text-[11px] font-normal text-slate-400">
                                {new Date(obs.createdAt).toLocaleString('es-CO')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{obs.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Historial de Auditoría / Trazabilidad */}
                  {pqr.historyLogs && pqr.historyLogs.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        Línea de Tiempo del Trámite
                      </h4>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {pqr.historyLogs.map((log) => (
                          <div key={log.id} className="relative text-xs">
                            <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-brand-blue border-2 border-white"></div>
                            <div className="flex items-center justify-between text-slate-500">
                              <span className="font-bold text-slate-800 uppercase">{log.action.replace('_', ' ')}</span>
                              <span className="text-[11px]">{new Date(log.createdAt).toLocaleString('es-CO')}</span>
                            </div>
                            {log.notes && (
                              <p className="text-slate-600 mt-0.5">{log.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
