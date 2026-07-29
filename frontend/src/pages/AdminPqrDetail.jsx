import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { 
  XMarkIcon, 
  PaperClipIcon, 
  DocumentArrowDownIcon, 
  ClockIcon, 
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function AdminPqrDetail({ pqrId, onClose, onUpdated }) {
  const [pqr, setPqr] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modificación de Estado
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Observaciones
  const [obsContent, setObsContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [obsLoading, setObsLoading] = useState(false);

  const fetchPqr = async () => {
    setLoading(true);
    try {
      // Buscar PQR por ID desde la lista administrativa
      const res = await api.get(`/admin/pqrs?search=${pqrId}&limit=1`);
      const found = res.data.data.find(item => item.id === pqrId);
      if (found) {
        setPqr(found);
        setNewStatus(found.status);
      }
    } catch (err) {
      console.error('Error cargando detalle PQR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pqrId) fetchPqr();
  }, [pqrId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    setStatusLoading(true);

    try {
      await api.patch(`/admin/pqrs/${pqrId}/status`, {
        status: newStatus,
        note: statusNote
      });
      setStatusNote('');
      await fetchPqr();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar el estado.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddObservation = async (e) => {
    e.preventDefault();
    if (!obsContent.trim()) return;
    setObsLoading(true);

    try {
      await api.post(`/admin/pqrs/${pqrId}/observations`, {
        content: obsContent,
        isPrivate
      });
      setObsContent('');
      await fetchPqr();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al agregar respuesta.');
    } finally {
      setObsLoading(false);
    }
  };

  const handleReopen = async () => {
    const reason = prompt('Ingrese el motivo de la reapertura de este caso:');
    if (reason === null) return;

    try {
      await api.post(`/admin/pqrs/${pqrId}/reopen`, { reason });
      await fetchPqr();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al reabrir la PQR.');
    }
  };

  if (!pqrId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-end">
      
      <div className="bg-white w-full max-w-3xl min-h-screen shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-slate-200">
        
        {loading || !pqr ? (
          <div className="flex-1 flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-brand-blue animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gestión de PQR</span>
                <h2 className="text-2xl font-black text-brand-blue">{pqr.radicado}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Badge & Print Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={pqr.status} />
                <span className="text-xs text-slate-400">
                  Radicado el {new Date(pqr.createdAt).toLocaleString('es-CO')}
                </span>
              </div>

              <a
                href={`/api/pqr/${pqr.radicado}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-brand-blue text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:bg-sky-700"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Descargar Comprobante PDF
              </a>
            </div>

            {/* Datos del Solicitante */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-slate-400 font-bold uppercase">Solicitante</span>
                <span className="font-extrabold text-slate-800">{pqr.residentName}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase">Ubicación</span>
                <span className="font-extrabold text-slate-800">Torre {pqr.tower} - Apto {pqr.apartment}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase">Correo</span>
                <span className="font-bold text-slate-700 truncate block">{pqr.email}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase">Celular</span>
                <span className="font-bold text-slate-700">{pqr.phone}</span>
              </div>
            </div>

            {/* Contenido PQR */}
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-50 text-brand-red text-xs font-bold uppercase">
                {pqr.type}
              </span>
              <h3 className="text-base font-bold text-slate-900">{pqr.subject}</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed">
                {pqr.description}
              </p>
            </div>

            {/* Archivos Adjuntos */}
            {pqr.attachments && pqr.attachments.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Archivos Adjuntos</h4>
                <div className="flex flex-wrap gap-2">
                  {pqr.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={`/api/pqr/attachment/${att.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                    >
                      <PaperClipIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{att.originalName}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Sección: Cambiar Estado */}
            <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-sky-800 flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-sky-600" />
                Actualizar Estado de la Solicitud
              </h4>

              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="En revisión">En revisión</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>

                  <button
                    type="submit"
                    disabled={statusLoading}
                    className="bg-brand-blue text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-sky-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    {statusLoading ? 'Guardando...' : 'Cambiar Estado'}
                  </button>
                </div>

                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Nota explicativa para el cambio de estado (Opcional)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </form>

              {(pqr.status === 'Cerrado' || pqr.status === 'Resuelto') && (
                <button
                  onClick={handleReopen}
                  className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                >
                  <ExclamationCircleIcon className="w-4 h-4" />
                  Reabrir este caso
                </button>
              )}
            </div>

            {/* Sección: Respuestas y Observaciones */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-slate-600" />
                Agregar Respuesta u Observación
              </h4>

              <form onSubmit={handleAddObservation} className="space-y-3">
                <textarea
                  rows={3}
                  value={obsContent}
                  onChange={(e) => setObsContent(e.target.value)}
                  placeholder="Escriba la respuesta oficial o nota interna del comité..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-blue"
                ></textarea>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="flex items-center gap-1">
                      <LockClosedIcon className="w-3.5 h-3.5 text-amber-600" />
                      Observación Privada (Solo visible para el Comité)
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={obsLoading}
                    className="bg-brand-green text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-all"
                  >
                    {obsLoading ? 'Guardando...' : 'Publicar Respuesta'}
                  </button>
                </div>
              </form>
            </div>

            {/* Historial de Respuestas & Auditoría */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                Historial de Auditoría & Respuestas ({pqr.historyLogs?.length || 0})
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {pqr.historyLogs && pqr.historyLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 font-semibold">
                      <span className="text-slate-800 font-bold">{log.userName || 'Usuario'} ({log.userRole || 'RESIDENTE'})</span>
                      <span className="text-[11px]">{new Date(log.createdAt).toLocaleString('es-CO')}</span>
                    </div>
                    <p className="text-slate-700 font-medium">Acción: {log.action.replace('_', ' ')}</p>
                    {log.previousState && (
                      <p className="text-slate-500">Transición: <span className="font-bold">{log.previousState}</span> &rarr; <span className="font-bold text-brand-green">{log.newState}</span></p>
                    )}
                    {log.notes && (
                      <p className="text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 italic">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
