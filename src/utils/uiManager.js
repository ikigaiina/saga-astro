// src/utils/uiManager.js

/**
 * Show a notification to the user
 * @param {string} message - The message to display
 * @param {string} icon - The icon to display (optional)
 * @param {string} bgColor - The background color class (optional)
 */
export function showNotification(message, icon = '', bgColor = 'bg-slate-600') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center`;
  
  if (icon) {
    const iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', icon);
    iconEl.className = 'mr-2';
    notification.appendChild(iconEl);
  }
  
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  notification.appendChild(messageEl);
  
  // Add to document
  document.body.appendChild(notification);
  
  // Refresh Lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show or hide the spinner
 * @param {string} message - The message to display with the spinner
 */
export function showLoadingSpinner(show, message = 'Loading...') {
  const spinner = document.getElementById('loading-spinner');
  const mainContent = document.getElementById('main-content');
  
  if (spinner) {
    spinner.style.display = show ? 'flex' : 'none';
    spinner.querySelector('span').textContent = message;
  }
  
  if (mainContent) {
    mainContent.style.opacity = show ? '0.5' : '1';
    mainContent.style.pointerEvents = show ? 'none' : 'auto';
  }
}

/**
 * Update login UI based on user status
 * @param {Object|null} user - The current user object or null if not logged in
 */
export function updateLoginUI(user) {
  const loggedOutView = document.getElementById('logged-out-view');
  const loggedInView = document.getElementById('logged-in-view');
  const currentUsernameDisplay = document.getElementById('current-username');
  const userIdDisplay = document.getElementById('user-id-display');
  const wandererNameInput = document.getElementById('wanderer-name-input');

  if (user) {
    if (loggedOutView) loggedOutView.style.display = 'none';
    if (loggedInView) loggedInView.style.display = 'block';
    if (currentUsernameDisplay) currentUsernameDisplay.textContent = user.name;
    if (userIdDisplay) userIdDisplay.textContent = user.id;
  } else {
    if (loggedOutView) loggedOutView.style.display = 'block';
    if (loggedInView) loggedInView.style.display = 'none';
    if (wandererNameInput) wandererNameInput.value = '';
  }
}