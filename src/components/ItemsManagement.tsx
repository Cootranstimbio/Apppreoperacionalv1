import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useUserContext, CheckItem } from './UserContext';
import { toast } from 'sonner@2.0.3';

export function ItemsManagement() {
  const { checkItems, setCheckItems } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CheckItem | null>(null);
  const [formData, setFormData] = useState<Partial<CheckItem>>({
    nombre: '',
    modulo: '',
    criterio: '',
    islero: true
  });

  const modulos = Array.from(new Set(checkItems.map(item => item.modulo)));

  const filteredItems = checkItems.filter(item => {
    const matchSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModulo = filterModulo === 'all' || item.modulo === filterModulo;

    return matchSearch && matchModulo;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.modulo]) {
      acc[item.modulo] = [];
    }
    acc[item.modulo].push(item);
    return acc;
  }, {} as Record<string, typeof checkItems>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.modulo || !formData.criterio) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (editingItem) {
      setCheckItems(
        checkItems.map(item =>
          item.id === editingItem.id ? { ...item, ...formData } as CheckItem : item
        )
      );
      toast.success('Ítem actualizado correctamente');
    } else {
      const newItem: CheckItem = {
        id: `i${Date.now()}`,
        ...formData as Omit<CheckItem, 'id'>
      };
      setCheckItems([...checkItems, newItem]);
      toast.success('Ítem agregado correctamente');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este ítem? Esta acción no se puede deshacer.')) {
      setCheckItems(checkItems.filter(item => item.id !== id));
      toast.success('Ítem eliminado correctamente');
    }
  };

  const handleEdit = (item: CheckItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      nombre: '',
      modulo: '',
      criterio: '',
      islero: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o módulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterModulo}
            onChange={(e) => setFilterModulo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los módulos</option>
            {modulos.map(modulo => (
              <option key={modulo} value={modulo}>
                {modulo}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus className="size-5" />
          Agregar Ítem
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Total de Ítems</p>
          <p className="text-gray-900">{checkItems.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Ítems para Mecánico</p>
          <p className="text-gray-900">{checkItems.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Ítems para Islero</p>
          <p className="text-gray-900">{checkItems.filter(i => i.islero).length}</p>
        </div>
      </div>

      {/* Items by Module */}
      {Object.entries(groupedItems).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          No se encontraron ítems
        </div>
      ) : (
        Object.entries(groupedItems).map(([modulo, moduloItems]) => (
          <div key={modulo} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-gray-900">
                {modulo} <span className="text-sm text-gray-600">({moduloItems.length} ítems)</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {moduloItems.map(item => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{item.nombre}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.islero
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.islero ? 'Mecánico + Islero' : 'Solo Mecánico'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.criterio}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">
                {editingItem ? 'Editar Ítem de Chequeo' : 'Agregar Ítem de Chequeo'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre del Ítem *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Llantas Rodamiento (Nivel de Labrado)"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Módulo / Grupo *</label>
                <input
                  type="text"
                  required
                  value={formData.modulo}
                  onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 5.2 - Llantas, Frenos, Luces y Fugas"
                  list="modulos-list"
                />
                <datalist id="modulos-list">
                  {modulos.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Criterio de Inspección *</label>
                <textarea
                  required
                  value={formData.criterio}
                  onChange={(e) => setFormData({ ...formData, criterio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ej: Profundidad mínima de 1.6 mm en el dibujo."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="islero-checkbox"
                  checked={formData.islero}
                  onChange={(e) => setFormData({ ...formData, islero: e.target.checked })}
                  className="size-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="islero-checkbox" className="text-gray-900 cursor-pointer">
                  Este ítem aplica también para el chequeo del Operador Isla (Islero)
                </label>
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
                  {editingItem ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
