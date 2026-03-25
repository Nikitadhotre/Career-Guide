import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  BookOpen,
  AlertCircle,
  X,
  Save,
  Tag
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const AdminQuestions = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    category: 'aptitude',
    difficulty: 'medium',
    options: [
      { label: '', value: '', tags: [] }
    ]
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN_QUESTIONS);
      setQuestions(response.data.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await axios.delete(`${API_ENDPOINTS.ADMIN_QUESTIONS}/${questionId}`);
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
      options: question.options.map(opt => ({
        label: opt.label,
        value: opt.value,
        tags: opt.tags || []
      }))
    });
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      text: '',
      category: 'aptitude',
      difficulty: 'medium',
      options: [
        { label: '', value: '', tags: [] }
      ]
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.text.trim()) {
      toast.error('Question text is required');
      return;
    }
    
    if (formData.options.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }
    
    for (let option of formData.options) {
      if (!option.label.trim() || !option.value.trim()) {
        toast.error('All options must have both label and value');
        return;
      }
    }

    try {
      if (editingQuestion) {
        await axios.put(`${API_ENDPOINTS.ADMIN_QUESTIONS}/${editingQuestion._id}`, formData);
        toast.success('Question updated successfully');
      } else {
        await axios.post(API_ENDPOINTS.ADMIN_QUESTIONS, formData);
        toast.success('Question added successfully');
      }
      setShowModal(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { label: '', value: '', tags: [] }]
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 1) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const addTag = (optionIndex, tag) => {
    if (tag.trim()) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.map((option, i) => 
          i === optionIndex 
            ? { ...option, tags: [...option.tags, tag.trim()] }
            : option
        )
      }));
    }
  };

  const removeTag = (optionIndex, tagIndex) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === optionIndex 
          ? { ...option, tags: option.tags.filter((_, ti) => ti !== tagIndex) }
          : option
      )
    }));
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
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
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Manage Questions
                </h1>
                <p className="text-gray-600 text-lg">Add, edit, and manage aptitude test questions</p>
              </div>
            </div>
            <button 
              onClick={handleAddQuestion}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
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
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Categories</option>
                <option value="aptitude">Aptitude</option>
                <option value="personality">Personality</option>
                <option value="interest">Interest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="p-8 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900">
              Questions ({filteredQuestions.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No questions found</p>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div key={question._id} className="p-8 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm rounded-full font-medium">
                          {question.category}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 text-sm rounded-full font-medium">
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {question.text}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="text-sm text-gray-700">{option.label}</span>
                            {option.tags && option.tags.length > 0 && (
                              <div className="flex gap-1">
                                {option.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <button 
                        onClick={() => handleEditQuestion(question)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question._id)}
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

      {/* Add/Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter the question text..."
                  required
                />
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="aptitude">Aptitude</option>
                    <option value="personality">Personality</option>
                    <option value="interest">Interest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Options *
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => updateOption(index, 'label', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Option label..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Value</label>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => updateOption(index, 'value', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Option value..."
                            required
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Tags (optional)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {option.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(index, tagIndex)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add tag..."
                            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(index, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              addTag(index, input.value);
                              input.value = '';
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions; 