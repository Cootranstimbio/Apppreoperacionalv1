import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Truck,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  ListChecks,
  UserCog
} from 'lucide-react';
import { useUserContext } from './UserContext';
import { HomeView } from './HomeView';
import { ConductoresView } from './ConductoresView';
import { VehiculosView } from './VehiculosView';
import { ChequeoView } from './ChequeoView';
import { ReportesView } from './ReportesView';
import { PerfilView } from './PerfilView';
import { ItemsManagement } from './ItemsManagement';
import { UsersManagement } from './UsersManagement';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  onLogout: () => void;
}

type View = 'home' | 'conductores' | 'vehiculos' | 'chequeo' | 'reportes' | 'perfil' | 'items' | 'users';

export function Dashboard({ onLogout }: DashboardProps) {
  const { currentUser, setCurrentUser } = useUserContext();
  const [currentView, setCurrentView] = useState<View>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const canManageMaestros = currentUser.rol === 'Administrador' || currentUser.rol === 'Programador';
  const canDoChequeo = currentUser.rol === 'Mantenimiento' || currentUser.rol === 'Operador Isla';
  const canManageItems = currentUser.rol === 'Programador' || currentUser.rol === 'Administrador';
  const canManageUsers = currentUser.rol === 'Administrador' || currentUser.rol === 'Programador';

  // Escuchar evento de navegación a reportes
  useEffect(() => {
    const handleNavigateToReportes = () => {
      setCurrentView('reportes');
    };

    const handleNavigateToConductores = () => {
      setCurrentView('conductores');
    };

    const handleNavigateToVehiculos = () => {
      setCurrentView('vehiculos');
    };

    window.addEventListener('navigate-to-reportes', handleNavigateToReportes);
    window.addEventListener('navigate-to-conductores', handleNavigateToConductores);
    window.addEventListener('navigate-to-vehiculos', handleNavigateToVehiculos);
    
    return () => {
      window.removeEventListener('navigate-to-reportes', handleNavigateToReportes);
      window.removeEventListener('navigate-to-conductores', handleNavigateToConductores);
      window.removeEventListener('navigate-to-vehiculos', handleNavigateToVehiculos);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
    toast.success('Sesión cerrada correctamente');
  };

  const menuItems = [
    { id: 'home' as View, icon: Home, label: 'Inicio', show: true },
    { id: 'conductores' as View, icon: Users, label: 'Conductores', show: canManageMaestros },
    { id: 'vehiculos' as View, icon: Truck, label: 'Vehículos', show: canManageMaestros },
    { id: 'chequeo' as View, icon: ClipboardCheck, label: 'Chequeo', show: canDoChequeo },
    { id: 'reportes' as View, icon: FileText, label: 'Reportes', show: true },
    { id: 'items' as View, icon: ListChecks, label: 'Ítems de Chequeo', show: canManageItems },
    { id: 'users' as View, icon: UserCog, label: 'Usuarios', show: canManageUsers },
    { id: 'perfil' as View, icon: Settings, label: 'Perfil', show: true }
  ].filter(item => item.show);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'conductores':
        return <ConductoresView />;
      case 'vehiculos':
        return <VehiculosView />;
      case 'chequeo':
        return <ChequeoView />;
      case 'reportes':
        return <ReportesView />;
      case 'perfil':
        return <PerfilView />;
      case 'items':
        return <ItemsManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <Truck className="size-8" />
            <div>
              <h2 className="text-white">TRANSTIMBIO</h2>
              <p className="text-blue-300 text-sm">{currentUser.rol}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800/50'
              }`}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800/50 rounded-lg transition-colors"
          >
            <LogOut className="size-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="size-6" />
              </button>
              <h1 className="text-gray-900">
                {menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <UserCircle className="size-8 text-gray-600" />
              <div className="hidden sm:block">
                <p className="text-gray-900">{currentUser.nombre}</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}