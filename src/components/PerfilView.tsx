import { useState, useRef } from 'react';
import { Eye, EyeOff, Save, User, Camera, Shield, Upload, Lock } from 'lucide-react';
import { useUserContext } from './UserContext';
import { toast } from 'sonner@2.0.3';
import { SecurityQuestionsConfig } from './SecurityQuestionsConfig';

export function PerfilView() {
  const { currentUser, setCurrentUser, users, setUsers } = useUserContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecurityConfig, setShowSecurityConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor seleccione una imagen');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = {
        ...currentUser!,
        avatarUrl: reader.result as string
      };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => (u.id === currentUser!.id ? updatedUser : u)));
      toast.success('Foto de perfil actualizada');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Info with Avatar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            {currentUser?.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt="Avatar" 
                className="size-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="bg-blue-100 p-6 rounded-full">
                <User className="size-12 text-blue-600" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
              title="Cambiar foto de perfil"
            >
              <Upload className="size-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900">{currentUser?.nombre}</h2>
            <p className="text-gray-600">{currentUser?.rol}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Seleccionar de Galería
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
              >
                <Camera className="size-4" />
                Tomar Foto
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleAvatarChange}
          className="hidden"
        />

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

      {/* Security Questions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <Lock className="size-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Preguntas de Seguridad</h3>
            <p className="text-sm text-gray-600">
              {currentUser?.securityAnswers 
                ? 'Preguntas configuradas ✅' 
                : 'Configure 3 preguntas simples para recuperar su contraseña'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-3">
            <Shield className="size-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-2">Sistema de Recuperación Simple</p>
              <p className="text-sm text-gray-700 mb-3">
                Responda 3 preguntas sencillas con opciones múltiples:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>¿Cuál es tu color favorito? (azul, rosado, negro)</li>
                <li>Elige un número (1, 2, 3)</li>
                <li>Elige un animal (perro, gato, loro)</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSecurityConfig(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Lock className="size-5" />
          {currentUser?.securityAnswers ? 'Actualizar Preguntas de Seguridad' : 'Configurar Preguntas de Seguridad'}
        </button>
      </div>

      {/* Modales */}
      {showSecurityConfig && (
        <SecurityQuestionsConfig onClose={() => setShowSecurityConfig(false)} />
      )}

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