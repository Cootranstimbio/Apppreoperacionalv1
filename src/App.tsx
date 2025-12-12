import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { UserProvider } from './components/UserContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
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
