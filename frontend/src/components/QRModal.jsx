import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  CheckCircleIcon, 
  DocumentArrowDownIcon, 
  ClipboardDocumentIcon, 
  ClipboardDocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function QRModal({ pqr, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!pqr) return null;

  const trackingUrl = `${window.location.origin}/consultar?radicado=${pqr.radicado}`;
  const pdfUrl = `/api/pqr/${pqr.radicado}/pdf`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-100 overflow-hidden text-center">
        
        {/* Header Decorator */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-red via-brand-green to-brand-blue"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-brand-green flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">¡PQR Radicada Exitosamente!</h3>
        <p className="text-xs text-slate-500 mt-1">Guarde su número de radicado para realizar el seguimiento</p>

        {/* Radicado Box */}
        <div className="my-5 p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Número de Radicado</span>
          <span className="block text-2xl font-black text-brand-blue tracking-wider mt-1">{pqr.radicado}</span>
        </div>

        {/* Código QR */}
        <div className="flex flex-col items-center justify-center my-4 p-4 bg-slate-50 border border-slate-200/60 rounded-xl inline-block mx-auto">
          <QRCodeCanvas value={trackingUrl} size={150} level="H" includeMargin={true} />
          <span className="text-[11px] text-slate-400 mt-2">Escanee para consultar estado en móvil</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-6">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Descargar Comprobante PDF
          </a>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl font-medium hover:bg-slate-200 transition-all"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-5 h-5 text-slate-500" />
                <span>Copiar Enlace de Seguimiento</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
