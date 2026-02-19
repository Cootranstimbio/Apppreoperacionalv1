import { useState } from 'react';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { useUserContext, SecurityAnswers } from './UserContext';
import { toast } from 'sonner@2.0.3';

interface PasswordRecoveryProps {
  onBack: () => void;
}

export function PasswordRecovery({ onBack }: PasswordRecoveryProps) {
  const { users, setUsers } = useUserContext();
  const [step, setStep] = useState<'cedula' | 'questions' | 'newPassword'>('cedula');
  const [cedula, setCedula] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [answers, setAnswers] = useState<SecurityAnswers>({
    color: 'azul',
    numero: '1',
    animal: 'perro'
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCedulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(u => u.cedula === cedula);

    if (!user) {
      toast.error('No se encontró un usuario con esta cédula');
      return;
    }

    if (!user.securityAnswers) {
      toast.error('Este usuario no ha configurado preguntas de seguridad');
      return;
    }

    setSelectedUser(user);
    setStep('questions');
  };

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser?.securityAnswers) return;

    // Verificar respuestas
    if (
      answers.color === selectedUser.securityAnswers.color &&
      answers.numero === selectedUser.securityAnswers.numero &&
      answers.animal === selectedUser.securityAnswers.animal
    ) {
      setStep('newPassword');
    } else {
      toast.error('Las respuestas no coinciden con las configuradas');
      // Reset respuestas
      setAnswers({
        color: 'azul',
        numero: '1',
        animal: 'perro'
      });
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!selectedUser) return;

    // Actualizar contraseña y resetear intentos fallidos
    const updatedUsers = users.map(u =>
      u.id === selectedUser.id
        ? { ...u, password: newPassword, failedLoginAttempts: 0, isBlocked: false }
        : u
    );

    setUsers(updatedUsers);
    toast.success('Contraseña restablecida exitosamente');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="size-5" />
            Volver al inicio de sesión
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Lock className="size-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Recuperar Contraseña</h2>
              <p className="text-sm text-gray-600">
                {step === 'cedula' && 'Ingresa tu número de cédula'}
                {step === 'questions' && 'Responde las preguntas de seguridad'}
                {step === 'newPassword' && 'Establece tu nueva contraseña'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'cedula' && (
            <form onSubmit={handleCedulaSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Número de Cédula
                </label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 1001001001"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continuar
              </button>
            </form>
          )}

          {step === 'questions' && selectedUser && (
            <form onSubmit={handleQuestionsSubmit} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Usuario:</strong> {selectedUser.nombre}
                </p>
              </div>

              {/* Pregunta 1: Color */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                <label className="block mb-3 text-gray-900 font-medium">
                  1. ¿Cuál es tu color favorito?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="color"
                      value="azul"
                      checked={answers.color === 'azul'}
                      onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                      className="size-4 text-purple-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500"></span>
                      <span>a. Azul</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="color"
                      value="rosado"
                      checked={answers.color === 'rosado'}
                      onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                      className="size-4 text-purple-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-500"></span>
                      <span>b. Rosado</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50">
                    <input
                      type="radio"
                      name="color"
                      value="negro"
                      checked={answers.color === 'negro'}
                      onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                      className="size-4 text-purple-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black"></span>
                      <span>c. Negro</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Pregunta 2: Número */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                <label className="block mb-3 text-gray-900 font-medium">
                  2. Elige un número
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="numero"
                      value="1"
                      checked={answers.numero === '1'}
                      onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                      className="size-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</span>
                      <span>a. Número 1</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="numero"
                      value="2"
                      checked={answers.numero === '2'}
                      onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                      className="size-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</span>
                      <span>b. Número 2</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name="numero"
                      value="3"
                      checked={answers.numero === '3'}
                      onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                      className="size-4 text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</span>
                      <span>c. Número 3</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Pregunta 3: Animal */}
              <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                <label className="block mb-3 text-gray-900 font-medium">
                  3. Elige un animal
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50">
                    <input
                      type="radio"
                      name="animal"
                      value="perro"
                      checked={answers.animal === 'perro'}
                      onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                      className="size-4 text-green-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-xl">🐕</span>
                      <span>a. Perro</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50">
                    <input
                      type="radio"
                      name="animal"
                      value="gato"
                      checked={answers.animal === 'gato'}
                      onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                      className="size-4 text-green-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-xl">🐈</span>
                      <span>b. Gato</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50">
                    <input
                      type="radio"
                      name="animal"
                      value="loro"
                      checked={answers.animal === 'loro'}
                      onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                      className="size-4 text-green-600"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-xl">🦜</span>
                      <span>c. Loro</span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Verificar Respuestas
              </button>
            </form>
          )}

          {step === 'newPassword' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-800 font-medium">
                      ✅ Respuestas correctas
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Ahora puedes establecer una nueva contraseña
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mínimo 4 caracteres"
                  required
                  minLength={4}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Repite la contraseña"
                  required
                  minLength={4}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Restablecer Contraseña
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
