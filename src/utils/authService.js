// src/utils/authService.js

// Simple in-memory storage for users (in a real app, this would be backed by a database)
let users = {};
let currentUser = null;

/**
 * Create a new user or login existing user
 * @param {string} username - The username
 * @param {string} role - The user role ('wanderer' or 'forger')
 * @returns {Object} The user object
 */
export async function createOrLoginUser(username, role) {
  // Validate role
  if (role !== 'wanderer' && role !== 'forger') {
    throw new Error('Invalid role. Must be "wanderer" or "forger".');
  }

  // Check if user already exists
  const existingUser = Object.values(users).find(user => user.name === username && user.role === role);
  
  if (existingUser) {
    currentUser = existingUser;
    return existingUser;
  }

  // Create new user
  const newUser = {
    id: generateUserId(),
    name: username,
    role: role,
    createdAt: new Date().toISOString()
  };

  users[newUser.id] = newUser;
  currentUser = newUser;
  
  return newUser;
}

/**
 * Logout the current user
 */
export function logoutUser() {
  currentUser = null;
}

/**
 * Get the current user
 * @returns {Object|null} The current user object or null if not logged in
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Generate a unique user ID
 * @returns {string} A unique user ID
 */
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}