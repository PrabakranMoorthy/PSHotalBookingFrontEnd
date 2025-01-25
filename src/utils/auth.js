// src/utils/auth.js

export const logout = () => {
  // Clear user data from localStorage
  localStorage.removeItem("user");

  // You can also clear other authentication tokens, if any
  localStorage.removeItem("token");

  // Redirect to login page or home page after logout
  window.location.href = "/login"; // Change this to your login route if different
};
