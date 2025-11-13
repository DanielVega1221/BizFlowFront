import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <Spinner size="lg" className="text-white" />
        <p className="mt-4 text-white text-lg">Verificando autenticación...</p>
        <p className="mt-2 text-white/80 text-sm">Si el servidor estaba dormido, esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
