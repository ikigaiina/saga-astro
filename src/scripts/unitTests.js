// src/scripts/unitTests.js
// Unit tests for The Soulforge Saga core systems

import { testingFramework, assertEqual, assertExists, assertTrue, assertFalse } from './testingFramework.js';
import { gameStateManager } from '../game/stateManager.js';
import { inventorySystem } from '../game/inventorySystem.js';
import { questSystem } from '../game/questSystem.js';
import { craftingSystem } from '../game/craftingSystem.js';
import { combatSystem } from '../game/combatSystem.js';
import { explorationSystem } from '../game/explorationSystem.js';
import { forgerSystem } from '../game/forgerSystem.js';
import { worldSystem } from '../game/worldSystem.js';
import { saveLoadSystem } from '../game/saveLoadSystem.js';

class UnitTests {
  constructor() {
    this.framework = testingFramework;
  }

  // Test game state manager
  async testGameStateManager() {
    // Initialize game state
    gameStateManager.initialize();
    const state = gameStateManager.getState();
    
    // Assertions
    assertExists(state.player, 'Player should exist in initial state');
    assertExists(state.world, 'World should exist in initial state');
    assertEqual(state.player.level, 1, 'Player should start at level 1');
    
    // Test player update
    gameStateManager.updatePlayer({ name: 'TestPlayer', level: 5 });
    const updatedState = gameStateManager.getState();
    assertEqual(updatedState.player.name, 'TestPlayer', 'Player name should be updated');
    assertEqual(updatedState.player.level, 5, 'Player level should be updated');
    
    // Test experience system
    const expBefore = updatedState.player.experience;
    gameStateManager.addPlayerExperience(100);
    const stateAfterExp = gameStateManager.getState();
    assertTrue(stateAfterExp.player.experience > expBefore, 'Player experience should increase');
    
    return { success: true, message: 'Game state manager tests passed' };
  }

  // Test inventory system
  async testInventorySystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test adding item
    const addItemResult = inventorySystem.addItem('healing_potion', 3);
    assertTrue(addItemResult.success, 'Adding item should succeed');
    
    // Check inventory
    const inventory = inventorySystem.getInventoryItems();
    const potionItem = inventory.find(item => item.id === 'healing_potion');
    assertExists(potionItem, 'Healing potion should be in inventory');
    assertEqual(potionItem.quantity, 3, 'Should have 3 healing potions');
    
    // Test using consumable
    const useResult = inventorySystem.useItem(potionItem.instanceId);
    assertTrue(useResult.success, 'Using item should succeed');
    
    return { success: true, message: 'Inventory system tests passed' };
  }

  // Test quest system
  async testQuestSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test getting available quests
    const availableQuests = questSystem.getAvailableQuests();
    assertTrue(Array.isArray(availableQuests), 'Available quests should be an array');
    
    return { success: true, message: 'Quest system tests passed' };
  }

  // Test crafting system
  async testCraftingSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test getting available recipes
    const recipes = craftingSystem.getAvailableRecipes();
    assertTrue(Array.isArray(recipes), 'Recipes should be an array');
    
    // Test getting recipe by ID
    const breadRecipe = craftingSystem.getRecipe('craft_bread');
    assertExists(breadRecipe, 'Bread recipe should exist');
    
    return { success: true, message: 'Crafting system tests passed' };
  }

  // Test combat system
  async testCombatSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test creating enemy
    const enemy = combatSystem.createEnemy('dire_wolf');
    assertExists(enemy, 'Enemy should be created');
    assertEqual(enemy.type, 'dire_wolf', 'Enemy type should be dire_wolf');
    
    // Test combat initialization
    const combatId = combatSystem.startCombat('test-player', 'dire_wolf');
    assertExists(combatId, 'Combat ID should be generated');
    
    // End combat
    combatSystem.endCombat(combatId, 'fled');
    
    return { success: true, message: 'Combat system tests passed' };
  }

  // Test exploration system
  async testExplorationSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test getting nearby regions
    const currentRegion = gameStateManager.getState().player.location;
    const nearbyRegions = explorationSystem.getNearbyRegions(currentRegion);
    assertTrue(Array.isArray(nearbyRegions), 'Nearby regions should be an array');
    
    return { success: true, message: 'Exploration system tests passed' };
  }

  // Test Forger system
  async testForgerSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test getting available tools
    const tools = forgerSystem.getAvailableTools();
    assertTrue(Array.isArray(tools), 'Tools should be an array');
    
    // Test getting tool by ID
    const analyzerTool = forgerSystem.tools['nexus_analyzer'];
    assertExists(analyzerTool, 'Nexus analyzer tool should exist');
    
    return { success: true, message: 'Forger system tests passed' };
  }

  // Test world system
  async testWorldSystem() {
    // Initialize world
    const initResult = worldSystem.initializeWorld();
    assertTrue(initResult.success, 'World initialization should succeed');
    
    // Test getting world state
    const worldState = worldSystem.getWorldState();
    assertExists(worldState, 'World state should exist');
    
    return { success: true, message: 'World system tests passed' };
  }

  // Test save/load system
  async testSaveLoadSystem() {
    // Initialize game state
    gameStateManager.initialize();
    
    // Test saving game
    const saveResult = saveLoadSystem.saveGame('test_save');
    assertTrue(saveResult.success, 'Saving game should succeed');
    
    // Test getting available saves
    const saves = saveLoadSystem.getAvailableSaves();
    assertTrue(Array.isArray(saves), 'Available saves should be an array');
    
    return { success: true, message: 'Save/Load system tests passed' };
  }

  // Run all unit tests
  async runAllUnitTests() {
    const tests = [
      {
        name: 'Game State Manager',
        fn: () => this.testGameStateManager()
      },
      {
        name: 'Inventory System',
        fn: () => this.testInventorySystem()
      },
      {
        name: 'Quest System',
        fn: () => this.testQuestSystem()
      },
      {
        name: 'Crafting System',
        fn: () => this.testCraftingSystem()
      },
      {
        name: 'Combat System',
        fn: () => this.testCombatSystem()
      },
      {
        name: 'Exploration System',
        fn: () => this.testExplorationSystem()
      },
      {
        name: 'Forger System',
        fn: () => this.testForgerSystem()
      },
      {
        name: 'World System',
        fn: () => this.testWorldSystem()
      },
      {
        name: 'Save/Load System',
        fn: () => this.testSaveLoadSystem()
      }
    ];
    
    return await this.framework.runTests(tests);
  }
}

// Export unit tests
export const unitTests = new UnitTests();

// Run tests if this file is executed directly
if (import.meta.url === new URL(import.meta.url)) {
  unitTests.runAllUnitTests().then(results => {
    console.log('Unit tests completed');
  }).catch(error => {
    console.error('Unit tests failed:', error);
  });
}

// Export default class
export default UnitTests;