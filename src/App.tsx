import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { UserProvider } from './components/UserContext';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <Dashboard onLogout={() => setIsAuthenticated(false)} />
        )}
      </div>
    </UserProvider>
  );
}