// Simple test script to check if the API endpoints are working
const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test if auth endpoints are accessible
    const optionsResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'OPTIONS'
    });
    console.log('Auth endpoint OPTIONS:', optionsResponse.status);
    
    console.log('API test completed successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();
