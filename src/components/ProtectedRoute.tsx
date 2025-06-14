import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Auth state:', { user, loading, path: location.pathname });

  if (loading) {
    console.log('ProtectedRoute - Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-charcoal">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Optional: Check if user has admin role if adminOnly is true
  if (adminOnly) {
    // For development, log the user object to see what's available
    console.log('User object:', user);
    
    // Temporary: Bypass admin check for testing
    console.log('Bypassing admin role check for testing');
    
    // Original admin check (commented out for testing)
    /*
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.app_metadata?.role === 'admin' ||
                   user.email === 'your-admin-email@example.com';
    
    if (!isAdmin) {
      console.log('ProtectedRoute - User is not admin');
      return <Navigate to="/unauthorized" replace />;
    }
    */
  }

  return <>{children}</>;
};
