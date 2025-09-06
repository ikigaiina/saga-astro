// src/game/worldGenerator.js
// Functional infinite world generation system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';

class WorldGenerator {
  constructor() {
    this.worldSeed = Math.floor(Math.random() * 1000000);
    this.settlements = [];
    this.factions = [];
    this.worldEvents = [];
    this.proceduralContent = [];
    this.isInitialized = false;
  }

  // Initialize the infinite world
  initializeInfiniteWorld() {
    if (this.isInitialized) {
      console.log('World generator already initialized');
      return { success: true, message: 'World generator already initialized' };
    }
    
    console.log('Initializing infinite world generation...');
    
    // Generate initial world structure
    this.generateFactions();
    this.generateInitialSettlements();
    this.generateDynamicEvents();
    
    // Mark as initialized
    this.isInitialized = true;
    
    console.log(`Generated ${this.settlements.length} settlements, ${this.factions.length} factions`);
    
    return { success: true, message: 'Infinite world initialized' };
  }

  // Generate factions with complex relationships
  generateFactions() {
    const factionTypes = [
      { name: 'The Arbiters', description: 'Guardians of balance and order', alignment: 'lawful_good' },
      { name: 'The Echo Cult', description: 'Worshippers of forgotten truths', alignment: 'chaotic_neutral' },
      { name: 'The Luminous Guardians', description: 'Protectors of light and life', alignment: 'lawful_good' },
      { name: 'The Stonekin', description: 'Ancient beings of earth and mountain', alignment: 'neutral_good' },
      { name: 'The Sand Worshippers', description: 'Followers of the eternal desert', alignment: 'neutral_evil' },
      { name: 'The Void Seekers', description: 'Those who embrace emptiness', alignment: 'chaotic_evil' }
    ];
    
    // Create factions with relationships
    factionTypes.forEach((faction, index) => {
      const newFaction = {
        id: `faction_${index}`,
        name: faction.name,
        description: faction.description,
        alignment: faction.alignment,
        reputation: Math.floor(Math.random() * 100),
        power: Math.floor(Math.random() * 100) + 50,
        territory: [],
        allies: [],
        enemies: [],
        quests: [],
        npcs: []
      };
      
      // Create relationships with other factions
      factionTypes.forEach((otherFaction, otherIndex) => {
        if (index !== otherIndex) {
          const relation = this.calculateFactionRelation(faction.alignment, otherFaction.alignment);
          if (relation === 'ally') {
            newFaction.allies.push(`faction_${otherIndex}`);
          } else if (relation === 'enemy') {
            newFaction.enemies.push(`faction_${otherIndex}`);
          }
        }
      });
      
      this.factions.push(newFaction);
    });
  }

  // Calculate faction relations based on alignments
  calculateFactionRelation(alignment1, alignment2) {
    // Simplified relationship calculation
    if (alignment1 === alignment2) return 'ally';
    if ((alignment1 === 'lawful_good' && alignment2 === 'chaotic_evil') ||
        (alignment1 === 'chaotic_evil' && alignment2 === 'lawful_good')) {
      return 'enemy';
    }
    return 'neutral';
  }

  // Generate initial settlements
  generateInitialSettlements() {
    const settlementTypes = [
      { name: 'Hamlet', population: 50, complexity: 1 },
      { name: 'Village', population: 200, complexity: 2 },
      { name: 'Town', population: 1000, complexity: 3 },
      { name: 'City', population: 5000, complexity: 4 },
      { name: 'Metropolis', population: 20000, complexity: 5 }
    ];
    
    // Generate sample settlements
    const sampleSettlements = [
      { name: 'Nexus Pusat yang Berdenyut', type: 'City', faction: 'faction_0' },
      { name: 'Dataran Bercahaya', type: 'Village', faction: 'faction_2' },
      { name: 'Jangkauan Berbisik', type: 'Hamlet', faction: 'faction_1' },
      { name: 'Gunung Batu Segala', type: 'Town', faction: 'faction_3' },
      { name: 'Gurun Matahari Menyala', type: 'Village', faction: 'faction_4' },
      { name: 'Kekosongan Abadi', type: 'Ruins', faction: 'faction_5' }
    ];
    
    sampleSettlements.forEach((settlement, index) => {
      const settlementType = settlementTypes.find(t => t.name === settlement.type) || settlementTypes[2];
      
      const newSettlement = {
        id: `settlement_${index}`,
        name: settlement.name,
        type: settlement.type,
        population: settlementType.population,
        faction: settlement.faction,
        npcs: [],
        buildings: [],
        economy: {
          prosperity: Math.random(),
          resources: ['essence_crystal', 'rare_minerals', 'mana_crystal'],
          tradeRoutes: []
        },
        problems: this.generateSettlementProblems(settlement, settlementType),
        events: [],
        coordinates: {
          x: Math.random() * 1000,
          y: Math.random() * 1000
        }
      };
      
      this.settlements.push(newSettlement);
    });
  }

  // Generate problems for settlements
  generateSettlementProblems(region, settlementType) {
    const problemTypes = [
      'resource_scarcity',
      'faction_conflict',
      'monster_threat',
      'disease_outbreak',
      'economic_crisis',
      'political_unrest'
    ];
    
    const problems = [];
    const problemCount = Math.floor(Math.random() * 3) + 1; // 1-3 problems
    
    for (let i = 0; i < problemCount; i++) {
      const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
      const severity = Math.random();
      
      problems.push({
        id: `problem_${Date.now()}_${i}`,
        type: problemType,
        severity: severity,
        description: this.generateProblemDescription(problemType, region, settlementType),
        affectedPopulation: Math.floor(settlementType.population * severity * 0.3),
        potentialSolutions: this.generateSolutions(problemType),
        questGenerated: false
      });
    }
    
    return problems;
  }

  // Generate problem descriptions
  generateProblemDescription(problemType, region, settlementType) {
    const descriptions = {
      'resource_scarcity': `The ${region.name} has experienced a drought, affecting the ${settlementType.name}'s primary water source.`,
      'faction_conflict': `Tensions between local factions have escalated into open conflict in the streets.`,
      'monster_threat': `Dangerous creatures from the ${region.name} have been attacking travelers and villagers.`,
      'disease_outbreak': `A mysterious illness is spreading through the population, weakening the community.`,
      'economic_crisis': `Trade routes have been disrupted, causing shortages and inflation throughout the settlement.`,
      'political_unrest': `Discontent with local leadership has led to protests and civil unrest.`
    };
    
    return descriptions[problemType] || 'An unknown problem affects this settlement.';
  }

  // Generate potential solutions for problems
  generateSolutions(problemType) {
    const solutions = {
      'resource_scarcity': [
        'Find alternative water source',
        'Negotiate with neighboring settlements',
        'Perform ritual to appease nature spirits'
      ],
      'faction_conflict': [
        'Mediate peace talks',
        'Expose hidden conspiracies',
        'Remove key agitators'
      ],
      'monster_threat': [
        'Hunt the creatures',
        'Find their lair and destroy it',
        'Negotiate with their leader'
      ],
      'disease_outbreak': [
        'Find cure ingredients',
        'Quarantine the sick',
        'Seek help from healers'
      ],
      'economic_crisis': [
        'Establish new trade routes',
        'Discover hidden resources',
        'Organize community effort'
      ],
      'political_unrest': [
        'Investigate corruption',
        'Support reform candidates',
        'Expose the truth to the people'
      ]
    };
    
    return solutions[problemType] || ['Generic solution'];
  }

  // Generate dynamic world events
  generateDynamicEvents() {
    const eventTypes = [
      'festival',
      'war_declaration',
      'natural_phenomenon',
      'political_upheaval',
      'economic_boom',
      'epidemic'
    ];
    
    // Generate initial events
    for (let i = 0; i < 3; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      this.createWorldEvent(eventType);
    }
  }

  // Create a world event
  createWorldEvent(eventType) {
    const event = {
      id: `event_${Date.now()}`,
      type: eventType,
      timestamp: Date.now(),
      duration: Math.floor(Math.random() * 1440) + 60, // 1-24 hours
      affectedRegions: [],
      affectedFactions: [],
      impact: Math.random() * 0.5,
      description: this.generateEventDescription(eventType),
      consequences: []
    };
    
    this.worldEvents.push(event);
    return event;
  }

  // Generate event descriptions
  generateEventDescription(eventType) {
    const descriptions = {
      'festival': 'A grand festival is being held to celebrate the harvest season, bringing together people from across the region.',
      'war_declaration': 'Two powerful factions have declared war on each other, threatening to destabilize the entire region.',
      'natural_phenomenon': 'Strange lights have been seen in the sky, and the local wildlife is behaving unusually.',
      'political_upheaval': 'A major political figure has been assassinated, throwing the government into chaos.',
      'economic_boom': 'A newly discovered trade route has brought prosperity to the region, with markets bustling with activity.',
      'epidemic': 'A contagious disease is spreading rapidly, forcing quarantines and causing panic among the population.'
    };
    
    return descriptions[eventType] || 'A significant event is unfolding in the world.';
  }

  // Get current world state
  getWorldState() {
    return {
      settlements: this.settlements,
      factions: this.factions,
      events: this.worldEvents,
      generatedRegions: []
    };
  }

  // Get settlement by ID
  getSettlement(settlementId) {
    return this.settlements.find(s => s.id === settlementId);
  }

  // Get faction by ID
  getFaction(factionId) {
    return this.factions.find(f => f.id === factionId);
  }

  // Get active events
  getActiveEvents() {
    return this.worldEvents;
  }

  // Get all settlements
  getSettlements() {
    return this.settlements;
  }

  // Get all factions
  getFactions() {
    return this.factions;
  }

  // Update world (called periodically)
  update() {
    // In a real implementation, this would update world state
    // For now, we'll just log that we're updating
    if (Math.random() < 0.1) { // 10% chance to generate new content
      this.generateNewContent();
    }
  }

  // Generate new content dynamically
  generateNewContent() {
    // In a real implementation, this would generate new content
    // For now, we'll just log it
    console.log('Generating new dynamic content...');
  }
}

// Export a singleton instance
export const worldGenerator = new WorldGenerator();

// Export the class for potential extension
export default WorldGenerator;