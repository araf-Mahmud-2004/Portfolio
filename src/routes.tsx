import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import App from './App';

// Layout component for protected routes
const ProtectedLayout = () => (
  <ProtectedRoute adminOnly={true}>
    <Outlet />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      
      // Protected routes
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: 'admin/dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'admin',
            element: <Navigate to="/admin/dashboard" replace />,
          },
        ],
      },
      
      // 404 route
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  // Future flags can be added here when needed
});
