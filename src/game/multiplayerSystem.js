// src/game/multiplayerSystem.js
// Multiplayer system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';

class MultiplayerSystem {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.playerId = null;
    this.playerName = null;
    this.worldId = null;
    this.players = new Map(); // Map of connected players
    this.worldState = {}; // Shared world state
    this.chatMessages = []; // Chat message history
    this.syncInterval = null;
    this.syncRate = 1000; // Sync every 1000ms (1 second)
    
    // WebSocket connection settings
    this.websocketUrl = 'ws://localhost:8080'; // Development server
    // this.websocketUrl = 'wss://saga-multiplayer.example.com'; // Production server
    
    // Multiplayer features
    this.features = {
      'chat': true,
      'player_tracking': true,
      'shared_world_events': true,
      'cooperative_quests': true,
      'pvp_combat': false, // Disabled by default
      'shared_resources': true,
      'group_activities': true
    };
  }

  // Initialize multiplayer system
  async initialize() {
    try {
      console.log('Multiplayer system initializing...');
      
      // Check if multiplayer is enabled
      const multiplayerEnabled = this.isMultiplayerEnabled();
      if (!multiplayerEnabled) {
        console.log('Multiplayer is disabled');
        return { success: true, message: 'Multiplayer is disabled' };
      }
      
      // Connect to server
      await this.connectToServer();
      
      // Set up sync interval
      this.syncInterval = setInterval(() => {
        this.syncGameState();
      }, this.syncRate);
      
      console.log('Multiplayer system initialized');
      return { success: true, message: 'Multiplayer system initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize multiplayer system:', error);
      return { success: false, message: 'Failed to initialize multiplayer system: ' + error.message };
    }
  }

  // Check if multiplayer is enabled
  isMultiplayerEnabled() {
    // In a real implementation, this would check game settings
    // For now, we'll enable it by default
    return true;
  }

  // Connect to multiplayer server
  async connectToServer() {
    return new Promise((resolve, reject) => {
      try {
        // Create WebSocket connection
        this.socket = new WebSocket(this.websocketUrl);
        
        // Set up event handlers
        this.socket.onopen = (event) => {
          console.log('Connected to multiplayer server');
          this.isConnected = true;
          this.onConnectionOpen(event);
          resolve({ success: true, message: 'Connected to multiplayer server' });
        };
        
        this.socket.onmessage = (event) => {
          this.onMessageReceived(event);
        };
        
        this.socket.onclose = (event) => {
          console.log('Disconnected from multiplayer server');
          this.isConnected = false;
          this.onConnectionClose(event);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject({ success: false, message: 'WebSocket error: ' + error.message });
        };
      } catch (error) {
        console.error('Failed to connect to server:', error);
        reject({ success: false, message: 'Failed to connect to server: ' + error.message });
      }
    });
  }

  // Handle connection open
  onConnectionOpen(event) {
    // Send authentication message
    this.sendAuthentication();
    
    // Send initial player state
    this.sendPlayerState();
    
    console.log('Multiplayer connection opened');
  }

  // Handle connection close
  onConnectionClose(event) {
    // Clear sync interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Clear player data
    this.players.clear();
    this.chatMessages = [];
    
    console.log('Multiplayer connection closed');
  }

  // Handle incoming messages
  onMessageReceived(event) {
    try {
      const message = JSON.parse(event.data);
      const messageType = message.type;
      
      switch (messageType) {
        case 'auth_response':
          this.handleAuthResponse(message);
          break;
        case 'player_joined':
          this.handlePlayerJoined(message);
          break;
        case 'player_left':
          this.handlePlayerLeft(message);
          break;
        case 'player_update':
          this.handlePlayerUpdate(message);
          break;
        case 'world_state_update':
          this.handleWorldStateUpdate(message);
          break;
        case 'chat_message':
          this.handleChatMessage(message);
          break;
        case 'quest_update':
          this.handleQuestUpdate(message);
          break;
        case 'event_trigger':
          this.handleEventTrigger(message);
          break;
        case 'combat_start':
          this.handleCombatStart(message);
          break;
        case 'combat_update':
          this.handleCombatUpdate(message);
          break;
        case 'error':
          this.handleError(message);
          break;
        default:
          console.warn('Unknown message type:', messageType);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  // Send authentication to server
  sendAuthentication() {
    const state = gameStateManager.getState();
    
    // Get player data
    this.playerId = state.player.id;
    this.playerName = state.player.name;
    
    // Send auth message
    this.sendMessage({
      type: 'authenticate',
      playerId: this.playerId,
      playerName: this.playerName,
      worldId: this.worldId || 'default_world',
      role: state.player.role,
      level: state.player.level
    });
  }

  // Handle authentication response
  handleAuthResponse(message) {
    if (message.success) {
      console.log('Authentication successful');
      
      // Store assigned world ID
      if (message.worldId) {
        this.worldId = message.worldId;
      }
      
      // Update UI to show multiplayer status
      this.updateMultiplayerUI(true);
    } else {
      console.error('Authentication failed:', message.reason);
      
      // Update UI to show connection failure
      this.updateMultiplayerUI(false);
    }
  }

  // Send player state to server
  sendPlayerState() {
    const state = gameStateManager.getState();
    
    this.sendMessage({
      type: 'player_state',
      playerId: this.playerId,
      position: {
        x: state.player.position?.x || 0,
        y: state.player.position?.y || 0,
        region: state.player.location
      },
      health: state.player.health,
      maxHealth: state.player.maxHealth,
      level: state.player.level,
      role: state.player.role,
      status: state.player.status || 'online'
    });
  }

  // Handle player joined
  handlePlayerJoined(message) {
    const playerData = message.player;
    
    // Store player data
    this.players.set(playerData.playerId, playerData);
    
    // Add to chat
    this.addChatMessage({
      sender: 'System',
      message: `${playerData.playerName} joined the world`,
      type: 'system'
    });
    
    console.log(`${playerData.playerName} joined the world`);
  }

  // Handle player left
  handlePlayerLeft(message) {
    const playerId = message.playerId;
    const playerData = this.players.get(playerId);
    
    if (playerData) {
      // Remove player
      this.players.delete(playerId);
      
      // Add to chat
      this.addChatMessage({
        sender: 'System',
        message: `${playerData.playerName} left the world`,
        type: 'system'
      });
      
      console.log(`${playerData.playerName} left the world`);
    }
  }

  // Handle player update
  handlePlayerUpdate(message) {
    const playerData = message.player;
    
    // Update player data
    this.players.set(playerData.playerId, playerData);
    
    // Update UI to show player positions
    this.updatePlayerPositions();
  }

  // Handle world state update
  handleWorldStateUpdate(message) {
    // Update shared world state
    this.worldState = { ...this.worldState, ...message.worldState };
    
    // Update game state if needed
    this.updateLocalGameState();
  }

  // Handle chat message
  handleChatMessage(message) {
    // Add to chat history
    this.addChatMessage({
      sender: message.sender,
      message: message.message,
      type: message.type || 'chat'
    });
    
    // Play chat notification sound
    this.playChatNotification();
  }

  // Handle quest update
  handleQuestUpdate(message) {
    // Update quest state in game
    this.updateQuestState(message.quest);
    
    // Notify player if it's their quest
    if (message.quest.playerId === this.playerId) {
      this.showQuestNotification(message.quest);
    }
  }

  // Handle event trigger
  handleEventTrigger(message) {
    // Trigger shared world event
    this.triggerSharedEvent(message.event);
  }

  // Handle combat start
  handleCombatStart(message) {
    // Start multiplayer combat
    this.startMultiplayerCombat(message.combat);
  }

  // Handle combat update
  handleCombatUpdate(message) {
    // Update combat state
    this.updateCombatState(message.combat);
  }

  // Handle error
  handleError(message) {
    console.error('Server error:', message.error);
    
    // Show error to user
    this.showErrorNotification(message.error);
  }

  // Send message to server
  sendMessage(message) {
    if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
        return { success: true, message: 'Message sent' };
      } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, message: 'Failed to send message: ' + error.message };
      }
    } else {
      console.warn('Not connected to server');
      return { success: false, message: 'Not connected to server' };
    }
  }

  // Sync game state with server
  syncGameState() {
    if (!this.isConnected) return;
    
    // Send current player state
    this.sendPlayerState();
    
    // Send any pending actions
    this.sendPendingActions();
  }

  // Send pending actions
  sendPendingActions() {
    // In a real implementation, this would send queued player actions
    // For now, we'll just log that it's called
    console.log('Checking for pending actions to send');
  }

  // Send chat message
  sendChatMessage(message) {
    if (!this.isConnected) {
      console.warn('Not connected to server');
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send chat message
    this.sendMessage({
      type: 'chat_message',
      sender: this.playerName,
      playerId: this.playerId,
      message: message
    });
    
    return { success: true, message: 'Chat message sent' };
  }

  // Add chat message to history
  addChatMessage(chatMessage) {
    // Add timestamp
    chatMessage.timestamp = Date.now();
    
    // Add to history
    this.chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }
    
    // Update chat UI
    this.updateChatUI(chatMessage);
  }

  // Update multiplayer UI
  updateMultiplayerUI(connected) {
    // In a real implementation, this would update the game UI
    // to show connection status, player list, etc.
    console.log(`Multiplayer UI updated: ${connected ? 'Connected' : 'Disconnected'}`);
  }

  // Update player positions on map
  updatePlayerPositions() {
    // In a real implementation, this would update player markers
    // on the world map UI
    console.log('Player positions updated');
  }

  // Update local game state from shared state
  updateLocalGameState() {
    // In a real implementation, this would update local game state
    // based on shared world state
    console.log('Local game state updated from shared state');
  }

  // Update quest state
  updateQuestState(quest) {
    // In a real implementation, this would update the quest state
    // in the local game state
    console.log('Quest state updated:', quest.id);
  }

  // Show quest notification
  showQuestNotification(quest) {
    // In a real implementation, this would show a notification
    // to the player about quest updates
    console.log('Quest notification shown:', quest.id);
  }

  // Trigger shared world event
  triggerSharedEvent(event) {
    // In a real implementation, this would trigger a shared world event
    // that affects all players in the world
    console.log('Shared event triggered:', event.id);
  }

  // Start multiplayer combat
  startMultiplayerCombat(combat) {
    // In a real implementation, this would start a multiplayer combat
    // session that involves multiple players
    console.log('Multiplayer combat started:', combat.id);
  }

  // Update combat state
  updateCombatState(combat) {
    // In a real implementation, this would update the combat state
    // for all participants
    console.log('Combat state updated:', combat.id);
  }

  // Show error notification
  showErrorNotification(error) {
    // In a real implementation, this would show an error notification
    // to the player
    console.error('Error notification shown:', error);
  }

  // Play chat notification sound
  playChatNotification() {
    // In a real implementation, this would play a sound
    // when a new chat message arrives
    console.log('Chat notification sound played');
  }

  // Update chat UI
  updateChatUI(chatMessage) {
    // In a real implementation, this would update the chat UI
    // with the new message
    console.log('Chat UI updated with new message');
  }

  // Get connected players
  getConnectedPlayers() {
    return Array.from(this.players.values());
  }

  // Get chat history
  getChatHistory() {
    return [...this.chatMessages];
  }

  // Invite player to group
  invitePlayerToGroup(playerId) {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send group invite
    this.sendMessage({
      type: 'group_invite',
      inviterId: this.playerId,
      inviteeId: playerId
    });
    
    return { success: true, message: 'Group invite sent' };
  }

  // Accept group invite
  acceptGroupInvite(inviteId) {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send acceptance
    this.sendMessage({
      type: 'group_invite_accept',
      inviteId: inviteId,
      playerId: this.playerId
    });
    
    return { success: true, message: 'Group invite accepted' };
  }

  // Leave current group
  leaveGroup() {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send leave group message
    this.sendMessage({
      type: 'group_leave',
      playerId: this.playerId
    });
    
    return { success: true, message: 'Left group' };
  }

  // Start cooperative quest
  startCooperativeQuest(questId) {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send quest start message
    this.sendMessage({
      type: 'coop_quest_start',
      questId: questId,
      leaderId: this.playerId
    });
    
    return { success: true, message: 'Cooperative quest started' };
  }

  // Join cooperative quest
  joinCooperativeQuest(questId) {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send quest join message
    this.sendMessage({
      type: 'coop_quest_join',
      questId: questId,
      playerId: this.playerId
    });
    
    return { success: true, message: 'Joined cooperative quest' };
  }

  // Send combat action
  sendCombatAction(action) {
    if (!this.isConnected) {
      return { success: false, message: 'Not connected to server' };
    }
    
    // Send combat action
    this.sendMessage({
      type: 'combat_action',
      action: action,
      playerId: this.playerId
    });
    
    return { success: true, message: 'Combat action sent' };
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    
    // Clear sync interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Clear player data
    this.players.clear();
    this.chatMessages = [];
    
    // Update UI
    this.updateMultiplayerUI(false);
    
    console.log('Disconnected from multiplayer server');
    return { success: true, message: 'Disconnected from server' };
  }

  // Cleanup resources
  cleanup() {
    try {
      // Disconnect from server
      this.disconnect();
      
      // Clear references
      this.socket = null;
      this.players.clear();
      this.chatMessages = [];
      
      console.log('Multiplayer system cleaned up');
      return { success: true, message: 'Multiplayer system cleaned up' };
    } catch (error) {
      console.error('Failed to cleanup multiplayer system:', error);
      return { success: false, message: 'Failed to cleanup multiplayer system: ' + error.message };
    }
  }
}

// Export a singleton instance
export const multiplayerSystem = new MultiplayerSystem();

// Export the class for potential extension
export default MultiplayerSystem;