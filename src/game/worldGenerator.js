// src/game/worldGenerator.js
// Infinite world generation system for The Soulforge Saga

import { REGIONS_DATA } from '../data/world.js';
import { CREATURES_DATA } from '../data/npcs.js';
import { QUEST_TEMPLATES } from '../data/quests.js';
import { gameStateManager } from './stateManager.js';

class WorldGenerator {
  constructor() {
    this.worldSeed = Math.floor(Math.random() * 1000000);
    this.generatedRegions = new Set();
    this.settlements = [];
    this.factions = [];
    this.worldEvents = [];
    this.proceduralContent = [];
  }

  // Initialize the infinite world
  initializeInfiniteWorld() {
    console.log('Initializing infinite world generation...');
    
    // Generate initial world structure
    this.generateFactions();
    this.generateInitialSettlements();
    this.generateDynamicEvents();
    
    // Start procedural generation systems
    this.startProceduralGeneration();
    
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
      { name: 'The Void Seekers', description: 'Those who embrace emptiness', alignment: 'chaotic_evil' },
      { name: 'The Nexus Keepers', description: 'Guardians of cosmic harmony', alignment: 'lawful_neutral' },
      { name: 'The Forgotten', description: 'Outcasts seeking redemption', alignment: 'chaotic_good' }
    ];
    
    // Create factions with relationships
    factionTypes.forEach((faction, index) => {
      const newFaction = {
        id: `faction_${index}`,
        name: faction.name,
        description: faction.description,
        alignment: faction.alignment,
        reputation: 0,
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
    
    console.log(`Generated ${this.factions.length} factions with dynamic relationships`);
  }

  // Calculate faction relations based on alignments
  calculateFactionRelation(alignment1, alignment2) {
    const relations = {
      'lawful_good': {
        'lawful_good': 'ally',
        'neutral_good': 'ally',
        'chaotic_good': 'neutral',
        'lawful_neutral': 'neutral',
        'true_neutral': 'neutral',
        'chaotic_neutral': 'neutral',
        'lawful_evil': 'enemy',
        'neutral_evil': 'enemy',
        'chaotic_evil': 'enemy'
      },
      'chaotic_good': {
        'lawful_good': 'neutral',
        'neutral_good': 'ally',
        'chaotic_good': 'ally',
        'lawful_neutral': 'neutral',
        'true_neutral': 'neutral',
        'chaotic_neutral': 'ally',
        'lawful_evil': 'enemy',
        'neutral_evil': 'enemy',
        'chaotic_evil': 'enemy'
      }
      // In a full implementation, we'd have all alignment combinations
    };
    
    // Simplified for this example
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
    
    // Create settlements in existing regions
    Object.keys(REGIONS_DATA).forEach((regionId, index) => {
      const region = REGIONS_DATA[regionId];
      const settlementType = settlementTypes[Math.floor(Math.random() * settlementTypes.length)];
      
      const settlement = {
        id: `settlement_${this.settlements.length}`,
        name: `${region.name} ${settlementType.name}`,
        type: settlementType.name,
        population: settlementType.population,
        regionId: regionId,
        faction: this.factions[Math.floor(Math.random() * this.factions.length)].id,
        npcs: [],
        buildings: [],
        economy: {
          prosperity: Math.random(),
          resources: [...region.resources],
          tradeRoutes: []
        },
        problems: this.generateSettlementProblems(region, settlementType),
        events: []
      };
      
      this.settlements.push(settlement);
      
      // Add to region
      const state = gameStateManager.getState();
      if (state.world.regions[regionId]) {
        if (!state.world.regions[regionId].settlements) {
          state.world.regions[regionId].settlements = [];
        }
        state.world.regions[regionId].settlements.push(settlement.id);
      }
    });
    
    console.log(`Generated ${this.settlements.length} initial settlements`);
  }

  // Generate problems for settlements
  generateSettlementProblems(region, settlementType) {
    const problemTypes = [
      'resource_scarcity',
      'faction_conflict',
      'monster_threat',
      'disease_outbreak',
      'economic_crisis',
      'political_unrest',
      'natural_disaster',
      'mysterious_disappearance'
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
      'political_unrest': `Discontent with local leadership has led to protests and civil unrest.`,
      'natural_disaster': `Recent storms have damaged homes and crops, leaving many in need of aid.`,
      'mysterious_disappearance': `Villagers have been vanishing without a trace, spreading fear through the community.`
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
      ],
      'natural_disaster': [
        'Organize relief efforts',
        'Rebuild damaged structures',
        'Perform protective rituals'
      ],
      'mysterious_disappearance': [
        'Investigate the disappearances',
        'Search for hidden clues',
        'Confront potential culprits'
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
      'epidemic',
      'discovery',
      'catastrophe'
    ];
    
    // Generate initial events
    for (let i = 0; i < 5; i++) {
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
    
    // Affect random regions
    const regionKeys = Object.keys(REGIONS_DATA);
    const affectedCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < affectedCount; i++) {
      const regionId = regionKeys[Math.floor(Math.random() * regionKeys.length)];
      if (!event.affectedRegions.includes(regionId)) {
        event.affectedRegions.push(regionId);
      }
    }
    
    // Affect random factions
    const affectedFactions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < affectedFactions; i++) {
      const faction = this.factions[Math.floor(Math.random() * this.factions.length)];
      if (!event.affectedFactions.includes(faction.id)) {
        event.affectedFactions.push(faction.id);
      }
    }
    
    this.worldEvents.push(event);
    
    // Add to game journal
    gameStateManager.addJournalEntry({
      title: `World Event: ${this.getEventTitle(eventType)}`,
      content: event.description,
      category: 'World Event',
      icon: this.getEventIcon(eventType)
    });
    
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
      'epidemic': 'A contagious disease is spreading rapidly, forcing quarantines and causing panic among the population.',
      'discovery': 'Archaeologists have uncovered ancient ruins that may hold secrets to the world\'s forgotten history.',
      'catastrophe': 'A massive earthquake has devastated several settlements, leaving thousands homeless and in need of aid.'
    };
    
    return descriptions[eventType] || 'A significant event is unfolding in the world.';
  }

  // Get event title
  getEventTitle(eventType) {
    const titles = {
      'festival': 'Festival of Harvest',
      'war_declaration': 'Declaration of War',
      'natural_phenomenon': 'Mystical Phenomenon',
      'political_upheaval': 'Political Crisis',
      'economic_boom': 'Economic Boom',
      'epidemic': 'Disease Outbreak',
      'discovery': 'Ancient Discovery',
      'catastrophe': 'Natural Catastrophe'
    };
    
    return titles[eventType] || 'World Event';
  }

  // Get event icon
  getEventIcon(eventType) {
    const icons = {
      'festival': 'party-popper',
      'war_declaration': 'swords',
      'natural_phenomenon': 'sparkles',
      'political_upheaval': 'users',
      'economic_boom': 'trending-up',
      'epidemic': 'biohazard',
      'discovery': 'compass',
      'catastrophe': 'cloud-lightning'
    };
    
    return icons[eventType] || 'globe';
  }

  // Start procedural generation systems
  startProceduralGeneration() {
    // Generate new content periodically
    setInterval(() => {
      this.generateNewContent();
    }, 300000); // Every 5 minutes
    
    // Update world events
    setInterval(() => {
      this.updateWorldEvents();
    }, 60000); // Every minute
    
    // Evolve factions
    setInterval(() => {
      this.evolveFactions();
    }, 900000); // Every 15 minutes
    
    // Create random events
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance per interval
        const eventTypes = ['festival', 'war_declaration', 'natural_phenomenon', 'political_upheaval', 'economic_boom', 'epidemic', 'discovery', 'catastrophe'];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        this.createWorldEvent(eventType);
      }
    }, 180000); // Every 3 minutes
  }

  // Generate new content dynamically
  generateNewContent() {
    // Generate new NPCs
    this.generateNewNPCs();
    
    // Generate new quests
    this.generateDynamicQuests();
    
    // Update settlement problems
    this.updateSettlementProblems();
    
    console.log('Generated new dynamic content');
  }

  // Generate new NPCs
  generateNewNPCs() {
    // In a full implementation, this would create new NPCs with personalities, schedules, etc.
    // For now, we'll just log that we're generating them
    console.log('Generating new NPCs...');
  }

  // Generate dynamic quests
  generateDynamicQuests() {
    // Create quests based on current world state
    this.settlements.forEach(settlement => {
      // Chance to generate a new quest for each settlement
      if (Math.random() < 0.2) { // 20% chance
        this.createDynamicQuest(settlement);
      }
    });
  }

  // Create a dynamic quest
  createDynamicQuest(settlement) {
    // Select a random problem from the settlement
    if (settlement.problems.length > 0) {
      const problem = settlement.problems[Math.floor(Math.random() * settlement.problems.length)];
      
      // Only create a quest if one hasn't been generated for this problem
      if (!problem.questGenerated) {
        const questTemplate = Object.keys(QUEST_TEMPLATES)[Math.floor(Math.random() * Object.keys(QUEST_TEMPLATES).length)];
        const template = QUEST_TEMPLATES[questTemplate];
        
        // Customize the quest for this problem
        const quest = {
          id: `quest_${Date.now()}`,
          name: `${template.name}: ${settlement.name}`,
          description: `${template.description} ${problem.description}`,
          type: template.type,
          objectives: this.customizeObjectives(template.objectives, problem),
          rewards: template.rewards,
          prerequisites: template.prerequisites,
          location: settlement.id,
          faction: settlement.faction
        };
        
        // Mark problem as having a quest
        problem.questGenerated = true;
        
        // Add to faction quests
        const faction = this.factions.find(f => f.id === settlement.faction);
        if (faction) {
          faction.quests.push(quest.id);
        }
        
        // In a full implementation, we would add this to the quest system
        console.log(`Created dynamic quest: ${quest.name}`);
      }
    }
  }

  // Customize quest objectives based on the problem
  customizeObjectives(objectives, problem) {
    return objectives.map(objective => {
      // Customize objective based on problem type
      switch (problem.type) {
        case 'resource_scarcity':
          return {
            ...objective,
            description: objective.description.replace('{quantity}', problem.affectedPopulation.toString())
          };
        case 'monster_threat':
          return {
            ...objective,
            description: objective.description.replace('{quantity}', 'the threatening creatures')
          };
        default:
          return objective;
      }
    });
  }

  // Update settlement problems
  updateSettlementProblems() {
    this.settlements.forEach(settlement => {
      // Randomly evolve existing problems
      settlement.problems.forEach(problem => {
        // Increase or decrease severity
        problem.severity = Math.max(0, Math.min(1, problem.severity + (Math.random() - 0.5) * 0.1));
        
        // Update affected population
        problem.affectedPopulation = Math.floor(
          settlement.population * problem.severity * 0.3
        );
      });
      
      // Chance to add new problems
      if (Math.random() < 0.1) { // 10% chance
        const region = REGIONS_DATA[settlement.regionId];
        const settlementTypes = [
          { name: 'Hamlet', population: 50, complexity: 1 },
          { name: 'Village', population: 200, complexity: 2 },
          { name: 'Town', population: 1000, complexity: 3 },
          { name: 'City', population: 5000, complexity: 4 },
          { name: 'Metropolis', population: 20000, complexity: 5 }
        ];
        const settlementType = settlementTypes.find(t => t.name === settlement.type) || settlementTypes[0];
        
        const newProblem = this.generateSettlementProblems(region, settlementType)[0];
        settlement.problems.push(newProblem);
      }
    });
  }

  // Update world events
  updateWorldEvents() {
    const now = Date.now();
    
    // Remove expired events
    this.worldEvents = this.worldEvents.filter(event => {
      const expired = (now - event.timestamp) > (event.duration * 60000);
      if (expired) {
        // Add consequence entry to journal
        gameStateManager.addJournalEntry({
          title: `Event Concluded: ${this.getEventTitle(event.type)}`,
          content: `The ${this.getEventTitle(event.type)} has ended. The world continues to evolve.`,
          category: 'World Event',
          icon: 'clock'
        });
      }
      return !expired;
    });
  }

  // Evolve factions over time
  evolveFactions() {
    this.factions.forEach(faction => {
      // Small random changes to power
      faction.power = Math.max(10, faction.power + (Math.random() - 0.5) * 20);
      
      // Chance to change relationships
      if (Math.random() < 0.05) { // 5% chance
        const otherFaction = this.factions[Math.floor(Math.random() * this.factions.length)];
        if (otherFaction.id !== faction.id) {
          // Simple relationship change for demonstration
          if (!faction.allies.includes(otherFaction.id) && !faction.enemies.includes(otherFaction.id)) {
            // Become allies or enemies
            if (Math.random() < 0.5) {
              faction.allies.push(otherFaction.id);
              otherFaction.allies.push(faction.id);
            } else {
              faction.enemies.push(otherFaction.id);
              otherFaction.enemies.push(faction.id);
            }
          }
        }
      }
    });
  }

  // Generate new regions procedurally
  generateNewRegion() {
    // In a full implementation, this would create entirely new regions
    // For now, we'll just log the intention
    console.log('Generating new procedural region...');
  }

  // Get current world state
  getWorldState() {
    return {
      settlements: this.settlements,
      factions: this.factions,
      events: this.worldEvents,
      generatedRegions: Array.from(this.generatedRegions)
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
}

// Export a singleton instance
export const worldGenerator = new WorldGenerator();

// Export the class for potential extension
export default WorldGenerator;