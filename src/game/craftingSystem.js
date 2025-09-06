// src/game/craftingSystem.js
// Crafting system for The Soulforge Saga

import { gameStateManager } from './stateManager.js';
import { TRADABLE_ITEMS_DATA } from '../data/items.js';
import { inventorySystem } from './inventorySystem.js';

class CraftingSystem {
  constructor() {
    this.recipes = this.initializeRecipes();
  }

  // Initialize crafting recipes
  initializeRecipes() {
    return {
      'craft_iron_sword': {
        id: 'craft_iron_sword',
        name: 'Tempa Pedang Besi',
        description: 'Tempa pedang besi yang kokoh dari batang besi dan kayu.',
        requiredSkills: [],
        requiredLevel: 1,
        ingredients: [
          { itemId: 'iron_ingot', quantity: 2 },
          { itemId: 'wood', quantity: 1 }
        ],
        output: {
          itemId: 'steel_sword',
          quantity: 1
        },
        timeRequired: 30, // minutes
        toolRequired: null,
        experience: 25
      },
      'craft_leather_vest': {
        id: 'craft_leather_vest',
        name: 'Buat Rompi Kulit',
        description: 'Buat rompi kulit pelindung dari kulit hewan.',
        requiredSkills: [],
        requiredLevel: 1,
        ingredients: [
          { itemId: 'rabbit_pelt', quantity: 4 }
        ],
        output: {
          itemId: 'leather_vest',
          quantity: 1
        },
        timeRequired: 20, // minutes
        toolRequired: null,
        experience: 15
      },
      'craft_healing_potion': {
        id: 'craft_healing_potion',
        name: 'Buat Ramuan Penyembuh',
        description: 'Campur herbal penyembuh dengan air murni untuk membuat ramuan.',
        requiredSkills: [],
        requiredLevel: 1,
        ingredients: [
          { itemId: 'healing_herbs', quantity: 2 },
          { itemId: 'pure_water', quantity: 1 }
        ],
        output: {
          itemId: 'healing_potion',
          quantity: 1
        },
        timeRequired: 10, // minutes
        toolRequired: null,
        experience: 10
      },
      'craft_bread': {
        id: 'craft_bread',
        name: 'Panggang Roti',
        description: 'Panggang roti dari gandum dan air.',
        requiredSkills: [],
        requiredLevel: 1,
        ingredients: [
          { itemId: 'wheat', quantity: 3 },
          { itemId: 'pure_water', quantity: 1 }
        ],
        output: {
          itemId: 'bread',
          quantity: 2
        },
        timeRequired: 15, // minutes
        toolRequired: 'oven',
        experience: 5
      }
    };
  }

  // Get available recipes for player
  getAvailableRecipes() {
    const state = gameStateManager.getState();
    const player = state.player;
    
    const availableRecipes = [];
    
    for (const recipeId in this.recipes) {
      const recipe = this.recipes[recipeId];
      
      // Check if player meets requirements
      if (this.checkRecipeRequirements(recipe, player)) {
        availableRecipes.push({
          ...recipe,
          id: recipeId,
          canCraft: this.canCraftRecipe(recipe)
        });
      }
    }
    
    return availableRecipes;
  }

  // Check if player meets recipe requirements
  checkRecipeRequirements(recipe, player) {
    // Check required level
    if (player.level < recipe.requiredLevel) {
      return false;
    }
    
    // Check required skills
    if (recipe.requiredSkills && recipe.requiredSkills.length > 0) {
      for (const skillReq of recipe.requiredSkills) {
        const skill = player.skills[skillReq.skillId];
        if (!skill || skill.level < skillReq.level) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Check if player can craft a specific recipe (has ingredients)
  canCraftRecipe(recipe) {
    const state = gameStateManager.getState();
    const inventory = state.player.inventory;
    
    // Check if player has all required ingredients
    for (const ingredient of recipe.ingredients) {
      const itemInInventory = inventory.find(item => item.id === ingredient.itemId);
      if (!itemInInventory || itemInInventory.quantity < ingredient.quantity) {
        return false;
      }
    }
    
    // Check if tool is required and available
    if (recipe.toolRequired) {
      // In a full implementation, this would check for specific tools
      // For now, we'll assume tools are available if required
    }
    
    return true;
  }

  // Craft an item
  craftItem(recipeId) {
    const recipe = this.recipes[recipeId];
    if (!recipe) {
      return { success: false, message: 'Resep tidak ditemukan' };
    }
    
    const state = gameStateManager.getState();
    const player = state.player;
    
    // Check if player meets requirements
    if (!this.checkRecipeRequirements(recipe, player)) {
      return { success: false, message: 'Anda tidak memenuhi syarat untuk resep ini' };
    }
    
    // Check if player can craft (has ingredients)
    if (!this.canCraftRecipe(recipe)) {
      return { success: false, message: 'Anda tidak memiliki bahan yang cukup' };
    }
    
    // Consume ingredients
    for (const ingredient of recipe.ingredients) {
      const itemInInventory = player.inventory.find(item => item.id === ingredient.itemId);
      if (itemInInventory) {
        inventorySystem.removeItem(itemInInventory.instanceId, ingredient.quantity);
      }
    }
    
    // Create output item
    const outputItem = TRADABLE_ITEMS_DATA[recipe.output.itemId];
    if (!outputItem) {
      return { success: false, message: 'Item hasil tidak ditemukan' };
    }
    
    // Add crafted item to inventory
    const craftedItems = [];
    for (let i = 0; i < recipe.output.quantity; i++) {
      inventorySystem.addItem(recipe.output.itemId, 1);
      craftedItems.push({ ...outputItem });
    }
    
    // Award crafting experience
    if (recipe.experience) {
      // In a full implementation, this would be crafting skill experience
      gameStateManager.addPlayerExperience(recipe.experience);
    }
    
    // Advance time
    gameStateManager.advanceTime(recipe.timeRequired);
    
    return {
      success: true,
      message: `Berhasil membuat ${recipe.output.quantity} ${outputItem.name}!`,
      items: craftedItems,
      experience: recipe.experience
    };
  }

  // Get recipe by ID
  getRecipe(recipeId) {
    return this.recipes[recipeId] || null;
  }

  // Get recipes by category
  getRecipesByCategory(category) {
    const recipes = [];
    
    for (const recipeId in this.recipes) {
      const recipe = this.recipes[recipeId];
      const outputItem = TRADABLE_ITEMS_DATA[recipe.output.itemId];
      
      if (outputItem && outputItem.type === category) {
        recipes.push({
          ...recipe,
          id: recipeId
        });
      }
    }
    
    return recipes;
  }

  // Get recipes that use a specific ingredient
  getRecipesUsingIngredient(ingredientId) {
    const recipes = [];
    
    for (const recipeId in this.recipes) {
      const recipe = this.recipes[recipeId];
      
      if (recipe.ingredients.some(ing => ing.itemId === ingredientId)) {
        recipes.push({
          ...recipe,
          id: recipeId
        });
      }
    }
    
    return recipes;
  }

  // Add a new recipe (for Forger crafting)
  addRecipe(recipe) {
    if (!recipe.id) {
      recipe.id = `recipe_${Date.now()}`;
    }
    
    this.recipes[recipe.id] = recipe;
    
    return {
      success: true,
      message: 'Resep berhasil ditambahkan',
      recipeId: recipe.id
    };
  }

  // Remove a recipe
  removeRecipe(recipeId) {
    if (this.recipes[recipeId]) {
      delete this.recipes[recipeId];
      
      return {
        success: true,
        message: 'Resep berhasil dihapus'
      };
    }
    
    return {
      success: false,
      message: 'Resep tidak ditemukan'
    };
  }

  // Get all recipes
  getAllRecipes() {
    return this.recipes;
  }

  // Calculate crafting time with skill modifiers
  calculateCraftingTime(recipe) {
    const state = gameStateManager.getState();
    let time = recipe.timeRequired;
    
    // Apply skill modifiers if player has relevant skills
    if (state.player.skills.primordial_crafting && state.player.skills.primordial_crafting.level > 0) {
      const skillLevel = state.player.skills.primordial_crafting.level;
      const modifier = 1.0 - (skillLevel * 0.05); // 5% faster per skill level
      time = Math.max(1, Math.floor(time * modifier));
    }
    
    return time;
  }

  // Calculate quality of crafted item based on skills
  calculateItemQuality(recipe) {
    const state = gameStateManager.getState();
    let quality = 'normal'; // 'normal', 'fine', 'excellent', 'legendary'
    let qualityModifier = 1.0;
    
    // Apply skill modifiers
    if (state.player.skills.primordial_crafting && state.player.skills.primordial_crafting.level > 0) {
      const skillLevel = state.player.skills.primordial_crafting.level;
      
      // Chance for higher quality based on skill
      if (skillLevel >= 10) {
        if (Math.random() < 0.1) {
          quality = 'legendary';
          qualityModifier = 1.5;
        } else if (Math.random() < 0.2) {
          quality = 'excellent';
          qualityModifier = 1.3;
        } else if (Math.random() < 0.3) {
          quality = 'fine';
          qualityModifier = 1.1;
        }
      } else if (skillLevel >= 5) {
        if (Math.random() < 0.1) {
          quality = 'excellent';
          qualityModifier = 1.3;
        } else if (Math.random() < 0.2) {
          quality = 'fine';
          qualityModifier = 1.1;
        }
      } else if (skillLevel >= 1) {
        if (Math.random() < 0.1) {
          quality = 'fine';
          qualityModifier = 1.1;
        }
      }
    }
    
    return {
      quality: quality,
      modifier: qualityModifier
    };
  }
}

// Export a singleton instance
export const craftingSystem = new CraftingSystem();

// Export the class for potential extension
export default CraftingSystem;