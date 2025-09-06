// src/game/worldSystem.js
// World simulation system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { REGIONS_DATA, NEXUS_STATES, WORLD_LANDMARKS } from '../data/world.js';
import { CREATURES_DATA } from '../data/npcs.js';
import { GLOBAL_WORLD_EVENTS } from '../data/events.js';

class WorldSystem {
  constructor() {
    this.activeEvents = [];
    this.worldCycle = null;
    this.simulationInterval = null;
    this.lastUpdateTime = 0;
  }

  // Initialize the world
  initializeWorld() {
    // Set initial world state
    const initialState = {
      time: {
        day: 1,
        hour: 12,
        minute: 0,
        season: 'spring',
        year: 1
      },
      nexusState: 'stable_flux',
      corruptionLevel: 0.0,
      events: []
    };
    
    gameStateManager.updateWorld(initialState);
    
    return { success: true, message: 'Dunia berhasil diinisialisasi' };
  }

  // Update method for game loop integration
  update() {
    const now = performance.now();
    
    // Update world state (this can happen every frame)
    this.updateWorldState();
    
    // Update regions and NPCs less frequently (every 5 seconds)
    if (now - this.lastUpdateTime > 5000) {
      this.updateRegions();
      this.updateNPCs();
      this.lastUpdateTime = now;
    }
    
    // Check for random events (very infrequently)
    if (Math.random() < 0.001) { // 0.1% chance per update
      this.checkForRandomEvents();
    }
  }

  // Simulate one step of world progression (for backward compatibility)
  simulateWorldStep() {
    // Advance time
    gameStateManager.advanceTime(1);
    
    // Update world state
    this.updateWorldState();
    
    // Check for random events
    this.checkForRandomEvents();
    
    // Update regions
    this.updateRegions();
    
    // Update NPCs (simplified)
    this.updateNPCs();
  }

  // Update overall world state
  updateWorldState() {
    const state = gameStateManager.getState();
    const world = state.world;
    
    // Update nexus state based on corruption level
    let newNexusState = world.nexusState;
    
    if (world.corruptionLevel > 0.5) {
      newNexusState = 'corrupted_bleed';
    } else if (world.corruptionLevel > 0.2) {
      newNexusState = 'unstable_resonance';
    } else {
      newNexusState = 'stable_flux';
    }
    
    // Occasionally change nexus state randomly for variety
    if (Math.random() < 0.01) { // 1% chance per step
      const nexusStates = Object.keys(NEXUS_STATES);
      newNexusState = nexusStates[Math.floor(Math.random() * nexusStates.length)];
    }
    
    if (newNexusState !== world.nexusState) {
      gameStateManager.updateWorld({ nexusState: newNexusState });
      
      // Add journal entry for nexus state change
      const nexusStateData = NEXUS_STATES[newNexusState];
      gameStateManager.addJournalEntry({
        title: `Perubahan Nexus: ${nexusStateData.name}`,
        content: nexusStateData.description,
        category: 'World Event',
        icon: nexusStateData.visual_signature || 'globe'
      });
    }
    
    // Slowly increase corruption over time unless actively purified
    if (world.corruptionLevel > 0) {
      const corruptionDecay = 0.001; // Slow decay
      const newCorruptionLevel = Math.max(0, world.corruptionLevel - corruptionDecay);
      gameStateManager.updateWorld({ corruptionLevel: newCorruptionLevel });
    }
  }

  // Check for random world events
  checkForRandomEvents() {
    const state = gameStateManager.getState();
    
    // Base event chance
    let eventChance = 0.005; // 0.5% per step
    
    // Modify by nexus state
    const nexusState = NEXUS_STATES[state.world.nexusState];
    if (nexusState && nexusState.type === 'unstable') {
      eventChance *= 2; // Double chance in unstable nexus
    } else if (nexusState && nexusState.type === 'corrupted') {
      eventChance *= 3; // Triple chance in corrupted nexus
    }
    
    // Roll for event
    if (Math.random() < eventChance) {
      this.triggerRandomEvent();
    }
  }

  // Trigger a random world event
  triggerRandomEvent() {
    // In a full implementation, this would select from a variety of events
    // For now, we'll use a simple resource boom event
    
    const event = {
      id: `event_${Date.now()}`,
      type: 'resource_boom',
      name: 'Ledakan Sumber Daya',
      description: 'Deposit sumber daya baru ditemukan di seluruh dunia!',
      duration: 1440, // 24 hours in minutes
      startTime: Date.now(),
      effects: {
        resourceModifier: 0.2 // 20% increase in resource gathering
      }
    };
    
    // Add to active events
    this.activeEvents.push(event);
    
    // Apply effects to world
    gameStateManager.updateWorld({ events: [...state.world.events, event] });
    
    // Add journal entry
    gameStateManager.addJournalEntry({
      title: `Event Dunia: ${event.name}`,
      content: event.description,
      category: 'World Event',
      icon: 'gem'
    });
    
    // Set timeout to end event
    setTimeout(() => {
      this.endEvent(event.id);
    }, event.duration * 60 * 1000); // Convert minutes to milliseconds
    
    return event;
  }

  // End an event
  endEvent(eventId) {
    const eventIndex = this.activeEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const event = this.activeEvents.splice(eventIndex, 1)[0];
      
      // Remove from world state
      const state = gameStateManager.getState();
      const updatedEvents = state.world.events.filter(e => e.id !== eventId);
      gameStateManager.updateWorld({ events: updatedEvents });
      
      // Add journal entry
      gameStateManager.addJournalEntry({
        title: `Event Berakhir: ${event.name}`,
        content: `Event "${event.name}" telah berakhir.`,
        category: 'World Event',
        icon: 'clock'
      });
    }
  }

  // Update regions
  updateRegions() {
    const state = gameStateManager.getState();
    const regions = { ...state.world.regions };
    
    // Update each region
    for (const regionId in regions) {
      const region = regions[regionId];
      
      // Slowly change corruption levels
      if (region.corruptionLevel > 0) {
        region.corruptionLevel = Math.max(0, region.corruptionLevel - 0.0005);
      }
      
      // Occasionally spawn NPCs or events
      if (Math.random() < 0.01) { // 1% chance per region per step
        this.spawnRegionEvent(regionId);
      }
    }
    
    // Update world state
    gameStateManager.updateWorld({ regions });
  }

  // Spawn a region event
  spawnRegionEvent(regionId) {
    const region = REGIONS_DATA[regionId];
    if (!region) return;
    
    // Simple event: resource discovery
    if (region.resources && region.resources.length > 0) {
      const resource = region.resources[Math.floor(Math.random() * region.resources.length)];
      
      // Add journal entry
      gameStateManager.addJournalEntry({
        title: 'Penemuan Sumber Daya',
        content: `Deposit baru ${this.getResourceName(resource)} ditemukan di ${region.name}!`,
        category: 'Exploration',
        icon: 'search'
      });
    }
  }

  // Get resource name
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

  // Update NPCs (simplified)
  updateNPCs() {
    // In a full implementation, this would update NPC states, move them around, etc.
    // For now, we'll just simulate NPC activities
    
    const state = gameStateManager.getState();
    
    // Occasionally add NPC-related journal entries
    if (Math.random() < 0.005) { // 0.5% chance per step
      const npcActivities = [
        'Penduduk berkumpul di alun-alun kota',
        'Pedagang baru tiba di pasar',
        'Petani melaporkan panen yang baik',
        'Penjaga melaporkan aktivitas mencurigakan',
        'Cendekiawan menemukan artefak kuno'
      ];
      
      const activity = npcActivities[Math.floor(Math.random() * npcActivities.length)];
      
      gameStateManager.addJournalEntry({
        title: 'Aktivitas NPC',
        content: activity,
        category: 'Social',
        icon: 'users'
      });
    }
  }

  // Change season
  changeSeason() {
    const state = gameStateManager.getState();
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const currentIndex = seasons.indexOf(state.world.time.season);
    const nextIndex = (currentIndex + 1) % seasons.length;
    const newSeason = seasons[nextIndex];
    
    gameStateManager.updateWorld({ 
      time: { 
        ...state.world.time, 
        season: newSeason 
      } 
    });
    
    // Add journal entry
    const seasonNames = {
      'spring': 'Musim Semi',
      'summer': 'Musim Panas',
      'autumn': 'Musim Gugur',
      'winter': 'Musim Dingin'
    };
    
    gameStateManager.addJournalEntry({
      title: `Perubahan Musim: ${seasonNames[newSeason]}`,
      content: `Musim telah berubah menjadi ${seasonNames[newSeason]}.`,
      category: 'World Event',
      icon: 'sun'
    });
  }

  // Get current world state
  getWorldState() {
    return gameStateManager.getState().world;
  }

  // Get active events
  getActiveEvents() {
    return this.activeEvents;
  }

  // Get regions
  getRegions() {
    return gameStateManager.getState().world.regions;
  }

  // Get region by ID
  getRegion(regionId) {
    const state = gameStateManager.getState();
    return state.world.regions[regionId];
  }

  // Get landmarks
  getLandmarks() {
    return WORLD_LANDMARKS;
  }

  // Get landmark by ID
  getLandmark(landmarkId) {
    return WORLD_LANDMARKS[landmarkId];
  }

  // Get time information
  getTime() {
    const state = gameStateManager.getState();
    return state.world.time;
  }

  // Get nexus state information
  getNexusState() {
    const state = gameStateManager.getState();
    return {
      state: state.world.nexusState,
      data: NEXUS_STATES[state.world.nexusState]
    };
  }

  // Get corruption level
  getCorruptionLevel() {
    const state = gameStateManager.getState();
    return state.world.corruptionLevel;
  }

  // Set corruption level
  setCorruptionLevel(level) {
    const clampedLevel = Math.max(0, Math.min(1, level)); // Between 0 and 1
    gameStateManager.updateWorld({ corruptionLevel: clampedLevel });
    
    return { success: true, message: `Tingkat korupsi diatur ke ${clampedLevel}` };
  }

  // Add corruption
  addCorruption(amount) {
    const state = gameStateManager.getState();
    const newLevel = Math.min(1, state.world.corruptionLevel + amount);
    gameStateManager.updateWorld({ corruptionLevel: newLevel });
    
    return { success: true, message: `Menambahkan ${amount} korupsi` };
  }

  // Reduce corruption
  reduceCorruption(amount) {
    const state = gameStateManager.getState();
    const newLevel = Math.max(0, state.world.corruptionLevel - amount);
    gameStateManager.updateWorld({ corruptionLevel: newLevel });
    
    return { success: true, message: `Mengurangi ${amount} korupsi` };
  }
}

// Export a singleton instance
export const worldSystem = new WorldSystem();

// Export the class for potential extension
export default WorldSystem;