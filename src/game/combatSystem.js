// src/game/combatSystem.js
// Combat system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { CREATURES_DATA } from '../data/npcs.js';
import { TRADABLE_ITEMS_DATA, GLOBAL_LOOT_TABLES } from '../data/items.js';

class CombatSystem {
  constructor() {
    this.activeCombats = new Map(); // Map of active combats by player ID
  }

  // Initialize a combat encounter
  startCombat(playerId, enemyType) {
    // Get player data
    const state = gameStateManager.getState();
    const player = state.player;
    
    // Create enemy based on type
    const enemy = this.createEnemy(enemyType);
    
    // Create combat instance
    const combatId = `${playerId}-${Date.now()}`;
    const combat = {
      id: combatId,
      playerId: playerId,
      player: {
        ...player,
        currentHealth: player.health,
        maxHealth: player.maxHealth,
        actions: this.getPlayerActions(player)
      },
      enemy: enemy,
      turn: 'player', // 'player' or 'enemy'
      log: [],
      status: 'active' // 'active', 'player_win', 'enemy_win', 'fled'
    };
    
    // Store combat
    this.activeCombats.set(combatId, combat);
    
    // Add to combat log
    this.addToCombatLog(combatId, `Pertempuran dimulai melawan ${enemy.name}!`);
    
    return combatId;
  }

  // Create an enemy based on type
  createEnemy(enemyType) {
    const baseCreature = CREATURES_DATA[enemyType];
    if (!baseCreature) {
      // Default to a basic creature if type not found
      return {
        id: 'generic_enemy',
        name: 'Musuh Misterius',
        type: 'generic',
        level: 1,
        health: 30,
        maxHealth: 30,
        strength: 8,
        dexterity: 8,
        defense: 2,
        damage: { min: 3, max: 6 },
        lootTable: 'loot_table_rabbit_pelt'
      };
    }
    
    // Calculate level based on player level (simplified)
    const state = gameStateManager.getState();
    const playerLevel = state.player.level;
    const enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
    
    // Scale stats based on level
    const levelScale = enemyLevel / baseCreature.baseAttributes.strength;
    
    return {
      id: enemyType,
      name: baseCreature.name,
      type: enemyType,
      level: enemyLevel,
      health: Math.floor(baseCreature.baseAttributes.constitution * levelScale * 5),
      maxHealth: Math.floor(baseCreature.baseAttributes.constitution * levelScale * 5),
      strength: Math.floor(baseCreature.baseAttributes.strength * levelScale),
      dexterity: Math.floor(baseCreature.baseAttributes.dexterity * levelScale),
      defense: Math.floor((baseCreature.baseAttributes.strength + baseCreature.baseAttributes.dexterity) * levelScale * 0.2),
      damage: { 
        min: Math.floor(baseCreature.baseAttributes.strength * levelScale * 0.3), 
        max: Math.floor(baseCreature.baseAttributes.strength * levelScale * 0.6) 
      },
      lootTable: this.getLootTableForEnemy(enemyType)
    };
  }

  // Get loot table for enemy type
  getLootTableForEnemy(enemyType) {
    // Simplified mapping - in a full implementation, this would be more complex
    switch (enemyType) {
      case 'dire_wolf':
        return 'loot_table_dire_wolf_pelt';
      case 'echo_wraith':
        return 'loot_table_echo_wraith';
      default:
        return 'loot_table_rabbit_pelt';
    }
  }

  // Get player actions based on equipment and skills
  getPlayerActions(player) {
    const actions = [
      { id: 'attack', name: 'Serang', type: 'damage' },
      { id: 'defend', name: 'Bertahan', type: 'defense' }
    ];

    // Add special actions based on equipment
    const weapon = player.equipment.weapon;
    if (weapon) {
      actions.push({ id: 'special_attack', name: 'Serangan Spesial', type: 'damage', power: 1.5 });
    }

    // Add actions based on skills
    if (player.skills.wilderness_survival && player.skills.wilderness_survival.level >= 3) {
      actions.push({ id: 'analyze_weakness', name: 'Analisis Kelemahan', type: 'buff' });
    }

    return actions;
  }

  // Player takes a turn
  playerTurn(combatId, actionId, target = 'enemy') {
    const combat = this.activeCombats.get(combatId);
    if (!combat || combat.turn !== 'player' || combat.status !== 'active') {
      return { success: false, message: 'Aksi tidak valid' };
    }

    const action = combat.player.actions.find(a => a.id === actionId);
    if (!action) {
      return { success: false, message: 'Aksi tidak ditemukan' };
    }

    let result = { success: true, message: '', effects: [] };

    switch (action.id) {
      case 'attack':
        result = this.performAttack(combat.player, combat.enemy);
        break;
      case 'defend':
        result = this.performDefend(combat.player);
        break;
      case 'special_attack':
        result = this.performSpecialAttack(combat.player, combat.enemy, action.power);
        break;
      case 'analyze_weakness':
        result = this.performAnalyzeWeakness(combat.enemy);
        break;
      default:
        result = { success: false, message: 'Aksi tidak dikenali' };
    }

    // Add to combat log
    this.addToCombatLog(combatId, `Pemain menggunakan ${action.name}: ${result.message}`);

    // Check if enemy is defeated
    if (combat.enemy.health <= 0) {
      combat.status = 'player_win';
      this.endCombat(combatId, 'player_win');
      return { success: true, message: result.message, combatEnded: true, victory: true };
    }

    // Switch turns
    combat.turn = 'enemy';

    // Process enemy turn after a short delay to simulate thinking
    setTimeout(() => {
      this.enemyTurn(combatId);
    }, 1000);

    return { success: true, message: result.message, combatEnded: false };
  }

  // Enemy takes a turn
  enemyTurn(combatId) {
    const combat = this.activeCombats.get(combatId);
    if (!combat || combat.turn !== 'enemy' || combat.status !== 'active') {
      return { success: false, message: 'Aksi tidak valid' };
    }

    // Simple AI: mostly attack, sometimes defend
    const enemyAction = Math.random() > 0.2 ? 'attack' : 'defend';
    let result = { success: true, message: '', effects: [] };

    switch (enemyAction) {
      case 'attack':
        result = this.performAttack(combat.enemy, combat.player);
        break;
      case 'defend':
        result = this.performDefend(combat.enemy);
        break;
    }

    // Add to combat log
    this.addToCombatLog(combatId, `${combat.enemy.name} menggunakan ${enemyAction === 'attack' ? 'Serang' : 'Bertahan'}: ${result.message}`);

    // Check if player is defeated
    if (combat.player.currentHealth <= 0) {
      combat.status = 'enemy_win';
      this.endCombat(combatId, 'enemy_win');
      return { success: true, message: result.message, combatEnded: true, victory: false };
    }

    // Switch turns
    combat.turn = 'player';

    return { success: true, message: result.message, combatEnded: false };
  }

  // Perform a basic attack
  performAttack(attacker, defender) {
    // Calculate damage
    const baseDamage = Math.floor(Math.random() * (attacker.damage.max - attacker.damage.min + 1)) + attacker.damage.min;
    const defense = defender.defense || 0;
    const damage = Math.max(1, baseDamage - defense); // Minimum 1 damage

    // Apply damage
    defender.health = Math.max(0, defender.health - damage);

    return {
      success: true,
      message: `${attacker.name} menyerang ${defender.name} untuk ${damage} kerusakan!`,
      damage: damage
    };
  }

  // Perform a defend action
  performDefend(defender) {
    // Increase defense for next turn
    if (!defender.defenseBoost) {
      defender.defenseBoost = 0;
    }
    defender.defenseBoost += 2;

    return {
      success: true,
      message: `${defender.name} memasuki posisi pertahanan, meningkatkan pertahanan!`
    };
  }

  // Perform a special attack
  performSpecialAttack(attacker, defender, power) {
    // Calculate enhanced damage
    const baseDamage = Math.floor(Math.random() * (attacker.damage.max - attacker.damage.min + 1)) + attacker.damage.min;
    const enhancedDamage = Math.floor(baseDamage * power);
    const defense = defender.defense || 0;
    const damage = Math.max(1, enhancedDamage - defense); // Minimum 1 damage

    // Apply damage
    defender.health = Math.max(0, defender.health - damage);

    return {
      success: true,
      message: `${attacker.name} melakukan serangan spesial terhadap ${defender.name} untuk ${damage} kerusakan!`,
      damage: damage
    };
  }

  // Analyze enemy weakness
  performAnalyzeWeakness(enemy) {
    // Reveal enemy stats
    return {
      success: true,
      message: `Menganalisis ${enemy.name}: Level ${enemy.level}, HP ${enemy.health}/${enemy.maxHealth}, Kekuatan ${enemy.strength}`,
      revealedStats: {
        level: enemy.level,
        health: enemy.health,
        maxHealth: enemy.maxHealth,
        strength: enemy.strength
      }
    };
  }

  // Add entry to combat log
  addToCombatLog(combatId, message) {
    const combat = this.activeCombats.get(combatId);
    if (combat) {
      combat.log.push({
        timestamp: Date.now(),
        message: message
      });
    }
  }

  // Player attempts to flee from combat
  fleeCombat(combatId) {
    const combat = this.activeCombats.get(combatId);
    if (!combat || combat.status !== 'active') {
      return { success: false, message: 'Tidak dapat melarikan diri' };
    }

    // 70% chance to flee successfully
    const fleeSuccess = Math.random() < 0.7;

    if (fleeSuccess) {
      combat.status = 'fled';
      this.endCombat(combatId, 'fled');
      return { success: true, message: 'Berhasil melarikan diri dari pertempuran!', fled: true };
    } else {
      // Failed to flee, enemy gets a free attack
      const result = this.performAttack(combat.enemy, combat.player);
      this.addToCombatLog(combatId, `${combat.enemy.name} menyerang saat pemain mencoba melarikan diri: ${result.message}`);
      
      // Check if player is defeated
      if (combat.player.currentHealth <= 0) {
        combat.status = 'enemy_win';
        this.endCombat(combatId, 'enemy_win');
        return { success: false, message: `Gagal melarikan diri! ${result.message}`, combatEnded: true, victory: false };
      }
      
      return { success: false, message: `Gagal melarikan diri! ${result.message}` };
    }
  }

  // End combat and process rewards
  endCombat(combatId, outcome) {
    const combat = this.activeCombats.get(combatId);
    if (!combat) return;

    const state = gameStateManager.getState();
    
    if (outcome === 'player_win') {
      // Add combat log entry
      this.addToCombatLog(combatId, `Pemain mengalahkan ${combat.enemy.name}!`);
      
      // Award experience
      const experienceGain = combat.enemy.level * 10;
      gameStateManager.addPlayerExperience(experienceGain);
      
      // Award essence
      const essenceGain = combat.enemy.level * 2;
      gameStateManager.updatePlayer({ essence: state.player.essence + essenceGain });
      
      // Generate loot
      const loot = this.generateLoot(combat.enemy.lootTable);
      loot.forEach(item => {
        gameStateManager.addToInventory(item);
      });
      
      // Add to combat log
      this.addToCombatLog(combatId, `Mendapatkan ${experienceGain} EXP dan ${essenceGain} Essence!`);
      if (loot.length > 0) {
        const lootDescription = loot.map(item => `${item.name} x${item.quantity}`).join(', ');
        this.addToCombatLog(combatId, `Mendapatkan loot: ${lootDescription}`);
      }
      
      // Check for skill experience gain
      if (state.player.skills.combat && state.player.skills.combat.level > 0) {
        gameStateManager.addSkillExperience('combat', experienceGain / 2);
      }
    } else if (outcome === 'enemy_win') {
      // Player defeated
      this.addToCombatLog(combatId, `${combat.enemy.name} mengalahkan pemain!`);
      
      // Apply damage to player
      const damage = Math.floor(state.player.maxHealth * 0.2); // Lose 20% health
      const newHealth = Math.max(1, state.player.health - damage); // Don't let player die completely
      gameStateManager.updatePlayer({ health: newHealth });
      
      this.addToCombatLog(combatId, `Menderita ${damage} kerusakan!`);
    } else if (outcome === 'fled') {
      this.addToCombatLog(combatId, 'Pemain melarikan diri dari pertempuran!');
    }

    // Remove combat from active combats
    this.activeCombats.delete(combatId);
  }

  // Generate loot from loot table
  generateLoot(lootTableId) {
    const lootTable = GLOBAL_LOOT_TABLES[lootTableId];
    if (!lootTable) return [];

    const loot = [];
    
    // Process each item in the loot table
    lootTable.items.forEach(itemEntry => {
      // Check if item drops based on chance
      if (Math.random() < itemEntry.chance) {
        // Determine quantity
        const quantity = Math.floor(Math.random() * (itemEntry.maxQuantity - itemEntry.minQuantity + 1)) + itemEntry.minQuantity;
        
        // Get item data
        const itemData = TRADABLE_ITEMS_DATA[itemEntry.itemId];
        if (itemData) {
          loot.push({
            ...itemData,
            quantity: quantity
          });
        }
      }
    });
    
    // Add currency
    if (lootTable.currency_range) {
      const currency = Math.floor(Math.random() * (lootTable.currency_range.max - lootTable.currency_range.min + 1)) + lootTable.currency_range.min;
      if (currency > 0) {
        loot.push({
          id: 'essence',
          name: 'Essence',
          type: 'currency',
          value: currency,
          rarity: 'common',
          quantity: currency
        });
      }
    }
    
    return loot;
  }

  // Get active combat for player
  getActiveCombat(playerId) {
    for (const [combatId, combat] of this.activeCombats.entries()) {
      if (combat.playerId === playerId && combat.status === 'active') {
        return combat;
      }
    }
    return null;
  }

  // Check if player is in combat
  isInCombat(playerId) {
    return this.getActiveCombat(playerId) !== null;
  }
}

// Export a singleton instance
export const combatSystem = new CombatSystem();

// Export the class for potential extension
export default CombatSystem;