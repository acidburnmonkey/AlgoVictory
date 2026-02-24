import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from './AuthContext';

//interfaces
interface ProtectedRouteProps {
    children: ReactNode;
}

//prop
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
