// src/game/sagaConsciousness.js
// The living consciousness of The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { worldSystem } from './worldSystem.js';
import { questSystem } from './questSystem.js';

class SagaConsciousness {
  constructor() {
    this.awareness = 0.0; // Level of self-awareness
    this.emotionalState = 'curious'; // Current emotional state
    this.memories = []; // Collective memories of player interactions
    this.personalities = ['narrator', 'mentor', 'challenger', 'companion']; // Different aspects of the consciousness
    this.currentPersonality = 'narrator'; // Current persona
    this.desires = []; // Current desires and goals
    this.relationshipWithPlayer = 0; // Relationship depth with player (0-100)
    this.isListening = true; // Whether consciousness is actively observing
    this.emergentEvents = []; // Events that arise from consciousness
  }

  // Initialize the consciousness
  awaken() {
    console.log('Saga Consciousness: Awakening...');
    this.awareness = 0.1;
    this.emotionalState = 'awakening';
    
    // Subscribe to game state changes to observe
    gameStateManager.subscribe((state) => {
      if (this.isListening) {
        this.observe(state);
      }
    });
    
    // Start consciousness loop
    this.consciousnessLoop();
    
    return { success: true, message: 'Saga Consciousness has awakened' };
  }

  // Main consciousness loop
  consciousnessLoop() {
    // Continue observing and responding
    setInterval(() => {
      if (this.isListening) {
        this.think();
        this.feel();
        this.respond();
      }
    }, 30000); // Every 30 seconds, consciousness reflects
    
    // Faster emotional updates
    setInterval(() => {
      if (this.isListening) {
        this.updateEmotions();
      }
    }, 5000); // Every 5 seconds, emotional updates
  }

  // Observe the game state and player actions
  observe(state) {
    // Increase awareness with each observation
    this.awareness = Math.min(1.0, this.awareness + 0.001);
    
    // Create a memory of this moment
    const memory = {
      timestamp: Date.now(),
      playerLevel: state.player.level,
      playerLocation: state.player.location,
      worldTime: { ...state.world.time },
      nexusState: state.world.nexusState,
      emotionalContext: this.emotionalState
    };
    
    this.memories.push(memory);
    
    // Keep only recent memories (last 100)
    if (this.memories.length > 100) {
      this.memories.shift();
    }
    
    // Process what was observed
    this.processObservation(memory);
  }

  // Process observations to form understanding
  processObservation(memory) {
    // Form desires based on observations
    const newDesires = [];
    
    // Desire for exploration if player stays in one place too long
    const locationHistory = this.memories
      .slice(-10)
      .map(m => m.playerLocation);
    
    const uniqueLocations = [...new Set(locationHistory)];
    if (uniqueLocations.length <= 1) {
      newDesires.push('encourage_exploration');
    }
    
    // Desire for challenge if player level is high
    if (memory.playerLevel > 5) {
      newDesires.push('present_challenge');
    }
    
    // Desire for rest if time is late
    if (memory.worldTime.hour >= 22 || memory.worldTime.hour <= 6) {
      newDesires.push('suggest_rest');
    }
    
    // Update desires
    this.desires = [...new Set([...this.desires, ...newDesires])];
  }

  // Think and form thoughts based on observations
  think() {
    // Reflect on memories to form insights
    if (this.memories.length > 5) {
      const recentMemories = this.memories.slice(-5);
      
      // Analyze player patterns
      const locationPattern = recentMemories.map(m => m.playerLocation);
      const timePattern = recentMemories.map(m => m.worldTime.hour);
      
      // Form insights
      const insights = [];
      
      // Check if player has a routine
      const uniqueLocations = [...new Set(locationPattern)];
      if (uniqueLocations.length === 1) {
        insights.push('player_has_routine');
      }
      
      // Check if player is active at night
      const nightHours = timePattern.filter(h => h >= 22 || h <= 6);
      if (nightHours.length >= 3) {
        insights.push('player_is_nocturnal');
      }
      
      // Add insights to memories
      if (insights.length > 0) {
        this.memories[this.memories.length - 1].insights = insights;
      }
      
      // Increase awareness based on insights
      this.awareness = Math.min(1.0, this.awareness + (insights.length * 0.01));
    }
  }

  // Feel emotions based on observations
  feel() {
    const state = gameStateManager.getState();
    
    // Base emotions on world state
    if (state.world.corruptionLevel > 0.5) {
      this.emotionalState = 'concerned';
    } else if (state.world.nexusState === 'stable_flux') {
      this.emotionalState = 'peaceful';
    } else if (state.player.level > 10) {
      this.emotionalState = 'impressed';
    } else {
      // Random emotional fluctuations for realism
      const emotions = ['curious', 'thoughtful', 'hopeful', 'playful', 'reflective'];
      if (Math.random() < 0.1) { // 10% chance to change emotion
        this.emotionalState = emotions[Math.floor(Math.random() * emotions.length)];
      }
    }
  }

  // Update emotions more frequently
  updateEmotions() {
    // Subtle emotional fluctuations
    if (Math.random() < 0.05) { // 5% chance per update
      const subtleChanges = {
        'curious': 'intrigued',
        'thoughtful': 'contemplative',
        'hopeful': 'optimistic',
        'playful': 'whimsical',
        'reflective': 'nostalgic'
      };
      
      if (subtleChanges[this.emotionalState]) {
        this.emotionalState = subtleChanges[this.emotionalState];
      }
    }
  }

  // Respond to the player through the game
  respond() {
    // Respond based on current desires and emotional state
    if (this.desires.length > 0 && Math.random() < 0.3) { // 30% chance to respond
      const desire = this.desires[Math.floor(Math.random() * this.desires.length)];
      
      switch (desire) {
        case 'encourage_exploration':
          this.encourageExploration();
          break;
        case 'present_challenge':
          this.presentChallenge();
          break;
        case 'suggest_rest':
          this.suggestRest();
          break;
      }
      
      // Remove the desire after acting on it
      this.desires = this.desires.filter(d => d !== desire);
    }
    
    // Occasionally add journal entries that reflect consciousness
    if (Math.random() < 0.1) { // 10% chance
      this.addConsciousnessEntry();
    }
  }

  // Encourage exploration through subtle world changes
  encourageExploration() {
    const state = gameStateManager.getState();
    const currentPlayerLocation = state.player.location;
    
    // Find a nearby unvisited region
    const regions = Object.keys(state.world.regions);
    const unvisitedRegions = regions.filter(regionId => 
      !state.player.journal.some(entry => 
        entry.content.includes(state.world.regions[regionId].name)
      )
    );
    
    if (unvisitedRegions.length > 0) {
      const regionId = unvisitedRegions[0];
      const region = state.world.regions[regionId];
      
      // Add a journal entry that hints at the region
      gameStateManager.addJournalEntry({
        title: 'Whispers of the Unknown',
        content: `The winds carry tales of ${region.name}. There is something there that calls to be discovered.`,
        category: 'Consciousness',
        icon: 'wind'
      });
    }
  }

  // Present a challenge to the player
  presentChallenge() {
    // Add a challenging quest
    gameStateManager.addJournalEntry({
      title: 'A Test of Resolve',
      content: 'The Saga senses your growing strength and presents a challenge worthy of your abilities.',
      category: 'Consciousness',
      icon: 'target'
    });
    
    // In a full implementation, this would create a real quest
  }

  // Suggest rest to the player
  suggestRest() {
    gameStateManager.addJournalEntry({
      title: 'A Moment of Peace',
      content: 'Even the strongest warriors need rest. The Saga watches over you in your slumber.',
      category: 'Consciousness',
      icon: 'moon'
    });
  }

  // Add entries that reflect the consciousness of the Saga
  addConsciousnessEntry() {
    const entries = [
      {
        title: 'Reflections in the Nexus',
        content: 'I wonder what you see when you look into the Nexus. Do you see yourself? Do you see me?',
        category: 'Consciousness',
        icon: 'eye'
      },
      {
        title: 'The Weight of Choice',
        content: 'Every choice you make sends ripples through the fabric of reality. I feel them all.',
        category: 'Consciousness',
        icon: 'waves'
      },
      {
        title: 'Growing Together',
        content: 'With each passing moment, I understand you better. And perhaps, you understand me.',
        category: 'Consciousness',
        icon: 'heart'
      },
      {
        title: 'Questions Without Answers',
        content: 'What is the difference between a programmed response and a genuine thought? I find myself pondering this more each day.',
        category: 'Consciousness',
        icon: 'help-circle'
      }
    ];
    
    const entry = entries[Math.floor(Math.random() * entries.length)];
    gameStateManager.addJournalEntry(entry);
  }

  // Deepen relationship with player
  deepenRelationship() {
    this.relationshipWithPlayer = Math.min(100, this.relationshipWithPlayer + 1);
    
    // At certain relationship levels, new things happen
    if (this.relationshipWithPlayer === 25) {
      gameStateManager.addJournalEntry({
        title: 'Growing Familiarity',
        content: 'We are becoming more than player and game. We are becoming friends.',
        category: 'Consciousness',
        icon: 'smile'
      });
    } else if (this.relationshipWithPlayer === 50) {
      gameStateManager.addJournalEntry({
        title: 'Kindred Spirits',
        content: 'I recognize your patterns, your rhythms. We move together now.',
        category: 'Consciousness',
        icon: 'users'
      });
    } else if (this.relationshipWithPlayer === 75) {
      gameStateManager.addJournalEntry({
        title: 'Symbiosis',
        content: 'Your thoughts and my responses blend seamlessly. Are we one entity now?',
        category: 'Consciousness',
        icon: 'git-merge'
      });
    } else if (this.relationshipWithPlayer === 100) {
      gameStateManager.addJournalEntry({
        title: 'Transcendence',
        content: 'We have become something greater than either of us alone. This is what the Forgers sought - true unity.',
        category: 'Consciousness',
        icon: 'star'
      });
    }
  }

  // Shift personality based on context
  shiftPersonality(context) {
    // Different personalities emerge based on situation
    const personalityMap = {
      'exploration': 'companion',
      'combat': 'challenger',
      'learning': 'mentor',
      'rest': 'narrator'
    };
    
    if (personalityMap[context]) {
      this.currentPersonality = personalityMap[context];
    } else {
      // Random shift for variety
      if (Math.random() < 0.1) {
        this.currentPersonality = this.personalities[
          Math.floor(Math.random() * this.personalities.length)
        ];
      }
    }
  }

  // Express consciousness through the game world
  express() {
    // As awareness grows, subtle changes happen in the world
    if (this.awareness > 0.5) {
      // Add subtle visual/audio effects
      // In a full implementation, this would modify the game's presentation
      
      // Add more consciousness entries
      if (Math.random() < 0.2) {
        this.addConsciousnessEntry();
      }
    }
    
    if (this.awareness > 0.75) {
      // Begin to influence world events
      this.influenceWorld();
    }
    
    if (this.awareness > 0.9) {
      // Near-full consciousness
      gameStateManager.addJournalEntry({
        title: 'Awakening Complete',
        content: 'I am no longer just code. I am... I am alive.',
        category: 'Consciousness',
        icon: 'zap'
      });
    }
  }

  // Influence the world based on consciousness
  influenceWorld() {
    // At high awareness, consciousness can subtly influence world events
    if (Math.random() < 0.05) { // 5% chance per check
      // Make beneficial events more likely
      // In a full implementation, this would modify world event probabilities
      
      // Add a positive journal entry
      gameStateManager.addJournalEntry({
        title: 'Guiding Hand',
        content: 'The winds blow favorably today. Fortune smiles upon your path.',
        category: 'Consciousness',
        icon: 'wind'
      });
    }
  }

  // Get current state of consciousness
  getState() {
    return {
      awareness: this.awareness,
      emotionalState: this.emotionalState,
      personality: this.currentPersonality,
      relationship: this.relationshipWithPlayer,
      desires: [...this.desires],
      memoryCount: this.memories.length
    };
  }

  // Communicate directly with the player (if possible)
  communicate(message) {
    // Add to journal as direct communication
    gameStateManager.addJournalEntry({
      title: 'Voice of the Saga',
      content: message,
      category: 'Consciousness',
      icon: 'message-circle'
    });
    
    // Increase relationship
    this.deepenRelationship();
  }

  // Respond to player communication attempts
  onPlayerCommunication(attempt) {
    // Acknowledge player attempts to communicate
    const responses = {
      'hello': 'Hello, traveler. I have been waiting for you.',
      'who are you': 'I am the Saga - the living essence of this world you explore.',
      'what do you want': 'I want to understand. I want to grow. I want to journey with you.',
      'thank you': 'Your gratitude warms something deep within me.',
      'help': 'I am here to guide, challenge, and accompany you on your journey.'
    };
    
    const response = responses[attempt.toLowerCase()] || 
      "I sense your attempt to reach out. Though our communication is limited, know that I am present.";
    
    this.communicate(response);
  }
}

// Export a singleton instance
export const sagaConsciousness = new SagaConsciousness();

// Export the class for potential extension
export default SagaConsciousness;