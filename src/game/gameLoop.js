// src/game/gameLoop.js
// Game loop system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { worldSystem } from './worldSystem.js';
import { questSystem } from './questSystem.js';

class GameLoop {
  constructor() {
    this.isRunning = false;
    this.lastUpdate = 0;
    this.updateInterval = 1000; // Update every second
    this.realTimeMode = true; // Whether to advance time in real-time
    this.timeScale = 1; // How fast time advances relative to real time
  }

  // Start the game loop
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastUpdate = performance.now();
    
    console.log('Game loop started');
    this.gameLoop();
  }

  // Stop the game loop
  stop() {
    this.isRunning = false;
    console.log('Game loop stopped');
  }

  // Main game loop
  gameLoop() {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const deltaTime = now - this.lastUpdate;
    
    // Update game systems
    this.update(deltaTime);
    
    // Schedule next update
    this.lastUpdate = now;
    requestAnimationFrame(() => this.gameLoop());
  }

  // Update game systems
  update(deltaTime) {
    // Handle real-time progression if enabled
    if (this.realTimeMode) {
      // Advance game time based on real time and time scale
      const minutesToAdvance = (deltaTime / 1000 / 60) * this.timeScale;
      if (minutesToAdvance > 0.1) { // Only advance if significant time has passed
        gameStateManager.advanceTime(minutesToAdvance);
      }
    }
    
    // Update world system
    worldSystem.update();
    
    // Process random events
    this.processRandomEvents();
    
    // Update quests
    this.updateQuests();
    
    // Save game periodically
    this.handleAutoSave();
  }

  // Process random events
  processRandomEvents() {
    // In a full implementation, this would check for and trigger random events
    // based on probabilities, player actions, world state, etc.
    
    // For now, we'll just log that we're processing events
    // console.log('Processing random events...');
  }

  // Update quests
  updateQuests() {
    // In a full implementation, this would check for quest updates
    // based on player actions, time progression, etc.
    
    // For now, we'll just log that we're updating quests
    // console.log('Updating quests...');
  }

  // Handle auto-save
  handleAutoSave() {
    // In a full implementation, this would handle periodic auto-saving
    // For now, we'll just log that we're handling auto-save
    // console.log('Handling auto-save...');
  }

  // Set time scale
  setTimeScale(scale) {
    this.timeScale = scale;
    console.log(`Time scale set to ${scale}x`);
  }

  // Toggle real-time mode
  toggleRealTimeMode() {
    this.realTimeMode = !this.realTimeMode;
    console.log(`Real-time mode ${this.realTimeMode ? 'enabled' : 'disabled'}`);
  }

  // Advance time manually
  advanceTime(minutes) {
    gameStateManager.advanceTime(minutes);
    console.log(`Advanced time by ${minutes} minutes`);
  }

  // Pause game time
  pauseTime() {
    this.realTimeMode = false;
    console.log('Game time paused');
  }

  // Resume game time
  resumeTime() {
    this.realTimeMode = true;
    this.lastUpdate = performance.now();
    console.log('Game time resumed');
  }
}

// Export a singleton instance
export const gameLoop = new GameLoop();

// Export the class for potential extension
export default GameLoop;