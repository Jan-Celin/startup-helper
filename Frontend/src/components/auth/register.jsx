import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email je obavezan';
    if (!emailRegex.test(email)) return 'Unesite valjanu email adresu';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Zaporka je obavezna';
    if (password.length < 8) return 'Zaporka mora imati najmanje 8 znakova';
    if (!/(?=.*[A-Z])/.test(password)) return 'Zaporka mora sadržavati barem jedno veliko slovo';
    if (!/(?=.*[0-9])/.test(password)) return 'Zaporka mora sadržavati barem jedan broj';
    if (!/(?=.*[!@#$%^&*])/.test(password)) return 'Zaporka mora sadržavati barem jedan specijalni znak';
    return '';
  };

  const validateName = (name, field) => {
    if (!name) return `${field} je obavezno`;
    if (name.length < 2) return `${field} mora imati najmanje 2 znaka`;
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      firstName: validateName(formData.firstName, 'Ime'),
      lastName: validateName(formData.lastName, 'Prezime')
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await registerApi(formData);
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      });
    } catch (err) {
      setSubmitError(err.message || 'An error occurred during registration');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'firstName':
        error = validateName(value, 'Ime');
        break;
      case 'lastName':
        error = validateName(value, 'Prezime');
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Izradite novi račun
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {submitError && (
            <div className="text-red-600 text-center">{submitError}</div>
          )}
          <div className="space-y-4">
            <div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <input
                type="email"
                name="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email adresa"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
              <input
                type="text"
                name="firstName"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Ime"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
              <input
                type="text"
                name="lastName"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Prezime"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <input
                type="password"
                name="password"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Zaporka"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Registracija
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}