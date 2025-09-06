// src/game/questSystem.js
// Quest system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { QUEST_TEMPLATES, QUEST_CHAINS } from '../data/quests.js';
import { SKILL_TREE_DATA } from '../data/skills.js';

class QuestSystem {
  constructor() {
    this.activeQuests = new Map(); // Map of active quests by player ID
    this.completedQuests = new Map(); // Map of completed quests by player ID
  }

  // Get available quests for player
  getAvailableQuests() {
    const state = gameStateManager.getState();
    const player = state.player;
    
    const availableQuests = [];
    
    // Check each quest template
    for (const questId in QUEST_TEMPLATES) {
      const questTemplate = QUEST_TEMPLATES[questId];
      
      // Skip if player already has or completed this quest
      if (this.hasQuest(questId) || this.isQuestCompleted(questId)) {
        continue;
      }
      
      // Check prerequisites
      if (this.checkPrerequisites(questTemplate.prerequisites, player)) {
        availableQuests.push({
          ...questTemplate,
          id: questId
        });
      }
    }
    
    return availableQuests;
  }

  // Check if player meets prerequisites
  checkPrerequisites(prerequisites, player) {
    if (!prerequisites || prerequisites.length === 0) {
      return true;
    }
    
    for (const prereq of prerequisites) {
      // Check skill prerequisite
      if (prereq.skill) {
        const skill = player.skills[prereq.skill];
        if (!skill || skill.level < prereq.level) {
          return false;
        }
      }
      
      // Check role prerequisite
      if (prereq.role && player.role !== prereq.role) {
        return false;
      }
      
      // Check completed quest prerequisite
      if (prereq.quest && !this.isQuestCompleted(prereq.quest)) {
        return false;
      }
    }
    
    return true;
  }

  // Accept a quest
  acceptQuest(questId) {
    const state = gameStateManager.getState();
    const player = state.player;
    
    // Check if quest exists
    const questTemplate = QUEST_TEMPLATES[questId];
    if (!questTemplate) {
      return { success: false, message: 'Misi tidak ditemukan' };
    }
    
    // Check if player already has this quest
    if (this.hasQuest(questId)) {
      return { success: false, message: 'Anda sudah menerima misi ini' };
    }
    
    // Check if quest is already completed
    if (this.isQuestCompleted(questId)) {
      return { success: false, message: 'Anda sudah menyelesaikan misi ini' };
    }
    
    // Check prerequisites
    if (!this.checkPrerequisites(questTemplate.prerequisites, player)) {
      return { success: false, message: 'Anda tidak memenuhi syarat untuk misi ini' };
    }
    
    // Create quest instance
    const questInstance = {
      ...questTemplate,
      id: questId,
      acceptedTime: Date.now(),
      status: 'active',
      objectives: questTemplate.objectives.map(obj => ({
        ...obj,
        currentQuantity: obj.currentQuantity || 0,
        completed: obj.completed || false
      }))
    };
    
    // Add to player's active quests
    gameStateManager.addQuest(questInstance);
    
    // Add to journal
    gameStateManager.addJournalEntry({
      title: `Misi Diterima: ${questTemplate.name}`,
      content: questTemplate.description,
      category: 'Quest',
      icon: 'clipboard-list'
    });
    
    return {
      success: true,
      message: `Anda menerima misi: ${questTemplate.name}`,
      quest: questInstance
    };
  }

  // Check if player has a specific quest
  hasQuest(questId) {
    const state = gameStateManager.getState();
    return state.player.quests.some(quest => quest.id === questId && quest.status === 'active');
  }

  // Check if player has completed a specific quest
  isQuestCompleted(questId) {
    const state = gameStateManager.getState();
    return state.player.quests.some(quest => quest.id === questId && quest.status === 'completed');
  }

  // Update quest objective
  updateQuestObjective(questId, objectiveId, progress) {
    const state = gameStateManager.getState();
    const quest = state.player.quests.find(q => q.id === questId && q.status === 'active');
    
    if (!quest) {
      return { success: false, message: 'Misi tidak ditemukan' };
    }
    
    const objective = quest.objectives.find(obj => obj.id === objectiveId);
    if (!objective) {
      return { success: false, message: 'Objektif misi tidak ditemukan' };
    }
    
    // Update progress
    if (objective.type === 'gather_item') {
      objective.currentQuantity = (objective.currentQuantity || 0) + progress;
      if (objective.currentQuantity >= objective.requiredQuantity) {
        objective.completed = true;
      }
    } else if (objective.type === 'defeat_enemy') {
      objective.currentQuantity = (objective.currentQuantity || 0) + progress;
      if (objective.currentQuantity >= objective.requiredQuantity) {
        objective.completed = true;
      }
    } else {
      // For other objective types, mark as completed
      objective.completed = true;
    }
    
    // Check if all objectives are completed
    const allCompleted = quest.objectives.every(obj => obj.completed);
    if (allCompleted) {
      return this.completeQuest(questId);
    }
    
    // Update quest in state
    gameStateManager.updateQuestStatus(questId, 'active');
    
    return {
      success: true,
      message: `Kemajuan misi diperbarui`,
      objective: objective,
      allCompleted: allCompleted
    };
  }

  // Complete a quest
  completeQuest(questId) {
    const state = gameStateManager.getState();
    const quest = state.player.quests.find(q => q.id === questId && q.status === 'active');
    
    if (!quest) {
      return { success: false, message: 'Misi tidak ditemukan' };
    }
    
    // Check if all objectives are completed
    const allCompleted = quest.objectives.every(obj => obj.completed);
    if (!allCompleted) {
      return { success: false, message: 'Belum semua objektif misi selesai' };
    }
    
    // Update quest status
    gameStateManager.updateQuestStatus(questId, 'completed');
    
    // Award rewards
    const rewards = this.awardQuestRewards(quest.rewards);
    
    // Add to journal
    gameStateManager.addJournalEntry({
      title: `Misi Selesai: ${quest.name}`,
      content: `Anda berhasil menyelesaikan misi "${quest.name}"`,
      category: 'Quest',
      icon: 'check-square'
    });
    
    // Add achievement if it's a significant quest
    if (quest.type === 'lore' || quest.type === 'forger') {
      gameStateManager.addAchievement({
        id: `quest_${questId}_completed`,
        name: 'Penjelajah Misi',
        description: `Menyelesaikan misi: ${quest.name}`,
        rarity: 'uncommon'
      });
    }
    
    return {
      success: true,
      message: `Misi "${quest.name}" selesai!`,
      rewards: rewards
    };
  }

  // Award quest rewards
  awardQuestRewards(rewards) {
    const state = gameStateManager.getState();
    const awardedRewards = [];
    
    // Award experience
    if (rewards.experience) {
      gameStateManager.addPlayerExperience(rewards.experience);
      awardedRewards.push({ type: 'experience', amount: rewards.experience });
    }
    
    // Award essence
    if (rewards.essence) {
      gameStateManager.updatePlayer({ essence: state.player.essence + rewards.essence });
      awardedRewards.push({ type: 'essence', amount: rewards.essence });
    }
    
    // Award items
    if (rewards.items) {
      rewards.items.forEach(item => {
        gameStateManager.addToInventory(item);
        awardedRewards.push({ type: 'item', item: item });
      });
    }
    
    // Award skill experience
    if (rewards.skillExperience) {
      for (const skillId in rewards.skillExperience) {
        gameStateManager.addSkillExperience(skillId, rewards.skillExperience[skillId]);
        awardedRewards.push({ 
          type: 'skill_experience', 
          skill: skillId, 
          amount: rewards.skillExperience[skillId] 
        });
      }
    }
    
    // Award Forger essence
    if (rewards.forgerEssence && state.player.role === 'forger') {
      const newEssence = (state.forger.essence || 0) + rewards.forgerEssence;
      gameStateManager.updateWorld({ forger: { ...state.forger, essence: newEssence } });
      awardedRewards.push({ type: 'forger_essence', amount: rewards.forgerEssence });
    }
    
    return awardedRewards;
  }

  // Fail a quest
  failQuest(questId) {
    const state = gameStateManager.getState();
    const quest = state.player.quests.find(q => q.id === questId && q.status === 'active');
    
    if (!quest) {
      return { success: false, message: 'Misi tidak ditemukan' };
    }
    
    // Update quest status
    gameStateManager.updateQuestStatus(questId, 'failed');
    
    // Add to journal
    gameStateManager.addJournalEntry({
      title: `Misi Gagal: ${quest.name}`,
      content: `Anda gagal menyelesaikan misi "${quest.name}"`,
      category: 'Quest',
      icon: 'x-circle'
    });
    
    return {
      success: true,
      message: `Misi "${quest.name}" gagal!`
    };
  }

  // Get active quests
  getActiveQuests() {
    const state = gameStateManager.getState();
    return state.player.quests.filter(quest => quest.status === 'active');
  }

  // Get completed quests
  getCompletedQuests() {
    const state = gameStateManager.getState();
    return state.player.quests.filter(quest => quest.status === 'completed');
  }

  // Get quest chains
  getQuestChains() {
    return QUEST_CHAINS;
  }

  // Start a quest chain
  startQuestChain(chainId) {
    const chain = QUEST_CHAINS[chainId];
    if (!chain) {
      return { success: false, message: 'Rantai misi tidak ditemukan' };
    }
    
    // For now, just accept the first quest in the chain
    if (chain.quests && chain.quests.length > 0) {
      return this.acceptQuest(chain.quests[0]);
    }
    
    return { success: false, message: 'Rantai misi kosong' };
  }

  // Track quest progress
  trackQuestProgress(eventType, eventData) {
    const state = gameStateManager.getState();
    const activeQuests = this.getActiveQuests();
    
    // Check each active quest for matching objectives
    activeQuests.forEach(quest => {
      quest.objectives.forEach(objective => {
        let progress = 0;
        
        switch (objective.type) {
          case 'gather_item':
            if (eventType === 'item_collected' && eventData.itemId === objective.targetItem) {
              progress = eventData.quantity || 1;
            }
            break;
            
          case 'defeat_enemy':
            if (eventType === 'enemy_defeated' && eventData.enemyType === objective.targetCreature) {
              progress = 1;
            }
            break;
            
          case 'visit_location':
            if (eventType === 'location_visited' && eventData.locationId === objective.targetRegion) {
              progress = 1;
            }
            break;
            
          case 'find_item':
            if (eventType === 'item_found' && eventData.itemId === objective.targetItem) {
              progress = 1;
            }
            break;
            
          case 'use_forger_tool':
            if (eventType === 'forger_tool_used' && eventData.toolId === objective.targetTool) {
              progress = 1;
            }
            break;
        }
        
        // Update objective if progress was made
        if (progress > 0) {
          this.updateQuestObjective(quest.id, objective.id, progress);
        }
      });
    });
  }
}

// Export a singleton instance
export const questSystem = new QuestSystem();

// Export the class for potential extension
export default QuestSystem;