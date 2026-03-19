import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

//interfaces
interface ProtectedRouteProps {
    children: ReactNode;
}

//prop
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress />
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
