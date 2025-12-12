import { useState } from 'react';
import { Eye, Download, Search, Filter, Printer } from 'lucide-react';
import { useUserContext } from './UserContext';
import { ReporteDetail } from './ReporteDetail';

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

  const generatePDF = (reporteId: string) => {
    const reporte = reportes.find(r => r.id === reporteId);
    if (!reporte) return;

    // In a real app, this would generate a proper PDF using a library like jsPDF
    // For now, we'll create a printable HTML version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHTML = reporte.items
      .map(item => {
        const checkItem = checkItems.find(ci => ci.id === item.itemId);
        if (!checkItem) return '';

        const estadoColor = item.estado === 'bien' ? 'green' : item.estado === 'regular' ? 'orange' : 'red';
        const estadoText = item.estado === 'bien' ? 'BIEN' : item.estado === 'regular' ? 'REGULAR' : 'MAL';

        return `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>${checkItem.nombre}</strong>
              <span style="color: ${estadoColor}; font-weight: bold;">${estadoText}</span>
            </div>
            ${item.observacion ? `<p style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;"><strong>Observación:</strong> ${item.observacion}</p>` : ''}
            ${item.adjuntos.length > 0 ? `
              <div style="margin-top: 15px;">
                <strong>Evidencias Adjuntas:</strong>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                  ${item.adjuntos.map(adj => {
                    if (adj.type.startsWith('image/')) {
                      return `<img src="${adj.url}" style="width: 100%; height: 300px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;" />`;
                    } else {
                      return `<div style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; text-align: center; background: #f9f9f9;">PDF: ${adj.name}</div>`;
                    }
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      })
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte ${reporte.vehiculo.placa} - ${new Date(reporte.fecha).toLocaleDateString('es-CO')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { color: #1e40af; }
          .header { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; page-break-inside: avoid; }
          .signature-box { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .signature-box img { max-width: 300px; height: 150px; border: 1px solid #ddd; margin: 10px auto; display: block; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #1e40af; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
            Imprimir / Guardar como PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Cerrar
          </button>
        </div>

        <h1>TRANSTIMBIO - Reporte de Chequeo Pre-Operacional</h1>
        
        <div class="header">
          <p><strong>Tipo de Chequeo:</strong> ${reporte.tipo}</p>
          <p><strong>Fecha:</strong> ${new Date(reporte.fecha).toLocaleDateString('es-CO')} ${new Date(reporte.fecha).toLocaleTimeString('es-CO')}</p>
          <p><strong>Vehículo:</strong> ${reporte.vehiculo.placa} - ${reporte.vehiculo.marca} ${reporte.vehiculo.modelo}</p>
          <p><strong>Conductor:</strong> ${reporte.conductor.nombre} (${reporte.conductor.cedula})</p>
          <p><strong>Inspector:</strong> ${reporte.inspector.nombre} (${reporte.inspector.rol})</p>
        </div>

        <h2>Ítems de Inspección</h2>
        ${itemsHTML}

        <div class="signatures">
          <div class="signature-box">
            <h3>Firma del Inspector</h3>
            <img src="${reporte.firmaInspector}" alt="Firma Inspector" />
            <p>${reporte.inspector.nombre}</p>
            <p>${reporte.inspector.rol}</p>
          </div>
          <div class="signature-box">
            <h3>Firma del Conductor</h3>
            <img src="${reporte.firmaConductor}" alt="Firma Conductor" />
            <p>${reporte.conductor.nombre}</p>
            <p>Cédula: ${reporte.conductor.cedula}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

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
                        <button
                          onClick={() => generatePDF(reporte.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Descargar PDF"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          onClick={() => generatePDF(reporte.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Imprimir"
                        >
                          <Printer className="size-4" />
                        </button>
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