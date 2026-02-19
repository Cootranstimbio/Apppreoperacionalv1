import { ArrowLeft, Eye, X, FileText, AlertCircle } from 'lucide-react';
import { Reporte, useUserContext } from './UserContext';
import { useState } from 'react';
import { DocumentViewer } from './DocumentViewer';

interface ReporteDetailProps {
  reporte: Reporte;
  onClose: () => void;
}

export function ReporteDetail({ reporte, onClose }: ReporteDetailProps) {
  const { checkItems } = useUserContext();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string; type: string } | null>(null);

  const handlePreview = (url: string, type: string, name: string = 'Documento') => {
    setViewingDocument({ name, url, type });
  };

  const groupedItems = reporte.items.reduce((acc, item) => {
    const checkItem = checkItems.find(ci => ci.id === item.itemId);
    if (!checkItem) return acc;

    if (!acc[checkItem.modulo]) {
      acc[checkItem.modulo] = [];
    }
    acc[checkItem.modulo].push({ ...item, checkItem });
    return acc;
  }, {} as Record<string, Array<typeof reporte.items[0] & { checkItem: typeof checkItems[0] }>>);

  // Si está viendo un documento, mostrar el visor
  if (viewingDocument) {
    return (
      <DocumentViewer
        file={viewingDocument}
        timestamp={reporte.fecha}
        onBack={() => setViewingDocument(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="size-5" />
          Volver a la lista
        </button>

        {/* Alerta de Documentación Vencida */}
        {reporte.documentacionVencida && reporte.motivoBloqueo && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="size-10 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 mb-2">⚠️ VEHÍCULO/CONDUCTOR BLOQUEADO</h3>
                <p className="text-red-800 p-3 bg-red-100 rounded border border-red-300">
                  <strong>{reporte.motivoBloqueo}</strong>
                </p>
                <p className="text-red-700 mt-3 text-sm">
                  Este vehículo NO debe ser despachado hasta renovar la documentación correspondiente.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-gray-900 mb-4">Detalle del Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tipo de Chequeo</p>
              <p className="text-gray-900">{reporte.tipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="text-gray-900">
                {new Date(reporte.fecha).toLocaleDateString('es-CO')} {new Date(reporte.fecha).toLocaleTimeString('es-CO')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehículo</p>
              <p className="text-gray-900">
                {reporte.vehiculo.placa} - {reporte.vehiculo.marca} {reporte.vehiculo.modelo}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Conductor</p>
              <p className="text-gray-900">
                {reporte.conductor.nombre} ({reporte.conductor.cedula})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Inspector</p>
              <p className="text-gray-900">
                {reporte.inspector.nombre} ({reporte.inspector.rol})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      {Object.entries(groupedItems).map(([modulo, moduloItems]) => (
        <div key={modulo} className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-gray-900">{modulo}</h3>
          </div>
          <div className="p-6 space-y-6">
            {moduloItems.map((item) => {
              const estadoColor =
                item.estado === 'bien'
                  ? 'bg-green-100 text-green-800'
                  : item.estado === 'regular'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800';

              return (
                <div key={item.itemId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-gray-900 flex-1">{item.checkItem.nombre}</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${estadoColor}`}>
                      {item.estado?.toUpperCase()}
                    </span>
                  </div>

                  {item.observacion && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Observación:</strong> {item.observacion}
                      </p>
                    </div>
                  )}

                  {item.adjuntos.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Evidencias Adjuntas:</strong>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {item.adjuntos.map((adjunto, index) => (
                          <div
                            key={index}
                            className="relative border border-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={() => handlePreview(adjunto.url, adjunto.type, adjunto.name)}
                          >
                            {adjunto.type.startsWith('image/') ? (
                              <img
                                src={adjunto.url}
                                alt={adjunto.name}
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-red-100 flex items-center justify-center">
                                <span className="text-red-800">PDF</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="size-6 text-white" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                              {adjunto.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Documentos Generales */}
      {reporte.documentosGenerales && reporte.documentosGenerales.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 bg-purple-50">
            <h3 className="text-gray-900">Documentos y Evidencias Generales</h3>
            <p className="text-sm text-gray-600 mt-1">
              {reporte.documentosGenerales.length} documento(s) adjunto(s)
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reporte.documentosGenerales.map((doc, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 rounded-lg overflow-hidden group cursor-pointer shadow hover:shadow-lg transition-shadow"
                  onClick={() => handlePreview(doc.url, doc.type, doc.name)}
                >
                  {doc.type.startsWith('image/') ? (
                    <div className="aspect-video">
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center">
                      <FileText className="size-16 text-blue-600 mb-2" />
                      <span className="text-sm text-blue-800 text-center px-2">
                        {doc.type.split('/')[1]?.toUpperCase() || 'DOC'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="size-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                    <p className="text-sm truncate" title={doc.name}>{doc.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-6">Firmas Digitales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Firma del Inspector</p>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-2">
              <img
                src={reporte.firmaInspector}
                alt="Firma Inspector"
                className="w-full h-32 object-contain"
              />
            </div>
            <p className="text-gray-900">{reporte.inspector.nombre}</p>
            <p className="text-sm text-gray-600">{reporte.inspector.rol}</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Firma del Conductor</p>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-2">
              <img
                src={reporte.firmaConductor}
                alt="Firma Conductor"
                className="w-full h-32 object-contain"
              />
            </div>
            <p className="text-gray-900">{reporte.conductor.nombre}</p>
            <p className="text-sm text-gray-600">Cédula: {reporte.conductor.cedula}</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="size-6" />
            </button>
            {previewType.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg" />
            ) : (
              <iframe src={previewUrl} className="w-full h-[80vh] bg-white rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}