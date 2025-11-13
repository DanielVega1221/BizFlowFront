import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { validateEmail } from '../utils/validators';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, handleChange, setErrors } = useForm({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  // Escuchar evento de servidor despertando
  useEffect(() => {
    const handleServerWaking = () => {
      setServerWaking(true);
      // Resetear después de 35 segundos
      setTimeout(() => setServerWaking(false), 35000);
    };

    window.addEventListener('server:waking', handleServerWaking);
    return () => window.removeEventListener('server:waking', handleServerWaking);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica para login (no tan estricta como registro)
    const newErrors = {};
    
    // validateEmail retorna null si está OK, o un mensaje de error si falla
    const emailError = validateEmail(values.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    // Para login solo verificamos longitud mínima
    if (!values.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (values.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(values.email, values.password);
    setLoading(false);
    setServerWaking(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido a BizFlow!</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para gestionar tu negocio de forma profesional</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {serverWaking && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⏳ El servidor está despertando, por favor espera unos segundos...
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              serverWaking ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span>Despertando servidor...</span>
                </span>
              ) : (
                <Spinner size="sm" className="mx-auto" />
              )
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-900 mb-2">💡 Credenciales de prueba</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-indigo-700">📧 Email:</span>
                  <code className="text-xs text-indigo-900 bg-white px-2 py-0.5 rounded font-mono">admin@bizflow.test</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-indigo-700">🔑 Contraseña:</span>
                  <code className="text-xs text-indigo-900 bg-white px-2 py-0.5 rounded font-mono">Test1234</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
