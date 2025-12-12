import { useState } from 'react';
import { Eye, EyeOff, Save, User } from 'lucide-react';
import { useUserContext } from './UserContext';
import { toast } from 'sonner@2.0.3';

export function PerfilView() {
  const { currentUser, setCurrentUser, users, setUsers } = useUserContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || '',
    cedula: currentUser?.cedula || '',
    email: currentUser?.email || '',
    telefono: currentUser?.telefono || '',
    rol: currentUser?.rol || 'Mantenimiento',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const canEditRole = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Programador';
  const canEditBasicInfo = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Programador';

  const handleSaveProfile = () => {
    if (!currentUser) return;

    // Validate email
    if (!formData.email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    // Update basic info
    const updatedUser = {
      ...currentUser,
      email: formData.email,
      telefono: formData.telefono,
      ...(canEditBasicInfo && {
        nombre: formData.nombre,
        cedula: formData.cedula,
        rol: formData.rol as any
      })
    };

    setCurrentUser(updatedUser);
    setUsers(users.map(u => (u.id === currentUser.id ? updatedUser : u)));
    toast.success('Perfil actualizado correctamente');
  };

  const handleChangePassword = () => {
    if (!currentUser) return;

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Debe llenar todos los campos de contraseña');
      return;
    }

    if (formData.currentPassword !== currentUser.password) {
      toast.error('La contraseña actual es incorrecta');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: formData.newPassword
    };

    setCurrentUser(updatedUser);
    setUsers(users.map(u => (u.id === currentUser.id ? updatedUser : u)));

    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    toast.success('Contraseña actualizada correctamente');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="size-12 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900">{currentUser?.nombre}</h2>
            <p className="text-gray-600">{currentUser?.rol}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Nombre Completo {canEditBasicInfo ? '*' : '(No editable)'}
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              disabled={!canEditBasicInfo}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Cédula/ID {canEditBasicInfo ? '*' : '(No editable)'}
            </label>
            <input
              type="text"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              disabled={!canEditBasicInfo}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Correo Electrónico *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Teléfono de Contacto *</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {canEditRole && (
            <div>
              <label className="block text-gray-700 mb-2">Rol Asignado *</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Administrador">Administrador</option>
                <option value="Programador">Programador</option>
                <option value="Mantenimiento">Mantenimiento (Mecánico)</option>
                <option value="Operador Isla">Operador Isla (Islero)</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Como {currentUser?.rol}, puede modificar roles de usuarios
              </p>
            </div>
          )}

          {!canEditRole && (
            <div>
              <label className="block text-gray-700 mb-2">Rol Asignado (No editable)</label>
              <input
                type="text"
                value={currentUser?.rol}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="size-5" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-900 mb-6">Cambiar Contraseña</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Contraseña Actual *</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nueva Contraseña *</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirmar Nueva Contraseña *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
