import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { useUserContext, Conductor } from './UserContext';
import { toast } from 'sonner@2.0.3';

export function ConductoresView() {
  const { conductores, setConductores } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null);
  const [formData, setFormData] = useState<Partial<Conductor>>({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    licenciaVencimiento: ''
  });

  const handleBackToHome = () => {
    window.history.back();
  };

  const getDocumentStatus = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'vencido', color: 'red', label: 'Vencido' };
    if (diffDays < 30) return { status: 'proximo', color: 'yellow', label: 'Próximo a vencer' };
    return { status: 'vigente', color: 'green', label: 'Vigente' };
  };

  const filteredConductores = conductores.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cedula.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingConductor) {
      // Verificar si el conductor estaba bloqueado y ahora está apto
      const oldStatus = getDocumentStatus(editingConductor.licenciaVencimiento);
      const newStatus = getDocumentStatus(formData.licenciaVencimiento || '');
      const wasBlocked = oldStatus.status === 'vencido';
      const isNowValid = newStatus.status === 'vigente';

      setConductores(
        conductores.map(c =>
          c.id === editingConductor.id ? { ...c, ...formData } as Conductor : c
        )
      );

      if (wasBlocked && isNowValid) {
        toast.success('✅ Conductor actualizado - APTO PARA OPERAR', {
          duration: 5000,
        });
      } else {
        toast.success('Conductor actualizado correctamente');
      }
    } else {
      const newConductor: Conductor = {
        id: `c${Date.now()}`,
        ...formData as Omit<Conductor, 'id'>
      };
      setConductores([...conductores, newConductor]);
      toast.success('Conductor agregado correctamente');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este conductor?')) {
      setConductores(conductores.filter(c => c.id !== id));
      toast.success('Conductor eliminado correctamente');
    }
  };

  const handleEdit = (conductor: Conductor) => {
    setEditingConductor(conductor);
    setFormData(conductor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingConductor(null);
    setFormData({
      nombre: '',
      cedula: '',
      telefono: '',
      email: '',
      licenciaVencimiento: ''
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
            placeholder="Buscar por nombre, cédula o email..."
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
          Agregar Conductor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-gray-700">Cédula</th>
                <th className="px-6 py-3 text-left text-gray-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-gray-700">Licencia</th>
                <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConductores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron conductores
                  </td>
                </tr>
              ) : (
                filteredConductores.map(conductor => {
                  const status = getDocumentStatus(conductor.licenciaVencimiento);
                  return (
                    <tr key={conductor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{conductor.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{conductor.cedula}</td>
                      <td className="px-6 py-4 text-gray-600">{conductor.telefono}</td>
                      <td className="px-6 py-4 text-gray-600">{conductor.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(conductor.licenciaVencimiento).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(conductor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(conductor.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                {editingConductor ? 'Editar Conductor' : 'Agregar Conductor'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cédula *</label>
                <input
                  type="text"
                  required
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Vencimiento Licencia de Conducción *
                </label>
                <input
                  type="date"
                  required
                  value={formData.licenciaVencimiento}
                  onChange={(e) => setFormData({ ...formData, licenciaVencimiento: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  {editingConductor ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}