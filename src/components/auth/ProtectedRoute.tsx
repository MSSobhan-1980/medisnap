
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthorization } from '@/hooks/useAuthorization';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('user' | 'admin' | 'caregiver' | 'child')[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { roles, loading: authLoading } = useAuthorization();
  const location = useLocation();

  // If still loading auth state, show loading
  if (loading || authLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If specific roles are required
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
