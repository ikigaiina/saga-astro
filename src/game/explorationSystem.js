// src/game/explorationSystem.js
// Exploration system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { REGIONS_DATA, WORLD_LANDMARKS } from '../data/world.js';
import { CREATURES_DATA } from '../data/npcs.js';
import { QUEST_TEMPLATES } from '../data/quests.js';
import { combatSystem } from './combatSystem.js';

class ExplorationSystem {
  constructor() {
    this.discoveredLocations = new Set();
    this.discoveredLandmarks = new Set();
    this.activeEncounters = new Map();
  }

  // Move player to a new region
  travelToRegion(regionId) {
    const state = gameStateManager.getState();
    
    // Check if region exists
    if (!REGIONS_DATA[regionId]) {
      return { success: false, message: 'Wilayah tidak ditemukan' };
    }
    
    // Check if region is accessible
    const currentRegion = state.player.location;
    const currentRegionData = REGIONS_DATA[currentRegion];
    
    // Check if regions are neighbors (simplified)
    if (currentRegion !== regionId && 
        (!currentRegionData.neighboringRegions || 
         !currentRegionData.neighboringRegions.includes(regionId))) {
      return { success: false, message: 'Wilayah tidak dapat dijangkau dari lokasi saat ini' };
    }
    
    // Update player location
    gameStateManager.updatePlayer({ location: regionId });
    
    // Mark region as discovered
    this.discoveredLocations.add(regionId);
    
    // Advance time (travel takes time)
    gameStateManager.advanceTime(30);
    
    // Check for random encounters
    const encounter = this.checkForEncounter(regionId);
    
    return {
      success: true,
      message: `Melanjutkan perjalanan ke ${REGIONS_DATA[regionId].name}`,
      encounter: encounter
    };
  }

  // Check for random encounters in a region
  checkForEncounter(regionId) {
    const region = REGIONS_DATA[regionId];
    if (!region) return null;
    
    // Base encounter chance based on threat level (0-5)
    const baseChance = region.threatLevel * 0.1;
    
    // Modify by time of day
    const state = gameStateManager.getState();
    const hour = state.world.time.hour;
    let timeModifier = 1.0;
    
    // Higher chance at night (18:00-6:00)
    if (hour >= 18 || hour < 6) {
      timeModifier = 1.5;
    }
    
    // Calculate final chance
    const encounterChance = baseChance * timeModifier;
    
    // Roll for encounter
    if (Math.random() < encounterChance) {
      return this.generateEncounter(regionId);
    }
    
    return null;
  }

  // Generate a random encounter
  generateEncounter(regionId) {
    const region = REGIONS_DATA[regionId];
    if (!region || !region.spawnableCreatureTypes || region.spawnableCreatureTypes.length === 0) {
      return null;
    }
    
    // Select a random creature type
    const creatureType = region.spawnableCreatureTypes[
      Math.floor(Math.random() * region.spawnableCreatureTypes.length)
    ];
    
    const creature = CREATURES_DATA[creatureType];
    if (!creature) return null;
    
    // Create encounter ID
    const encounterId = `encounter-${Date.now()}`;
    
    // Create encounter
    const encounter = {
      id: encounterId,
      type: 'creature',
      creatureType: creatureType,
      creatureName: creature.name,
      description: `Anda bertemu dengan ${creature.name} di ${region.name}`,
      options: [
        { id: 'fight', name: 'Bertarung', action: 'combat' },
        { id: 'flee', name: 'Melarikan diri', action: 'flee' },
        { id: 'observe', name: 'Mengamati', action: 'observe' }
      ]
    };
    
    // Store encounter
    this.activeEncounters.set(encounterId, encounter);
    
    return encounter;
  }

  // Handle encounter choice
  handleEncounterChoice(encounterId, choiceId) {
    const encounter = this.activeEncounters.get(encounterId);
    if (!encounter) {
      return { success: false, message: 'Encounter tidak ditemukan' };
    }
    
    const choice = encounter.options.find(opt => opt.id === choiceId);
    if (!choice) {
      return { success: false, message: 'Pilihan tidak valid' };
    }
    
    let result = { success: true, message: '' };
    
    switch (choice.action) {
      case 'combat':
        // Start combat
        const combatId = combatSystem.startCombat(gameStateManager.getState().player.id, encounter.creatureType);
        result = {
          success: true,
          message: `Pertempuran dimulai melawan ${encounter.creatureName}!`,
          action: 'start_combat',
          combatId: combatId
        };
        break;
        
      case 'flee':
        // Attempt to flee (70% success rate)
        const fleeSuccess = Math.random() < 0.7;
        if (fleeSuccess) {
          result = {
            success: true,
            message: `Anda berhasil melarikan diri dari ${encounter.creatureName}!`,
            action: 'flee_success'
          };
        } else {
          // Failed flee - forced combat
          const combatId = combatSystem.startCombat(gameStateManager.getState().player.id, encounter.creatureType);
          result = {
            success: true,
            message: `Gagal melarikan diri! ${encounter.creatureName} menyerang!`,
            action: 'start_combat',
            combatId: combatId
          };
        }
        break;
        
      case 'observe':
        // Observation attempt - chance to gain lore or items
        const observationSuccess = Math.random() < 0.5;
        if (observationSuccess) {
          // Gain some experience or minor item
          const expGain = Math.floor(Math.random() * 10) + 5;
          gameStateManager.addPlayerExperience(expGain);
          
          result = {
            success: true,
            message: `Anda mengamati ${encounter.creatureName} dari kejauhan dan mempelajari perilakunya. Mendapatkan ${expGain} EXP.`,
            action: 'observation_success',
            experience: expGain
          };
        } else {
          result = {
            success: true,
            message: `Anda mencoba mengamati ${encounter.creatureName}, tetapi makhluk itu menyadari keberadaan Anda!`,
            action: 'observation_fail'
          };
          
          // 50% chance of combat after failed observation
          if (Math.random() < 0.5) {
            const combatId = combatSystem.startCombat(gameStateManager.getState().player.id, encounter.creatureType);
            result.combatId = combatId;
            result.message += ' Pertempuran dimulai!';
            result.action = 'start_combat';
          }
        }
        break;
    }
    
    // Remove encounter
    this.activeEncounters.delete(encounterId);
    
    return result;
  }

  // Explore landmark
  exploreLandmark(landmarkId) {
    const landmark = WORLD_LANDMARKS[landmarkId];
    if (!landmark) {
      return { success: false, message: 'Landmark tidak ditemukan' };
    }
    
    // Check if player is in the correct region
    const state = gameStateManager.getState();
    if (landmark.regionId !== state.player.location) {
      return { success: false, message: 'Landmark tidak berada di wilayah saat ini' };
    }
    
    // Mark as discovered
    this.discoveredLandmarks.add(landmarkId);
    
    // Create journal entry
    gameStateManager.addJournalEntry({
      title: `Menjelajahi: ${landmark.name}`,
      content: landmark.description,
      category: 'Exploration',
      icon: landmark.icon
    });
    
    // Chance to find items or lore
    const findChance = 0.3;
    const itemsFound = [];
    
    if (Math.random() < findChance) {
      // Simplified item discovery
      itemsFound.push({
        id: 'ancient_artifact',
        name: 'Artefak Kuno',
        type: 'artifact',
        value: 50,
        rarity: 'uncommon',
        quantity: 1
      });
      
      gameStateManager.addToInventory(itemsFound[0]);
    }
    
    // Advance time
    gameStateManager.advanceTime(60); // Exploration takes time
    
    return {
      success: true,
      message: `Anda menjelajahi ${landmark.name}. ${landmark.historicalLore}`,
      itemsFound: itemsFound,
      landmark: landmark
    };
  }

  // Gather resources in current region
  gatherResources() {
    const state = gameStateManager.getState();
    const regionId = state.player.location;
    const region = REGIONS_DATA[regionId];
    
    if (!region) {
      return { success: false, message: 'Wilayah tidak valid' };
    }
    
    // Check if region has resources
    if (!region.resources || region.resources.length === 0) {
      return { success: false, message: 'Tidak ada sumber daya yang dapat dikumpulkan di wilayah ini' };
    }
    
    // Select a random resource
    const resource = region.resources[Math.floor(Math.random() * region.resources.length)];
    
    // Determine quantity based on player skills
    let baseQuantity = Math.floor(Math.random() * 3) + 1;
    let skillModifier = 1.0;
    
    // Apply skill modifier if player has relevant skill
    if (state.player.skills.wilderness_survival && state.player.skills.wilderness_survival.level > 0) {
      skillModifier = 1.0 + (state.player.skills.wilderness_survival.level * 0.1);
    }
    
    const quantity = Math.floor(baseQuantity * skillModifier);
    
    // Create resource item (simplified)
    const resourceItem = {
      id: resource,
      name: this.getResourceName(resource),
      type: 'material',
      value: this.getResourceValue(resource),
      rarity: 'common',
      quantity: quantity
    };
    
    // Add to inventory
    gameStateManager.addToInventory(resourceItem);
    
    // Advance time
    gameStateManager.advanceTime(30);
    
    return {
      success: true,
      message: `Anda berhasil mengumpulkan ${quantity} ${resourceItem.name}.`,
      item: resourceItem
    };
  }

  // Get resource name based on ID
  getResourceName(resourceId) {
    const names = {
      'essence_crystal': 'Kristal Essence',
      'rare_minerals': 'Mineral Langka',
      'mana_crystal': 'Kristal Mana',
      'mutated_flora': 'Flora Terdimensi',
      'shadow_essence': 'Esensi Bayangan',
      'venomous_gland': 'Kelenjar Berbisa',
      'healing_herbs': 'Herbal Penyembuh',
      'pure_water': 'Air Murni',
      'radiant_dust': 'Debu Radiant',
      'desert_minerals': 'Mineral Gurun',
      'sunstone': 'Batu Matahari',
      'scorched_hide': 'Kulit Terbakar'
    };
    
    return names[resourceId] || resourceId;
  }

  // Get resource value based on ID
  getResourceValue(resourceId) {
    const values = {
      'essence_crystal': 25,
      'rare_minerals': 15,
      'mana_crystal': 30,
      'mutated_flora': 20,
      'shadow_essence': 35,
      'venomous_gland': 12,
      'healing_herbs': 8,
      'pure_water': 5,
      'radiant_dust': 18,
      'desert_minerals': 10,
      'sunstone': 40,
      'scorched_hide': 22
    };
    
    return values[resourceId] || 10;
  }

  // Get nearby regions for travel
  getNearbyRegions(currentRegionId) {
    const region = REGIONS_DATA[currentRegionId];
    if (!region || !region.neighboringRegions) {
      return [];
    }
    
    return region.neighboringRegions.map(regionId => ({
      id: regionId,
      name: REGIONS_DATA[regionId].name,
      description: REGIONS_DATA[regionId].description,
      threatLevel: REGIONS_DATA[regionId].threatLevel
    }));
  }

  // Get landmarks in current region
  getLandmarksInRegion(regionId) {
    const landmarks = [];
    
    for (const landmarkId in WORLD_LANDMARKS) {
      const landmark = WORLD_LANDMARKS[landmarkId];
      if (landmark.regionId === regionId) {
        landmarks.push({
          ...landmark,
          discovered: this.discoveredLandmarks.has(landmarkId)
        });
      }
    }
    
    return landmarks;
  }

  // Get discovered locations
  getDiscoveredLocations() {
    return Array.from(this.discoveredLocations).map(locationId => ({
      id: locationId,
      name: REGIONS_DATA[locationId].name,
      description: REGIONS_DATA[locationId].description
    }));
  }

  // Check if landmark is discovered
  isLandmarkDiscovered(landmarkId) {
    return this.discoveredLandmarks.has(landmarkId);
  }
}

// Export a singleton instance
export const explorationSystem = new ExplorationSystem();

// Export the class for potential extension
export default ExplorationSystem;