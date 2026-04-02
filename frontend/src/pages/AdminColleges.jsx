import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin,
  Star,
  Building2,
  Loader2,
  AlertCircle,
  X,
  Save,
  Tag,
  Filter,
  ExternalLink
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const AdminColleges = () => {
  const { user } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      state: '',
      city: '',
      address: ''
    },
    streams: [],
    interestTags: [],
    description: '',
    rating: 0,
    rank: 0,
    website: '',
    phone: '',
    email: '',
    facilities: [],
    admissionCriteria: ''
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.ADMIN_COLLEGES}?limit=1000`);
      setColleges(response.data.data.colleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (!confirm('Are you sure you want to delete this college?')) return;
    
    try {
      await axios.delete(`${API_ENDPOINTS.ADMIN_COLLEGES}/${collegeId}`);
      toast.success('College deleted successfully');
      fetchColleges();
    } catch (error) {
      console.error('Error deleting college:', error);
      toast.error('Failed to delete college');
    }
  };

  const handleEditCollege = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name || '',
      location: {
        state: college.location?.state || '',
        city: college.location?.city || '',
        address: college.location?.address || ''
      },
      streams: college.streams || [],
      interestTags: college.interestTags || [],
      description: college.description || '',
      rating: college.rating || 0,
      rank: college.rank || 0,
      website: college.website || '',
      phone: college.phone || '',
      email: college.email || '',
      facilities: college.facilities || [],
      admissionCriteria: college.admissionCriteria || ''
    });
    setShowModal(true);
  };

  const handleAddCollege = () => {
    setEditingCollege(null);
    setFormData({
      name: '',
      location: {
        state: '',
        city: '',
        address: ''
      },
      streams: [],
      interestTags: [],
      description: '',
      rating: 0,
      rank: 0,
      website: '',
      phone: '',
      email: '',
      facilities: [],
      admissionCriteria: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('College name is required');
      return;
    }

    try {
      if (editingCollege) {
        await axios.put(`${API_ENDPOINTS.ADMIN_COLLEGES}/${editingCollege._id}`, formData);
        toast.success('College updated successfully');
      } else {
        await axios.post(API_ENDPOINTS.ADMIN_COLLEGES, formData);
        toast.success('College created successfully');
      }
      
      setShowModal(false);
      setEditingCollege(null);
      resetForm();
      fetchColleges();
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: {
        state: '',
        city: '',
        address: ''
      },
      streams: [],
      interestTags: [],
      description: '',
      rating: 0,
      rank: 0,
      website: '',
      phone: '',
      email: '',
      facilities: [],
      admissionCriteria: ''
    });
  };

  const addStream = () => {
    setFormData(prev => ({
      ...prev,
      streams: [...prev.streams, '']
    }));
  };

  const removeStream = (index) => {
    setFormData(prev => ({
      ...prev,
      streams: prev.streams.filter((_, i) => i !== index)
    }));
  };

  const updateStream = (index, value) => {
    setFormData(prev => ({
      ...prev,
      streams: prev.streams.map((stream, i) => i === index ? value : stream)
    }));
  };

  const addTag = (tag) => {
    if (tag.trim() && !formData.interestTags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        interestTags: [...prev.interestTags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagIndex) => {
    setFormData(prev => ({
      ...prev,
      interestTags: prev.interestTags.filter((_, i) => i !== tagIndex)
    }));
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === 'all' || college.location?.state === filterState;
    return matchesSearch && matchesState;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading colleges...</p>
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
              <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Manage Colleges
                </h1>
                <p className="text-gray-600 text-lg">Add, edit, and manage college information</p>
              </div>
            </div>
            <button 
              onClick={handleAddCollege}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add College
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All States</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Kerala">Kerala</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colleges List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="p-8 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900">
              Colleges ({filteredColleges.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {filteredColleges.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No colleges found</p>
              </div>
            ) : (
              filteredColleges.map((college) => (
                <div key={college._id} className="p-8 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm rounded-full font-medium">
                          Rank: {college.rank}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 font-medium">{college.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{college.location?.city}, {college.location?.state}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {college.streams?.map((stream, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm rounded-full font-medium"
                          >
                            {stream}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {college.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <button 
                        onClick={() => handleEditCollege(college)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCollege(college._id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-md"
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

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCollege ? 'Edit College' : 'Add New College'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.location.state}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, state: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rank
                    </label>
                    <input
                      type="number"
                      value={formData.rank}
                      onChange={(e) => setFormData(prev => ({ ...prev, rank: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.location.address}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, address: e.target.value }
                    }))}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Streams
                  </label>
                  <div className="space-y-2">
                    {formData.streams.map((stream, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={stream}
                          onChange={(e) => updateStream(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter stream name"
                        />
                        <button
                          type="button"
                          onClick={() => removeStream(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStream}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Add Stream
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.interestTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add interest tag"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        addTag(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingCollege ? 'Update College' : 'Add College'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminColleges; 