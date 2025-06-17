
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ScrollProvider } from './contexts/ScrollContext';
import { AuthProvider } from './contexts/AuthContext';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <CustomCursor />
        <ScrollRestoration />
        <Outlet />
      </ScrollProvider>
    </AuthProvider>
  );
}

export default App;