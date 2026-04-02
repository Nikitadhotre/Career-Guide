import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  BookOpen, 
  Heart,
  ExternalLink,
  Building2,
  Loader2,
  X
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const Collage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCollege, setSavingCollege] = useState(null);
  const [savedColleges, setSavedColleges] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    stream: '',
    minRating: '',
    maxRating: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    states: [],
    cities: [],
    streams: [],
    tags: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalColleges: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchFilters();
    fetchSavedColleges();
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [filters, pagination.currentPage]);

  const fetchFilters = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.COLLEGES_FILTERS);
      setAvailableFilters(response.data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USER_SAVED_COLLEGES);
      const savedIds = new Set(response.data.data.savedColleges.map(college => college._id));
      setSavedColleges(savedIds);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...filters
      });

      const response = await axios.get(`${API_ENDPOINTS.COLLEGES}?${params}`);
      setColleges(response.data.data.colleges);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCollege = async (collegeId) => {
    setSavingCollege(collegeId);
    try {
      if (savedColleges.has(collegeId)) {
        await axios.delete(`${API_ENDPOINTS.USER_REMOVE_COLLEGE}/${collegeId}`);
        setSavedColleges(prev => {
          const newSet = new Set(prev);
          newSet.delete(collegeId);
          return newSet;
        });
        toast.success('College removed from saved list');
      } else {
        await axios.post(API_ENDPOINTS.USER_SAVE_COLLEGE, { collegeId });
        setSavedColleges(prev => new Set([...prev, collegeId]));
        toast.success('College saved successfully');
      }
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    } finally {
      setSavingCollege(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      state: '',
      city: '',
      stream: '',
      minRating: '',
      maxRating: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Colleges</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover {pagination.totalColleges} colleges and universities
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 lg:mt-0"
            >
              <Filter className="h-5 w-5" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search colleges by name, location, or stream..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All States</option>
                    {availableFilters.states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Cities</option>
                    {availableFilters.cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Stream</label>
                  <select
                    value={filters.stream}
                    onChange={(e) => handleFilterChange('stream', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Streams</option>
                    {availableFilters.streams.map((stream) => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Max Rating</label>
                  <select
                    value={filters.maxRating}
                    onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">Up to 3 Stars</option>
                    <option value="4">Up to 4 Stars</option>
                    <option value="5">Up to 5 Stars</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value) {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {key}: {value}
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {colleges.map((college) => (
            <div key={college._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow transition-colors duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{college.name}</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-3">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{college.rating}/5.0</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCollege(college._id)}
                    disabled={savingCollege === college._id}
                    className={`p-2 rounded-full transition-colors ${
                      savedColleges.has(college._id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                  >
                    {savingCollege === college._id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${savedColleges.has(college._id) ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Streams</h4>
                  <div className="flex flex-wrap gap-1">
                    {college.streams?.slice(0, 3).map((stream, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        {stream}
                      </span>
                    ))}
                    {college.streams?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        +{college.streams.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{college.courses?.length || 0} courses</span>
                  </div>
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-gray-600 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collage;
