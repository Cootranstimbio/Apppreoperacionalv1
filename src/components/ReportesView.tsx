import { useState } from 'react';
import { Eye, Download, Search, Filter } from 'lucide-react';
import { useUserContext } from './UserContext';
import { ReporteDetail } from './ReporteDetail';
import { PDFGenerator } from './PDFGenerator';

export function ReportesView() {
  const { currentUser, reportes, checkItems } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'all' | 'Mantenimiento' | 'Planillaje'>('all');
  const [selectedReporte, setSelectedReporte] = useState<string | null>(null);

  const canViewAll = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Programador';

  const misReportes = canViewAll
    ? reportes
    : reportes.filter(r => r.inspector.id === currentUser?.id);

  const filteredReportes = misReportes.filter(r => {
    const matchSearch =
      r.vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.inspector.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTipo = filterTipo === 'all' || r.tipo === filterTipo;

    return matchSearch && matchTipo;
  });

  if (selectedReporte) {
    const reporte = reportes.find(r => r.id === selectedReporte);
    if (reporte) {
      return <ReporteDetail reporte={reporte} onClose={() => setSelectedReporte(null)} />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por placa, conductor o inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-600" />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Planillaje">Planillaje</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>Total: {filteredReportes.length} reportes</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-left text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-gray-700">Vehículo</th>
                <th className="px-6 py-3 text-left text-gray-700">Conductor</th>
                <th className="px-6 py-3 text-left text-gray-700">Inspector</th>
                <th className="px-6 py-3 text-left text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReportes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron reportes
                  </td>
                </tr>
              ) : (
                filteredReportes.map(reporte => (
                  <tr key={reporte.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(reporte.fecha).toLocaleDateString('es-CO')}
                      <br />
                      <span className="text-sm text-gray-500">
                        {new Date(reporte.fecha).toLocaleTimeString('es-CO')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          reporte.tipo === 'Mantenimiento'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {reporte.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {reporte.vehiculo.placa}
                      <br />
                      <span className="text-sm text-gray-500">
                        {reporte.vehiculo.marca} {reporte.vehiculo.modelo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {reporte.conductor.nombre}
                      <br />
                      <span className="text-sm text-gray-500">{reporte.conductor.cedula}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{reporte.inspector.nombre}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReporte(reporte.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="size-4" />
                        </button>
                        <PDFGenerator reporte={reporte} checkItems={checkItems} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}