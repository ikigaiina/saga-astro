// src/game/forgerSystem.js
// Forger system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { REGIONS_DATA, NEXUS_STATES } from '../data/world.js';
import { questSystem } from './questSystem.js';

class ForgerSystem {
  constructor() {
    this.tools = this.initializeTools();
    this.interventions = [];
  }

  // Initialize Forger tools
  initializeTools() {
    return {
      'nexus_analyzer': {
        id: 'nexus_analyzer',
        name: 'Analyzer Nexus',
        description: 'Alat untuk menganalisis kondisi dan fluktuasi Nexus.',
        type: 'analysis',
        powerLevel: 1,
        essenceCost: 5
      },
      'stability_injector': {
        id: 'stability_injector',
        name: 'Injektor Stabilitas',
        description: 'Alat untuk menstabilkan fluktuasi Nexus.',
        type: 'intervention',
        powerLevel: 2,
        essenceCost: 15
      },
      'corruption_purifier': {
        id: 'corruption_purifier',
        name: 'Pemurni Korupsi',
        description: 'Alat untuk memurnikan area yang tercemar korupsi.',
        type: 'purification',
        powerLevel: 3,
        essenceCost: 25
      },
      'dimensional_shaper': {
        id: 'dimensional_shaper',
        name: 'Pembentuk Dimensi',
        description: 'Alat untuk membentuk dan memanipulasi struktur dimensi.',
        type: 'creation',
        powerLevel: 5,
        essenceCost: 50
      },
      'temporal_weaver': {
        id: 'temporal_weaver',
        name: 'Penenun Temporal',
        description: 'Alat untuk memanipulasi aliran waktu.',
        type: 'temporal',
        powerLevel: 4,
        essenceCost: 40
      }
    };
  }

  // Get available tools for Forger
  getAvailableTools() {
    const state = gameStateManager.getState();
    
    // Only available to Forgers
    if (state.player.role !== 'forger') {
      return [];
    }
    
    return Object.values(this.tools);
  }

  // Use a Forger tool
  useTool(toolId, target) {
    const tool = this.tools[toolId];
    if (!tool) {
      return { success: false, message: 'Alat tidak ditemukan' };
    }
    
    const state = gameStateManager.getState();
    
    // Check if player is a Forger
    if (state.player.role !== 'forger') {
      return { success: false, message: 'Hanya Forger yang dapat menggunakan alat ini' };
    }
    
    // Check if player has enough Forger essence
    const currentEssence = state.forger.essence || 0;
    if (currentEssence < tool.essenceCost) {
      return { success: false, message: `Essensi Forger tidak mencukupi. Dibutuhkan ${tool.essenceCost}, tersedia ${currentEssence}` };
    }
    
    // Apply tool effect
    const result = this.applyToolEffect(tool, target);
    
    // Deduct essence cost
    const newEssence = currentEssence - tool.essenceCost;
    gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
    
    // Track tool usage for quests
    questSystem.trackQuestProgress('forger_tool_used', { toolId: tool.id });
    
    // Add to Forger's intervention history
    this.interventions.push({
      toolId: tool.id,
      toolName: tool.name,
      target: target,
      timestamp: Date.now(),
      result: result
    });
    
    return {
      success: true,
      message: `Menggunakan ${tool.name}: ${result.message}`,
      essenceCost: tool.essenceCost,
      essenceRemaining: newEssence,
      effect: result
    };
  }

  // Apply tool effect
  applyToolEffect(tool, target) {
    let result = { success: true, message: '' };
    
    switch (tool.type) {
      case 'analysis':
        result = this.performAnalysis(target);
        break;
        
      case 'intervention':
        result = this.performIntervention(target);
        break;
        
      case 'purification':
        result = this.performPurification(target);
        break;
        
      case 'creation':
        result = this.performCreation(target);
        break;
        
      case 'temporal':
        result = this.performTemporalManipulation(target);
        break;
        
      default:
        result = { success: true, message: 'Alat digunakan' };
    }
    
    return result;
  }

  // Perform analysis with Nexus Analyzer
  performAnalysis(target) {
    // In a full implementation, this would provide detailed information
    // For now, we'll provide generic analysis
    
    if (target === 'nexus') {
      const state = gameStateManager.getState();
      const nexusState = NEXUS_STATES[state.world.nexusState] || NEXUS_STATES['stable_flux'];
      
      return {
        success: true,
        message: `Analisis Nexus: ${nexusState.name} - ${nexusState.description}`,
        details: {
          stability: nexusState.stabilityModifier,
          corruption: state.world.corruptionLevel,
          dimensionalActivity: nexusState.dimensionalRiftSpawnChanceModifier
        }
      };
    } else if (target === 'region') {
      const state = gameStateManager.getState();
      const region = REGIONS_DATA[state.player.location];
      
      return {
        success: true,
        message: `Analisis Wilayah: ${region.name}`,
        details: {
          threatLevel: region.threatLevel,
          corruptionLevel: state.world.regions[state.player.location]?.corruptionLevel || 0,
          resources: region.resources
        }
      };
    }
    
    return {
      success: true,
      message: 'Analisis selesai',
      details: {}
    };
  }

  // Perform intervention with Stability Injector
  performIntervention(target) {
    if (target === 'nexus') {
      const state = gameStateManager.getState();
      
      // Reduce corruption level
      const corruptionReduction = 0.05;
      const newCorruptionLevel = Math.max(0, state.world.corruptionLevel - corruptionReduction);
      
      // Update world state
      gameStateManager.updateWorld({ corruptionLevel: newCorruptionLevel });
      
      // Add achievement for significant purification
      if (newCorruptionLevel === 0) {
        gameStateManager.addAchievement({
          id: 'pure_nexus',
          name: 'Nexus Murni',
          description: 'Berhasil memurnikan Nexus sepenuhnya',
          rarity: 'rare'
        });
      }
      
      return {
        success: true,
        message: `Nexus distabilkan. Tingkat korupsi berkurang ${corruptionReduction * 100}%`,
        corruptionReduced: corruptionReduction
      };
    }
    
    return {
      success: true,
      message: 'Intervensi selesai'
    };
  }

  // Perform purification with Corruption Purifier
  performPurification(target) {
    if (target === 'region') {
      const state = gameStateManager.getState();
      const regionId = state.player.location;
      
      // Reduce regional corruption
      const corruptionReduction = 0.1;
      const currentRegion = state.world.regions[regionId] || {};
      const newCorruptionLevel = Math.max(0, (currentRegion.corruptionLevel || 0) - corruptionReduction);
      
      // Update region state
      const updatedRegions = { ...state.world.regions };
      updatedRegions[regionId] = { ...currentRegion, corruptionLevel: newCorruptionLevel };
      
      gameStateManager.updateWorld({ regions: updatedRegions });
      
      // Add experience for successful purification
      gameStateManager.addPlayerExperience(50);
      
      return {
        success: true,
        message: `Wilayah dimurnikan. Tingkat korupsi berkurang ${corruptionReduction * 100}%`,
        corruptionReduced: corruptionReduction
      };
    }
    
    return {
      success: true,
      message: 'Pemurnian selesai'
    };
  }

  // Perform creation with Dimensional Shaper
  performCreation(target) {
    // This would be used for creating new regions, landmarks, or structures
    // For now, we'll provide a generic creation effect
    
    // Award Forger essence for successful creation
    const state = gameStateManager.getState();
    const essenceGain = 10;
    const newEssence = (state.forger.essence || 0) + essenceGain;
    
    gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
    
    // Add achievement for creation
    gameStateManager.addAchievement({
      id: 'first_creation',
      name: 'Pencipta Pertama',
      description: 'Melakukan penciptaan pertama dengan alat dimensi',
      rarity: 'uncommon'
    });
    
    return {
      success: true,
      message: 'Penciptaan berhasil! Energi kreatif mengalir.',
      essenceGained: essenceGain,
      essenceTotal: newEssence
    };
  }

  // Perform temporal manipulation with Temporal Weaver
  performTemporalManipulation(target) {
    // This would allow the Forger to manipulate time - advance or rewind
    // For now, we'll provide a generic temporal effect
    
    // Advance time by a significant amount
    gameStateManager.advanceTime(120); // Advance by 2 hours
    
    // Award experience for temporal manipulation
    gameStateManager.addPlayerExperience(75);
    
    return {
      success: true,
      message: 'Aliran waktu dimanipulasi. Waktu melompat maju 2 jam.',
      timeAdvanced: 120
    };
  }

  // Generate Forger essence
  generateEssence(amount) {
    const state = gameStateManager.getState();
    const currentEssence = state.forger.essence || 0;
    const newEssence = currentEssence + amount;
    
    gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
    
    return {
      success: true,
      message: `Mendapatkan ${amount} Essensi Forger`,
      essenceGained: amount,
      essenceTotal: newEssence
    };
  }

  // Get Forger essence
  getEssence() {
    const state = gameStateManager.getState();
    return state.forger.essence || 0;
  }

  // Get Forger interventions history
  getInterventionsHistory() {
    return this.interventions;
  }

  // Get Forger tools
  getTools() {
    return this.tools;
  }

  // Unlock a new tool for Forger
  unlockTool(toolId) {
    // In a full implementation, this would unlock new tools based on progression
    // For now, we'll just return a placeholder
    
    return {
      success: true,
      message: `Alat ${toolId} tersedia untuk digunakan`
    };
  }

  // Upgrade a tool
  upgradeTool(toolId) {
    const tool = this.tools[toolId];
    if (!tool) {
      return { success: false, message: 'Alat tidak ditemukan' };
    }
    
    // Increase power level
    tool.powerLevel += 1;
    
    // Reduce essence cost (more efficient)
    tool.essenceCost = Math.max(1, Math.floor(tool.essenceCost * 0.9));
    
    return {
      success: true,
      message: `${tool.name} ditingkatkan ke tingkat kekuatan ${tool.powerLevel}`,
      tool: tool
    };
  }

  // Create a new world landmark (Forger ability)
  createLandmark(landmarkData) {
    // In a full implementation, this would add a new landmark to the world
    // For now, we'll just simulate the creation
    
    const state = gameStateManager.getState();
    
    // Check if player is in correct location
    if (landmarkData.regionId !== state.player.location) {
      return { success: false, message: 'Anda harus berada di wilayah yang benar untuk membuat landmark' };
    }
    
    // Cost in Forger essence
    const creationCost = 100;
    const currentEssence = state.forger.essence || 0;
    
    if (currentEssence < creationCost) {
      return { success: false, message: `Essensi Forger tidak mencukupi. Dibutuhkan ${creationCost}, tersedia ${currentEssence}` };
    }
    
    // Deduct essence
    const newEssence = currentEssence - creationCost;
    gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
    
    // Add achievement
    gameStateManager.addAchievement({
      id: 'landmark_creator',
      name: 'Pencipta Landmark',
      description: 'Menciptakan landmark baru di dunia',
      rarity: 'rare'
    });
    
    return {
      success: true,
      message: `Landmark "${landmarkData.name}" berhasil diciptakan!`,
      essenceCost: creationCost,
      essenceRemaining: newEssence
    };
  }

  // Manipulate region properties (Forger ability)
  manipulateRegion(regionId, properties) {
    const state = gameStateManager.getState();
    
    // Check if player is a Forger
    if (state.player.role !== 'forger') {
      return { success: false, message: 'Hanya Forger yang dapat memanipulasi wilayah' };
    }
    
    // Cost in Forger essence
    const manipulationCost = 50;
    const currentEssence = state.forger.essence || 0;
    
    if (currentEssence < manipulationCost) {
      return { success: false, message: `Essensi Forger tidak mencukupi. Dibutuhkan ${manipulationCost}, tersedia ${currentEssence}` };
    }
    
    // Deduct essence
    const newEssence = currentEssence - manipulationCost;
    gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
    
    // Update region properties
    const updatedRegions = { ...state.world.regions };
    if (updatedRegions[regionId]) {
      updatedRegions[regionId] = { ...updatedRegions[regionId], ...properties };
      gameStateManager.updateWorld({ regions: updatedRegions });
    }
    
    return {
      success: true,
      message: `Wilayah ${regionId} berhasil dimanipulasi`,
      essenceCost: manipulationCost,
      essenceRemaining: newEssence,
      updatedProperties: properties
    };
  }
}

// Export a singleton instance
export const forgerSystem = new ForgerSystem();

// Export the class for potential extension
export default ForgerSystem;