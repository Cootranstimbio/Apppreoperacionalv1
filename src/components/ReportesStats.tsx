import { X, TrendingUp, Calendar, Clock, User, BarChart3 } from 'lucide-react';
import { useUserContext } from './UserContext';

interface ReportesStatsProps {
  onClose: () => void;
}

export function ReportesStats({ onClose }: ReportesStatsProps) {
  const { currentUser, reportes } = useUserContext();

  const today = new Date();
  const todayStr = today.toDateString();
  
  // Reportes del día
  const reportesDelDia = reportes.filter(r => {
    const reporteDate = new Date(r.fecha);
    return reporteDate.toDateString() === todayStr;
  });

  // Reportes del mes actual - General
  const reportesMensualGeneral = reportes.filter(r => {
    const reporteDate = new Date(r.fecha);
    return reporteDate.getMonth() === today.getMonth() && reporteDate.getFullYear() === today.getFullYear();
  });

  // Reportes del mes actual - Usuario actual
  const reportesMensualUsuario = reportes.filter(r => {
    const reporteDate = new Date(r.fecha);
    return (
      reporteDate.getMonth() === today.getMonth() &&
      reporteDate.getFullYear() === today.getFullYear() &&
      r.inspector.id === currentUser?.id
    );
  });

  // Estadísticas por tipo
  const getStatsByTipo = (reportesList: typeof reportes) => {
    const mantenimiento = reportesList.filter(r => r.tipo === 'Mantenimiento').length;
    const planillaje = reportesList.filter(r => r.tipo === 'Planillaje').length;
    return { mantenimiento, planillaje };
  };

  const statsDia = getStatsByTipo(reportesDelDia);
  const statsMensualGeneral = getStatsByTipo(reportesMensualGeneral);
  const statsMensualUsuario = getStatsByTipo(reportesMensualUsuario);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Estadísticas de Reportes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Inspector: {currentUser?.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Reportes del Día */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Clock className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Reportes del Día</h3>
                <p className="text-sm text-gray-600">
                  {today.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-blue-600">{reportesDelDia.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-purple-600">{statsDia.mantenimiento}</p>
                <p className="text-sm text-gray-600 mt-1">Mantenimiento</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-green-600">{statsDia.planillaje}</p>
                <p className="text-sm text-gray-600 mt-1">Planillaje</p>
              </div>
            </div>

            {reportesDelDia.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700">Últimos registros del día:</p>
                {reportesDelDia.slice(0, 3).map(reporte => (
                  <div key={reporte.id} className="bg-white rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{reporte.vehiculo.placa}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        reporte.tipo === 'Mantenimiento' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {reporte.tipo}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {new Date(reporte.fecha).toLocaleTimeString('es-CO')} - {reporte.conductor.nombre}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reportes Mensual - General */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <BarChart3 className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Resumen Mensual General</h3>
                <p className="text-sm text-gray-600">
                  {today.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-purple-600">{reportesMensualGeneral.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-purple-600">{statsMensualGeneral.mantenimiento}</p>
                <p className="text-sm text-gray-600 mt-1">Mantenimiento</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-green-600">{statsMensualGeneral.planillaje}</p>
                <p className="text-sm text-gray-600 mt-1">Planillaje</p>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">Distribución por inspector:</p>
              {Array.from(new Set(reportesMensualGeneral.map(r => r.inspector.id))).map(inspectorId => {
                const inspector = reportesMensualGeneral.find(r => r.inspector.id === inspectorId)?.inspector;
                const count = reportesMensualGeneral.filter(r => r.inspector.id === inspectorId).length;
                const percentage = ((count / reportesMensualGeneral.length) * 100).toFixed(1);
                
                return (
                  <div key={inspectorId} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm text-gray-900">{inspector?.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{count} reportes</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reportes Mensual - Usuario */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <User className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Resumen Mensual del Usuario</h3>
                <p className="text-sm text-gray-600">
                  {today.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-green-600">{reportesMensualUsuario.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-purple-600">{statsMensualUsuario.mantenimiento}</p>
                <p className="text-sm text-gray-600 mt-1">Mantenimiento</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl text-green-600">{statsMensualUsuario.planillaje}</p>
                <p className="text-sm text-gray-600 mt-1">Planillaje</p>
              </div>
            </div>

            {reportesMensualUsuario.length > 0 && (
              <div className="mt-4 bg-white rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">Promedio diario:</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-green-600">
                    {(reportesMensualUsuario.length / today.getDate()).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600">reportes por día</span>
                </div>
              </div>
            )}

            {reportesMensualUsuario.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700">Últimos reportes del mes:</p>
                {reportesMensualUsuario.slice(-5).reverse().map(reporte => (
                  <div key={reporte.id} className="bg-white rounded p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{reporte.vehiculo.placa}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        reporte.tipo === 'Mantenimiento' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {reporte.tipo}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {new Date(reporte.fecha).toLocaleDateString('es-CO')} - {reporte.conductor.nombre}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comparativo */}
          {reportesMensualGeneral.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="size-6 text-gray-600" />
                <h3 className="text-gray-900">Comparativo de Rendimiento</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">Tu participación en el mes:</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-600 h-full rounded-full transition-all"
                        style={{
                          width: `${(reportesMensualUsuario.length / reportesMensualGeneral.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">
                      {((reportesMensualUsuario.length / reportesMensualGeneral.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {reportesMensualUsuario.length} de {reportesMensualGeneral.length} reportes totales
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
