export const loginUser = (email, password) => {
    // Simulate API request
    if (email === 'test@example.com' && password === 'password123') {
      localStorage.setItem('token', 'mock-token');
      return true;
    }
    return false;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem('token');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  