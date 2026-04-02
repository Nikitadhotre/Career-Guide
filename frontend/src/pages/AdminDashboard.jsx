import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Users, 
  Building2, 
  BookOpen, 
  BarChart3,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Shield
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_DASHBOARD);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Last updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(new Date())}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.stats?.totalColleges || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.stats?.totalQuestions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.stats?.totalTests || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Recent Users</h2>
              </div>
              <Link
                to="/admin/users"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentUsers?.map((user) => (
                <div key={user._id} className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:scale-110 transition-all duration-300">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:scale-110 transition-all duration-300">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Recent Tests</h2>
              </div>
              <Link
                to="/admin/analytics"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentTests?.map((test) => (
                <div key={test._id} className="bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{test.userId?.name || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{test.userId?.email || 'No email'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(test.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{test.score}%</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{test.matchedTags?.length || 0} tags</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mt-8 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/questions"
              className="flex items-center p-4 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Add, edit, or remove test questions</p>
              </div>
            </Link>

            <Link
              to="/admin/colleges"
              className="flex items-center p-4 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Colleges</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Update college information</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center p-4 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View and manage user accounts</p>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center p-4 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View system analytics and reports</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mt-8 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">System Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border border-green-200 dark:border-green-700/50 rounded-xl shadow-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-3 shadow-lg"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">System Online</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">All services are running normally</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700/50 rounded-xl shadow-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 shadow-lg"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Database</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">MongoDB connection stable</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-700/50 rounded-xl shadow-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3 shadow-lg"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">API</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">All endpoints responding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 