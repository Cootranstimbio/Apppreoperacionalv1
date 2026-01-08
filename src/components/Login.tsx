import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Truck } from 'lucide-react';
import { useUserContext } from './UserContext';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const { users, setCurrentUser } = useUserContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      u => u.email === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      onLogin();
      toast.success(`Bienvenido, ${user.nombre}`);
    } else {
      toast.error('Credenciales incorrectas. Verifique su usuario y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-full mb-4">
            <Truck className="size-12 text-white" />
          </div>
          <h1 className="text-blue-900">TRANSTIMBIO</h1>
          <p className="text-gray-600">Chequeo Pre-Operacional</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Usuario (Email)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@transtimbio.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => toast.info('Contacte al administrador para recuperar su contraseña')}
          >
            ¿Olvidó su contraseña?
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="mb-2">Usuarios de prueba:</p>
              <ul className="space-y-1 text-xs">
                <li>Admin: admin@transtimbio.com / admin123</li>
                <li>Programador: programador@transtimbio.com / prog123</li>
                <li>Mecánico: mecanico@transtimbio.com / mec123</li>
                <li>Islero: islero@transtimbio.com / isla123</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}