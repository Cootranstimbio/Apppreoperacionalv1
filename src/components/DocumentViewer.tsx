import { ArrowLeft, Calendar, Clock, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentViewerProps {
  file: {
    name: string;
    url: string;
    type: string;
  };
  timestamp?: string;
  onBack: () => void;
}

export function DocumentViewer({ file, timestamp, onBack }: DocumentViewerProps) {
  const currentTimestamp = timestamp || new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = file.type.startsWith('image/') || 
                  ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => file.name.toLowerCase().endsWith(ext));

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="size-5" />
            Regresar
          </button>
          <div className="flex items-center gap-2 text-white">
            {isPDF ? <FileText className="size-5" /> : <ImageIcon className="size-5" />}
            <span className="text-sm">{file.name}</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <Calendar className="size-4" />
            <span>{currentTimestamp.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <Clock className="size-4" />
            <span>{currentTimestamp.split(',')[1]?.trim() || currentTimestamp}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {isPDF ? (
          <iframe
            src={file.url}
            className="w-full h-full bg-white rounded-lg"
            title={file.name}
          />
        ) : isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <div className="text-white text-center">
            <p className="mb-4">Vista previa no disponible para este tipo de archivo</p>
            <a
              href={file.url}
              download={file.name}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Descargar Archivo
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Tipo: {file.type || 'Desconocido'}
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
}
