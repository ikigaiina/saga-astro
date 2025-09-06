// src/scripts/performanceTests.js
// Performance tests for The Soulforge Saga

import { testingFramework, assertPerformance } from './testingFramework.js';
import { gameStateManager } from '../game/stateManager.js';
import { inventorySystem } from '../game/inventorySystem.js';
import { questSystem } from '../game/questSystem.js';
import { craftingSystem } from '../game/craftingSystem.js';
import { combatSystem } from '../game/combatSystem.js';
import { explorationSystem } from '../game/explorationSystem.js';

class PerformanceTests {
  constructor() {
    this.framework = testingFramework;
  }

  // Test game state initialization performance
  async testGameStateInitializationPerformance() {
    console.log('Testing game state initialization performance...');
    
    const startTime = performance.now();
    
    // Initialize game state multiple times
    for (let i = 0; i < 100; i++) {
      gameStateManager.initialize();
    }
    
    const endTime = performance.now();
    const averageDuration = (endTime - startTime) / 100;
    
    assertPerformance(averageDuration, 50, 'Game state initialization should be fast');
    
    return { 
      success: true, 
      message: `Game state initialization: ${averageDuration.toFixed(2)}ms average`,
      duration: averageDuration
    };
  }

  // Test inventory operations performance
  async testInventoryOperationsPerformance() {
    console.log('Testing inventory operations performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Test adding many items
    const startTime = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      inventorySystem.addItem(`item_${i}`, 1);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    assertPerformance(duration, 100, 'Adding many items should be efficient');
    
    // Test inventory retrieval
    const retrievalStartTime = performance.now();
    const inventory = inventorySystem.getInventoryItems();
    const retrievalEndTime = performance.now();
    const retrievalDuration = retrievalEndTime - retrievalStartTime;
    
    assertPerformance(retrievalDuration, 10, 'Retrieving inventory should be fast');
    
    return { 
      success: true, 
      message: `Inventory operations: ${duration.toFixed(2)}ms for 1000 adds, ${retrievalDuration.toFixed(2)}ms for retrieval`,
      addDuration: duration,
      retrievalDuration: retrievalDuration
    };
  }

  // Test quest system performance
  async testQuestSystemPerformance() {
    console.log('Testing quest system performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Test getting quests many times
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      questSystem.getAvailableQuests();
    }
    
    const endTime = performance.now();
    const averageDuration = (endTime - startTime) / 100;
    
    assertPerformance(averageDuration, 20, 'Getting quests should be fast');
    
    return { 
      success: true, 
      message: `Quest system: ${averageDuration.toFixed(2)}ms average per quest retrieval`,
      duration: averageDuration
    };
  }

  // Test crafting system performance
  async testCraftingSystemPerformance() {
    console.log('Testing crafting system performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Add crafting materials
    inventorySystem.addItem('iron_ore', 50);
    inventorySystem.addItem('wood', 30);
    
    // Test crafting many items
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      craftingSystem.craftItem('craft_iron_sword');
    }
    
    const endTime = performance.now();
    const averageDuration = (endTime - startTime) / 100;
    
    assertPerformance(averageDuration, 30, 'Crafting items should be efficient');
    
    return { 
      success: true, 
      message: `Crafting system: ${averageDuration.toFixed(2)}ms average per craft`,
      duration: averageDuration
    };
  }

  // Test combat system performance
  async testCombatSystemPerformance() {
    console.log('Testing combat system performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Test creating many enemies
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      combatSystem.createEnemy('dire_wolf');
    }
    
    const endTime = performance.now();
    const averageDuration = (endTime - startTime) / 100;
    
    assertPerformance(averageDuration, 20, 'Creating enemies should be fast');
    
    // Test combat processing
    const combatId = combatSystem.startCombat('test-player', 'dire_wolf');
    const combatStartTime = performance.now();
    
    for (let i = 0; i < 50; i++) {
      combatSystem.processCombatRound(combatId, {
        action: 'attack',
        target: 'enemy'
      });
    }
    
    const combatEndTime = performance.now();
    const combatAverageDuration = (combatEndTime - combatStartTime) / 50;
    
    assertPerformance(combatAverageDuration, 15, 'Processing combat rounds should be fast');
    
    return { 
      success: true, 
      message: `Combat system: ${averageDuration.toFixed(2)}ms average per enemy creation, ${combatAverageDuration.toFixed(2)}ms per combat round`,
      enemyCreationDuration: averageDuration,
      combatRoundDuration: combatAverageDuration
    };
  }

  // Test exploration system performance
  async testExplorationSystemPerformance() {
    console.log('Testing exploration system performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Test region traversal
    const startTime = performance.now();
    
    for (let i = 0; i < 50; i++) {
      explorationSystem.getNearbyRegions('TheCentralNexus');
    }
    
    const endTime = performance.now();
    const averageDuration = (endTime - startTime) / 50;
    
    assertPerformance(averageDuration, 25, 'Getting nearby regions should be fast');
    
    return { 
      success: true, 
      message: `Exploration system: ${averageDuration.toFixed(2)}ms average per region lookup`,
      duration: averageDuration
    };
  }

  // Test memory usage
  async testMemoryUsage() {
    console.log('Testing memory usage...');
    
    // Measure memory before
    const memoryBefore = performance.memory ? {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize
    } : null;
    
    // Create memory-intensive operations
    const startTime = performance.now();
    
    // Create many game objects
    const objects = [];
    for (let i = 0; i < 10000; i++) {
      objects.push({
        id: i,
        data: Array(10).fill().map(() => Math.random()),
        timestamp: Date.now()
      });
    }
    
    const creationEndTime = performance.now();
    const creationDuration = creationEndTime - startTime;
    
    // Process objects
    for (let i = 0; i < objects.length; i++) {
      objects[i].processed = true;
      objects[i].value = objects[i].data.reduce((sum, val) => sum + val, 0);
    }
    
    const processingEndTime = performance.now();
    const processingDuration = processingEndTime - creationEndTime;
    
    // Clean up
    objects.length = 0;
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    assertPerformance(totalTime, 500, 'Memory-intensive operations should be efficient');
    
    return { 
      success: true, 
      message: `Memory usage test: ${creationDuration.toFixed(2)}ms creation, ${processingDuration.toFixed(2)}ms processing, ${totalTime.toFixed(2)}ms total`,
      creationDuration: creationDuration,
      processingDuration: processingDuration,
      totalDuration: totalTime
    };
  }

  // Test save/load performance
  async testSaveLoadPerformance() {
    console.log('Testing save/load performance...');
    
    // Initialize game state
    gameStateManager.initialize();
    
    // Add substantial data
    for (let i = 0; i < 100; i++) {
      inventorySystem.addItem(`item_${i}`, Math.floor(Math.random() * 10) + 1);
      gameStateManager.addPlayerExperience(Math.floor(Math.random() * 100));
    }
    
    // Test saving
    const saveStartTime = performance.now();
    const saveResult = saveLoadSystem.saveGame('performance_test_save');
    const saveEndTime = performance.now();
    const saveDuration = saveEndTime - saveStartTime;
    
    assertTrue(saveResult.success, 'Saving should succeed');
    assertPerformance(saveDuration, 100, 'Saving should be fast');
    
    // Test loading
    const loadStartTime = performance.now();
    const loadResult = saveLoadSystem.loadGame('performance_test_save');
    const loadEndTime = performance.now();
    const loadDuration = loadEndTime - loadStartTime;
    
    assertTrue(loadResult.success, 'Loading should succeed');
    assertPerformance(loadDuration, 100, 'Loading should be fast');
    
    return { 
      success: true, 
      message: `Save/Load performance: ${saveDuration.toFixed(2)}ms save, ${loadDuration.toFixed(2)}ms load`,
      saveDuration: saveDuration,
      loadDuration: loadDuration
    };
  }

  // Run all performance tests
  async runAllPerformanceTests() {
    const tests = [
      {
        name: 'Game State Initialization Performance',
        fn: () => this.testGameStateInitializationPerformance()
      },
      {
        name: 'Inventory Operations Performance',
        fn: () => this.testInventoryOperationsPerformance()
      },
      {
        name: 'Quest System Performance',
        fn: () => this.testQuestSystemPerformance()
      },
      {
        name: 'Crafting System Performance',
        fn: () => this.testCraftingSystemPerformance()
      },
      {
        name: 'Combat System Performance',
        fn: () => this.testCombatSystemPerformance()
      },
      {
        name: 'Exploration System Performance',
        fn: () => this.testExplorationSystemPerformance()
      },
      {
        name: 'Memory Usage',
        fn: () => this.testMemoryUsage()
      },
      {
        name: 'Save/Load Performance',
        fn: () => this.testSaveLoadPerformance()
      }
    ];
    
    return await this.framework.runTests(tests);
  }
}

// Export performance tests
export const performanceTests = new PerformanceTests();

// Export default class
export default PerformanceTests;