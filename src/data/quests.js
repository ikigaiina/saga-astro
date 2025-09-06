// src/data/quests.js
// Quest data for The Soulforge Saga

export const QUEST_TEMPLATES = {
  'quest_explore_region': {
    id: 'quest_explore_region',
    name: 'Jelajahi Wilayah',
    description: 'Jelajahi wilayah baru untuk mendapatkan wawasan tentang dunia.',
    type: 'exploration',
    objectives: [
      {
        id: 'explore_objective',
        description: 'Kunjungi {regionName}',
        type: 'visit_location',
        targetRegion: '{regionId}',
        completed: false
      }
    ],
    rewards: {
      experience: 50,
      essence: 10,
      items: []
    },
    prerequisites: [],
    repeatable: false,
    llm_notes: 'Quest dasar eksplorasi untuk memperkenalkan pemain pada wilayah baru.'
  },
  'quest_gather_resources': {
    id: 'quest_gather_resources',
    name: 'Kumpulkan Sumber Daya',
    description: 'Kumpulkan sumber daya yang dibutuhkan untuk mendukung pemukiman.',
    type: 'gathering',
    objectives: [
      {
        id: 'gather_objective',
        description: 'Kumpulkan {quantity} {resourceName}',
        type: 'gather_item',
        targetItem: '{itemId}',
        requiredQuantity: '{quantity}',
        currentQuantity: 0,
        completed: false
      }
    ],
    rewards: {
      experience: 30,
      essence: 5,
      items: []
    },
    prerequisites: [],
    repeatable: true,
    llm_notes: 'Quest pengumpulan sumber daya dasar yang dapat diulang.'
  },
  'quest_defeat_creatures': {
    id: 'quest_defeat_creatures',
    name: 'Kalahkan Makhluk',
    description: 'Kalahkan makhluk yang mengancam wilayah ini.',
    type: 'combat',
    objectives: [
      {
        id: 'defeat_objective',
        description: 'Kalahkan {quantity} {creatureName}',
        type: 'defeat_enemy',
        targetCreature: '{creatureId}',
        requiredQuantity: '{quantity}',
        currentQuantity: 0,
        completed: false
      }
    ],
    rewards: {
      experience: 75,
      essence: 15,
      items: [
        { itemId: 'iron_ore', quantity: 3 }
      ]
    },
    prerequisites: [],
    repeatable: true,
    llm_notes: 'Quest tempur dasar melawan makhluk liar.'
  },
  'quest_ancient_tablet': {
    id: 'quest_ancient_tablet',
    name: 'Tablet Kuno Misterius',
    description: 'Temukan dan pelajari tablet kuno yang ditemukan di reruntuhan kuno.',
    type: 'lore',
    objectives: [
      {
        id: 'find_tablet',
        description: 'Temukan tablet kuno di {location}',
        type: 'find_item',
        targetItem: 'ancient_tablet',
        completed: false
      },
      {
        id: 'study_tablet',
        description: 'Pelajari tablet kuno di perpustakaan',
        type: 'interact_with_object',
        targetObject: 'library_research_table',
        completed: false
      }
    ],
    rewards: {
      experience: 100,
      essence: 25,
      items: [
        { itemId: 'ancient_tablet', quantity: 1 }
      ],
      skillExperience: {
        'cosmic_insight': 20
      }
    },
    prerequisites: [
      { skill: 'soul_resonance', level: 3 }
    ],
    repeatable: false,
    llm_notes: 'Quest lore yang memperkenalkan pemain pada mekanik tablet kuno dan memberikan skill experience.'
  },
  'quest_nexus_stabilization': {
    id: 'quest_nexus_stabilization',
    name: 'Stabilisasi Nexus',
    description: 'Bantu menstabilkan fluktuasi Nexus di wilayah ini.',
    type: 'forger',
    objectives: [
      {
        id: 'analyze_fluctuations',
        description: 'Analisis fluktuasi Nexus di {regionName}',
        type: 'use_forger_tool',
        targetTool: 'nexus_analyzer',
        completed: false
      },
      {
        id: 'apply_stabilization',
        description: 'Terapkan stabilisasi ke Nexus',
        type: 'use_forger_tool',
        targetTool: 'stability_injector',
        completed: false
      }
    ],
    rewards: {
      experience: 150,
      essence: 50,
      items: [],
      forgerEssence: 10
    },
    prerequisites: [
      { role: 'forger' }
    ],
    repeatable: false,
    llm_notes: 'Quest khusus Forger yang memberikan Forger Essence sebagai reward.'
  }
};

export const QUEST_CHAINS = {
  'chain_explorers_path': {
    id: 'chain_explorers_path',
    name: 'Jalur Penjelajah',
    description: 'Rantai misi yang memandu pemain melalui perjalanan penjelajahan awal.',
    type: 'exploration',
    quests: [
      'quest_explore_region',
      'quest_gather_resources',
      'quest_defeat_creatures'
    ],
    finalRewards: {
      experience: 300,
      essence: 50,
      items: [
        { itemId: 'leather_vest', quantity: 1 }
      ]
    },
    prerequisites: [],
    llm_notes: 'Rantai misi awal untuk memperkenalkan pemain pada mekanik dasar.'
  }
};