import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Target,
  Zap
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.APTITUDE_QUESTIONS);
      setQuestions(response.data.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      if (!confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const answersArray = questions.map(question => ({
        questionId: question._id,
        selectedOption: answers[question._id] || null
      })).filter(answer => answer.selectedOption !== null);

      const response = await axios.post(API_ENDPOINTS.APTITUDE_SUBMIT, {
        answers: answersArray
      });

      toast.success('Test submitted successfully!');
      navigate('/career', { 
        state: { 
          result: response.data.data.result,
          recommendations: response.data.data.recommendations,
          colleges: response.data.data.colleges
        }
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (Object.keys(answers).length / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading your aptitude assessment...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Aptitude Assessment</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">{Object.keys(answers).length}/{questions.length}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
              <span className="font-medium">Your Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 mb-8 transition-all duration-300">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {question.text}
              </h2>
            </div>
            
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    answers[question._id] === option.value
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option.value}
                    checked={answers[question._id] === option.value}
                    onChange={() => handleAnswerSelect(question._id, option.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center transition-all duration-300 ${
                    answers[question._id] === option.value
                      ? 'border-blue-500 bg-blue-500 shadow-lg'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {answers[question._id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 text-lg">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            {Object.keys(answers).length < questions.length && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">You have unanswered questions</span>
              </div>
            )}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Submit Test</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
