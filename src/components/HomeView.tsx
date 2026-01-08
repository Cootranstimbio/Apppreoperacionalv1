import { Users, Truck, FileText, ClipboardCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUserContext } from './UserContext';

export function HomeView() {
  const { currentUser, conductores, vehiculos, reportes } = useUserContext();

  const handleNavigateToConductores = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-conductores'));
  };

  const handleNavigateToVehiculos = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-vehiculos'));
  };

  const handleNavigateToReportes = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-reportes'));
  };

  const getDocumentStatus = (fechaVencimiento: string) => {
    const today = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'vencido';
    if (diffDays < 30) return 'proximo';
    return 'vigente';
  };

  const conductoresVencidos = conductores.filter(c => getDocumentStatus(c.licenciaVencimiento) === 'vencido').length;
  const conductoresProximos = conductores.filter(c => getDocumentStatus(c.licenciaVencimiento) === 'proximo').length;

  const vehiculosVencidos = vehiculos.filter(v =>
    getDocumentStatus(v.soatVencimiento) === 'vencido' ||
    getDocumentStatus(v.rtmVencimiento) === 'vencido' ||
    getDocumentStatus(v.toVencimiento) === 'vencido'
  ).length;

  const vehiculosProximos = vehiculos.filter(v =>
    getDocumentStatus(v.soatVencimiento) === 'proximo' ||
    getDocumentStatus(v.rtmVencimiento) === 'proximo' ||
    getDocumentStatus(v.toVencimiento) === 'proximo'
  ).length;

  const misReportes = currentUser?.rol === 'Mantenimiento' || currentUser?.rol === 'Operador Isla'
    ? reportes.filter(r => r.inspector.id === currentUser?.id)
    : reportes;

  const canManageMaestros = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Programador';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Bienvenido, {currentUser?.nombre}</h2>
        <p className="text-gray-600">Panel de Control - {currentUser?.rol}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {canManageMaestros && (
          <>
            <button
              onClick={handleNavigateToConductores}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Conductores</p>
                  <p className="text-gray-900">{conductores.length}</p>
                </div>
              </div>
              {conductoresVencidos > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="size-4" />
                  <span>{conductoresVencidos} licencias vencidas</span>
                </div>
              )}
              {conductoresProximos > 0 && conductoresVencidos === 0 && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertTriangle className="size-4" />
                  <span>{conductoresProximos} por vencer</span>
                </div>
              )}
              {conductoresVencidos === 0 && conductoresProximos === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="size-4" />
                  <span>Todos vigentes</span>
                </div>
              )}
            </button>

            <button
              onClick={handleNavigateToVehiculos}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Truck className="size-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Vehículos</p>
                  <p className="text-gray-900">{vehiculos.length}</p>
                </div>
              </div>
              {vehiculosVencidos > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="size-4" />
                  <span>{vehiculosVencidos} documentos vencidos</span>
                </div>
              )}
              {vehiculosProximos > 0 && vehiculosVencidos === 0 && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertTriangle className="size-4" />
                  <span>{vehiculosProximos} por vencer</span>
                </div>
              )}
              {vehiculosVencidos === 0 && vehiculosProximos === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="size-4" />
                  <span>Todos vigentes</span>
                </div>
              )}
            </button>
          </>
        )}

        <button
          onClick={handleNavigateToReportes}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="size-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-gray-600">Reportes</p>
              <p className="text-gray-900">{misReportes.length}</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleNavigateToReportes}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ClipboardCheck className="size-6 text-orange-600" />
            </div>
            <div className="text-right">
              <p className="text-gray-600">Mes Actual</p>
              <p className="text-gray-900">
                {misReportes.filter(r => {
                  const fecha = new Date(r.fecha);
                  const hoy = new Date();
                  return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          {misReportes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay reportes registrados</p>
          ) : (
            <div className="space-y-4">
              {misReportes.slice(0, 5).map(reporte => (
                <div key={reporte.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded">
                    <ClipboardCheck className="size-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      Chequeo {reporte.tipo} - {reporte.vehiculo.placa}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(reporte.fecha).toLocaleDateString('es-CO')} - {reporte.inspector.nombre}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      {canManageMaestros && (conductoresVencidos > 0 || vehiculosVencidos > 0 || conductoresProximos > 0 || vehiculosProximos > 0) && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Alertas del Sistema</h3>
          </div>
          <div className="p-6 space-y-4">
            {conductoresVencidos > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900">
                    {conductoresVencidos} conductor{conductoresVencidos > 1 ? 'es tienen' : ' tiene'} licencias vencidas
                  </p>
                  <p className="text-sm text-red-700">
                    Requiere acción inmediata
                  </p>
                </div>
              </div>
            )}
            {vehiculosVencidos > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900">
                    {vehiculosVencidos} vehículo{vehiculosVencidos > 1 ? 's tienen' : ' tiene'} documentos vencidos
                  </p>
                  <p className="text-sm text-red-700">
                    No deben operar hasta renovar documentación
                  </p>
                </div>
              </div>
            )}
            {conductoresProximos > 0 && conductoresVencidos === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900">
                    {conductoresProximos} conductor{conductoresProximos > 1 ? 'es tienen' : ' tiene'} licencias próximas a vencer
                  </p>
                  <p className="text-sm text-yellow-700">
                    Vence en menos de 30 días
                  </p>
                </div>
              </div>
            )}
            {vehiculosProximos > 0 && vehiculosVencidos === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900">
                    {vehiculosProximos} vehículo{vehiculosProximos > 1 ? 's tienen' : ' tiene'} documentos próximos a vencer
                  </p>
                  <p className="text-sm text-yellow-700">
                    Vencen en menos de 30 días
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}