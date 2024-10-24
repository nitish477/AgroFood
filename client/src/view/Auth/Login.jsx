import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
const URL = import.meta.env.VITE_APP_API
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
 const navigate =useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setSubmitStatus('validating');
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitStatus('authenticating');
  
        const res = await axios.post(`${URL}/api/v1/auth/login`, formData);    
        console.log(res);
        
        if (res?.status === 200) {
          toast.success(res?.data?.message);
          setSubmitStatus('completing');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          localStorage.setItem("token",res?.data?.data?.accessToken)
          localStorage.setItem("userRole",JSON.stringify(res?.data?.data?.user?.roles))
          navigate('/dashboard');  // Redirect to the appropriate page
        }
      } catch (error) {
        setErrors({ general: 'Login failed. Please try again.' });
        toast.error('Login failed. Check your credentials or try again later.');
      } finally {
        setIsLoading(false);
        setSubmitStatus(null);
      }
    } else {
      setErrors(newErrors);
    }
  };
  

  const handleFocus = (fieldName) => {
    setCurrentField(fieldName);
  };

  const handleBlur = () => {
    setCurrentField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        <div className="bg-white p-8 rounded-xl shadow-2xl relative">
          {/* Submit Status Overlay */}
          {submitStatus && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-green-600 text-lg font-medium">
                  {submitStatus === 'validating' && 'Validating...'}
                  {submitStatus === 'authenticating' && 'Authenticating...'}
                  {submitStatus === 'success' && (
                    <span className="flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Welcome back!
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 animate-slideDown">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 animate-fadeIn">
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div className={`transform transition-all duration-300 ${
                currentField === 'email' ? 'scale-105' : ''
              }`}>
                <div className="relative">
                  <label htmlFor="email" 
                         className={`block text-sm font-medium transition-colors duration-300 ${
                           currentField === 'email' ? 'text-green-600' : 'text-gray-700'
                         }`}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-lg shadow-sm 
                      transition-all duration-300 ease-in-out
                      ${currentField === 'email' 
                        ? 'border-green-500 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-green-300'}
                      focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 animate-shake">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className={`transform transition-all duration-300 ${
                currentField === 'password' ? 'scale-105' : ''
              }`}>
                <div className="relative">
                  <label htmlFor="password" 
                         className={`block text-sm font-medium transition-colors duration-300 ${
                           currentField === 'password' ? 'text-green-600' : 'text-gray-700'
                         }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full px-4 py-3 pr-12 border-2 rounded-lg shadow-sm 
                        transition-all duration-300 ease-in-out
                        ${currentField === 'password' 
                          ? 'border-green-500 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-green-300'}
                        focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 animate-shake">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-green-600 hover:text-green-500 font-medium">
                Forgot password?
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent 
                  rounded-lg text-white text-lg font-semibold
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105 hover:shadow-lg
                  ${isLoading 
                    ? 'bg-green-400 cursor-wait' 
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
               <Link to={"/auth/register"}>
               <button type="button" className="text-green-600 hover:text-green-500 font-medium">
                  Sign up
                </button>
               </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toaster/>
    </div>
  );
}

export default Login;