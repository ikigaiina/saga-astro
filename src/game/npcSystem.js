// src/game/npcSystem.js
// Functional NPC system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { worldGenerator } from './worldGenerator.js';

class NPCSystem {
  constructor() {
    this.npcs = new Map();
    this.schedules = new Map();
    this.relationships = new Map();
    this.conversations = new Map();
    this.personalities = new Map();
    this.memories = new Map();
    this.goals = new Map();
    this.isInitialized = false;
  }

  // Initialize the NPC system
  initializeNPCs() {
    if (this.isInitialized) {
      console.log('NPC system already initialized');
      return { success: true, message: 'NPC system already initialized' };
    }
    
    console.log('Initializing dynamic NPC system...');
    
    // Create initial NPCs for settlements
    this.createInitialNPCs();
    
    // Start NPC simulation
    this.startNPCSimulation();
    
    this.isInitialized = true;
    
    return { success: true, message: 'NPC system initialized' };
  }

  // Create initial NPCs
  createInitialNPCs() {
    // Get settlements from world generator
    const settlements = worldGenerator.getSettlements();
    
    settlements.forEach(settlement => {
      // Create different types of NPCs for each settlement
      const npcRoles = [
        'merchant', 'guard', 'craftsman', 'scholar', 
        'priest', 'farmer', 'child', 'elder'
      ];
      
      // Create 3-5 NPCs per settlement
      const npcCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < npcCount; i++) {
        const role = npcRoles[Math.floor(Math.random() * npcRoles.length)];
        this.createNPC(role, settlement.id);
      }
    });
    
    console.log(`Created ${this.npcs.size} initial NPCs`);
  }

  // Create a single NPC
  createNPC(role, settlementId) {
    const npcId = `npc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // Base NPC data
    const npc = {
      id: npcId,
      name: this.generateNPCName(role),
      role: role,
      settlementId: settlementId,
      age: this.generateNPCAge(role),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      personality: this.generatePersonality(),
      traits: this.generateTraits(),
      skills: this.generateSkills(role),
      inventory: this.generateInventory(role),
      relationships: new Map(),
      mood: 'neutral',
      health: 100,
      location: {
        settlement: settlementId,
        building: null,
        x: Math.random(),
        y: Math.random()
      },
      goals: this.generateGoals(role),
      memories: [],
      lastInteraction: null,
      schedule: this.generateSchedule(role, settlementId)
    };
    
    // Store NPC
    this.npcs.set(npcId, npc);
    
    // Create relationship map
    this.relationships.set(npcId, new Map());
    
    return npc;
  }

  // Generate NPC name based on role
  generateNPCName(role) {
    const nameParts = {
      merchant: ['Thornwick', 'Brightgold', 'Silverleaf', 'Ironhold', 'Stormwind'],
      guard: ['Stonehelm', 'Ironshield', 'Brightblade', 'Shadowwatch', 'Dawnbreaker'],
      craftsman: ['Forgeheart', 'Steadhand', 'Quickfingers', 'Truecraft', 'Masterwork'],
      scholar: ['Deepmind', 'Keeneye', 'Wisdomseeker', 'Truthfinder', 'Lorekeeper'],
      priest: ['Soulhealer', 'Lightbringer', 'Peacekeeper', 'Divinehand', 'Sacredheart'],
      farmer: ['Greenfield', 'Harvestgold', 'Earthfriend', 'Seasonworker', 'Cropmaster'],
      child: ['Young', 'Little', 'Small', 'Tiny', 'New'],
      elder: ['Graybeard', 'Wiseman', 'Old', 'Ancient', 'Elder']
    };
    
    const firstNames = ['Aldric', 'Bryn', 'Cedric', 'Darian', 'Eldrin', 'Fenris', 'Gareth', 'Hadrian', 'Ivor', 'Jorah'];
    const lastNames = nameParts[role] || ['Traveler', 'Wanderer', 'Stranger', 'Unknown'];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  // Generate NPC age based on role
  generateNPCAge(role) {
    const ageRanges = {
      child: [5, 16],
      elder: [60, 90],
      merchant: [25, 60],
      guard: [18, 50],
      craftsman: [20, 65],
      scholar: [25, 80],
      priest: [25, 75],
      farmer: [18, 70]
    };
    
    const range = ageRanges[role] || [18, 65];
    return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  }

  // Generate personality traits
  generatePersonality() {
    const traits = [
      'optimistic', 'pessimistic', 'curious', 'cautious', 'brave', 'cowardly',
      'generous', 'selfish', 'honest', 'deceitful', 'loyal', 'treacherous',
      'kind', 'cruel', 'patient', 'impatient', 'wise', 'foolish'
    ];
    
    // Select 3-5 random traits
    const selectedTraits = [];
    const traitCount = Math.floor(Math.random() * 3) + 3; // 3-5 traits
    
    for (let i = 0; i < traitCount; i++) {
      const trait = traits[Math.floor(Math.random() * traits.length)];
      if (!selectedTraits.includes(trait)) {
        selectedTraits.push(trait);
      }
    }
    
    return selectedTraits;
  }

  // Generate character traits
  generateTraits() {
    const possibleTraits = [
      'scar', 'tattoo', 'accent', 'limp', 'glasses', 'beard', 'piercing',
      'nervous_habit', 'distinctive_clothing', 'unique_scent', 'memorable_voice'
    ];
    
    const traits = [];
    const traitCount = Math.floor(Math.random() * 3) + 1; // 1-3 traits
    
    for (let i = 0; i < traitCount; i++) {
      const trait = possibleTraits[Math.floor(Math.random() * possibleTraits.length)];
      if (!traits.includes(trait)) {
        traits.push(trait);
      }
    }
    
    return traits;
  }

  // Generate skills based on role
  generateSkills(role) {
    const skillTemplates = {
      merchant: {
        'commerce': Math.floor(Math.random() * 50) + 50,
        'negotiation': Math.floor(Math.random() * 40) + 40,
        'appraisal': Math.floor(Math.random() * 60) + 30
      },
      guard: {
        'combat': Math.floor(Math.random() * 60) + 40,
        'observation': Math.floor(Math.random() * 50) + 50,
        'intimidation': Math.floor(Math.random() * 40) + 30
      },
      craftsman: {
        'crafting': Math.floor(Math.random() * 70) + 30,
        'repair': Math.floor(Math.random() * 60) + 40,
        'materials_knowledge': Math.floor(Math.random() * 50) + 50
      },
      scholar: {
        'lore': Math.floor(Math.random() * 80) + 20,
        'research': Math.floor(Math.random() * 70) + 30,
        'languages': Math.floor(Math.random() * 60) + 40
      },
      priest: {
        'healing': Math.floor(Math.random() * 60) + 40,
        'divine_knowledge': Math.floor(Math.random() * 70) + 30,
        'persuasion': Math.floor(Math.random() * 50) + 50
      },
      farmer: {
        'agriculture': Math.floor(Math.random() * 70) + 30,
        'animal_handling': Math.floor(Math.random() * 60) + 40,
        'survival': Math.floor(Math.random() * 50) + 50
      },
      child: {
        'playfulness': Math.floor(Math.random() * 80) + 20,
        'curiosity': Math.floor(Math.random() * 70) + 30,
        'innocence': Math.floor(Math.random() * 90) + 10
      },
      elder: {
        'wisdom': Math.floor(Math.random() * 80) + 20,
        'storytelling': Math.floor(Math.random() * 70) + 30,
        'history': Math.floor(Math.random() * 90) + 10
      }
    };
    
    return skillTemplates[role] || {
      'general': Math.floor(Math.random() * 50) + 30
    };
  }

  // Generate inventory based on role
  generateInventory(role) {
    const inventoryTemplates = {
      merchant: [
        { item: 'gold', quantity: Math.floor(Math.random() * 100) + 50 },
        { item: 'trinket', quantity: Math.floor(Math.random() * 10) + 1 },
        { item: 'spices', quantity: Math.floor(Math.random() * 20) + 5 }
      ],
      guard: [
        { item: 'sword', quantity: 1 },
        { item: 'shield', quantity: 1 },
        { item: 'armor', quantity: 1 }
      ],
      craftsman: [
        { item: 'tools', quantity: 1 },
        { item: 'raw_materials', quantity: Math.floor(Math.random() * 20) + 10 },
        { item: 'crafted_item', quantity: Math.floor(Math.random() * 5) + 1 }
      ],
      scholar: [
        { item: 'book', quantity: Math.floor(Math.random() * 10) + 1 },
        { item: 'scroll', quantity: Math.floor(Math.random() * 5) + 1 },
        { item: 'ink', quantity: Math.floor(Math.random() * 10) + 5 }
      ],
      priest: [
        { item: 'holy_symbol', quantity: 1 },
        { item: 'healing_potion', quantity: Math.floor(Math.random() * 5) + 1 },
        { item: 'incense', quantity: Math.floor(Math.random() * 10) + 5 }
      ],
      farmer: [
        { item: 'food', quantity: Math.floor(Math.random() * 30) + 10 },
        { item: 'tools', quantity: 1 },
        { item: 'seeds', quantity: Math.floor(Math.random() * 50) + 20 }
      ],
      child: [
        { item: 'toy', quantity: 1 },
        { item: 'candy', quantity: Math.floor(Math.random() * 10) + 1 },
        { item: 'stick', quantity: 1 }
      ],
      elder: [
        { item: 'walking_stick', quantity: 1 },
        { item: 'glasses', quantity: 1 },
        { item: 'memories', quantity: 'priceless' }
      ]
    };
    
    return inventoryTemplates[role] || [
      { item: 'coin', quantity: Math.floor(Math.random() * 20) + 5 }
    ];
  }

  // Generate personal goals
  generateGoals(role) {
    const goalTemplates = {
      merchant: [
        'increase_profits',
        'expand_business',
        'find_rare_goods',
        'build_reputation'
      ],
      guard: [
        'maintain_order',
        'gain_promotion',
        'protect_citizens',
        'capture_criminal'
      ],
      craftsman: [
        'create_masterpiece',
        'learn_new_technique',
        'acquire_quality_materials',
        'train_apprentice'
      ],
      scholar: [
        'discover_lost_knowledge',
        'publish_research',
        'decode_ancient_text',
        'find_artifact'
      ],
      priest: [
        'spread_faith',
        'heal_sick',
        'combat_evil',
        'achieve_enlightenment'
      ],
      farmer: [
        'harvest_good_crop',
        'expand_farm',
        'breed_quality_livestock',
        'weather_drought'
      ],
      child: [
        'learn_new_skill',
        'make_friends',
        'explore_world',
        'find_treasure'
      ],
      elder: [
        'pass_down_knowledge',
        'see_family_prosper',
        'find_peace',
        'complete_life_mission'
      ]
    };
    
    const goals = goalTemplates[role] || ['survive', 'find_purpose'];
    const selectedGoals = [];
    
    // Select 1-2 random goals
    const goalCount = Math.min(2, Math.floor(Math.random() * 2) + 1);
    for (let i = 0; i < goalCount; i++) {
      const goal = goals[Math.floor(Math.random() * goals.length)];
      if (!selectedGoals.includes(goal)) {
        selectedGoals.push({
          id: goal,
          description: this.getGoalDescription(goal),
          progress: 0,
          completed: false
        });
      }
    }
    
    return selectedGoals;
  }

  // Get goal description
  getGoalDescription(goalId) {
    const descriptions = {
      'increase_profits': 'Earn more gold through trade and commerce',
      'expand_business': 'Open new shops or trade routes',
      'find_rare_goods': 'Locate and acquire unique merchandise',
      'build_reputation': 'Become known as a trustworthy merchant',
      'maintain_order': 'Keep the peace in the settlement',
      'gain_promotion': 'Rise through the ranks of the guard',
      'protect_citizens': 'Safeguard the people from harm',
      'capture_criminal': 'Apprehend a wanted fugitive',
      'create_masterpiece': 'Craft an item of exceptional quality',
      'learn_new_technique': 'Master a new crafting method',
      'acquire_quality_materials': 'Obtain the finest raw materials',
      'train_apprentice': 'Teach skills to a new generation',
      'discover_lost_knowledge': 'Uncover forgotten wisdom',
      'publish_research': 'Share findings with the scholarly community',
      'decode_ancient_text': 'Translate mysterious writings',
      'find_artifact': 'Locate a powerful historical item',
      'spread_faith': 'Convert others to the teachings',
      'heal_sick': 'Cure disease and injury',
      'combat_evil': 'Fight against dark forces',
      'achieve_enlightenment': 'Attain spiritual perfection',
      'harvest_good_crop': 'Ensure a successful harvest',
      'expand_farm': 'Increase agricultural production',
      'breed_quality_livestock': 'Raise healthy, productive animals',
      'weather_drought': 'Survive harsh environmental conditions',
      'learn_new_skill': 'Acquire knowledge or abilities',
      'make_friends': 'Form meaningful relationships',
      'explore_world': 'Discover new places and experiences',
      'find_treasure': 'Locate valuable items or coins',
      'pass_down_knowledge': 'Share wisdom with younger generations',
      'see_family_prosper': 'Ensure descendants succeed',
      'find_peace': 'Achieve inner tranquility',
      'complete_life_mission': 'Fulfill one\'s destiny',
      'survive': 'Continue living through challenges',
      'find_purpose': 'Discover meaning in existence'
    };
    
    return descriptions[goalId] || 'Pursue personal ambitions';
  }

  // Generate NPC schedule based on role
  generateSchedule(role, settlementId) {
    const schedule = [];
    
    // Basic daily routine (24-hour format)
    const routines = {
      merchant: [
        { time: 6, activity: 'open_shop', location: 'market' },
        { time: 12, activity: 'lunch_break', location: 'tavern' },
        { time: 18, activity: 'close_shop', location: 'market' },
        { time: 20, activity: 'socialize', location: 'town_square' },
        { time: 22, activity: 'rest', location: 'home' }
      ],
      guard: [
        { time: 6, activity: 'patrol_start', location: 'gates' },
        { time: 12, activity: 'shift_change', location: 'barracks' },
        { time: 18, activity: 'evening_patrol', location: 'streets' },
        { time: 22, activity: 'rest', location: 'barracks' },
        { time: 2, activity: 'night_watch', location: 'walls' }
      ],
      craftsman: [
        { time: 7, activity: 'work_start', location: 'workshop' },
        { time: 12, activity: 'lunch', location: 'workshop' },
        { time: 17, activity: 'work_end', location: 'workshop' },
        { time: 19, activity: 'socialize', location: 'tavern' },
        { time: 21, activity: 'rest', location: 'home' }
      ],
      scholar: [
        { time: 8, activity: 'research_start', location: 'library' },
        { time: 12, activity: 'lunch', location: 'library' },
        { time: 16, activity: 'teach', location: 'school' },
        { time: 19, activity: 'study', location: 'home' },
        { time: 23, activity: 'rest', location: 'home' }
      ],
      priest: [
        { time: 5, activity: 'prayer', location: 'temple' },
        { time: 8, activity: 'service', location: 'temple' },
        { time: 12, activity: 'heal', location: 'temple' },
        { time: 16, activity: 'visit_sick', location: 'homes' },
        { time: 20, activity: 'evening_service', location: 'temple' },
        { time: 22, activity: 'rest', location: 'quarters' }
      ],
      farmer: [
        { time: 5, activity: 'farm_work', location: 'fields' },
        { time: 12, activity: 'lunch', location: 'farmhouse' },
        { time: 17, activity: 'farm_end', location: 'fields' },
        { time: 19, activity: 'family_time', location: 'farmhouse' },
        { time: 21, activity: 'rest', location: 'farmhouse' }
      ],
      child: [
        { time: 7, activity: 'play', location: 'playground' },
        { time: 12, activity: 'lunch', location: 'home' },
        { time: 14, activity: 'school', location: 'school' },
        { time: 17, activity: 'play', location: 'streets' },
        { time: 19, activity: 'family_dinner', location: 'home' },
        { time: 20, activity: 'bedtime', location: 'home' }
      ],
      elder: [
        { time: 7, activity: 'morning_walk', location: 'garden' },
        { time: 10, activity: 'socialize', location: 'park' },
        { time: 12, activity: 'lunch', location: 'home' },
        { time: 15, activity: 'storytelling', location: 'town_square' },
        { time: 18, activity: 'family_time', location: 'home' },
        { time: 20, activity: 'reflection', location: 'home' },
        { time: 21, activity: 'rest', location: 'home' }
      ]
    };
    
    const npcRoutine = routines[role] || [
      { time: 8, activity: 'work', location: 'generic' },
      { time: 12, activity: 'lunch', location: 'tavern' },
      { time: 17, activity: 'leisure', location: 'town' },
      { time: 21, activity: 'rest', location: 'home' }
    ];
    
    schedule.push(...npcRoutine);
    return schedule;
  }

  // Start NPC simulation
  startNPCSimulation() {
    // Update NPC activities based on time
    setInterval(() => {
      this.updateNPCActivities();
    }, 60000); // Every minute
    
    // Update NPC moods and relationships
    setInterval(() => {
      this.updateNPCMoods();
    }, 120000); // Every 2 minutes
    
    // Generate random NPC events
    setInterval(() => {
      this.generateNPCEvents();
    }, 180000); // Every 3 minutes
  }

  // Update NPC activities based on current time
  updateNPCActivities() {
    const state = gameStateManager.getState();
    const currentHour = state.world.time.hour;
    
    this.npcs.forEach((npc, npcId) => {
      const schedule = npc.schedule;
      if (schedule) {
        // Find current activity
        let currentActivity = schedule[0];
        for (let i = schedule.length - 1; i >= 0; i--) {
          if (currentHour >= schedule[i].time) {
            currentActivity = schedule[i];
            break;
          }
        }
        
        // Update NPC location based on activity
        npc.location.building = currentActivity.location;
        
        // Update NPC mood based on activity
        this.updateNPCMoodBasedOnActivity(npcId, currentActivity.activity);
      }
    });
  }

  // Update NPC mood based on activity
  updateNPCMoodBasedOnActivity(npcId, activity) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    
    const moodChanges = {
      'open_shop': 'businesslike',
      'lunch_break': 'relaxed',
      'close_shop': 'tired',
      'socialize': 'happy',
      'rest': 'peaceful',
      'patrol_start': 'alert',
      'shift_change': 'relieved',
      'evening_patrol': 'vigilant',
      'night_watch': 'watchful',
      'work_start': 'focused',
      'work_end': 'satisfied',
      'research_start': 'curious',
      'teach': 'helpful',
      'study': 'concentrated',
      'prayer': 'reverent',
      'service': 'devout',
      'heal': 'compassionate',
      'visit_sick': 'concerned',
      'evening_service': 'peaceful',
      'farm_work': 'industrious',
      'farm_end': 'accomplished',
      'family_time': 'content',
      'play': 'joyful',
      'school': 'attentive',
      'bedtime': 'sleepy',
      'morning_walk': 'refreshed',
      'storytelling': 'entertaining',
      'reflection': 'thoughtful'
    };
    
    if (moodChanges[activity]) {
      npc.mood = moodChanges[activity];
    }
  }

  // Update NPC moods and relationships
  updateNPCMoods() {
    this.npcs.forEach((npc, npcId) => {
      // Random mood fluctuations
      if (Math.random() < 0.1) { // 10% chance
        const moods = ['happy', 'sad', 'angry', 'excited', 'bored', 'anxious', 'calm', 'curious'];
        npc.mood = moods[Math.floor(Math.random() * moods.length)];
      }
      
      // Update based on goals
      npc.goals.forEach(goal => {
        if (!goal.completed && Math.random() < 0.05) { // 5% chance to make progress
          goal.progress = Math.min(100, goal.progress + Math.floor(Math.random() * 10) + 1);
          if (goal.progress >= 100) {
            goal.completed = true;
            // Add to memories
            npc.memories.push({
              timestamp: Date.now(),
              type: 'goal_completed',
              content: `Completed goal: ${goal.description}`
            });
          }
        }
      });
    });
  }

  // Generate random NPC events
  generateNPCEvents() {
    if (Math.random() < 0.2) { // 20% chance
      const npcIds = Array.from(this.npcs.keys());
      if (npcIds.length > 0) {
        const npcId = npcIds[Math.floor(Math.random() * npcIds.length)];
        const npc = this.npcs.get(npcId);
        
        if (npc) {
          const events = [
            'found_item',
            'lost_item',
            'received_gift',
            'had_dream',
            'met_stranger',
            'remembered_past',
            'felt_lonely',
            'felt_grateful'
          ];
          
          const event = events[Math.floor(Math.random() * events.length)];
          this.createNPCEvent(npcId, event);
        }
      }
    }
  }

  // Create an NPC event
  createNPCEvent(npcId, eventType) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    
    const events = {
      'found_item': 'Found a mysterious object while going about their day',
      'lost_item': 'Realized they\'ve misplaced something important',
      'received_gift': 'Received an unexpected present from someone',
      'had_dream': 'Had a vivid dream that felt significant',
      'met_stranger': 'Encountered an unfamiliar face in town',
      'remembered_past': 'Recalled a long-forgotten memory',
      'felt_lonely': 'Felt isolated despite being surrounded by people',
      'felt_grateful': 'Experienced deep appreciation for their life'
    };
    
    // Add to memories
    npc.memories.push({
      timestamp: Date.now(),
      type: eventType,
      content: events[eventType]
    });
    
    // Possibly affect mood
    const moodEffects = {
      'found_item': 'curious',
      'lost_item': 'worried',
      'received_gift': 'happy',
      'had_dream': 'thoughtful',
      'met_stranger': 'cautious',
      'remembered_past': 'nostalgic',
      'felt_lonely': 'sad',
      'felt_grateful': 'content'
    };
    
    if (moodEffects[eventType]) {
      npc.mood = moodEffects[eventType];
    }
  }

  // Handle player interaction with NPC
  interactWithNPC(npcId, interactionType) {
    const npc = this.npcs.get(npcId);
    if (!npc) return { success: false, message: 'NPC not found' };
    
    // Update last interaction
    npc.lastInteraction = Date.now();
    
    // Get player state
    const playerState = gameStateManager.getState().player;
    
    // Handle different interaction types
    let response = '';
    let relationshipChange = 0;
    
    switch (interactionType) {
      case 'greet':
        response = this.generateGreeting(npc, playerState);
        relationshipChange = 1;
        break;
      case 'trade':
        response = this.generateTradeResponse(npc, playerState);
        relationshipChange = 2;
        break;
      case 'quest':
        response = this.generateQuestResponse(npc, playerState);
        relationshipChange = 3;
        break;
      case 'chat':
        response = this.generateChatResponse(npc, playerState);
        relationshipChange = 1;
        break;
      case 'help':
        response = this.generateHelpResponse(npc, playerState);
        relationshipChange = 2;
        break;
      default:
        response = `${npc.name} looks at you with interest.`;
        relationshipChange = 0;
    }
    
    // Update relationship
    this.updateRelationship(npcId, playerState.id, relationshipChange);
    
    // Add to conversation history
    if (!this.conversations.has(npcId)) {
      this.conversations.set(npcId, []);
    }
    this.conversations.get(npcId).push({
      timestamp: Date.now(),
      type: interactionType,
      response: response,
      playerLevel: playerState.level
    });
    
    return {
      success: true,
      npcName: npc.name,
      response: response,
      relationshipChange: relationshipChange
    };
  }

  // Generate greeting based on NPC and player
  generateGreeting(npc, player) {
    const greetings = [
      `Hello there, traveler. What brings you to ${npc.settlementId}?`,
      `Well met, adventurer. How fares your journey?`,
      `Greetings! It's not often we see new faces in these parts.`,
      `Ah, welcome! You look like someone with stories to tell.`,
      `Good day to you! How may I be of service?`
    ];
    
    // Personalize based on relationship
    const relationship = this.getRelationship(npc.id, player.id);
    if (relationship > 50) {
      return `Ah, ${player.name}! Good to see you again. How have you been?`;
    } else if (relationship > 25) {
      return `Hello again, ${player.name}. What brings you back?`;
    }
    
    // Personalize based on NPC role
    const roleGreetings = {
      merchant: `Welcome to my shop! See anything that catches your eye?`,
      guard: `Greetings, citizen. All seems well in our fair settlement.`,
      craftsman: `Ah, a new face! Do you have need of my services?`,
      scholar: `Welcome, seeker of knowledge. What would you like to discuss?`,
      priest: `Peace be with you, child. May the divine light your path.`,
      farmer: `Good day! Fresh produce available if you're hungry.`,
      child: `Hi there! Want to play a game?`,
      elder: `Welcome, young one. Come, sit and listen to an old tale.`
    };
    
    if (roleGreetings[npc.role]) {
      return roleGreetings[npc.role];
    }
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Generate trade response
  generateTradeResponse(npc, player) {
    if (npc.role !== 'merchant') {
      return `${npc.name} chuckles. "I'm afraid I'm not a merchant, but perhaps we can trade stories instead?"`;
    }
    
    return `Ah, a customer! I have many fine wares. What are you looking for today?`;
  }

  // Generate quest response
  generateQuestResponse(npc, player) {
    // Check if NPC has any quests
    const settlements = worldGenerator.getSettlements();
    const npcSettlement = settlements.find(s => s.id === npc.settlementId);
    
    if (npcSettlement && npcSettlement.problems.length > 0) {
      const problem = npcSettlement.problems[0];
      return `Actually, now that you mention it, we do have a problem that needs solving. ${problem.description} Think you could help?`;
    }
    
    return `${npc.name} thinks for a moment. "I don't have any specific tasks, but there's always work to be found in town."`;
  }

  // Generate chat response
  generateChatResponse(npc, player) {
    // Base on NPC personality and mood
    const personalityResponses = {
      optimistic: [
        'The future looks bright, doesn\'t it?',
        'I always believe that good things are just around the corner.',
        'Every day is a gift to be cherished.'
      ],
      pessimistic: [
        'Things seem to be getting worse, if you ask me.',
        'I\'ve seen better days, that\'s for sure.',
        'Hope is a luxury we can\'t always afford.'
      ],
      curious: [
        'Tell me, where have you traveled recently?',
        'I\'ve always wondered about the lands beyond our borders.',
        'What fascinating things have you seen in your journeys?'
      ],
      cautious: [
        'It\'s important to be careful in these uncertain times.',
        'I\'ve learned that trust must be earned, not given freely.',
        'One can never be too careful, especially with strangers.'
      ]
    };
    
    // Base on NPC mood
    const moodResponses = {
      happy: [
        'I haven\'t felt this good in ages!',
        'Life is truly wonderful when you stop to appreciate it.',
        'I\'d love to share my joy with someone!'
      ],
      sad: [
        'Some days it feels like nothing goes right.',
        'I\'ve been feeling a bit down lately.',
        'Sometimes the weight of the world feels too heavy.'
      ],
      angry: [
        'I\'m not in the mood for idle chatter.',
        'Some things have been getting on my nerves lately.',
        'I\'d rather be left alone right now.'
      ],
      excited: [
        'I can barely contain my excitement!',
        'Something wonderful is about to happen, I just know it!',
        'I feel like I could take on the world right now!'
      ]
    };
    
    // Get responses based on personality and mood
    let responses = [];
    
    npc.personality.forEach(trait => {
      if (personalityResponses[trait]) {
        responses.push(...personalityResponses[trait]);
      }
    });
    
    if (moodResponses[npc.mood]) {
      responses.push(...moodResponses[npc.mood]);
    }
    
    // Add role-specific responses
    const roleResponses = {
      merchant: [
        'Business has been good lately, thanks for asking.',
        'I\'ve acquired some rare items you might find interesting.',
        'The trade routes have been stable, which is a blessing.'
      ],
      guard: [
        'Things have been quiet, which is how we like it.',
        'We\'ve had a few incidents, but nothing we can\'t handle.',
        'Stay out of trouble and we\'ll all get along fine.'
      ],
      craftsman: [
        'I\'m working on something special right now.',
        'The materials these days are of exceptional quality.',
        'I\'ve been perfecting a new technique.'
      ],
      scholar: [
        'I\'ve made a fascinating discovery in my research.',
        'There\'s so much we still don\'t understand.',
        'Knowledge is the greatest treasure of all.'
      ],
      priest: [
        'The divine has been especially present lately.',
        'I\'ve been helping many souls find peace.',
        'Faith can move mountains, if you truly believe.'
      ],
      farmer: [
        'The crops are coming along nicely this season.',
        'Weather\'s been cooperating, thankfully.',
        'There\'s nothing quite like the satisfaction of honest work.'
      ],
      child: [
        'I found the coolest thing today!',
        'Want to hear about my latest adventure?',
        'Can you teach me something new?'
      ],
      elder: [
        'In my long years, I\'ve seen many changes.',
        'I remember when things were very different.',
        'There\'s wisdom in every experience, young one.'
      ]
    };
    
    if (roleResponses[npc.role]) {
      responses.push(...roleResponses[npc.role]);
    }
    
    if (responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return 'It\'s a fine day, isn\'t it?';
  }

  // Generate help response
  generateHelpResponse(npc, player) {
    // Check if NPC can actually help based on role
    const helpResponses = {
      merchant: 'I can offer you goods and information about trade routes.',
      guard: 'I can tell you about safety concerns and wanted criminals.',
      craftsman: 'I can repair your equipment or craft special items.',
      scholar: 'I can share knowledge and research findings.',
      priest: 'I can heal your wounds and provide spiritual guidance.',
      farmer: 'I can sell you food and tell you about the land.',
      child: 'I might know secret places adults don\'t!',
      elder: 'I can share wisdom from my many years of experience.'
    };
    
    if (helpResponses[npc.role]) {
      return helpResponses[npc.role];
    }
    
    return `${npc.name} considers your request. "I\'ll do what I can to help."`;
  }

  // Update relationship between two entities
  updateRelationship(npcId, entityId, change) {
    if (!this.relationships.has(npcId)) {
      this.relationships.set(npcId, new Map());
    }
    
    const npcRelationships = this.relationships.get(npcId);
    const current = npcRelationships.get(entityId) || 0;
    const newRelationship = Math.max(-100, Math.min(100, current + change));
    
    npcRelationships.set(entityId, newRelationship);
  }

  // Get relationship between NPC and entity
  getRelationship(npcId, entityId) {
    if (!this.relationships.has(npcId)) {
      return 0;
    }
    
    const npcRelationships = this.relationships.get(npcId);
    return npcRelationships.get(entityId) || 0;
  }

  // Get NPC by ID
  getNPC(npcId) {
    return this.npcs.get(npcId);
  }

  // Get all NPCs in a settlement
  getNPCsInSettlement(settlementId) {
    const npcs = [];
    this.npcs.forEach((npc, npcId) => {
      if (npc.settlementId === settlementId) {
        npcs.push({ id: npcId, ...npc });
      }
    });
    return npcs;
  }

  // Get NPC count by role
  getNPCCountByRole(role) {
    let count = 0;
    this.npcs.forEach(npc => {
      if (npc.role === role) {
        count++;
      }
    });
    return count;
  }

  // Get NPC system status
  getStatus() {
    return {
      totalNPCs: this.npcs.size,
      relationships: this.relationships.size,
      conversations: this.conversations.size,
      personalities: this.personalities.size
    };
  }
}

// Export a singleton instance
export const npcSystem = new NPCSystem();

// Export the class for potential extension
export default NPCSystem;,
        { time: 16, activity: 'teach', location: 'school' },
        { time: 19, activity: 'study', location: 'home' },
        { time: 23, activity: 'rest', location: 'home' }
      ],
      priest: [
        { time: 5, activity: 'prayer', location: 'temple' },
        { time: 8, activity: 'service', location: 'temple' },
        { time: 12, activity: 'heal', location: 'temple' },
        { time: 16, activity: 'visit_sick', location: 'homes' },
        { time: 20, activity: 'evening_service', location: 'temple' },
        { time: 22, activity: 'rest', location: 'quarters' }
      ],
      farmer: [
        { time: 5, activity: 'farm_work', location: 'fields' },
        { time: 12, activity: 'lunch', location: 'farmhouse' },
        { time: 17, activity: 'farm_end', location: 'fields' },
        { time: 19, activity: 'family_time', location: 'farmhouse' },
        { time: 21, activity: 'rest', location: 'farmhouse' }
      ],
      child: [
        { time: 7, activity: 'play', location: 'playground' },
        { time: 12, activity: 'lunch', location: 'home' },
        { time: 14, activity: 'school', location: 'school' },
        { time: 17, activity: 'play', location: 'streets' },
        { time: 19, activity: 'family_dinner', location: 'home' },
        { time: 20, activity: 'bedtime', location: 'home' }
      ],
      elder: [
        { time: 7, activity: 'morning_walk', location: 'garden' },
        { time: 10, activity: 'socialize', location: 'park' },
        { time: 12, activity: 'lunch', location: 'home' },
        { time: 15, activity: 'storytelling', location: 'town_square' },
        { time: 18, activity: 'family_time', location: 'home' },
        { time: 20, activity: 'reflection', location: 'home' },
        { time: 21, activity: 'rest', location: 'home' }
      ]
    };
    
    const npcRoutine = routines[role] || [
      { time: 8, activity: 'work', location: 'generic' },
      { time: 12, activity: 'lunch', location: 'tavern' },
      { time: 17, activity: 'leisure', location: 'town' },
      { time: 21, activity: 'rest', location: 'home' }
    ];
    
    schedule.push(...npcRoutine);
    
    // Store schedule
    this.schedules.set(npcId, schedule);
  }

  // Start NPC simulation
  startNPCSimulation() {
    // Update NPC activities based on time
    setInterval(() => {
      this.updateNPCActivities();
    }, 60000); // Every minute
    
    // Update NPC moods and relationships
    setInterval(() => {
      this.updateNPCMoods();
    }, 120000); // Every 2 minutes
    
    // Generate random NPC events
    setInterval(() => {
      this.generateNPCEvents();
    }, 180000); // Every 3 minutes
  }

  // Update NPC activities based on current time
  updateNPCActivities() {
    const state = gameStateManager.getState();
    const currentHour = state.world.time.hour;
    
    this.npcs.forEach((npc, npcId) => {
      const schedule = this.schedules.get(npcId);
      if (schedule) {
        // Find current activity
        let currentActivity = schedule[0];
        for (let i = schedule.length - 1; i >= 0; i--) {
          if (currentHour >= schedule[i].time) {
            currentActivity = schedule[i];
            break;
          }
        }
        
        // Update NPC location based on activity
        npc.location.building = currentActivity.location;
        
        // Update NPC mood based on activity
        this.updateNPCMoodBasedOnActivity(npcId, currentActivity.activity);
      }
    });
  }

  // Update NPC mood based on activity
  updateNPCMoodBasedOnActivity(npcId, activity) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    
    const moodChanges = {
      'open_shop': 'businesslike',
      'lunch_break': 'relaxed',
      'close_shop': 'tired',
      'socialize': 'happy',
      'rest': 'peaceful',
      'patrol_start': 'alert',
      'shift_change': 'relieved',
      'evening_patrol': 'vigilant',
      'night_watch': 'watchful',
      'work_start': 'focused',
      'work_end': 'satisfied',
      'research_start': 'curious',
      'teach': 'helpful',
      'study': 'concentrated',
      'prayer': 'reverent',
      'service': 'devout',
      'heal': 'compassionate',
      'visit_sick': 'concerned',
      'evening_service': 'peaceful',
      'farm_work': 'industrious',
      'farm_end': 'accomplished',
      'family_time': 'content',
      'play': 'joyful',
      'school': 'attentive',
      'bedtime': 'sleepy',
      'morning_walk': 'refreshed',
      'storytelling': 'entertaining',
      'reflection': 'thoughtful',
      'work': 'busy',
      'leisure': 'relaxed'
    };
    
    if (moodChanges[activity]) {
      npc.mood = moodChanges[activity];
    }
  }

  // Update NPC moods and relationships
  updateNPCMoods() {
    this.npcs.forEach((npc, npcId) => {
      // Random mood fluctuations
      if (Math.random() < 0.1) { // 10% chance
        const moods = ['happy', 'sad', 'angry', 'excited', 'bored', 'anxious', 'calm', 'curious'];
        npc.mood = moods[Math.floor(Math.random() * moods.length)];
      }
      
      // Update based on goals
      npc.goals.forEach(goal => {
        if (!goal.completed && Math.random() < 0.05) { // 5% chance to make progress
          goal.progress = Math.min(100, goal.progress + Math.floor(Math.random() * 10) + 1);
          if (goal.progress >= 100) {
            goal.completed = true;
            // Add to memories
            npc.memories.push({
              timestamp: Date.now(),
              type: 'goal_completed',
              content: `Completed goal: ${goal.description}`
            });
          }
        }
      });
    });
  }

  // Generate random NPC events
  generateNPCEvents() {
    if (Math.random() < 0.2) { // 20% chance
      const npcIds = Array.from(this.npcs.keys());
      if (npcIds.length > 0) {
        const npcId = npcIds[Math.floor(Math.random() * npcIds.length)];
        const npc = this.npcs.get(npcId);
        
        if (npc) {
          const events = [
            'found_item',
            'lost_item',
            'received_gift',
            'had_dream',
            'met_stranger',
            'remembered_past',
            'felt_lonely',
            'felt_grateful'
          ];
          
          const event = events[Math.floor(Math.random() * events.length)];
          this.createNPCEvent(npcId, event);
        }
      }
    }
  }

  // Create an NPC event
  createNPCEvent(npcId, eventType) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;
    
    const events = {
      'found_item': 'Found a mysterious object while going about their day',
      'lost_item': 'Realized they\'ve misplaced something important',
      'received_gift': 'Received an unexpected present from someone',
      'had_dream': 'Had a vivid dream that felt significant',
      'met_stranger': 'Encountered an unfamiliar face in town',
      'remembered_past': 'Recalled a long-forgotten memory',
      'felt_lonely': 'Felt isolated despite being surrounded by people',
      'felt_grateful': 'Experienced deep appreciation for their life'
    };
    
    // Add to memories
    npc.memories.push({
      timestamp: Date.now(),
      type: eventType,
      content: events[eventType]
    });
    
    // Possibly affect mood
    const moodEffects = {
      'found_item': 'curious',
      'lost_item': 'worried',
      'received_gift': 'happy',
      'had_dream': 'thoughtful',
      'met_stranger': 'cautious',
      'remembered_past': 'nostalgic',
      'felt_lonely': 'sad',
      'felt_grateful': 'content'
    };
    
    if (moodEffects[eventType]) {
      npc.mood = moodEffects[eventType];
    }
  }

  // Handle player interaction with NPC
  interactWithNPC(npcId, interactionType) {
    const npc = this.npcs.get(npcId);
    if (!npc) return { success: false, message: 'NPC not found' };
    
    // Update last interaction
    npc.lastInteraction = Date.now();
    
    // Get player state
    const playerState = gameStateManager.getState().player;
    
    // Handle different interaction types
    let response = '';
    let relationshipChange = 0;
    
    switch (interactionType) {
      case 'greet':
        response = this.generateGreeting(npc, playerState);
        relationshipChange = 1;
        break;
      case 'trade':
        response = this.generateTradeResponse(npc, playerState);
        relationshipChange = 2;
        break;
      case 'quest':
        response = this.generateQuestResponse(npc, playerState);
        relationshipChange = 3;
        break;
      case 'chat':
        response = this.generateChatResponse(npc, playerState);
        relationshipChange = 1;
        break;
      case 'help':
        response = this.generateHelpResponse(npc, playerState);
        relationshipChange = 2;
        break;
      default:
        response = `${npc.name} looks at you with interest.`;
        relationshipChange = 0;
    }
    
    // Update relationship
    this.updateRelationship(npcId, playerState.id, relationshipChange);
    
    // Add to conversation history
    if (!this.conversations.has(npcId)) {
      this.conversations.set(npcId, []);
    }
    this.conversations.get(npcId).push({
      timestamp: Date.now(),
      type: interactionType,
      response: response,
      playerLevel: playerState.level
    });
    
    return {
      success: true,
      npcName: npc.name,
      response: response,
      relationshipChange: relationshipChange
    };
  }

  // Generate greeting based on NPC and player
  generateGreeting(npc, player) {
    const greetings = [
      `Hello there, traveler. What brings you to ${npc.settlementId}?`,
      `Well met, adventurer. How fares your journey?`,
      `Greetings! It's not often we see new faces in these parts.`,
      `Ah, welcome! You look like someone with stories to tell.`,
      `Good day to you! How may I be of service?`
    ];
    
    // Personalize based on relationship
    const relationship = this.getRelationship(npc.id, player.id);
    if (relationship > 50) {
      return `Ah, ${player.name}! Good to see you again. How have you been?`;
    } else if (relationship > 25) {
      return `Hello again, ${player.name}. What brings you back?`;
    }
    
    // Personalize based on NPC role
    const roleGreetings = {
      merchant: `Welcome to my shop! See anything that catches your eye?`,
      guard: `Greetings, citizen. All seems well in our fair settlement.`,
      craftsman: `Ah, a new face! Do you have need of my services?`,
      scholar: `Welcome, seeker of knowledge. What would you like to discuss?`,
      priest: `Peace be with you, child. May the divine light your path.`,
      farmer: `Good day! Fresh produce available if you're hungry.`,
      child: `Hi there! Want to play a game?`,
      elder: `Welcome, young one. Come, sit and listen to an old tale.`
    };
    
    if (roleGreetings[npc.role]) {
      return roleGreetings[npc.role];
    }
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Generate trade response
  generateTradeResponse(npc, player) {
    if (npc.role !== 'merchant') {
      return `${npc.name} chuckles. "I'm afraid I'm not a merchant, but perhaps we can trade stories instead?"`;
    }
    
    return `Ah, a customer! I have many fine wares. What are you looking for today?`;
  }

  // Generate quest response
  generateQuestResponse(npc, player) {
    // Check if NPC has any quests
    const settlements = worldGenerator.settlements;
    const npcSettlement = settlements.find(s => s.id === npc.settlementId);
    
    if (npcSettlement && npcSettlement.problems.length > 0) {
      const problem = npcSettlement.problems[0];
      return `Actually, now that you mention it, we do have a problem that needs solving. ${problem.description} Think you could help?`;
    }
    
    return `${npc.name} thinks for a moment. "I don't have any specific tasks, but there's always work to be found in town."`;
  }

  // Generate chat response
  generateChatResponse(npc, player) {
    // Base on NPC personality and mood
    const personalityResponses = {
      optimistic: [
        'The future looks bright, doesn\'t it?',
        'I always believe that good things are just around the corner.',
        'Every day is a gift to be cherished.'
      ],
      pessimistic: [
        'Things seem to be getting worse, if you ask me.',
        'I\'ve seen better days, that\'s for sure.',
        'Hope is a luxury we can\'t always afford.'
      ],
      curious: [
        'Tell me, where have you traveled recently?',
        'I\'ve always wondered about the lands beyond our borders.',
        'What fascinating things have you seen in your journeys?'
      ],
      cautious: [
        'It\'s important to be careful in these uncertain times.',
        'I\'ve learned that trust must be earned, not given freely.',
        'One can never be too careful, especially with strangers.'
      ]
    };
    
    // Base on NPC mood
    const moodResponses = {
      happy: [
        'I haven\'t felt this good in ages!',
        'Life is truly wonderful when you stop to appreciate it.',
        'I\'d love to share my joy with someone!'
      ],
      sad: [
        'Some days it feels like nothing goes right.',
        'I\'ve been feeling a bit down lately.',
        'Sometimes the weight of the world feels too heavy.'
      ],
      angry: [
        'I\'m not in the mood for idle chatter.',
        'Some things have been getting on my nerves lately.',
        'I\'d rather be left alone right now.'
      ],
      excited: [
        'I can barely contain my excitement!',
        'Something wonderful is about to happen, I just know it!',
        'I feel like I could take on the world right now!'
      ]
    };
    
    // Get responses based on personality and mood
    let responses = [];
    
    npc.personality.forEach(trait => {
      if (personalityResponses[trait]) {
        responses.push(...personalityResponses[trait]);
      }
    });
    
    if (moodResponses[npc.mood]) {
      responses.push(...moodResponses[npc.mood]);
    }
    
    // Add role-specific responses
    const roleResponses = {
      merchant: [
        'Business has been good lately, thanks for asking.',
        'I\'ve acquired some rare items you might find interesting.',
        'The trade routes have been stable, which is a blessing.'
      ],
      guard: [
        'Things have been quiet, which is how we like it.',
        'We\'ve had a few incidents, but nothing we can\'t handle.',
        'Stay out of trouble and we\'ll all get along fine.'
      ],
      craftsman: [
        'I\'m working on something special right now.',
        'The materials these days are of exceptional quality.',
        'I\'ve been perfecting a new technique.'
      ],
      scholar: [
        'I\'ve made a fascinating discovery in my research.',
        'There\'s so much we still don\'t understand.',
        'Knowledge is the greatest treasure of all.'
      ],
      priest: [
        'The divine has been especially present lately.',
        'I\'ve been helping many souls find peace.',
        'Faith can move mountains, if you truly believe.'
      ],
      farmer: [
        'The crops are coming along nicely this season.',
        'Weather\'s been cooperating, thankfully.',
        'There\'s nothing quite like the satisfaction of honest work.'
      ],
      child: [
        'I found the coolest thing today!',
        'Want to hear about my latest adventure?',
        'Can you teach me something new?'
      ],
      elder: [
        'In my long years, I\'ve seen many changes.',
        'I remember when things were very different.',
        'There\'s wisdom in every experience, young one.'
      ]
    };
    
    if (roleResponses[npc.role]) {
      responses.push(...roleResponses[npc.role]);
    }
    
    if (responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return 'It\'s a fine day, isn\'t it?';
  }

  // Generate help response
  generateHelpResponse(npc, player) {
    // Check if NPC can actually help based on role
    const helpResponses = {
      merchant: 'I can offer you goods and information about trade routes.',
      guard: 'I can tell you about safety concerns and wanted criminals.',
      craftsman: 'I can repair your equipment or craft special items.',
      scholar: 'I can share knowledge and research findings.',
      priest: 'I can heal your wounds and provide spiritual guidance.',
      farmer: 'I can sell you food and tell you about the land.',
      child: 'I might know secret places adults don\'t!',
      elder: 'I can share wisdom from my many years of experience.'
    };
    
    if (helpResponses[npc.role]) {
      return helpResponses[npc.role];
    }
    
    return `${npc.name} considers your request. "I\'ll do what I can to help."`;
  }

  // Update relationship between two entities
  updateRelationship(npcId, entityId, change) {
    if (!this.relationships.has(npcId)) {
      this.relationships.set(npcId, new Map());
    }
    
    const npcRelationships = this.relationships.get(npcId);
    const current = npcRelationships.get(entityId) || 0;
    const newRelationship = Math.max(-100, Math.min(100, current + change));
    
    npcRelationships.set(entityId, newRelationship);
  }

  // Get relationship between NPC and entity
  getRelationship(npcId, entityId) {
    if (!this.relationships.has(npcId)) {
      return 0;
    }
    
    const npcRelationships = this.relationships.get(npcId);
    return npcRelationships.get(entityId) || 0;
  }

  // Get NPC by ID
  getNPC(npcId) {
    return this.npcs.get(npcId);
  }

  // Get all NPCs in a settlement
  getNPCsInSettlement(settlementId) {
    const npcs = [];
    this.npcs.forEach((npc, npcId) => {
      if (npc.settlementId === settlementId) {
        npcs.push({ id: npcId, ...npc });
      }
    });
    return npcs;
  }

  // Get NPC count by role
  getNPCCountByRole(role) {
    let count = 0;
    this.npcs.forEach(npc => {
      if (npc.role === role) {
        count++;
      }
    });
    return count;
  }

  // Get NPC system status
  getStatus() {
    return {
      totalNPCs: this.npcs.size,
      relationships: this.relationships.size,
      conversations: this.conversations.size,
      personalities: this.personalities.size
    };
  }
}

// Export a singleton instance
export const npcSystem = new NPCSystem();

// Export the class for potential extension
export default NPCSystem;