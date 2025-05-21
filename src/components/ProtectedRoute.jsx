import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, role: requiredRole }) {
    const { currentUser, role } = useAuth();

    if (!currentUser) return <Navigate to="/login" />;
    if (requiredRole && role !== requiredRole) return <Navigate to="/app" />;

    return children;
}
