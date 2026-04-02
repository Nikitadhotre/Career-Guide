import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Star, 
  MapPin, 
  Building2, 
  BookOpen, 
  Heart,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Trophy,
  Sparkles,
  Target,
  History,
  Calendar,
  BarChart3,
  Clock
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const Career = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [savedColleges, setSavedColleges] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { result, recommendations, colleges } = location.state || {};

  useEffect(() => {
    if (!result) {
      navigate('/quiz');
      return;
    }
    fetchSavedColleges();
    fetchPreviousResults();
  }, [result, navigate]);

  const fetchSavedColleges = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USER_SAVED_COLLEGES);
      const savedIds = new Set(response.data.data.savedColleges.map(college => college._id));
      setSavedColleges(savedIds);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const fetchPreviousResults = async () => {
    try {
      setLoadingHistory(true);
      const response = await axios.get(API_ENDPOINTS.APTITUDE_HISTORY);
      // Filter out the current result to avoid duplication
      const filteredResults = response.data.data.results.filter(
        prevResult => prevResult._id !== result?.id
      );
      setPreviousResults(filteredResults);
    } catch (error) {
      console.error('Error fetching previous results:', error);
      toast.error('Failed to load previous results');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSaveCollege = async (collegeId) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-green-900/20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">No test results found. Please take the aptitude test first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-green-900/20 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Your Career Assessment Results
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Based on your aptitude test, here are your personalized recommendations
                </p>
              </div>
            </div>
            
            {/* Score Card */}
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-2xl p-8 text-white mb-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{result.score}%</div>
                  <div className="text-emerald-100 font-medium">Match Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{result.totalQuestions}</div>
                  <div className="text-emerald-100 font-medium">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{result.matchedTags?.length || 0}</div>
                  <div className="text-emerald-100 font-medium">Interest Tags Matched</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Results Section */}
        {previousResults.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Previous Test Results</h2>
            </div>
            
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <span className="text-gray-600 dark:text-gray-300">Loading previous results...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousResults.map((prevResult, index) => (
                  <div key={prevResult._id} className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(prevResult.completedAt)}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(prevResult.score)} ${getScoreColor(prevResult.score)}`}>
                        {prevResult.score}%
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Score Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="font-bold text-gray-900 dark:text-white">{prevResult.totalQuestions}</div>
                          <div className="text-gray-600 dark:text-gray-400">Questions</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="font-bold text-gray-900 dark:text-white">{prevResult.matchedTags?.length || 0}</div>
                          <div className="text-gray-600 dark:text-gray-400">Tags Matched</div>
                        </div>
                      </div>
                    </div>
                    
                    {prevResult.matchedTags && prevResult.matchedTags.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Interest Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {prevResult.matchedTags.slice(0, 4).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {prevResult.matchedTags.length > 4 && (
                            <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              +{prevResult.matchedTags.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Test #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => navigate('/career', { 
                          state: { 
                            result: {
                              id: prevResult._id,
                              score: prevResult.score,
                              totalQuestions: prevResult.totalQuestions,
                              matchedTags: prevResult.matchedTags,
                              completedAt: prevResult.completedAt
                            },
                            recommendations: prevResult.recommendations,
                            colleges: prevResult.recommendations?.map(rec => rec.collegeId).filter(Boolean) || []
                          }
                        })}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Career Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Recommended Career Paths</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((career, index) => (
                <div key={index} className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{career.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{career.matchScore}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{career.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {career.skills?.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-800 dark:text-emerald-200 text-xs rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Colleges */}
        {colleges && colleges.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Recommended Colleges</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <div key={college._id} className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-700/50 dark:to-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-600/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg">
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
                      disabled={loading}
                      className={`p-2 rounded-full transition-colors ${
                        savedColleges.has(college._id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${savedColleges.has(college._id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Streams:</h4>
                    <div className="flex flex-wrap gap-1">
                      {college.streams?.slice(0, 3).map((stream, index) => (
                        <span key={index} className="px-2 py-1 bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 text-teal-800 dark:text-teal-200 text-xs rounded-full">
                          {stream}
                        </span>
                      ))}
                      {college.streams?.length > 3 && (
                        <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          +{college.streams.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Users className="h-4 w-4" />
                      <span>Student Body</span>
                    </div>
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="h-5 w-5" />
            <span>Retake Test</span>
          </button>
          <button
            onClick={() => navigate('/colleges')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 rounded-xl font-semibold text-lg hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300 hover:scale-105"
          >
            <Building2 className="h-5 w-5" />
            <span>Explore More Colleges</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Career;
