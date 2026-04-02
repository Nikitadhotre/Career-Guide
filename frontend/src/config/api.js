// API Configuration for unified deployment
// In production, both frontend and backend will be on the same domain
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  
  // User
  USER_STATS: `${API_BASE_URL}/user/stats`,
  USER_SAVED_COLLEGES: `${API_BASE_URL}/user/saved-colleges`,
  USER_SAVE_COLLEGE: `${API_BASE_URL}/user/save-college`,
  USER_REMOVE_COLLEGE: `${API_BASE_URL}/user/remove-college`,
  
  // Aptitude
  APTITUDE_QUESTIONS: `${API_BASE_URL}/aptitude/questions`,
  APTITUDE_SUBMIT: `${API_BASE_URL}/aptitude/submit`,
  APTITUDE_HISTORY: `${API_BASE_URL}/aptitude/history`,
  
  // Colleges
  COLLEGES: `${API_BASE_URL}/colleges`,
  COLLEGES_FILTERS: `${API_BASE_URL}/colleges/filters`,
  
  // Admin
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_USER_TOGGLE: `${API_BASE_URL}/admin/users`,
  ADMIN_QUESTIONS: `${API_BASE_URL}/admin/questions`,
  ADMIN_COLLEGES: `${API_BASE_URL}/admin/colleges`,
  ADMIN_TEST_RESULTS: `${API_BASE_URL}/admin/test-results`,
};

export default API_BASE_URL; 