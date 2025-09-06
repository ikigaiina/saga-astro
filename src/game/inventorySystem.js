// src/game/inventorySystem.js
// Inventory system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { TRADABLE_ITEMS_DATA, ITEM_EFFECTS_DATA } from '../data/items.js';
import { questSystem } from './questSystem.js';

class InventorySystem {
  constructor() {
    this.equipmentSlots = [
      'weapon',
      'armor',
      'helmet',
      'boots',
      'ring1',
      'ring2',
      'amulet'
    ];
  }

  // Add item to inventory
  addItem(itemId, quantity = 1) {
    const itemData = TRADABLE_ITEMS_DATA[itemId];
    if (!itemData) {
      return { success: false, message: 'Item tidak ditemukan' };
    }

    // Create item instance
    const item = {
      ...itemData,
      id: itemId,
      quantity: quantity,
      instanceId: this.generateInstanceId()
    };

    // Add to inventory
    gameStateManager.addToInventory(item);

    // Notify quest system of item collection
    questSystem.trackQuestProgress('item_collected', { itemId, quantity });

    return {
      success: true,
      message: `Menambahkan ${quantity} ${item.name} ke inventaris`,
      item: item
    };
  }

  // Remove item from inventory
  removeItem(instanceId, quantity = 1) {
    gameStateManager.removeFromInventory(instanceId, quantity);

    return {
      success: true,
      message: `Menghapus ${quantity} item dari inventaris`
    };
  }

  // Use consumable item
  useItem(instanceId) {
    const state = gameStateManager.getState();
    const itemInstance = state.player.inventory.find(item => item.instanceId === instanceId);
    
    if (!itemInstance) {
      return { success: false, message: 'Item tidak ditemukan di inventaris' };
    }
    
    if (itemInstance.type !== 'consumable') {
      return { success: false, message: 'Item ini tidak dapat digunakan' };
    }
    
    // Apply item effect
    const result = this.applyItemEffect(itemInstance);
    
    // Remove item from inventory (consumed)
    this.removeItem(instanceId, 1);
    
    return {
      success: true,
      message: `Menggunakan ${itemInstance.name}: ${result.message}`,
      effect: result
    };
  }

  // Apply item effect
  applyItemEffect(item) {
    const effectId = item.itemEffectId;
    const effectData = ITEM_EFFECTS_DATA[effectId];
    
    if (!effectData) {
      return { success: false, message: 'Efek item tidak ditemukan' };
    }
    
    const state = gameStateManager.getState();
    let result = { success: true, message: '' };
    
    switch (effectData.type) {
      case 'healing':
        const healAmount = effectData.impact_rules.health_recovery_amount || item.healingAmount || 0;
        const newHealth = Math.min(state.player.maxHealth, state.player.health + healAmount);
        const actualHeal = newHealth - state.player.health;
        
        gameStateManager.updatePlayer({ health: newHealth });
        
        result.message = `Memulihkan ${actualHeal} kesehatan`;
        break;
        
      case 'lore_unlock':
        // In a full implementation, this would unlock lore in the codex
        result.message = 'Memperoleh fragmen pengetahuan kuno';
        break;
        
      case 'damage':
        // This would be for consumable damage items like bombs
        const damage = effectData.impact_rules.damage_range ? 
          Math.floor(Math.random() * (effectData.impact_rules.damage_range.max - effectData.impact_rules.damage_range.min + 1)) + 
          effectData.impact_rules.damage_range.min : 0;
        result.message = `Menyebabkan ${damage} kerusakan`;
        break;
        
      default:
        result.message = 'Item digunakan';
    }
    
    return result;
  }

  // Equip item
  equipItem(instanceId) {
    const state = gameStateManager.getState();
    const itemInstance = state.player.inventory.find(item => item.instanceId === instanceId);
    
    if (!itemInstance) {
      return { success: false, message: 'Item tidak ditemukan di inventaris' };
    }
    
    // Check if item can be equipped
    if (!this.canEquipItem(itemInstance, state.player)) {
      return { success: false, message: 'Anda tidak dapat memakai item ini' };
    }
    
    // Determine equipment slot
    const slot = this.getEquipmentSlot(itemInstance);
    if (!slot) {
      return { success: false, message: 'Item ini tidak dapat dipakai' };
    }
    
    // Unequip current item in slot if exists
    if (state.player.equipment[slot]) {
      this.unequipItem(slot);
    }
    
    // Move item from inventory to equipment
    const updatedEquipment = { ...state.player.equipment };
    updatedEquipment[slot] = itemInstance;
    
    gameStateManager.updatePlayer({ equipment: updatedEquipment });
    
    // Remove item from inventory
    this.removeItem(instanceId, 1);
    
    return {
      success: true,
      message: `Memakai ${itemInstance.name}`,
      slot: slot
    };
  }

  // Unequip item
  unequipItem(slot) {
    const state = gameStateManager.getState();
    
    if (!state.player.equipment[slot]) {
      return { success: false, message: 'Tidak ada item yang dipakai di slot ini' };
    }
    
    const item = state.player.equipment[slot];
    
    // Move item from equipment to inventory
    const updatedEquipment = { ...state.player.equipment };
    delete updatedEquipment[slot];
    
    gameStateManager.updatePlayer({ equipment: updatedEquipment });
    
    // Add item back to inventory
    gameStateManager.addToInventory(item);
    
    return {
      success: true,
      message: `Melepas ${item.name}`,
      item: item
    };
  }

  // Check if item can be equipped
  canEquipItem(item, player) {
    // Check if item is equipment type
    if (!['weapon', 'armor', 'helmet', 'boots', 'ring', 'amulet'].includes(item.type)) {
      return false;
    }
    
    // Check attribute requirements
    if (item.attributeRequirements) {
      for (const attr in item.attributeRequirements) {
        if (player.attributes[attr] < item.attributeRequirements[attr]) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Get equipment slot for item
  getEquipmentSlot(item) {
    switch (item.type) {
      case 'weapon':
        return 'weapon';
      case 'armor':
        return 'armor';
      case 'helmet':
        return 'helmet';
      case 'boots':
        return 'boots';
      case 'ring':
        // Alternate between ring slots
        const state = gameStateManager.getState();
        return state.player.equipment.ring1 ? 'ring2' : 'ring1';
      case 'amulet':
        return 'amulet';
      default:
        return null;
    }
  }

  // Get player stats with equipment bonuses
  getPlayerStatsWithEquipment() {
    const state = gameStateManager.getState();
    const baseStats = { ...state.player.attributes };
    const equipment = state.player.equipment;
    
    // Apply equipment bonuses
    for (const slot in equipment) {
      const item = equipment[slot];
      
      // Apply attribute modifiers if they exist
      if (item.attributeModifiers) {
        for (const attr in item.attributeModifiers) {
          baseStats[attr] = (baseStats[attr] || 0) + item.attributeModifiers[attr];
        }
      }
      
      // Apply defense rating for armor
      if (item.type === 'armor' && item.defenseRating) {
        baseStats.defense = (baseStats.defense || 0) + item.defenseRating;
      }
      
      // Apply damage for weapons
      if (item.type === 'weapon' && item.damage) {
        baseStats.damage = item.damage;
      }
    }
    
    return baseStats;
  }

  // Generate unique instance ID
  generateInstanceId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Get inventory items
  getInventoryItems() {
    const state = gameStateManager.getState();
    return state.player.inventory;
  }

  // Get equipped items
  getEquippedItems() {
    const state = gameStateManager.getState();
    return state.player.equipment;
  }

  // Get items by type
  getItemsByType(type) {
    const state = gameStateManager.getState();
    return state.player.inventory.filter(item => item.type === type);
  }

  // Get items by rarity
  getItemsByRarity(rarity) {
    const state = gameStateManager.getState();
    return state.player.inventory.filter(item => item.rarity === rarity);
  }

  // Sell item
  sellItem(instanceId, quantity = 1) {
    const state = gameStateManager.getState();
    const itemInstance = state.player.inventory.find(item => item.instanceId === instanceId);
    
    if (!itemInstance) {
      return { success: false, message: 'Item tidak ditemukan di inventaris' };
    }
    
    if (itemInstance.quantity < quantity) {
      return { success: false, message: 'Jumlah item tidak mencukupi' };
    }
    
    // Calculate sell price (50% of item value)
    const sellPrice = Math.floor((itemInstance.value || 0) * 0.5 * quantity);
    
    // Remove item from inventory
    this.removeItem(instanceId, quantity);
    
    // Add essence to player
    gameStateManager.updatePlayer({ essence: state.player.essence + sellPrice });
    
    return {
      success: true,
      message: `Menjual ${quantity} ${itemInstance.name} seharga ${sellPrice} Essence`,
      essenceGained: sellPrice
    };
  }

  // Check if inventory is full
  isInventoryFull() {
    const state = gameStateManager.getState();
    // Simplified check - in a full implementation, this would consider inventory size limits
    return state.player.inventory.length > 100; // Arbitrary limit
  }

  // Get inventory space remaining
  getInventorySpaceRemaining() {
    const state = gameStateManager.getState();
    const maxInventorySize = 100; // Arbitrary limit
    return maxInventorySize - state.player.inventory.length;
  }
}

// Export a singleton instance
export const inventorySystem = new InventorySystem();

// Export the class for potential extension
export default InventorySystem;