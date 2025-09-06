// src/utils/app.js
import { showNotification, showLoadingSpinner, updateLoginUI } from './uiManager.js';
import { createOrLoginUser, logoutUser, getCurrentUser } from './authService.js';

class App {
  constructor() {
    this.currentUserId = null;
    this.currentUserRole = null;
    this.currentUsername = null;
    this.dailyUpdateInterval = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    // Set up event listeners
    this.setupEventListeners();
    
    // Update UI based on current user status
    const user = getCurrentUser();
    updateLoginUI(user);
    
    if (user) {
      this.currentUserId = user.id;
      this.currentUserRole = user.role;
      this.currentUsername = user.name;
    }
  }

  /**
   * Set up event listeners for UI elements
   */
  setupEventListeners() {
    // Login buttons
    const playAsWandererBtn = document.getElementById('play-as-wanderer-btn');
    const playAsForgerBtn = document.getElementById('play-as-forger-btn');
    
    if (playAsWandererBtn) {
      playAsWandererBtn.addEventListener('click', () => this.handleLogin('wanderer'));
    }
    
    if (playAsForgerBtn) {
      playAsForgerBtn.addEventListener('click', () => this.handleLogin('forger'));
    }
    
    // Continue button
    const continueGameBtn = document.getElementById('continue-game-btn');
    if (continueGameBtn) {
      continueGameBtn.addEventListener('click', () => {
        const user = getCurrentUser();
        if (user) {
          if (user.role === 'forger') {
            window.location.href = '/forger';
          } else if (user.role === 'wanderer') {
            window.location.href = '/wanderer';
          }
        }
      });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
    
    // Back to main button (on dashboard pages)
    const backToMainBtn = document.getElementById('back-to-main-btn');
    if (backToMainBtn) {
      backToMainBtn.addEventListener('click', () => {
        window.location.href = '/';
      });
    }
    
    // Navigation buttons for Forger dashboard
    const setupForgerNav = (btn, page) => {
      if (btn) {
        btn.addEventListener('click', () => {
          const user = getCurrentUser();
          if (user && user.role === 'forger') {
            window.location.href = `/${page}`;
          } else {
            showNotification('Hanya Forger yang dapat mengakses halaman ini', 'alert-triangle', 'bg-red-500');
          }
        });
      }
    };
    
    setupForgerNav(document.getElementById('go-to-designer-btn'), 'civilization_designer');
    setupForgerNav(document.getElementById('go-to-narrative-timeline-btn'), 'narrative_timeline_forge');
    setupForgerNav(document.getElementById('go-to-genealogy-atlas-btn'), 'cosmic_genealogy_atlas');
    setupForgerNav(document.getElementById('go-to-multiverse-suite-btn'), 'multiverse_simulation_suite');
    setupForgerNav(document.getElementById('go-to-ai-governance-btn'), 'ai_governance_console');
    setupForgerNav(document.getElementById('go-to-primordial-console-btn'), 'primordial_intervention_console');
    setupForgerNav(document.getElementById('go-to-environmental-sculptor-btn'), 'environmental_sculptor');
    setupForgerNav(document.getElementById('go-to-entity-inspector-btn'), 'entity_inspector');
    setupForgerNav(document.getElementById('go-to-cosmic-pattern-weaver-btn'), 'cosmic_pattern_weaver');
    
    // Navigation buttons for Wanderer dashboard
    const setupWandererNav = (btn, page) => {
      if (btn) {
        btn.addEventListener('click', () => {
          const user = getCurrentUser();
          if (user && user.role === 'wanderer') {
            window.location.href = `/${page}`;
          } else {
            showNotification('Hanya Wanderer yang dapat mengakses halaman ini', 'alert-triangle', 'bg-red-500');
          }
        });
      }
    };
    
    setupWandererNav(document.getElementById('go-to-echoes-of-divergence-btn'), 'echoes_of_divergence');
    setupWandererNav(document.getElementById('go-to-dream-weaver-btn'), 'dream_weaver');
    setupWandererNav(document.getElementById('go-to-meditation-chamber-btn'), 'meditation_chamber');
    setupWandererNav(document.getElementById('go-to-ancient-spirit-nexus-btn'), 'ancient_spirit_nexus');
    setupWandererNav(document.getElementById('go-to-hall-of-legends-btn'), 'hall_of_legends');
    setupWandererNav(document.getElementById('go-to-dimensional-rift-explorer-btn'), 'dimensional_rift_explorer');
  }

  /**
   * Handle user login
   * @param {string} role - The user role ('wanderer' or 'forger')
   */
  async handleLogin(role) {
    const wandererNameInput = document.getElementById('wanderer-name-input');
    const username = wandererNameInput ? wandererNameInput.value.trim() : '';
    
    if (!username) {
      showNotification('Silakan masukkan nama Anda', 'alert-triangle', 'bg-orange-500');
      return;
    }
    
    showLoadingSpinner(true, 'Logging in...');
    
    try {
      const user = await createOrLoginUser(username, role);
      this.currentUserId = user.id;
      this.currentUserRole = user.role;
      this.currentUsername = user.name;
      
      showNotification(`Selamat datang, ${user.name}!`, 'user', 'bg-green-600');
      updateLoginUI(user);
      
      // Redirect to appropriate dashboard
      setTimeout(() => {
        if (role === 'forger') {
          window.location.href = '/forger';
        } else {
          window.location.href = '/wanderer';
        }
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      showNotification('Login gagal: ' + error.message, 'error', 'bg-red-700');
    } finally {
      showLoadingSpinner(false);
    }
  }

  /**
   * Handle user logout
   */
  async handleLogout() {
    showLoadingSpinner(true, 'Logging out...');
    
    try {
      logoutUser();
      this.currentUserId = null;
      this.currentUserRole = null;
      this.currentUsername = null;
      
      showNotification('Anda telah logout', 'log-out', 'bg-slate-600');
      updateLoginUI(null);
      
      // Redirect to main page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      showNotification('Logout gagal: ' + error.message, 'error', 'bg-red-700');
    } finally {
      showLoadingSpinner(false);
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Export for potential use in other modules
export default App;