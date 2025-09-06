// src/game/saveLoadSystem.js
// Save and load system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';

class SaveLoadSystem {
  constructor() {
    this.saveFileName = 'saga_save_data';
    this.autoSaveInterval = null;
    this.autoSaveEnabled = true;
    this.autoSaveIntervalMinutes = 5;
  }

  // Initialize the save/load system
  initialize() {
    // Set up auto-save if enabled
    if (this.autoSaveEnabled) {
      this.startAutoSave();
    }
    
    console.log('Save/Load system initialized');
  }

  // Start auto-save interval
  startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    this.autoSaveInterval = setInterval(() => {
      this.saveGame();
    }, this.autoSaveIntervalMinutes * 60 * 1000); // Convert minutes to milliseconds
    
    console.log(`Auto-save started every ${this.autoSaveIntervalMinutes} minutes`);
  }

  // Stop auto-save interval
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('Auto-save stopped');
    }
  }

  // Save game to localStorage
  saveGame(saveName = null) {
    try {
      const state = gameStateManager.getState();
      
      // Create save data object
      const saveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        name: saveName || `Save ${new Date().toLocaleDateString()}`,
        state: state
      };
      
      // Save to localStorage
      const saveKey = `${this.saveFileName}_${saveData.timestamp}`;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // Update save index
      this.updateSaveIndex(saveKey, saveData);
      
      console.log('Game saved successfully');
      return { success: true, message: 'Game saved successfully', saveKey: saveKey };
    } catch (error) {
      console.error('Failed to save game:', error);
      return { success: false, message: 'Failed to save game: ' + error.message };
    }
  }

  // Load game from localStorage
  loadGame(saveKey) {
    try {
      // Retrieve save data
      const saveDataString = localStorage.getItem(saveKey);
      if (!saveDataString) {
        return { success: false, message: 'Save file not found' };
      }
      
      const saveData = JSON.parse(saveDataString);
      
      // Validate save data
      if (!saveData.version || !saveData.state) {
        return { success: false, message: 'Invalid save file format' };
      }
      
      // Check version compatibility
      if (saveData.version !== '1.0.0') {
        console.warn('Save file version mismatch. Attempting to load anyway.');
      }
      
      // Update game state
      gameStateManager.updateState(saveData.state);
      
      console.log('Game loaded successfully');
      return { success: true, message: 'Game loaded successfully' };
    } catch (error) {
      console.error('Failed to load game:', error);
      return { success: false, message: 'Failed to load game: ' + error.message };
    }
  }

  // Delete a save file
  deleteSave(saveKey) {
    try {
      // Remove save data
      localStorage.removeItem(saveKey);
      
      // Update save index
      this.removeFromSaveIndex(saveKey);
      
      console.log('Save file deleted successfully');
      return { success: true, message: 'Save file deleted successfully' };
    } catch (error) {
      console.error('Failed to delete save file:', error);
      return { success: false, message: 'Failed to delete save file: ' + error.message };
    }
  }

  // Get list of available saves
  getAvailableSaves() {
    try {
      const saveIndexString = localStorage.getItem(`${this.saveFileName}_index`);
      if (!saveIndexString) {
        return [];
      }
      
      const saveIndex = JSON.parse(saveIndexString);
      return saveIndex;
    } catch (error) {
      console.error('Failed to retrieve save index:', error);
      return [];
    }
  }

  // Update save index
  updateSaveIndex(saveKey, saveData) {
    try {
      // Get current index
      let saveIndex = [];
      const saveIndexString = localStorage.getItem(`${this.saveFileName}_index`);
      if (saveIndexString) {
        saveIndex = JSON.parse(saveIndexString);
      }
      
      // Check if save already exists in index
      const existingIndex = saveIndex.findIndex(save => save.key === saveKey);
      if (existingIndex !== -1) {
        // Update existing entry
        saveIndex[existingIndex] = {
          key: saveKey,
          name: saveData.name,
          timestamp: saveData.timestamp,
          version: saveData.version
        };
      } else {
        // Add new entry
        saveIndex.push({
          key: saveKey,
          name: saveData.name,
          timestamp: saveData.timestamp,
          version: saveData.version
        });
      }
      
      // Sort by timestamp (newest first)
      saveIndex.sort((a, b) => b.timestamp - a.timestamp);
      
      // Save updated index
      localStorage.setItem(`${this.saveFileName}_index`, JSON.stringify(saveIndex));
    } catch (error) {
      console.error('Failed to update save index:', error);
    }
  }

  // Remove save from index
  removeFromSaveIndex(saveKey) {
    try {
      const saveIndexString = localStorage.getItem(`${this.saveFileName}_index`);
      if (!saveIndexString) {
        return;
      }
      
      let saveIndex = JSON.parse(saveIndexString);
      saveIndex = saveIndex.filter(save => save.key !== saveKey);
      
      localStorage.setItem(`${this.saveFileName}_index`, JSON.stringify(saveIndex));
    } catch (error) {
      console.error('Failed to remove save from index:', error);
    }
  }

  // Export save data to file
  exportSaveToFile(saveKey) {
    try {
      const saveDataString = localStorage.getItem(saveKey);
      if (!saveDataString) {
        return { success: false, message: 'Save file not found' };
      }
      
      // Create blob and download link
      const blob = new Blob([saveDataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${saveKey}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('Save exported successfully');
      return { success: true, message: 'Save exported successfully' };
    } catch (error) {
      console.error('Failed to export save:', error);
      return { success: false, message: 'Failed to export save: ' + error.message };
    }
  }

  // Import save data from file
  importSaveFromFile(file) {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const saveData = JSON.parse(event.target.result);
            
            // Validate save data
            if (!saveData.version || !saveData.state) {
              resolve({ success: false, message: 'Invalid save file format' });
              return;
            }
            
            // Generate new save key
            const saveKey = `${this.saveFileName}_${Date.now()}`;
            
            // Save to localStorage
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            
            // Update save index
            this.updateSaveIndex(saveKey, saveData);
            
            console.log('Save imported successfully');
            resolve({ success: true, message: 'Save imported successfully', saveKey: saveKey });
          } catch (error) {
            console.error('Failed to parse imported save:', error);
            resolve({ success: false, message: 'Failed to parse imported save: ' + error.message });
          }
        };
        
        reader.onerror = (error) => {
          console.error('Failed to read save file:', error);
          resolve({ success: false, message: 'Failed to read save file: ' + error.message });
        };
        
        reader.readAsText(file);
      } catch (error) {
        console.error('Failed to import save:', error);
        resolve({ success: false, message: 'Failed to import save: ' + error.message });
      }
    });
  }

  // Quick save
  quickSave() {
    return this.saveGame('Quick Save');
  }

  // Quick load
  quickLoad() {
    const saves = this.getAvailableSaves();
    const quickSave = saves.find(save => save.name === 'Quick Save');
    
    if (quickSave) {
      return this.loadGame(quickSave.key);
    } else {
      return { success: false, message: 'No quick save found' };
    }
  }

  // Auto-save (called by interval)
  autoSave() {
    if (this.autoSaveEnabled) {
      console.log('Performing auto-save...');
      return this.saveGame('Auto Save');
    }
  }

  // Enable/disable auto-save
  setAutoSave(enabled) {
    this.autoSaveEnabled = enabled;
    
    if (enabled) {
      this.startAutoSave();
    } else {
      this.stopAutoSave();
    }
    
    console.log(`Auto-save ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Set auto-save interval
  setAutoSaveInterval(minutes) {
    this.autoSaveIntervalMinutes = minutes;
    
    // Restart auto-save with new interval
    if (this.autoSaveEnabled) {
      this.startAutoSave();
    }
    
    console.log(`Auto-save interval set to ${minutes} minutes`);
  }

  // Get save metadata
  getSaveMetadata(saveKey) {
    try {
      const saveDataString = localStorage.getItem(saveKey);
      if (!saveDataString) {
        return null;
      }
      
      const saveData = JSON.parse(saveDataString);
      return {
        name: saveData.name,
        version: saveData.version,
        timestamp: saveData.timestamp,
        playerLevel: saveData.state.player.level,
        playerName: saveData.state.player.name,
        playerRole: saveData.state.player.role,
        worldDay: saveData.state.world.time.day,
        worldYear: saveData.state.world.time.year
      };
    } catch (error) {
      console.error('Failed to get save metadata:', error);
      return null;
    }
  }

  // Clean up old autosaves (keep only last 5)
  cleanupOldSaves() {
    try {
      const saves = this.getAvailableSaves();
      
      // Filter autosaves
      const autoSaves = saves.filter(save => save.name === 'Auto Save');
      
      // Sort by timestamp (newest first)
      autoSaves.sort((a, b) => b.timestamp - a.timestamp);
      
      // Keep only the last 5 autosaves
      const savesToDelete = autoSaves.slice(5);
      
      // Delete old autosaves
      savesToDelete.forEach(save => {
        this.deleteSave(save.key);
      });
      
      console.log(`Cleaned up ${savesToDelete.length} old autosaves`);
      return { success: true, message: `Cleaned up ${savesToDelete.length} old autosaves` };
    } catch (error) {
      console.error('Failed to clean up old saves:', error);
      return { success: false, message: 'Failed to clean up old saves: ' + error.message };
    }
  }
}

// Export a singleton instance
export const saveLoadSystem = new SaveLoadSystem();

// Export the class for potential extension
export default SaveLoadSystem;