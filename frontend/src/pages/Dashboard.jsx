import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BookOpen, 
  Heart, 
  BarChart3, 
  Calendar,
  Star,
  MapPin,
  ExternalLink,
  TrendingUp,
  Users,
  Award,
  Loader2,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [savedColleges, setSavedColleges] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, savedCollegesRes, historyRes] = await Promise.all([
        axios.get(API_ENDPOINTS.USER_STATS),
        axios.get(API_ENDPOINTS.USER_SAVED_COLLEGES),
        axios.get(API_ENDPOINTS.APTITUDE_HISTORY)
      ]);

      setStats(statsRes.data.data);
      setSavedColleges(savedCollegesRes.data.data.savedColleges);
      setTestHistory(historyRes.data.data.results);
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center px-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
            <Target className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <Loader2 className="h-8 w-8 lg:h-12 lg:w-12 animate-spin text-purple-600 mx-auto mb-3 lg:mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-4 lg:py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-8 mb-6 lg:mb-8 transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-lg">
                  Here's your career guidance overview
                </p>
              </div>
            </div>
            <Link
              to="/quiz"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 lg:px-8 py-3 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            >
              Take New Test
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-6 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-3 lg:mb-0 lg:mr-4">
                <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300">Tests Taken</p>
                <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stats?.totalTests || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-6 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mb-3 lg:mb-0 lg:mr-4">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300">Saved Colleges</p>
                <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stats?.savedCollegesCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-6 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mb-3 lg:mb-0 lg:mr-4">
                <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300">Average Score</p>
                <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stats?.averageScore || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-6 transition-all duration-300 hover:scale-105">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg mb-3 lg:mb-0 lg:mr-4">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300">Member Since</p>
                <p className="text-sm lg:text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {formatDate(stats?.memberSince || new Date())}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Saved Colleges */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-8 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Saved Colleges
                </h2>
              </div>
              <Link
                to="/colleges"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-300 text-center sm:text-left"
              >
                View All
              </Link>
            </div>

            {savedColleges.length === 0 ? (
              <div className="text-center py-6 lg:py-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                  <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3 lg:mb-4 text-base lg:text-lg">No saved colleges yet</p>
                <Link
                  to="/colleges"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Browse Colleges
                </Link>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {savedColleges.slice(0, 5).map((college) => (
                  <div key={college._id} className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl p-3 lg:p-4 transition-all duration-300 hover:scale-105 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm lg:text-base truncate">
                          {college.name}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs lg:text-sm mb-1 lg:mb-2">
                          <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{college.location.city}, {college.location.state}</span>
                        </div>
                        <div className="flex items-center text-xs lg:text-sm">
                          <Star className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500 mr-1 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{college.rating}/5</span>
                        </div>
                      </div>
                      {college.website && (
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 ml-2 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test History */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-8 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Recent Tests
                </h2>
              </div>
              <Link
                to="/quiz"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-300 text-center sm:text-left"
              >
                Take New Test
              </Link>
            </div>

            {testHistory.length === 0 ? (
              <div className="text-center py-6 lg:py-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                  <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3 lg:mb-4 text-base lg:text-lg">No tests taken yet</p>
                <Link
                  to="/quiz"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Take Your First Test
                </Link>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {testHistory.slice(0, 5).map((test) => (
                  <div key={test._id} className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-xl p-3 lg:p-4 transition-all duration-300 hover:scale-105 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2 lg:mr-3 shadow-lg flex-shrink-0"></div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                          Score: {test.score}%
                        </span>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(test.completedAt)}
                      </span>
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                      {test.matchedTags.length} interest areas identified
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Career Insights */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-8 mt-6 lg:mt-8 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6 lg:mb-8">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Career Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg">
              <TrendingUp className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3 text-base lg:text-lg">Progress Tracking</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                Monitor your career exploration journey and track your growth over time.
              </p>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg">
              <Users className="h-8 w-8 lg:h-10 lg:w-10 text-green-600 dark:text-green-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3 text-base lg:text-lg">Personalized Recommendations</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                Get tailored college and career suggestions based on your unique profile.
              </p>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg md:col-span-2 lg:col-span-1">
              <Award className="h-8 w-8 lg:h-10 lg:w-10 text-purple-600 dark:text-purple-400 mx-auto mb-3 lg:mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 lg:mb-3 text-base lg:text-lg">Achievement Goals</h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                Set and achieve your career goals with our comprehensive guidance system.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 lg:p-8 mt-6 lg:mt-8 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6 lg:mb-8">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Link
              to="/quiz"
              className="flex flex-col sm:flex-row sm:items-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg text-center sm:text-left"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
                <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base lg:text-lg">Take Aptitude Test</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Discover your strengths</p>
              </div>
            </Link>
            <Link
              to="/colleges"
              className="flex flex-col sm:flex-row sm:items-center p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg text-center sm:text-left"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base lg:text-lg">Browse Colleges</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">Find your perfect match</p>
              </div>
            </Link>
            <Link
              to="/career"
              className="flex flex-col sm:flex-row sm:items-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 border border-purple-200 dark:border-purple-700 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg text-center sm:text-left md:col-span-2 lg:col-span-1"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
                <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base lg:text-lg">View Results</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">See your recommendations</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 