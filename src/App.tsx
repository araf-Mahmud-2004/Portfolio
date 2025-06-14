
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ScrollProvider } from './contexts/ScrollContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <ScrollRestoration />
        <Outlet />
      </ScrollProvider>
    </AuthProvider>
  );
}

export default App;