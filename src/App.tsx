import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ScrollProvider } from './contexts/ScrollContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import CustomCursor from './components/CustomCursor';
import { usePerformance } from './hooks/usePerformance';

function App() {
  // Initialize performance monitoring
  usePerformance();

  return (
    <AuthProvider>
      <AdminProvider>
        <ScrollProvider>
          <CustomCursor />
          <ScrollRestoration />
          <Outlet />
        </ScrollProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;