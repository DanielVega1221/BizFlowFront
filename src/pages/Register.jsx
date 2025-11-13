import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { validateAuthForm } from '../utils/validators';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { values, errors, handleChange, setErrors } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación robusta
    const validation = validateAuthForm(values, true);
    
    if (!validation.isValid) {
      // Convertir array de errores a objeto para setErrors
      const errorObj = {};
      validation.errors.forEach(error => {
        if (error.includes('nombre')) errorObj.name = error;
        else if (error.includes('email') || error.includes('correo')) errorObj.email = error;
        else if (error.includes('contraseña')) errorObj.password = error;
        else if (error.includes('coinciden')) errorObj.confirmPassword = error;
        else errorObj.general = error;
      });
      setErrors(errorObj);
      return;
    }

    setLoading(true);
    const result = await register(values.name, values.email, values.password);
    setLoading(false);

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
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-900">Comienza tu viaje</h1>
          <p className="text-gray-600 mt-2">
            Crea tu cuenta y empieza a gestionar tu negocio de forma profesional
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🚀 Solo toma 30 segundos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Tu nombre completo"
            required
          />

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

          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mx-auto" /> : 'Registrarse'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
