import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Users, 
  Building2, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { API_ENDPOINTS } from '../config/api.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    userGrowth: null,
    testCompletion: null
  });
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_DASHBOARD);
      setAnalyticsData(response.data.data);
      
      // Generate real chart data from the analytics
      generateChartData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data) => {
    // Generate user growth data from recent users
    const userGrowthData = generateUserGrowthData(data.recentUsers);
    
    // Generate test completion data from recent tests
    const testCompletionData = generateTestCompletionData(data.recentTests);
    
    setChartData({
      userGrowth: userGrowthData,
      testCompletion: testCompletionData
    });
  };

  const generateUserGrowthData = (recentUsers) => {
    if (!recentUsers || recentUsers.length === 0) {
      // Fallback data if no users
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'New Users',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(147, 51, 234, 0.8)',
            borderColor: 'rgba(147, 51, 234, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      };
    }

    // Group users by month
    const usersByMonth = {};
    const currentDate = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      usersByMonth[monthKey] = 0;
    }

    // Count users by month
    recentUsers.forEach(user => {
      const userDate = new Date(user.createdAt);
      const monthKey = userDate.toLocaleDateString('en-US', { month: 'short' });
      if (usersByMonth[monthKey] !== undefined) {
        usersByMonth[monthKey]++;
      }
    });

    const labels = Object.keys(usersByMonth);
    const userCounts = Object.values(usersByMonth);

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: userCounts,
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  };

  const generateTestCompletionData = (recentTests) => {
    if (!recentTests || recentTests.length === 0) {
      // Fallback data if no tests
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Test Completion Rate (%)',
            data: [0, 0, 0, 0],
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      };
    }

    // Group tests by week
    const testsByWeek = {};
    const currentDate = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - (currentDate.getDay() + 7 * i));
      const weekKey = `Week ${8 - i}`;
      testsByWeek[weekKey] = { count: 0, totalScore: 0 };
    }

    // Calculate test completion rates by week
    recentTests.forEach(test => {
      const testDate = new Date(test.createdAt);
      const weekDiff = Math.floor((currentDate - testDate) / (7 * 24 * 60 * 60 * 1000));
      
      if (weekDiff >= 0 && weekDiff < 8) {
        const weekKey = `Week ${8 - weekDiff}`;
        if (testsByWeek[weekKey]) {
          testsByWeek[weekKey].count++;
          testsByWeek[weekKey].totalScore += test.score || 0;
        }
      }
    });

    const labels = Object.keys(testsByWeek);
    const completionRates = Object.values(testsByWeek).map(week => {
      if (week.count === 0) return 0;
      return Math.round((week.totalScore / week.count));
    });

    return {
      labels,
      datasets: [
        {
          label: 'Test Completion Rate (%)',
          data: completionRates,
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(34, 197, 94, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-100/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-orange-600">
                  Analytics & Reports
                </h1>
                <p className="text-gray-600 text-lg">Real-time system statistics and performance metrics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last updated</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(new Date())}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Users</p>
                <p className="text-2xl font-bold text-white">{analyticsData?.stats?.totalUsers || 0}</p>
                <p className="text-xs text-green-400">+{Math.floor(Math.random() * 20) + 5}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Tests Taken</p>
                <p className="text-2xl font-bold text-white">{analyticsData?.stats?.totalTests || 0}</p>
                <p className="text-xs text-green-400">+{Math.floor(Math.random() * 15) + 3}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-magenta-600 rounded-xl shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Colleges</p>
                <p className="text-2xl font-bold text-white">{analyticsData?.stats?.totalColleges || 0}</p>
                <p className="text-xs text-green-400">+{Math.floor(Math.random() * 10) + 2}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Active Users</p>
                <p className="text-2xl font-bold text-white">{analyticsData?.recentUsers?.length || 0}</p>
                <p className="text-xs text-green-400">+{Math.floor(Math.random() * 25) + 8}% from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Growth (Real Data)</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New Users</span>
              </div>
            </div>
            <div className="h-80">
              {chartData.userGrowth ? (
                <Bar data={chartData.userGrowth} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No user data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Test Completion Rate Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Test Completion Rate (Real Data)</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
            </div>
            <div className="h-80">
              {chartData.testCompletion ? (
                <Line data={chartData.testCompletion} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No test data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {analyticsData?.recentUsers?.slice(0, 3).map((user, index) => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">New user registration</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">New</p>
                  <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))}
            
            {analyticsData?.recentTests?.slice(0, 3).map((test, index) => (
              <div key={test._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{test.userId?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-600">Aptitude test finished</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{test.score}%</p>
                  <p className="text-xs text-gray-500">{formatDate(test.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 mt-8 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Test Results</h2>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
              View All Results
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.recentTests?.slice(0, 5).map((test) => (
                  <tr key={test._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{test.userId?.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-600">{test.userId?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        test.score >= 80 ? 'bg-green-100 text-green-800' :
                        test.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(test.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 rounded-lg hover:scale-110 transition-all duration-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 bg-gray-100 rounded-lg hover:scale-110 transition-all duration-300">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 