import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { useUserContext, Vehiculo } from './UserContext';
import { toast } from 'sonner@2.0.3';

export function VehiculosView() {
  const { vehiculos, setVehiculos } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [formData, setFormData] = useState<Partial<Vehiculo>>({
    placa: '',
    marca: '',
    modelo: '',
    tipo: '',
    soatVencimiento: '',
    rtmVencimiento: '',
    toVencimiento: '',
    polizaRccVencimiento: '',
    polizaRceVencimiento: ''
  });

  const getDocumentStatus = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'vencido', color: 'red' };
    if (diffDays < 30) return { status: 'proximo', color: 'yellow' };
    return { status: 'vigente', color: 'green' };
  };

  const getVehiculoStatus = (vehiculo: Vehiculo) => {
    const soat = getDocumentStatus(vehiculo.soatVencimiento);
    const rtm = getDocumentStatus(vehiculo.rtmVencimiento);
    const to = getDocumentStatus(vehiculo.toVencimiento);

    if (soat.status === 'vencido' || rtm.status === 'vencido' || to.status === 'vencido') {
      return { status: 'vencido', color: 'red', label: 'Bloqueado' };
    }
    if (soat.status === 'proximo' || rtm.status === 'proximo' || to.status === 'proximo') {
      return { status: 'proximo', color: 'yellow', label: 'Alerta' };
    }
    return { status: 'vigente', color: 'green', label: 'Activo' };
  };

  const filteredVehiculos = vehiculos.filter(v =>
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVehiculo) {
      setVehiculos(
        vehiculos.map(v =>
          v.id === editingVehiculo.id ? { ...v, ...formData } as Vehiculo : v
        )
      );
      toast.success('Vehículo actualizado correctamente');
    } else {
      const newVehiculo: Vehiculo = {
        id: `v${Date.now()}`,
        ...formData as Omit<Vehiculo, 'id'>
      };
      setVehiculos([...vehiculos, newVehiculo]);
      toast.success('Vehículo agregado correctamente');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.id !== id));
      toast.success('Vehículo eliminado correctamente');
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData(vehiculo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehiculo(null);
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      tipo: '',
      soatVencimiento: '',
      rtmVencimiento: '',
      toVencimiento: '',
      polizaRccVencimiento: '',
      polizaRceVencimiento: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por placa, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-5" />
          Agregar Vehículo
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehiculos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron vehículos
          </div>
        ) : (
          filteredVehiculos.map(vehiculo => {
            const status = getVehiculoStatus(vehiculo);
            const soat = getDocumentStatus(vehiculo.soatVencimiento);
            const rtm = getDocumentStatus(vehiculo.rtmVencimiento);
            const to = getDocumentStatus(vehiculo.toVencimiento);

            return (
              <div
                key={vehiculo.id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  status.color === 'green'
                    ? 'border-green-500'
                    : status.color === 'yellow'
                    ? 'border-yellow-500'
                    : 'border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900">{vehiculo.placa}</h3>
                    <p className="text-gray-600">
                      {vehiculo.marca} {vehiculo.modelo}
                    </p>
                    <p className="text-sm text-gray-500">{vehiculo.tipo}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      status.color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : status.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {status.color === 'red' && <AlertCircle className="size-4" />}
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SOAT:</span>
                    <span
                      className={`text-sm ${
                        soat.color === 'green'
                          ? 'text-green-600'
                          : soat.color === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {new Date(vehiculo.soatVencimiento).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">RTM:</span>
                    <span
                      className={`text-sm ${
                        rtm.color === 'green'
                          ? 'text-green-600'
                          : rtm.color === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {new Date(vehiculo.rtmVencimiento).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">T.O.:</span>
                    <span
                      className={`text-sm ${
                        to.color === 'green'
                          ? 'text-green-600'
                          : to.color === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {new Date(vehiculo.toVencimiento).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(vehiculo)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="size-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vehiculo.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                {editingVehiculo ? 'Editar Vehículo' : 'Agregar Vehículo'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Placa *</label>
                  <input
                    type="text"
                    required
                    value={formData.placa}
                    onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Marca *</label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Modelo *</label>
                  <input
                    type="text"
                    required
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tipo de Vehículo *</label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione...</option>
                    <option value="Camión">Camión</option>
                    <option value="Van">Van</option>
                    <option value="Buseta">Buseta</option>
                    <option value="Automóvil">Automóvil</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-gray-900 mb-4">Documentación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Vencimiento SOAT *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.soatVencimiento}
                      onChange={(e) => setFormData({ ...formData, soatVencimiento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Vencimiento RTM *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.rtmVencimiento}
                      onChange={(e) => setFormData({ ...formData, rtmVencimiento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Vencimiento Tarjeta de Operación *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.toVencimiento}
                      onChange={(e) => setFormData({ ...formData, toVencimiento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Vencimiento Póliza RCC *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.polizaRccVencimiento}
                      onChange={(e) => setFormData({ ...formData, polizaRccVencimiento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Vencimiento Póliza RCE *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.polizaRceVencimiento}
                      onChange={(e) => setFormData({ ...formData, polizaRceVencimiento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingVehiculo ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}