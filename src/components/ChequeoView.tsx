import { useState } from 'react';
import { useUserContext, ReporteItem } from './UserContext';
import { Info, AlertCircle, Upload, Eye, X, CheckCircle2, FileText, Camera, CheckCheck } from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';
import { toast } from 'sonner@2.0.3';

type TipoChequeo = 'Mantenimiento' | 'Planillaje';
type Step = 'select' | 'inspect' | 'success';

export function ChequeoView() {
  const { currentUser, conductores, vehiculos, checkItems, reportes, setReportes } = useUserContext();
  const [tipo, setTipo] = useState<TipoChequeo>(
    currentUser?.rol === 'Operador Isla' ? 'Planillaje' : 'Mantenimiento'
  );
  const [step, setStep] = useState<Step>('select');
  const [selectedVehiculo, setSelectedVehiculo] = useState('');
  const [selectedConductor, setSelectedConductor] = useState('');
  const [items, setItems] = useState<ReporteItem[]>([]);
  const [documentosGenerales, setDocumentosGenerales] = useState<{ name: string; url: string; type: string }[]>([]);
  const [firmaInspector, setFirmaInspector] = useState('');
  const [firmaConductor, setFirmaConductor] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', criterio: '' });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');

  // Determinar qué tipo de chequeos puede hacer el usuario
  const canDoMantenimiento = currentUser?.rol === 'Mantenimiento';
  const canDoPlanillaje = currentUser?.rol === 'Operador Isla';

  // Función para verificar si un documento está vencido
  const isDocumentExpired = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < today;
  };

  // Verificar documentación del vehículo y conductor seleccionado
  const vehiculoSeleccionado = vehiculos.find(v => v.id === selectedVehiculo);
  const conductorSeleccionado = conductores.find(c => c.id === selectedConductor);

  const getDocumentacionStatus = () => {
    const problemas: string[] = [];

    if (vehiculoSeleccionado) {
      if (isDocumentExpired(vehiculoSeleccionado.soatVencimiento)) {
        problemas.push('SOAT vencido');
      }
      if (isDocumentExpired(vehiculoSeleccionado.rtmVencimiento)) {
        problemas.push('RTM vencida');
      }
      if (isDocumentExpired(vehiculoSeleccionado.toVencimiento)) {
        problemas.push('Tarjeta de Operación vencida');
      }
      if (isDocumentExpired(vehiculoSeleccionado.polizaRccVencimiento)) {
        problemas.push('Póliza RCC vencida');
      }
      if (isDocumentExpired(vehiculoSeleccionado.polizaRceVencimiento)) {
        problemas.push('Póliza RCE vencida');
      }
    }

    if (conductorSeleccionado) {
      if (isDocumentExpired(conductorSeleccionado.licenciaVencimiento)) {
        problemas.push('Licencia de conducción vencida');
      }
    }

    return {
      tieneProblemas: problemas.length > 0,
      problemas
    };
  };

  const documentacionStatus = getDocumentacionStatus();

  // Filtrar ítems excluyendo llantas y rodamientos para Operador Isla
  const filteredItems = currentUser?.rol === 'Operador Isla' 
    ? checkItems.filter(item => 
        item.islero && 
        !item.nombre.toLowerCase().includes('llanta') && 
        !item.nombre.toLowerCase().includes('rodamiento')
      )
    : checkItems;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.modulo]) {
      acc[item.modulo] = [];
    }
    acc[item.modulo].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  const handleStartInspection = () => {
    if (!selectedVehiculo || !selectedConductor) {
      toast.error('Debe seleccionar un vehículo y un conductor');
      return;
    }

    const newItems: ReporteItem[] = filteredItems.map(item => ({
      itemId: item.id,
      estado: null,
      observacion: '',
      adjuntos: []
    }));

    setItems(newItems);
    setStep('inspect');
  };

  const handleMarkAllAsGood = () => {
    setItems(items.map(item => ({
      ...item,
      estado: 'bien'
    })));
    toast.success(`Se marcaron ${items.length} ítems como "Bien"`);
  };

  const handleMarkModuleAsGood = (modulo: string) => {
    const moduleCheckItems = groupedItems[modulo];
    const moduleItemIds = moduleCheckItems.map(item => item.id);
    
    setItems(items.map(item => 
      moduleItemIds.includes(item.itemId) 
        ? { ...item, estado: 'bien' }
        : item
    ));
    
    toast.success(`Se marcaron ${moduleCheckItems.length} ítems del módulo "${modulo}" como "Bien"`);
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

  const handleFileUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      setItems(items.map(item =>
        item.itemId === itemId
          ? {
              ...item,
              adjuntos: [...item.adjuntos, { name: file.name, url, type: file.type }]
            }
          : item
      ));
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

  const handleGeneralFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      setDocumentosGenerales([...documentosGenerales, { name: file.name, url, type: file.type }]);
      toast.success('Documento agregado correctamente');
    };

    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const url = event.target?.result as string;
      setDocumentosGenerales([...documentosGenerales, { name: file.name, url, type: file.type }]);
      toast.success('Foto capturada correctamente');
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveGeneralFile = (index: number) => {
    setDocumentosGenerales(documentosGenerales.filter((_, i) => i !== index));
    toast.success('Documento eliminado');
  };

  const handlePreview = (url: string, type: string) => {
    setPreviewUrl(url);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  const validateAndFinalize = () => {
    // Validar que todos los items tengan estado
    const incompleteItems = items.filter(item => {
      if (item.estado === null) return true;
      if ((item.estado === 'regular' || item.estado === 'mal') && !item.observacion.trim()) {
        return true;
      }
      return false;
    });

    if (incompleteItems.length > 0) {
      const firstIncomplete = incompleteItems[0];
      const element = document.getElementById(`item-${firstIncomplete.itemId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error(`Hay ${incompleteItems.length} ítem(s) incompleto(s). Por favor complete todos los campos.`);
      return;
    }

    // Validar firmas
    if (!firmaInspector || !firmaConductor) {
      toast.error('Debe completar ambas firmas digitales');
      // Scroll a la sección de firmas
      const firmasElement = document.getElementById('firmas-section');
      if (firmasElement) {
        firmasElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Crear el reporte
    const vehiculo = vehiculos.find(v => v.id === selectedVehiculo);
    const conductor = conductores.find(c => c.id === selectedConductor);

    if (!vehiculo || !conductor || !currentUser) {
      toast.error('Error al crear el reporte');
      return;
    }

    // Verificar si hay problemas de documentación al momento de guardar
    const motivoBloqueo = documentacionStatus.tieneProblemas 
      ? `NO PUEDE HACER RODAMIENTO: ${documentacionStatus.problemas.join(', ')}`
      : undefined;

    const newReporte = {
      id: `r${Date.now()}`,
      fecha: new Date().toISOString(),
      vehiculo,
      conductor,
      inspector: currentUser,
      tipo,
      items,
      documentosGenerales,
      firmaInspector,
      firmaConductor,
      documentacionVencida: documentacionStatus.tieneProblemas,
      motivoBloqueo
    };

    setReportes([...reportes, newReporte]);
    
    if (documentacionStatus.tieneProblemas) {
      toast.success('Chequeo registrado - VEHÍCULO BLOQUEADO POR DOCUMENTACIÓN VENCIDA');
    } else {
      toast.success('Chequeo completado exitosamente');
    }
    
    // Ir a la pantalla de éxito
    setStep('success');
  };

  const resetForm = () => {
    setStep('select');
    setSelectedVehiculo('');
    setSelectedConductor('');
    setItems([]);
    setDocumentosGenerales([]);
    setFirmaInspector('');
    setFirmaConductor('');
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-gray-900 mb-2">¡Chequeo Completado!</h2>
          <p className="text-gray-600 mb-8">
            El chequeo {tipo} se ha registrado correctamente
          </p>
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nuevo Chequeo
            </button>
            <button
              onClick={() => {
                resetForm();
                // Simular click en el botón de reportes para cambiar de vista
                window.dispatchEvent(new CustomEvent('navigate-to-reportes'));
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="size-5" />
              Ver Todos los Chequeos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-900 mb-6">
            Nuevo Chequeo - {tipo}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Tipo de Chequeo *</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoChequeo)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {canDoMantenimiento && <option value="Mantenimiento">Mantenimiento (Completo)</option>}
                {canDoPlanillaje && <option value="Planillaje">Planillaje (Simplificado)</option>}
              </select>
            </div>

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

            {/* Advertencia de documentación vencida */}
            {selectedVehiculo && selectedConductor && documentacionStatus.tieneProblemas && (
              <div className="mt-6 bg-red-50 border-2 border-red-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="size-10 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-900 mb-2">⚠️ VEHÍCULO/CONDUCTOR NO PUEDE SER DESPACHADO</h3>
                    <p className="text-red-800 mb-3">
                      <strong>NO PUEDE HACER RODAMIENTO</strong> - Documentación vencida o próxima a vencer
                    </p>
                    <ul className="space-y-1 text-red-700">
                      {documentacionStatus.problemas.map((problema, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="size-1.5 bg-red-600 rounded-full"></span>
                          {problema}
                        </li>
                      ))}
                    </ul>
                    <p className="text-red-800 mt-4 p-3 bg-red-100 rounded border border-red-300">
                      <strong>NOTA:</strong> El chequeo puede realizarse y quedará registrado con estado &quot;BLOQUEADO POR DOCUMENTACIÓN&quot;. 
                      El vehículo NO debe operar hasta renovar la documentación correspondiente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p>Este formulario contiene {filteredItems.length} ítems de verificación para chequeo tipo <strong>{tipo}</strong>.</p>
              <p className="mt-2">Todos los campos son obligatorios. Si marca &quot;Regular&quot; o &quot;Mal&quot;, debe agregar una observación.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-gray-900">Inspección - {tipo}</h2>
            <p className="text-gray-600">
              {vehiculos.find(v => v.id === selectedVehiculo)?.placa} - {conductores.find(c => c.id === selectedConductor)?.nombre}
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleMarkAllAsGood}
              className="flex-1 sm:flex-initial px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              title="Marcar todos los ítems como 'Bien'"
            >
              <CheckCheck className="size-5" />
              <span className="hidden sm:inline">Marcar Todos Bien</span>
              <span className="sm:hidden">Todo Bien</span>
            </button>
            <button
              onClick={validateAndFinalize}
              className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <p><strong>Tip:</strong> Si todos los ítems están en buen estado, usa el botón <strong>"Marcar Todos Bien"</strong> para agilizar el proceso. Luego puedes modificar solo los ítems que requieran atención.</p>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(groupedItems).map(([modulo, moduloItems]) => (
        <div key={modulo} className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-gray-900">{modulo}</h3>
                <p className="text-sm text-gray-600 mt-1">{moduloItems.length} ítems</p>
              </div>
              <button
                onClick={() => handleMarkModuleAsGood(modulo)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                title={`Marcar todos los ítems de ${modulo} como 'Bien'`}
              >
                <CheckCheck className="size-4" />
                <span>Marcar Módulo Bien</span>
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {moduloItems.map(checkItem => {
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
                    <div>
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
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sección de Documentos y Evidencias Generales */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 bg-purple-50">
          <h3 className="text-gray-900">Documentos y Evidencias Generales</h3>
          <p className="text-sm text-gray-600 mt-1">Carga documentos, toma fotos o sube imágenes adicionales (opcional)</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subir Documento */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleGeneralFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <Upload className="size-8 text-gray-600" />
                <span className="text-sm text-gray-700 text-center">Cargar Documento</span>
                <span className="text-xs text-gray-500">PDF, DOC, XLS, IMG</span>
              </div>
            </label>

            {/* Tomar Foto */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <Camera className="size-8 text-gray-600" />
                <span className="text-sm text-gray-700 text-center">Tomar Foto</span>
                <span className="text-xs text-gray-500">Usar cámara</span>
              </div>
            </label>

            {/* Subir Imagen */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGeneralFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors">
                <Upload className="size-8 text-gray-600" />
                <span className="text-sm text-gray-700 text-center">Subir Imagen</span>
                <span className="text-xs text-gray-500">JPG, PNG, etc.</span>
              </div>
            </label>
          </div>

          {/* Lista de documentos cargados */}
          {documentosGenerales.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-gray-700 mb-3">Documentos Cargados ({documentosGenerales.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {documentosGenerales.map((doc, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-lg p-3 group hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {doc.type.startsWith('image/') ? (
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="size-16 object-cover rounded"
                        />
                      ) : (
                        <div className="size-16 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <FileText className="size-8 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.type.split('/')[1]?.toUpperCase() || 'Archivo'}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePreview(doc.url, doc.type)}
                        className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
                        title="Ver"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveGeneralFile(index)}
                        className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
                        title="Eliminar"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {documentosGenerales.length === 0 && (
            <div className="text-center py-8">
              <FileText className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay documentos cargados</p>
              <p className="text-gray-400 text-xs mt-1">Usa las opciones de arriba para agregar documentos o fotos</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Firmas */}
      <div id="firmas-section" className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-6">Firmas Digitales</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Firma del Inspector ({currentUser?.nombre}) *
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
              Firma del Conductor ({conductores.find(c => c.id === selectedConductor)?.nombre}) *
            </label>
            <SignatureCanvas onSave={setFirmaConductor} />
            {firmaConductor && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="size-5" />
                <span className="text-sm">Firma guardada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={validateAndFinalize}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Finalizar Chequeo
        </button>
      </div>

      {/* Info Modal */}
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