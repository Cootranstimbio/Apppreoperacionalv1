import { useState, useEffect } from 'react';
import { Info, Camera, Upload, X, Eye, AlertCircle, CheckCircle2, CheckCheck } from 'lucide-react';
import { useUserContext, Reporte, ReporteItem } from './UserContext';
import { toast } from 'sonner@2.0.3';
import { SignatureCanvas } from './SignatureCanvas';

// Definir submódulos lógicos
const SUBMODULOS: Record<string, { nombre: string; itemIds: string[] }[]> = {
  '5.1 - Cabina y Carrocería Externa': [
    { nombre: 'Vidrios y Espejos', itemIds: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'] },
    { nombre: 'Limpiaparabrisas y Visibilidad', itemIds: ['i9', 'i10', 'i11', 'i12', 'i13'] },
    { nombre: 'Sistema de Luces', itemIds: ['i14', 'i15', 'i16', 'i17', 'i18', 'i19', 'i20', 'i21', 'i22', 'i23', 'i24', 'i25', 'i26'] },
    { nombre: 'Carrocería y Estructura', itemIds: ['i27', 'i28', 'i29', 'i30', 'i31', 'i32', 'i33', 'i34', 'i35', 'i36', 'i37'] }
  ],
  '5.2 - Llantas, Frenos, Luces y Fugas': [
    { nombre: 'Llantas', itemIds: ['i38', 'i39', 'i40'] },
    { nombre: 'Sistema de Frenos y Escape', itemIds: ['i41', 'i42', 'i43'] },
    { nombre: 'Fugas de Fluidos', itemIds: ['i44', 'i45', 'i46', 'i47', 'i48', 'i49'] }
  ],
  '5.3 - Compartimiento del Motor, Fluidos y Componentes': [
    { nombre: 'Niveles de Fluidos', itemIds: ['i50', 'i51', 'i52', 'i53', 'i54'] },
    { nombre: 'Tapas y Cierres', itemIds: ['i55', 'i56'] },
    { nombre: 'Sistema Eléctrico', itemIds: ['i57', 'i58'] },
    { nombre: 'Correas y Componentes', itemIds: ['i59', 'i60'] },
    { nombre: 'Batería', itemIds: ['i61', 'i62', 'i63'] },
    { nombre: 'Filtros y Dirección', itemIds: ['i64', 'i65', 'i66', 'i67'] }
  ],
  '5.4 - Interior del Vehículo y Seguridad Obligatoria': [
    { nombre: 'Sistema de Encendido e Instrumentos', itemIds: ['i68', 'i69', 'i70', 'i71', 'i72', 'i73'] },
    { nombre: 'Condiciones del Interior', itemIds: ['i74', 'i75', 'i76', 'i77', 'i78'] },
    { nombre: 'Cinturones de Seguridad', itemIds: ['i79', 'i80', 'i81', 'i82'] },
    { nombre: 'Salidas de Emergencia', itemIds: ['i83', 'i84', 'i85', 'i86'] },
    { nombre: 'Herramientas de Emergencia', itemIds: ['i87', 'i88', 'i89', 'i90', 'i91', 'i92', 'i93'] },
    { nombre: 'Extintor', itemIds: ['i94', 'i95', 'i96'] },
    { nombre: 'Botiquín', itemIds: ['i97', 'i98', 'i99', 'i100', 'i101'] },
    { nombre: 'Documentación Legal', itemIds: ['i102', 'i103', 'i104'] }
  ]
};

export function ChequeoView() {
  const { currentUser, vehiculos, conductores, checkItems, reportes, setReportes } = useUserContext();
  const [step, setStep] = useState<'select' | 'inspect' | 'signature'>('select');
  const [selectedVehiculo, setSelectedVehiculo] = useState('');
  const [selectedConductor, setSelectedConductor] = useState('');
  const [items, setItems] = useState<ReporteItem[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', criterio: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [firmaInspector, setFirmaInspector] = useState('');
  const [firmaConductor, setFirmaConductor] = useState('');

  const tipo = currentUser?.rol === 'Mantenimiento' ? 'Mantenimiento' : 'Planillaje';
  
  const filteredItems = tipo === 'Planillaje' 
    ? checkItems.filter(item => item.islero)
    : checkItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.modulo]) {
      acc[item.modulo] = [];
    }
    acc[item.modulo].push(item);
    return acc;
  }, {} as Record<string, typeof checkItems>);

  useEffect(() => {
    if (step === 'inspect' && items.length === 0) {
      const initialItems: ReporteItem[] = filteredItems.map(item => ({
        itemId: item.id,
        estado: null,
        observacion: '',
        adjuntos: []
      }));
      setItems(initialItems);
    }
  }, [step, filteredItems]);

  const handleStartInspection = () => {
    if (!selectedVehiculo || !selectedConductor) {
      toast.error('Debe seleccionar un vehículo y un conductor');
      return;
    }
    setStep('inspect');
  };

  const handleEstadoChange = (itemId: string, estado: 'bien' | 'regular' | 'mal') => {
    setItems(items.map(item =>
      item.itemId === itemId ? { ...item, estado } : item
    ));
  };

  const handleObservacionChange = (itemId: string, observacion: string) => {
    setItems(items.map(item =>
      item.itemId === itemId ? { ...item, observacion } : item
    ));
  };

  const handleSetAllOK = (submoduloItemIds: string[]) => {
    setItems(items.map(item =>
      submoduloItemIds.includes(item.itemId) 
        ? { ...item, estado: 'bien' as const, observacion: '' } 
        : item
    ));
    toast.success('Todos los ítems del submódulo marcados como "Bien"');
  };

  const handleFileUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const url = reader.result as string;
      setItems(items.map(item =>
        item.itemId === itemId
          ? {
              ...item,
              adjuntos: [...item.adjuntos, { name: file.name, url, type: file.type }]
            }
          : item
      ));
      toast.success('Archivo adjuntado correctamente');
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (itemId: string, index: number) => {
    setItems(items.map(item =>
      item.itemId === itemId
        ? {
            ...item,
            adjuntos: item.adjuntos.filter((_, i) => i !== index)
          }
        : item
    ));
  };

  const handlePreview = (url: string, type: string) => {
    setPreviewUrl(url);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  const validateAndSubmit = () => {
    const incomplete = items.find(item => {
      if (item.estado === null) return true;
      if ((item.estado === 'regular' || item.estado === 'mal') && !item.observacion.trim()) {
        return true;
      }
      return false;
    });

    if (incomplete) {
      toast.error('¡Campo Requerido! Debe completar todos los ítems antes de continuar.');
      
      setTimeout(() => {
        const element = document.getElementById(`item-${incomplete.itemId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-red-500');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-red-500');
          }, 3000);
        }
      }, 100);
      return;
    }

    setStep('signature');
  };

  const handleFinalize = () => {
    if (!firmaInspector || !firmaConductor) {
      toast.error('Se requieren las firmas del inspector y del conductor');
      return;
    }

    const vehiculo = vehiculos.find(v => v.id === selectedVehiculo)!;
    const conductor = conductores.find(c => c.id === selectedConductor)!;

    const nuevoReporte: Reporte = {
      id: `r${Date.now()}`,
      fecha: new Date().toISOString(),
      vehiculo,
      conductor,
      inspector: currentUser!,
      tipo,
      items,
      firmaInspector,
      firmaConductor
    };

    setReportes([...reportes, nuevoReporte]);
    toast.success('Chequeo finalizado correctamente');

    setStep('select');
    setSelectedVehiculo('');
    setSelectedConductor('');
    setItems([]);
    setFirmaInspector('');
    setFirmaConductor('');
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-900 mb-6">
            Nuevo Chequeo - {tipo}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Seleccionar Vehículo *</label>
              <select
                value={selectedVehiculo}
                onChange={(e) => setSelectedVehiculo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un vehículo...</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.marca} {v.modelo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Seleccionar Conductor *</label>
              <select
                value={selectedConductor}
                onChange={(e) => setSelectedConductor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un conductor...</option>
                {conductores.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} - {c.cedula}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartInspection}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Inspección
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p>Este formulario contiene {filteredItems.length} ítems de verificación para chequeo tipo <strong>{tipo}</strong>.</p>
              <p className="mt-2">Todos los campos son obligatorios. Si marca "Regular" o "Mal", debe agregar una observación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'signature') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-900 mb-6">Firmas Digitales</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Firma del Inspector ({currentUser?.nombre})
              </label>
              <SignatureCanvas onSave={setFirmaInspector} />
              {firmaInspector && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="size-5" />
                  <span className="text-sm">Firma guardada</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Firma del Conductor ({conductores.find(c => c.id === selectedConductor)?.nombre})
              </label>
              <SignatureCanvas onSave={setFirmaConductor} />
              {firmaConductor && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="size-5" />
                  <span className="text-sm">Firma guardada</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('inspect')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleFinalize}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finalizar Chequeo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-gray-900">Inspección - {tipo}</h2>
            <p className="text-gray-600">
              {vehiculos.find(v => v.id === selectedVehiculo)?.placa} - {conductores.find(c => c.id === selectedConductor)?.nombre}
            </p>
          </div>
          <button
            onClick={validateAndSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar a Firmas
          </button>
        </div>
      </div>

      {Object.entries(groupedItems).map(([modulo, moduloItems]) => {
        const submodulos = SUBMODULOS[modulo] || [{ nombre: 'Todos', itemIds: moduloItems.map(i => i.id) }];
        
        return (
          <div key={modulo} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-gray-900">{modulo}</h3>
            </div>
            <div className="p-6 space-y-8">
              {submodulos.map((submodulo, idx) => {
                const submoduloItems = moduloItems.filter(item => 
                  submodulo.itemIds.includes(item.id)
                );

                if (submoduloItems.length === 0) return null;

                return (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-800">{submodulo.nombre}</h4>
                      <button
                        onClick={() => handleSetAllOK(submodulo.itemIds)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCheck className="size-5" />
                        <span>Todo en Orden</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {submoduloItems.map(checkItem => {
                        const item = items.find(i => i.itemId === checkItem.id);
                        if (!item) return null;

                        const needsObservation = item.estado === 'regular' || item.estado === 'mal';
                        const isIncomplete = item.estado === null || (needsObservation && !item.observacion.trim());

                        return (
                          <div
                            key={checkItem.id}
                            id={`item-${checkItem.id}`}
                            className={`border border-gray-200 rounded-lg p-4 transition-all ${
                              isIncomplete ? 'bg-red-50 border-red-300' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <p className="text-gray-900">{checkItem.nombre}</p>
                              </div>
                              <button
                                onClick={() => {
                                  setInfoContent({ title: checkItem.nombre, criterio: checkItem.criterio });
                                  setShowInfoModal(true);
                                }}
                                className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver criterio de inspección"
                              >
                                <Info className="size-5" />
                              </button>
                            </div>

                            {isIncomplete && (
                              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">
                                  ¡Campo Requerido! Debe seleccionar un estado{needsObservation && ' y llenar la observación'}.
                                </p>
                              </div>
                            )}

                            <div className="flex gap-3 mb-4">
                              <button
                                onClick={() => handleEstadoChange(checkItem.id, 'bien')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                                  item.estado === 'bien'
                                    ? 'bg-green-100 border-green-500 text-green-800'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Bien
                              </button>
                              <button
                                onClick={() => handleEstadoChange(checkItem.id, 'regular')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                                  item.estado === 'regular'
                                    ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Regular
                              </button>
                              <button
                                onClick={() => handleEstadoChange(checkItem.id, 'mal')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                                  item.estado === 'mal'
                                    ? 'bg-red-100 border-red-500 text-red-800'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Mal
                              </button>
                            </div>

                            {needsObservation && (
                              <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                  Observación * <span className="text-sm text-gray-500">(Requerida)</span>
                                </label>
                                <textarea
                                  value={item.observacion}
                                  onChange={(e) => handleObservacionChange(checkItem.id, e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={3}
                                  placeholder="Describa el problema o la condición encontrada..."
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-gray-700 mb-2">Adjuntar evidencia (opcional)</label>
                              <div className="flex gap-2 mb-3">
                                <label className="flex-1 cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileUpload(checkItem.id, e)}
                                    className="hidden"
                                  />
                                  <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Upload className="size-5 text-gray-600" />
                                    <span className="text-gray-700">Subir archivo</span>
                                  </div>
                                </label>
                              </div>

                              {item.adjuntos.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                  {item.adjuntos.map((adjunto, index) => (
                                    <div
                                      key={index}
                                      className="relative border border-gray-200 rounded-lg p-2 group"
                                    >
                                      <div className="flex items-center gap-2">
                                        {adjunto.type.startsWith('image/') ? (
                                          <img
                                            src={adjunto.url}
                                            alt={adjunto.name}
                                            className="size-12 object-cover rounded"
                                          />
                                        ) : (
                                          <div className="size-12 bg-red-100 rounded flex items-center justify-center">
                                            <span className="text-xs text-red-800">PDF</span>
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-gray-900 truncate">{adjunto.name}</p>
                                        </div>
                                      </div>
                                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => handlePreview(adjunto.url, adjunto.type)}
                                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                          <Eye className="size-4" />
                                        </button>
                                        <button
                                          onClick={() => handleRemoveFile(checkItem.id, index)}
                                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                          <X className="size-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={validateAndSubmit}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar a Firmas
        </button>
      </div>

      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">Criterio de Inspección</h3>
              <p className="text-sm text-gray-600 mt-1">{infoContent.title}</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700">{infoContent.criterio}</p>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
