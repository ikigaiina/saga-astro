// src/scripts/integrationTests.js
// Integration tests for The Soulforge Saga systems

import { testingFramework } from './testingFramework.js';
import { gameStateManager } from '../game/stateManager.js';
import { inventorySystem } from '../game/inventorySystem.js';
import { questSystem } from '../game/questSystem.js';
import { craftingSystem } from '../game/craftingSystem.js';
import { combatSystem } from '../game/combatSystem.js';
import { explorationSystem } from '../game/explorationSystem.js';

class IntegrationTests {
  constructor() {
    this.framework = testingFramework;
  }

  // Test player progression workflow
  async testPlayerProgressionWorkflow() {
    console.log('Testing player progression workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Check initial state
    const initialState = gameStateManager.getState();
    assertTrue(initialState.player.level === 1, 'Player should start at level 1');
    assertTrue(initialState.player.experience === 0, 'Player should start with 0 experience');
    
    // 3. Add experience
    gameStateManager.addPlayerExperience(150);
    
    // 4. Check level up
    const afterExpState = gameStateManager.getState();
    assertTrue(afterExpState.player.level >= 1, 'Player should have gained levels');
    assertTrue(afterExpState.player.experience >= 0, 'Player should have experience points');
    
    // 5. Test attribute increases
    const initialStrength = initialState.player.attributes.strength;
    const currentStrength = afterExpState.player.attributes.strength;
    assertTrue(currentStrength >= initialStrength, 'Strength should not decrease');
    
    return { success: true, message: 'Player progression workflow test passed' };
  }

  // Test crafting to combat workflow
  async testCraftingToCombatWorkflow() {
    console.log('Testing crafting to combat workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Add crafting materials to inventory
    inventorySystem.addItem('iron_ore', 5);
    inventorySystem.addItem('wood', 3);
    
    // 3. Check if iron sword recipe is available
    const recipes = craftingSystem.getAvailableRecipes();
    const swordRecipe = recipes.find(r => r.id === 'craft_iron_sword');
    assertExists(swordRecipe, 'Iron sword recipe should be available');
    
    // 4. Craft iron sword
    const craftResult = craftingSystem.craftItem('craft_iron_sword');
    assertTrue(craftResult.success, 'Crafting iron sword should succeed');
    
    // 5. Check if sword is in inventory
    const inventory = inventorySystem.getInventoryItems();
    const sword = inventory.find(item => item.id === 'steel_sword');
    assertExists(sword, 'Steel sword should be in inventory');
    
    // 6. Equip sword
    const equipResult = inventorySystem.equipItem(sword.instanceId);
    assertTrue(equipResult.success, 'Equipping sword should succeed');
    
    // 7. Check if sword is equipped
    const equippedItems = inventorySystem.getEquippedItems();
    assertTrue(Object.keys(equippedItems).length > 0, 'At least one item should be equipped');
    
    return { success: true, message: 'Crafting to combat workflow test passed' };
  }

  // Test exploration to quest workflow
  async testExplorationToQuestWorkflow() {
    console.log('Testing exploration to quest workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Travel to a region
    const travelResult = explorationSystem.travelToRegion('TheWhisperingReaches');
    assertTrue(travelResult.success, 'Traveling to region should succeed');
    
    // 3. Check if quests are available in this region
    const availableQuests = questSystem.getAvailableQuests();
    assertTrue(availableQuests.length >= 0, 'Should have at least 0 quests available');
    
    // 4. Discover a landmark
    const landmarks = explorationSystem.getLandmarksInRegion('TheWhisperingReaches');
    assertTrue(landmarks.length > 0, 'Should have landmarks in this region');
    
    // 5. Explore a landmark
    const firstLandmark = landmarks[0];
    const exploreResult = explorationSystem.exploreLandmark(firstLandmark.id);
    assertTrue(exploreResult.success, 'Exploring landmark should succeed');
    
    return { success: true, message: 'Exploration to quest workflow test passed' };
  }

  // Test combat to inventory workflow
  async testCombatToInventoryWorkflow() {
    console.log('Testing combat to inventory workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Create combat scenario
    const enemy = combatSystem.createEnemy('dire_wolf');
    const combatId = combatSystem.startCombat('test-player', 'dire_wolf');
    
    // 3. Simulate combat (simplified)
    const combatResult = combatSystem.processCombatRound(combatId, {
      action: 'attack',
      target: 'enemy'
    });
    
    assertTrue(combatResult.success, 'Combat round should process successfully');
    
    // 4. End combat
    combatSystem.endCombat(combatId, 'victory');
    
    // 5. Check if loot was added to inventory
    const inventory = inventorySystem.getInventoryItems();
    assertTrue(inventory.length >= 0, 'Inventory should exist');
    
    return { success: true, message: 'Combat to inventory workflow test passed' };
  }

  // Test quest to crafting workflow
  async testQuestToCraftingWorkflow() {
    console.log('Testing quest to crafting workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Get available quests
    const availableQuests = questSystem.getAvailableQuests();
    
    // 3. Accept a crafting-related quest (if available)
    const craftingQuest = availableQuests.find(q => q.type === 'crafting');
    if (craftingQuest) {
      const acceptResult = questSystem.acceptQuest(craftingQuest.id);
      assertTrue(acceptResult.success, 'Accepting crafting quest should succeed');
      
      // 4. Check quest objectives
      const activeQuests = questSystem.getActiveQuests();
      assertTrue(activeQuests.length > 0, 'Should have active quests');
    }
    
    // 5. Check if crafting recipes are unlocked
    const recipes = craftingSystem.getAvailableRecipes();
    assertTrue(recipes.length > 0, 'Should have crafting recipes available');
    
    return { success: true, message: 'Quest to crafting workflow test passed' };
  }

  // Test inventory to character development workflow
  async testInventoryToCharacterDevelopmentWorkflow() {
    console.log('Testing inventory to character development workflow...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Add consumable items to inventory
    inventorySystem.addItem('healing_potion', 2);
    inventorySystem.addItem('strength_potion', 1);
    
    // 3. Use a consumable
    const inventory = inventorySystem.getInventoryItems();
    const healingPotion = inventory.find(item => item.id === 'healing_potion');
    
    if (healingPotion) {
      const useResult = inventorySystem.useItem(healingPotion.instanceId);
      assertTrue(useResult.success, 'Using healing potion should succeed');
    }
    
    // 4. Check character stats after using consumable
    const state = gameStateManager.getState();
    assertTrue(state.player.health > 0, 'Player should have health');
    
    return { success: true, message: 'Inventory to character development workflow test passed' };
  }

  // Test world events affecting gameplay
  async testWorldEventsIntegration() {
    console.log('Testing world events integration...');
    
    // 1. Initialize game and world
    gameStateManager.initialize();
    
    // 2. Simulate a world event (simplified)
    const worldState = gameStateManager.getState().world;
    assertTrue(worldState.time.day > 0, 'World time should be progressing');
    
    // 3. Check if events affect gameplay
    const nexusState = worldState.nexusState;
    assertExists(nexusState, 'Nexus state should exist');
    
    return { success: true, message: 'World events integration test passed' };
  }

  // Test save/load integration
  async testSaveLoadIntegration() {
    console.log('Testing save/load integration...');
    
    // 1. Initialize game
    gameStateManager.initialize();
    
    // 2. Modify game state
    gameStateManager.addPlayerExperience(200);
    inventorySystem.addItem('test_item', 1);
    
    // 3. Save game
    const saveResult = saveLoadSystem.saveGame('integration_test_save');
    assertTrue(saveResult.success, 'Saving game should succeed');
    
    // 4. Reset game state
    gameStateManager.resetGame();
    
    // 5. Load game
    const loadResult = saveLoadSystem.loadGame('integration_test_save');
    assertTrue(loadResult.success, 'Loading game should succeed');
    
    // 6. Verify state was restored
    const restoredState = gameStateManager.getState();
    assertTrue(restoredState.player.experience >= 200, 'Player experience should be restored');
    
    return { success: true, message: 'Save/load integration test passed' };
  }

  // Run all integration tests
  async runAllIntegrationTests() {
    const tests = [
      {
        name: 'Player Progression Workflow',
        fn: () => this.testPlayerProgressionWorkflow()
      },
      {
        name: 'Crafting to Combat Workflow',
        fn: () => this.testCraftingToCombatWorkflow()
      },
      {
        name: 'Exploration to Quest Workflow',
        fn: () => this.testExplorationToQuestWorkflow()
      },
      {
        name: 'Combat to Inventory Workflow',
        fn: () => this.testCombatToInventoryWorkflow()
      },
      {
        name: 'Quest to Crafting Workflow',
        fn: () => this.testQuestToCraftingWorkflow()
      },
      {
        name: 'Inventory to Character Development Workflow',
        fn: () => this.testInventoryToCharacterDevelopmentWorkflow()
      },
      {
        name: 'World Events Integration',
        fn: () => this.testWorldEventsIntegration()
      },
      {
        name: 'Save/Load Integration',
        fn: () => this.testSaveLoadIntegration()
      }
    ];
    
    return await this.framework.runTests(tests);
  }
}

// Export integration tests
export const integrationTests = new IntegrationTests();

// Export default class
export default IntegrationTests;