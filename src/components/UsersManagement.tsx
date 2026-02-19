import { useState } from 'react';
import { useUserContext, User, Role } from './UserContext';
import { UserPlus, Edit, Trash2, X, Save, Shield, Unlock, Eye, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ChangePasswordModal } from './ChangePasswordModal';

export function UsersManagement() {
  const { users, setUsers, currentUser } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    rol: 'Operador Isla',
    password: ''
  });

  const canManageUsers = currentUser?.rol === 'Administrador' || currentUser?.rol === 'Programador';

  if (!canManageUsers) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  const handleOpenNew = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      cedula: '',
      email: '',
      telefono: '',
      rol: 'Operador Isla',
      password: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      cedula: user.cedula,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      password: user.password
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      cedula: '',
      email: '',
      telefono: '',
      rol: 'Operador Isla',
      password: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.cedula || !formData.email || !formData.telefono || !formData.password) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (editingUser) {
      // Editar usuario existente
      const updatedUsers = users.map(u =>
        u.id === editingUser.id ? { ...u, ...formData } as User : u
      );
      setUsers(updatedUsers);
      toast.success('Usuario actualizado correctamente');
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: `u${Date.now()}`,
        nombre: formData.nombre!,
        cedula: formData.cedula!,
        email: formData.email!,
        telefono: formData.telefono!,
        rol: formData.rol as Role,
        password: formData.password!
      };
      setUsers([...users, newUser]);
      toast.success('Usuario creado correctamente');
    }

    handleCloseModal();
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error('No puedes eliminar tu propio usuario');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      toast.success('Usuario eliminado correctamente');
    }
  };

  const handleUnblockUser = (user: User) => {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, isBlocked: false, failedLoginAttempts: 0 } : u
    );
    setUsers(updatedUsers);
    toast.success(`Usuario ${user.nombre} desbloqueado correctamente`);
  };

  const handleViewSecurity = (user: User) => {
    setSelectedUser(user);
    setShowSecurityModal(true);
  };

  const handleOpenChangePassword = (user: User) => {
    setSelectedUser(user);
    setShowChangePasswordModal(true);
  };

  const handleSavePassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId 
        ? { ...u, password: newPassword, isBlocked: false, failedLoginAttempts: 0 } 
        : u
    );
    setUsers(updatedUsers);
    toast.success('Contraseña cambiada correctamente. Usuario desbloqueado.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gray-900">Gestión de Usuarios</h2>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="size-5" />
            Nuevo Usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-700">Cédula</th>
                <th className="text-left py-3 px-4 text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-gray-700">Teléfono</th>
                <th className="text-left py-3 px-4 text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 text-gray-700">Estado</th>
                <th className="text-right py-3 px-4 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.nombre}</td>
                  <td className="py-3 px-4 text-gray-700">{user.cedula}</td>
                  <td className="py-3 px-4 text-gray-700">{user.email}</td>
                  <td className="py-3 px-4 text-gray-700">{user.telefono}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      user.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' :
                      user.rol === 'Programador' ? 'bg-blue-100 text-blue-800' :
                      user.rol === 'Mantenimiento' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.isBlocked ? (
                      <span className="inline-block px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                        Bloqueado
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      {user.isBlocked && (
                        <button
                          onClick={() => handleUnblockUser(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Desbloquear Usuario"
                        >
                          <Unlock className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewSecurity(user)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Ver Seguridad"
                      >
                        <Shield className="size-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                        disabled={user.id === currentUser?.id}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleOpenChangePassword(user)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Cambiar Contraseña"
                      >
                        <Key className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación/Edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-900">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Cédula *</label>
                  <input
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 1234567890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 3001234567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Rol *</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as Role })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Programador">Programador</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Operador Isla">Operador Isla</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Contraseña *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="size-4" />
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Información de Seguridad */}
      {showSecurityModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-900">Información de Seguridad</h3>
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-700 mb-1"><strong>Usuario:</strong> {selectedUser.nombre}</p>
                <p className="text-gray-700 mb-1"><strong>Email:</strong> {selectedUser.email}</p>
                <p className="text-gray-700 mb-1"><strong>Rol:</strong> {selectedUser.rol}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700 mb-2"><strong>Estado de Seguridad:</strong></p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600">Intentos fallidos:</span>{' '}
                    <span className={`${(selectedUser.failedLoginAttempts || 0) >= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                      {selectedUser.failedLoginAttempts || 0} / 5
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Estado:</span>{' '}
                    <span className={`${selectedUser.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedUser.isBlocked ? 'Bloqueado' : 'Activo'}
                    </span>
                  </p>
                </div>
              </div>

              {selectedUser.securityQuestions && selectedUser.securityQuestions.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-gray-700 mb-3"><strong>Preguntas de Seguridad:</strong></p>
                  <div className="space-y-3">
                    {selectedUser.securityQuestions.map((sq, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1"><strong>{idx + 1}. {sq.question}</strong></p>
                        <p className="text-sm text-gray-600">Respuesta: {sq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedUser.securityQuestions || selectedUser.securityQuestions.length === 0) && (
                <div className="border-t pt-4">
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Este usuario no ha configurado preguntas de seguridad
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Contraseña */}
      {showChangePasswordModal && selectedUser && (
        <ChangePasswordModal
          user={selectedUser}
          onClose={() => setShowChangePasswordModal(false)}
          onSave={handleSavePassword}
        />
      )}
    </div>
  );
}