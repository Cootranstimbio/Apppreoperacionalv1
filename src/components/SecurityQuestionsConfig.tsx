import { useState } from 'react';
import { Lock, Save, X } from 'lucide-react';
import { useUserContext, SecurityAnswers } from './UserContext';
import { toast } from 'sonner@2.0.3';

interface SecurityQuestionsConfigProps {
  onClose: () => void;
}

export function SecurityQuestionsConfig({ onClose }: SecurityQuestionsConfigProps) {
  const { currentUser, users, setUsers } = useUserContext();
  const [password, setPassword] = useState('');
  const [answers, setAnswers] = useState<SecurityAnswers>({
    color: currentUser?.securityAnswers?.color || 'azul',
    numero: currentUser?.securityAnswers?.numero || '1',
    animal: currentUser?.securityAnswers?.animal || 'perro'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    // Verificar contraseña
    if (password !== currentUser.password) {
      toast.error('Contraseña incorrecta');
      return;
    }

    // Actualizar preguntas de seguridad
    const updatedUsers = users.map(u =>
      u.id === currentUser.id
        ? { ...u, securityAnswers: answers }
        : u
    );

    setUsers(updatedUsers);
    toast.success('Preguntas de seguridad configuradas correctamente');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="size-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Configurar Preguntas de Seguridad</h2>
              <p className="text-sm text-gray-600">Estas preguntas te ayudarán a recuperar tu contraseña</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Verificación de contraseña */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-3">
              <strong>Por seguridad:</strong> Ingresa tu contraseña actual para configurar las preguntas de seguridad
            </p>
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Contraseña Actual *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Pregunta 1: Color favorito */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
            <label className="block mb-3">
              <span className="text-gray-900 font-medium">1. ¿Cuál es tu color favorito?</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input
                  type="radio"
                  name="color"
                  value="azul"
                  checked={answers.color === 'azul'}
                  onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                  className="size-4 text-purple-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500"></span>
                  <span className="text-gray-900">a. Azul</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input
                  type="radio"
                  name="color"
                  value="rosado"
                  checked={answers.color === 'rosado'}
                  onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                  className="size-4 text-purple-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-500"></span>
                  <span className="text-gray-900">b. Rosado</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input
                  type="radio"
                  name="color"
                  value="negro"
                  checked={answers.color === 'negro'}
                  onChange={(e) => setAnswers({ ...answers, color: e.target.value as SecurityAnswers['color'] })}
                  className="size-4 text-purple-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black"></span>
                  <span className="text-gray-900">c. Negro</span>
                </span>
              </label>
            </div>
          </div>

          {/* Pregunta 2: Número favorito */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
            <label className="block mb-3">
              <span className="text-gray-900 font-medium">2. Elige un número</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="numero"
                  value="1"
                  checked={answers.numero === '1'}
                  onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                  className="size-4 text-blue-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</span>
                  <span className="text-gray-900">a. Número 1</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="numero"
                  value="2"
                  checked={answers.numero === '2'}
                  onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                  className="size-4 text-blue-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</span>
                  <span className="text-gray-900">b. Número 2</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="numero"
                  value="3"
                  checked={answers.numero === '3'}
                  onChange={(e) => setAnswers({ ...answers, numero: e.target.value as SecurityAnswers['numero'] })}
                  className="size-4 text-blue-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</span>
                  <span className="text-gray-900">c. Número 3</span>
                </span>
              </label>
            </div>
          </div>

          {/* Pregunta 3: Animal favorito */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-5">
            <label className="block mb-3">
              <span className="text-gray-900 font-medium">3. Elige un animal</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="animal"
                  value="perro"
                  checked={answers.animal === 'perro'}
                  onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                  className="size-4 text-green-600"
                />
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🐕</span>
                  <span className="text-gray-900">a. Perro</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="animal"
                  value="gato"
                  checked={answers.animal === 'gato'}
                  onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                  className="size-4 text-green-600"
                />
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🐈</span>
                  <span className="text-gray-900">b. Gato</span>
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="animal"
                  value="loro"
                  checked={answers.animal === 'loro'}
                  onChange={(e) => setAnswers({ ...answers, animal: e.target.value as SecurityAnswers['animal'] })}
                  className="size-4 text-green-600"
                />
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🦜</span>
                  <span className="text-gray-900">c. Loro</span>
                </span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="size-5" />
              Guardar Preguntas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
