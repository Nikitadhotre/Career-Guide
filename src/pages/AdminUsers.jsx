import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Mail,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  ShieldOff,
  Filter
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_USERS);
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await axios.patch(`${API_ENDPOINTS.ADMIN_USER_TOGGLE}/${userId}/toggle-status`);
      toast.success('User status updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Manage Users
                </h1>
                <p className="text-gray-600 text-lg">View and manage user accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="p-8 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="p-8 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500 capitalize">{user.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        user.isActive 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user._id)}
                        className={`p-3 rounded-xl transition-all duration-300 hover:shadow-md ${
                          user.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 