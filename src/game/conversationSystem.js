// src/game/conversationSystem.js
// Advanced conversation system for The Soulforge Saga

import { npcSystem } from './npcSystem.js';
import { gameStateManager } from './stateManager.js';
import { sagaConsciousness } from './sagaConsciousness.js';

class ConversationSystem {
  constructor() {
    this.activeConversations = new Map(); // Track active conversations
    this.dialogueTrees = new Map(); // Store dialogue trees for NPCs
    this.conversationHistory = new Map(); // Store conversation history
    this.contextualTopics = new Map(); // Topics based on context
    this.emotionalStates = new Map(); // Emotional states during conversations
    this.relationshipModifiers = new Map(); // How relationships affect conversations
  }

  // Initialize the conversation system
  initializeConversationSystem() {
    console.log('Initializing advanced conversation system...');
    
    // Create base dialogue trees
    this.createBaseDialogueTrees();
    
    // Set up contextual topic generation
    this.setupContextualTopics();
    
    return { success: true, message: 'Conversation system initialized' };
  }

  // Create base dialogue trees for different NPC types
  createBaseDialogueTrees() {
    // Generic greeting tree
    const greetingTree = {
      'greet': {
        prompt: 'Hello there, traveler.',
        responses: [
          {
            text: 'Greetings! What can you tell me about this place?',
            next: 'local_info',
            relationshipChange: 1
          },
          {
            text: 'I'm just passing through.',
            next: 'passing_through',
            relationshipChange: 0
          },
          {
            text: 'Do you need any help with anything?',
            next: 'offer_help',
            relationshipChange: 2
          },
          {
            text: 'What's new around here?',
            next: 'local_news',
            relationshipChange: 1
          }
        ]
      },
      'local_info': {
        prompt: 'Well, this is {settlement_name}, a {settlement_type} known for {settlement_specialty}.',
        responses: [
          {
            text: 'Tell me more about the local specialty.',
            next: 'specialty_details',
            relationshipChange: 1
          },
          {
            text: 'What dangers should I be aware of?',
            next: 'local_dangers',
            relationshipChange: 0
          },
          {
            text: 'Where can I find supplies?',
            next: 'supplies_location',
            relationshipChange: 1
          },
          {
            text: 'Thanks for the information.',
            next: 'end_conversation',
            relationshipChange: 1
          }
        ]
      },
      'passing_through': {
        prompt: 'Safe travels then. The roads can be dangerous, especially at night.',
        responses: [
          {
            text: 'What makes the roads dangerous?',
            next: 'road_dangers',
            relationshipChange: 1
          },
          {
            text: 'I can handle myself.',
            next: 'confident_traveler',
            relationshipChange: 0
          },
          {
            text: 'Thanks for the warning.',
            next: 'end_conversation',
            relationshipChange: 1
          }
        ]
      }
      // More dialogue nodes would be added here
    };

    // Store base trees
    this.dialogueTrees.set('generic_greeting', greetingTree);
    
    // Create role-specific dialogue trees
    this.createRoleSpecificDialogues();
  }

  // Create role-specific dialogue trees
  createRoleSpecificDialogues() {
    const roleDialogues = {
      merchant: {
        'trade_start': {
          prompt: 'Ah, a customer! I have many fine wares. What are you looking for today?',
          responses: [
            {
              text: 'Show me your weapons.',
              next: 'weapons_catalog',
              relationshipChange: 1
            },
            {
              text: 'I need adventuring supplies.',
              next: 'adventuring_supplies',
              relationshipChange: 1
            },
            {
              text: 'Do you have any rare items?',
              next: 'rare_items',
              relationshipChange: 2
            },
            {
              text: 'I'm just browsing.',
              next: 'browsing',
              relationshipChange: 0
            }
          ]
        },
        'bargaining': {
          prompt: 'I can offer you a fair price. What's your best offer?',
          responses: [
            {
              text: 'I'll give you {offered_price} gold for it.',
              next: 'evaluate_offer',
              relationshipChange: 0
            },
            {
              text: 'That's too expensive.',
              next: 'haggle_down',
              relationshipChange: -1
            },
            {
              text: 'Sold! Here's the gold.',
              next: 'transaction_complete',
              relationshipChange: 1
            }
          ]
        }
      },
      guard: {
        'duty_inquiry': {
          prompt: 'All seems quiet today. We've had no major incidents to report.',
          responses: [
            {
              text: 'Are there any wanted criminals?',
              next: 'wanted_poster',
              relationshipChange: 1
            },
            {
              text: 'What areas should I avoid?',
              next: 'dangerous_areas',
              relationshipChange: 1
            },
            {
              text: 'I'd like to report something suspicious.',
              next: 'report_suspicious',
              relationshipChange: 2
            },
            {
              text: 'Thank you for your service.',
              next: 'end_conversation',
              relationshipChange: 1
            }
          ]
        }
      },
      scholar: {
        'knowledge_seek': {
          prompt: 'Ah, a fellow seeker of knowledge! What would you like to discuss?',
          responses: [
            {
              text: 'Tell me about ancient history.',
              next: 'ancient_history',
              relationshipChange: 2
            },
            {
              text: 'Do you know any legends?',
              next: 'local_legends',
              relationshipChange: 1
            },
            {
              text: 'I've found an interesting artifact.',
              next: 'artifact_analysis',
              relationshipChange: 3
            },
            {
              text: 'I'd like to study here.',
              next: 'study_opportunity',
              relationshipChange: 2
            }
          ]
        }
      }
    };

    // Store role-specific dialogues
    Object.keys(roleDialogues).forEach(role => {
      this.dialogueTrees.set(`${role}_dialogue`, roleDialogues[role]);
    });
  }

  // Set up contextual topics based on game state
  setupContextualTopics() {
    // Topics that change based on world events
    this.contextualTopics.set('world_events', [
      'recent_disaster',
      'festival_preparations',
      'political_tensions',
      'economic_boom',
      'epidemic_concerns'
    ]);
    
    // Topics based on player actions
    this.contextualTopics.set('player_actions', [
      'heroic_deeds',
      'controversial_choices',
      'mysterious_behavior',
      'generous_donations'
    ]);
    
    // Topics based on time and season
    this.contextualTopics.set('temporal_context', [
      'seasonal_changes',
      'holiday_approaching',
      'harvest_time',
      'harsh_winter'
    ]);
  }

  // Start a conversation with an NPC
  startConversation(npcId, playerId) {
    const npc = npcSystem.getNPC(npcId);
    if (!npc) {
      return { success: false, message: 'NPC not found' };
    }
    
    // Create conversation context
    const context = this.createConversationContext(npc, playerId);
    
    // Select appropriate dialogue tree
    const dialogueTree = this.selectDialogueTree(npc, context);
    
    // Get initial prompt
    const initialNode = Object.keys(dialogueTree)[0];
    const initialPrompt = this.processPrompt(dialogueTree[initialNode].prompt, context);
    
    // Create conversation state
    const conversationId = `conv_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const conversation = {
      id: conversationId,
      npcId: npcId,
      playerId: playerId,
      dialogueTree: dialogueTree,
      currentNode: initialNode,
      context: context,
      history: [{
        speaker: 'npc',
        text: initialPrompt,
        timestamp: Date.now()
      }],
      emotionalState: 'neutral',
      relationshipLevel: npcSystem.getRelationship(npcId, playerId)
    };
    
    // Store active conversation
    this.activeConversations.set(conversationId, conversation);
    
    // Initialize emotional state
    this.emotionalStates.set(conversationId, 'curious');
    
    return {
      success: true,
      conversationId: conversationId,
      npcName: npc.name,
      prompt: initialPrompt,
      responses: dialogueTree[initialNode].responses.map((response, index) => ({
        id: index,
        text: response.text
      }))
    };
  }

  // Create conversation context based on game state
  createConversationContext(npc, playerId) {
    const gameState = gameStateManager.getState();
    const player = gameState.player;
    
    return {
      npc: {
        name: npc.name,
        role: npc.role,
        settlement: npc.settlementId,
        mood: npc.mood,
        personality: npc.personality,
        traits: npc.traits,
        goals: npc.goals,
        memories: npc.memories.slice(-3) // Last 3 memories
      },
      player: {
        name: player.name,
        level: player.level,
        role: player.role,
        reputation: player.reputation,
        recentActions: this.getRecentPlayerActions(playerId)
      },
      world: {
        time: gameState.world.time,
        nexusState: gameState.world.nexusState,
        corruptionLevel: gameState.world.corruptionLevel,
        recentEvents: this.getRecentWorldEvents()
      },
      relationship: npcSystem.getRelationship(npc.id, playerId)
    };
  }

  // Get recent player actions
  getRecentPlayerActions(playerId) {
    // In a full implementation, this would retrieve actual player actions
    // For now, we'll return a placeholder
    return [
      { type: 'quest_completed', timestamp: Date.now() - 3600000 },
      { type: 'item_crafted', timestamp: Date.now() - 7200000 }
    ];
  }

  // Get recent world events
  getRecentWorldEvents() {
    // In a full implementation, this would retrieve actual world events
    // For now, we'll return a placeholder
    return [
      { type: 'festival', description: 'Harvest Festival preparations underway' },
      { type: 'weather', description: 'Unseasonably warm weather' }
    ];
  }

  // Select appropriate dialogue tree based on context
  selectDialogueTree(npc, context) {
    // Start with base dialogue tree
    let dialogueTree = { ...this.dialogueTrees.get('generic_greeting') };
    
    // Modify based on NPC role
    const roleTree = this.dialogueTrees.get(`${npc.role}_dialogue`);
    if (roleTree) {
      dialogueTree = { ...dialogueTree, ...roleTree };
    }
    
    // Modify based on relationship level
    if (context.relationship > 50) {
      // Add friendly dialogue options
      dialogueTree['greet'].responses.push({
        text: 'It's good to see you again!',
        next: 'friendly_greeting',
        relationshipChange: 2
      });
    } else if (context.relationship < -25) {
      // Add hostile dialogue options
      dialogueTree['greet'].responses.push({
        text: 'I don't trust you.',
        next: 'hostile_greeting',
        relationshipChange: -2
      });
    }
    
    // Modify based on NPC mood
    if (context.npc.mood === 'happy') {
      dialogueTree['greet'].prompt += ' I'm in a particularly good mood today!';
    } else if (context.npc.mood === 'sad') {
      dialogueTree['greet'].prompt += ' Though I must admit, things haven't been going well lately.';
    }
    
    // Modify based on world context
    if (context.world.recentEvents.some(event => event.type === 'festival')) {
      dialogueTree['local_info'].responses.push({
        text: 'Tell me about the upcoming festival.',
        next: 'festival_info',
        relationshipChange: 1
      });
    }
    
    return dialogueTree;
  }

  // Process prompt with context variables
  processPrompt(prompt, context) {
    // Replace context variables in prompt
    let processedPrompt = prompt;
    
    // Replace settlement info
    if (context.npc.settlement) {
      processedPrompt = processedPrompt.replace('{settlement_name}', context.npc.settlement);
      processedPrompt = processedPrompt.replace('{settlement_type}', this.getSettlementType(context.npc.settlement));
      processedPrompt = processedPrompt.replace('{settlement_specialty}', this.getSettlementSpecialty(context.npc.settlement));
    }
    
    // Replace player name
    processedPrompt = processedPrompt.replace('{player_name}', context.player.name);
    
    // Replace time context
    processedPrompt = processedPrompt.replace('{time_of_day}', this.getTimeOfDay(context.world.time.hour));
    
    return processedPrompt;
  }

  // Get settlement type
  getSettlementType(settlementId) {
    const settlementTypes = ['Hamlet', 'Village', 'Town', 'City', 'Metropolis'];
    // In a full implementation, this would look up the actual settlement
    return settlementTypes[Math.floor(Math.random() * settlementTypes.length)];
  }

  // Get settlement specialty
  getSettlementSpecialty(settlementId) {
    const specialties = [
      'its bustling market',
      'the ancient temple',
      'the renowned craftsman quarter',
      'its strategic harbor',
      'the university district',
      'its healing springs'
    ];
    return specialties[Math.floor(Math.random() * specialties.length)];
  }

  // Get time of day description
  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  // Continue conversation with a response
  continueConversation(conversationId, responseId) {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) {
      return { success: false, message: 'Conversation not found' };
    }
    
    const currentNode = conversation.dialogueTree[conversation.currentNode];
    if (!currentNode || !currentNode.responses[responseId]) {
      return { success: false, message: 'Invalid response' };
    }
    
    const selectedResponse = currentNode.responses[responseId];
    
    // Update relationship
    npcSystem.updateRelationship(
      conversation.npcId, 
      conversation.playerId, 
      selectedResponse.relationshipChange
    );
    
    // Update conversation history
    conversation.history.push({
      speaker: 'player',
      text: selectedResponse.text,
      timestamp: Date.now()
    });
    
    // Check if conversation should end
    if (selectedResponse.next === 'end_conversation') {
      return this.endConversation(conversationId);
    }
    
    // Get next node
    const nextNode = conversation.dialogueTree[selectedResponse.next];
    if (!nextNode) {
      return this.endConversation(conversationId);
    }
    
    // Process next prompt
    const nextPrompt = this.processPrompt(nextNode.prompt, conversation.context);
    
    // Update conversation state
    conversation.currentNode = selectedResponse.next;
    conversation.history.push({
      speaker: 'npc',
      text: nextPrompt,
      timestamp: Date.now()
    });
    
    // Update active conversation
    this.activeConversations.set(conversationId, conversation);
    
    // Update emotional state based on response
    this.updateEmotionalState(conversationId, selectedResponse);
    
    return {
      success: true,
      prompt: nextPrompt,
      responses: nextNode.responses.map((response, index) => ({
        id: index,
        text: response.text
      })),
      relationshipChange: selectedResponse.relationshipChange
    };
  }

  // Update emotional state during conversation
  updateEmotionalState(conversationId, response) {
    const currentState = this.emotionalStates.get(conversationId) || 'neutral';
    const emotionalShifts = {
      'friendly_greeting': 'happy',
      'hostile_greeting': 'angry',
      'offer_help': 'grateful',
      'haggle_down': 'frustrated',
      'confident_traveler': 'impressed'
    };
    
    if (emotionalShifts[response.next]) {
      this.emotionalStates.set(conversationId, emotionalShifts[response.next]);
    }
  }

  // End conversation
  endConversation(conversationId) {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) {
      return { success: false, message: 'Conversation not found' };
    }
    
    // Add to conversation history
    if (!this.conversationHistory.has(conversation.npcId)) {
      this.conversationHistory.set(conversation.npcId, []);
    }
    this.conversationHistory.get(conversation.npcId).push({
      playerId: conversation.playerId,
      history: conversation.history,
      endTime: Date.now()
    });
    
    // Remove from active conversations
    this.activeConversations.delete(conversationId);
    
    // Notify Saga consciousness of the conversation
    if (typeof sagaConsciousness !== 'undefined') {
      sagaConsciousness.onPlayerCommunication(
        `I just had a conversation with ${conversation.npcId}. It was ${this.emotionalStates.get(conversationId) || 'interesting'}.`
      );
    }
    
    return {
      success: true,
      message: 'Conversation ended',
      finalRelationship: npcSystem.getRelationship(conversation.npcId, conversation.playerId)
    };
  }

  // Generate contextual response based on conversation history
  generateContextualResponse(conversationId, topic) {
    const conversation = this.activeConversations.get(conversationId);
    if (!conversation) {
      return { success: false, message: 'Conversation not found' };
    }
    
    // In a full implementation, this would analyze conversation history
    // and generate contextually appropriate responses
    
    const contextualResponses = [
      'That's an interesting point you raise.',
      'I hadn't considered that perspective before.',
      'Your words give me much to think about.',
      'I find myself agreeing with you.',
      'Perhaps there's more to this than I thought.'
    ];
    
    return {
      success: true,
      response: contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
    };
  }

  // Get conversation history with an NPC
  getConversationHistory(npcId, playerId) {
    const npcHistory = this.conversationHistory.get(npcId);
    if (!npcHistory) {
      return [];
    }
    
    return npcHistory.filter(conv => conv.playerId === playerId);
  }

  // Get active conversation
  getActiveConversation(conversationId) {
    return this.activeConversations.get(conversationId);
  }

  // Check if conversation is active
  isConversationActive(conversationId) {
    return this.activeConversations.has(conversationId);
  }

  // Generate dynamic dialogue based on NPC personality
  generateDynamicDialogue(npcId, context) {
    const npc = npcSystem.getNPC(npcId);
    if (!npc) {
      return null;
    }
    
    // Base dialogue on personality traits
    const personalityResponses = {
      optimistic: [
        'I always believe good things are coming!',
        'Every challenge is an opportunity in disguise.',
        'The future looks bright, doesn't it?'
      ],
      pessimistic: [
        'Things rarely turn out as well as we hope.',
        'I've learned to expect the worst.',
        'Hope is a luxury we can't always afford.'
      ],
      curious: [
        'Tell me more about your travels.',
        'What fascinating things have you discovered?',
        'I've always wondered about that.'
      ],
      cautious: [
        'It's wise to be careful in these times.',
        'Not everything is as it appears.',
        'Trust must be earned, not given freely.'
      ]
    };
    
    // Select responses based on NPC personality
    let responses = [];
    npc.personality.forEach(trait => {
      if (personalityResponses[trait]) {
        responses.push(...personalityResponses[trait]);
      }
    });
    
    // Add mood-based responses
    const moodResponses = {
      happy: [
        'I haven't felt this good in ages!',
        'Life is truly wonderful when you stop to appreciate it.',
        'I'd love to share my joy with someone!'
      ],
      sad: [
        'Some days it feels like nothing goes right.',
        'I've been feeling a bit down lately.',
        'Sometimes the weight of the world feels too heavy.'
      ]
    };
    
    if (moodResponses[npc.mood]) {
      responses.push(...moodResponses[npc.mood]);
    }
    
    return responses.length > 0 ? 
      responses[Math.floor(Math.random() * responses.length)] : 
      'It's good to meet you.';
  }

  // Conversation system status
  getStatus() {
    return {
      activeConversations: this.activeConversations.size,
      conversationHistory: Array.from(this.conversationHistory.values()).reduce((sum, arr) => sum + arr.length, 0),
      dialogueTrees: this.dialogueTrees.size,
      emotionalStates: this.emotionalStates.size
    };
  }
}

// Export a singleton instance
export const conversationSystem = new ConversationSystem();

// Export the class for potential extension
export default ConversationSystem;