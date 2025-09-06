// src/game/stateManager.js
// Game State Manager for The Soulforge Saga

import { SKILL_TREE_DATA } from '../data/skills.js';
import { REGIONS_DATA } from '../data/world.js';
import { CREATURES_DATA, NPC_LIFESTAGES, NPC_HEALTH_STATES } from '../data/npcs.js';
import { TRADABLE_ITEMS_DATA } from '../data/items.js';
import { gameLoop } from './gameLoop.js';

class GameStateManager {
  constructor() {
    this.state = this.getDefaultState();
    this.subscribers = [];
  }

  getDefaultState() {
    return {
      // Player data
      player: {
        id: null,
        name: '',
        role: 'wanderer', // 'wanderer' or 'forger'
        level: 1,
        experience: 0,
        attributes: {
          strength: 10,
          intelligence: 10,
          charisma: 10,
          dexterity: 10,
          constitution: 10,
          wisdom: 10
        },
        skills: {},
        inventory: [],
        equipment: {},
        location: 'TheCentralNexus',
        health: 100,
        maxHealth: 100,
        essence: 0,
        reputation: {},
        journal: [],
        achievements: [],
        quests: []
      },
      
      // World data
      world: {
        regions: {},
        time: {
          day: 1,
          hour: 12,
          minute: 0,
          season: 'spring',
          year: 1
        },
        events: [],
        nexusState: 'stable_flux',
        corruptionLevel: 0.0
      },
      
      // NPCs
      npcs: {},
      
      // Game settings
      settings: {
        language: 'en',
        soundEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 0.8
      },
      
      // Forger specific data
      forger: {
        essence: 0,
        tools: [],
        creations: [],
        interventions: []
      }
    };
  }

  // Initialize the game state
  initialize() {
    // Initialize player skills
    this.state.player.skills = this.initializeSkills();
    
    // Initialize world regions
    this.state.world.regions = this.initializeRegions();
    
    // Initialize default player
    this.state.player.id = this.generateId();
    this.state.player.name = 'Wanderer';
    this.state.player.role = 'wanderer';
    
    // Notify subscribers of state change
    this.notifySubscribers();
  }

  // Initialize skills for the player
  initializeSkills() {
    const skills = {};
    for (const skillId in SKILL_TREE_DATA) {
      skills[skillId] = {
        level: 0,
        experience: 0,
        unlocked: false
      };
    }
    return skills;
  }

  // Initialize world regions
  initializeRegions() {
    const regions = {};
    for (const regionId in REGIONS_DATA) {
      regions[regionId] = {
        ...REGIONS_DATA[regionId],
        currentPopulation: REGIONS_DATA[regionId].initialPopulation || 100,
        corruptionLevel: 0.0,
        events: [],
        npcs: []
      };
    }
    return regions;
  }

  // Generate a unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Get current game state
  getState() {
    return this.state;
  }

  // Update game state
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  // Update player data
  updatePlayer(playerData) {
    this.state.player = { ...this.state.player, ...playerData };
    this.notifySubscribers();
  }

  // Update world data
  updateWorld(worldData) {
    this.state.world = { ...this.state.world, ...worldData };
    this.notifySubscribers();
  }

  // Add an item to player inventory
  addToInventory(item) {
    const newItem = {
      id: this.generateId(),
      ...item,
      quantity: item.quantity || 1
    };
    
    this.state.player.inventory.push(newItem);
    this.notifySubscribers();
  }

  // Remove an item from player inventory
  removeFromInventory(itemId, quantity = 1) {
    const itemIndex = this.state.player.inventory.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const item = this.state.player.inventory[itemIndex];
      if (item.quantity > quantity) {
        item.quantity -= quantity;
      } else {
        this.state.player.inventory.splice(itemIndex, 1);
      }
      this.notifySubscribers();
    }
  }

  // Add experience to a skill
  addSkillExperience(skillId, experience) {
    if (this.state.player.skills[skillId]) {
      this.state.player.skills[skillId].experience += experience;
      
      // Check for level up
      const skillData = SKILL_TREE_DATA[skillId];
      const currentLevel = this.state.player.skills[skillId].level;
      const xpForNextLevel = skillData.baseXpCost * Math.pow(1.5, currentLevel);
      
      if (this.state.player.skills[skillId].experience >= xpForNextLevel) {
        this.state.player.skills[skillId].level += 1;
        this.state.player.skills[skillId].experience -= xpForNextLevel;
        
        // Unlock skill if it's the first level
        if (this.state.player.skills[skillId].level === 1) {
          this.state.player.skills[skillId].unlocked = true;
        }
      }
      
      this.notifySubscribers();
    }
  }

  // Add experience to player
  addPlayerExperience(experience) {
    this.state.player.experience += experience;
    
    // Check for level up (simplified formula)
    const xpForNextLevel = this.state.player.level * 100;
    if (this.state.player.experience >= xpForNextLevel) {
      this.state.player.level += 1;
      this.state.player.experience -= xpForNextLevel;
      this.state.player.maxHealth += 10;
      this.state.player.health = this.state.player.maxHealth;
    }
    
    this.notifySubscribers();
  }

  // Add a journal entry
  addJournalEntry(entry) {
    const newEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    this.state.player.journal.push(newEntry);
    this.notifySubscribers();
  }

  // Add a quest
  addQuest(quest) {
    const newQuest = {
      id: this.generateId(),
      status: 'active', // 'active', 'completed', 'failed'
      ...quest
    };
    
    this.state.player.quests.push(newQuest);
    this.notifySubscribers();
  }

  // Update a quest status
  updateQuestStatus(questId, status) {
    const quest = this.state.player.quests.find(q => q.id === questId);
    if (quest) {
      quest.status = status;
      this.notifySubscribers();
    }
  }

  // Add an achievement
  addAchievement(achievement) {
    const newAchievement = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...achievement
    };
    
    // Check if achievement already exists
    const existingIndex = this.state.player.achievements.findIndex(a => a.id === newAchievement.id);
    if (existingIndex === -1) {
      this.state.player.achievements.push(newAchievement);
      this.notifySubscribers();
      return true; // Achievement was added
    }
    return false; // Achievement already existed
  }

  // Advance game time
  advanceTime(minutes = 1) {
    this.state.world.time.minute += minutes;
    
    // Handle time overflow
    while (this.state.world.time.minute >= 60) {
      this.state.world.time.minute -= 60;
      this.state.world.time.hour += 1;
      
      if (this.state.world.time.hour >= 24) {
        this.state.world.time.hour = 0;
        this.state.world.time.day += 1;
        
        // Simplified season system
        if (this.state.world.time.day % 90 === 0) {
          const seasons = ['spring', 'summer', 'autumn', 'winter'];
          const currentIndex = seasons.indexOf(this.state.world.time.season);
          this.state.world.time.season = seasons[(currentIndex + 1) % seasons.length];
        }
        
        // Year advancement
        if (this.state.world.time.day % 365 === 0) {
          this.state.world.time.year += 1;
        }
      }
    }
    
    this.notifySubscribers();
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from state changes
  unsubscribe(callback) {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  // Notify all subscribers of state changes
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in state subscriber:', error);
      }
    });
  }

  // Save game state
  saveGame() {
    try {
      localStorage.setItem('sagaGameState', JSON.stringify(this.state));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  // Load game state
  loadGame() {
    try {
      const savedState = localStorage.getItem('sagaGameState');
      if (savedState) {
        this.state = JSON.parse(savedState);
        this.notifySubscribers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }

  // Reset game state
  resetGame() {
    this.state = this.getDefaultState();
    this.initialize();
    localStorage.removeItem('sagaGameState');
  }
}

// Export a singleton instance
export const gameStateManager = new GameStateManager();

// Export the class for potential extension
export default GameStateManager;