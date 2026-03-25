import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  GraduationCap,
  Sparkles,
  CheckCircle,
  Shield,
  Zap,
  Heart,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await register(data);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Guidance',
      description: 'Get personalized career recommendations',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected and confidential',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your career insights immediately',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Features & Info */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span>Join 10,000+ Students</span>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Start Your Career Journey
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Discover your perfect career path with our AI-powered guidance system. 
                Get personalized recommendations for colleges, courses, and career opportunities.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="flex items-center space-x-4 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <div className="text-2xl font-bold">999+</div>
                <div className="text-sm opacity-90">Colleges</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-90">Career Paths</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white shadow-lg">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 lg:p-12">
            <div className="text-center mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-colors duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of students discovering their perfect career path
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      {...registerField('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        },
                        maxLength: {
                          value: 50,
                          message: 'Name must be less than 50 characters'
                        }
                      })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full mr-2"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...registerField('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all duration-300 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...registerField('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all duration-300 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...registerField('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all duration-300 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full mr-2"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 