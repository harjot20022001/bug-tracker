import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../utils/schemas';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setFormErrors({});

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setApiError(message);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md p-8 space-y-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl m-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to continue to your dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {apiError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md" role="alert">
              <p className="font-bold text-sm">Error</p>
              <p className="text-sm">{apiError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.email ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.password ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
