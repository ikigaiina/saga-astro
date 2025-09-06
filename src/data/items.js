// src/data/items.js
// Item data for The Soulforge Saga

export const TRADABLE_ITEMS_DATA = {
  'healing_potion': {
    id: 'healing_potion',
    name: 'Ramuan Penyembuh',
    description: 'Ramuan dasar yang dapat menyembuhkan luka ringan dan memulihkan vitalitas.',
    type: 'consumable', // Tipe item: "consumable", "weapon", "armor", "tool", "material", "artifact", "currency", "seed", "misc"
    value: 50, // Nilai dasar dalam Essence
    rarity: 'common', // Tingkat kelangkaan: "common", "uncommon", "rare", "epic", "legendary", "primordial"
    visualSpriteId: 'item_healing_potion.png', // ID sprite visual pixel-art
    itemEffectId: 'effect_restore_health_minor', // ID efek item yang dipicu saat digunakan
    maxStackSize: 10, // Jumlah maksimum dalam satu slot inventaris
    healingAmount: 10, // Jumlah kesehatan yang dipulihkan
    llm_notes: 'Item konsumsi dasar. Dapat ditemukan di pemukiman atau dijatuhkan oleh monster lemah.'
  },
  'ancient_tablet': {
    id: 'ancient_tablet',
    name: 'Tablet Kuno',
    description: 'Tablet batu yang diukir dengan tulisan kuno, berisi fragmen lore yang terlupakan. Sumber pengetahuan yang berharga.',
    type: 'artifact',
    value: 200,
    rarity: 'rare',
    visualSpriteId: 'item_ancient_tablet.png',
    itemEffectId: 'effect_unlock_lore_fragment', // Efek membuka fragmen lore
    loreFragmentId: 'lore_fragment_ancient_wisdom_01', // ID fragmen lore yang dibuka
    llm_notes: 'Item yang fokus pada lore. Dapat ditemukan di reruntuhan atau situs kuno. Memicu questline pencarian lore.'
  },
  'steel_sword': {
    id: 'steel_sword',
    name: 'Pedang Baja',
    description: 'Pedang tajam dan kokoh yang dibuat dari baja tempa. Senjata standar untuk prajurit.',
    type: 'weapon',
    value: 150,
    rarity: 'uncommon',
    visualSpriteId: 'item_steel_sword.png',
    itemEffectId: 'effect_base_damage_weapon', // Efek damage dasar
    damage: { min: 10, max: 15 }, // Rentang damage
    combatType: 'melee', // Tipe combat
    requiredStrength: 10, // Atribut Strength yang dibutuhkan
    llm_notes: 'Senjata dasar. Dapat dibuat oleh pengrajin atau dibeli dari pedagang.'
  },
  'aether_crystal': {
    id: 'aether_crystal',
    name: 'Kristal Aether',
    description: 'Kristal yang memancarkan energi eterik murni. Bahan baku penting untuk item magis dan ritual Nexus.',
    type: 'material',
    value: 100,
    rarity: 'rare',
    visualSpriteId: 'item_aether_crystal.png',
    maxStackSize: 99,
    llm_notes: 'Sumber daya yang terkait dengan Nexus dan sihir. Dapat ditemukan di situs mistis atau dari entitas elemental.'
  },
  'rabbit_pelt': {
    id: 'rabbit_pelt',
    name: 'Kulit Kelinci',
    description: 'Kulit lembut dari kelinci. Dapat digunakan untuk kerajinan atau dijual sebagai komoditas dasar.',
    type: 'material',
    value: 5,
    rarity: 'common',
    visualSpriteId: 'item_rabbit_pelt.png',
    maxStackSize: 20,
    llm_notes: 'Loot dasar dari kelinci. Digunakan untuk kerajinan ringan.'
  },
  'leather_vest': {
    id: 'leather_vest',
    name: 'Rompi Kulit',
    description: 'Rompi ringan yang memberikan perlindungan dasar.',
    type: 'armor',
    value: 75,
    rarity: 'common',
    visualSpriteId: 'item_leather_vest.png',
    defenseRating: 5,
    weight: 2,
    attributeRequirements: {
      'dexterity': 10
    },
    llm_notes: 'Armor dasar. Dapat dibuat oleh pengrajin atau dibeli dari pedagang.'
  },
  'bread': {
    id: 'bread',
    name: 'Roti',
    description: 'Roti segar yang mengenyangkan. Makanan dasar bagi penduduk.',
    type: 'consumable',
    value: 5,
    rarity: 'common',
    visualSpriteId: 'item_bread.png',
    healingAmount: 5,
    maxStackSize: 20,
    llm_notes: 'Makanan dasar. Dapat dibeli dari pedagang atau dibuat oleh pemain.'
  },
  'iron_ore': {
    id: 'iron_ore',
    name: 'Bijih Besi',
    description: 'Bijih besi mentah yang dapat dilebur menjadi batang besi. Bahan dasar untuk banyak alat dan senjata.',
    type: 'material',
    value: 10,
    rarity: 'common',
    visualSpriteId: 'item_iron_ore.png',
    maxStackSize: 50,
    llm_notes: 'Material dasar. Dapat ditambang dari deposit bijih.'
  },
  'iron_ingot': {
    id: 'iron_ingot',
    name: 'Batang Besi',
    description: 'Batang besi yang telah dilebur dan dibentuk. Bahan dasar untuk kerajinan logam.',
    type: 'material',
    value: 25,
    rarity: 'common',
    visualSpriteId: 'item_iron_ingot.png',
    maxStackSize: 30,
    llm_notes: 'Material hasil peleburan. Dapat dibuat dari bijih besi.'
  }
};

export const ITEM_EFFECTS_DATA = {
  'effect_restore_health_minor': {
    id: 'effect_restore_health_minor',
    name: 'Pulihkan Kesehatan Minor',
    description: 'Memulihkan sebagian kecil kesehatan target.',
    type: 'healing', // Tipe efek: "healing", "buff", "debuff", "damage", "utility", "lore_unlock"
    target: 'self', // Target efek: "self", "target_npc", "aoe"
    impact_rules: {
      health_recovery_amount: 10 // Jumlah pemulihan kesehatan
    },
    visualEffect: 'effect_healing_sparkle', // ID efek visual
    audioEffect: 'sfx_healing_chime', // ID efek audio
    llm_notes: 'Efek dasar untuk ramuan penyembuh. LLM dapat membuat variasi untuk efek yang lebih kuat.'
  },
  'effect_unlock_lore_fragment': {
    id: 'effect_unlock_lore_fragment',
    name: 'Buka Fragmen Lore',
    description: 'Membuka fragmen lore tersembunyi di Codex.',
    type: 'lore_unlock',
    target: 'player',
    impact_rules: {
      lore_fragment_id: 'dynamic_lore_id_from_item' // Placeholder ID lore yang akan diisi dari item yang memicu efek
    },
    visualEffect: 'effect_lore_unveiling',
    audioEffect: 'sfx_lore_chime_subtle',
    llm_notes: 'Efek ini harus dipicu oleh item artefak. LoreFragmentId harus diambil dari item yang menggunakan efek ini.'
  },
  'effect_base_damage_weapon': {
    id: 'effect_base_damage_weapon',
    name: 'Kerusakan Dasar Senjata',
    description: 'Memberikan kerusakan fisik dasar dalam pertempuran.',
    type: 'damage',
    target: 'enemy',
    impact_rules: {
      damage_range: { min: 10, max: 15 }, // Rentang kerusakan
      damage_type: 'physical' // Tipe kerusakan
    },
    visualEffect: 'effect_weapon_strike',
    audioEffect: 'sfx_weapon_swing_hit',
    llm_notes: 'Efek ini adalah standar untuk senjata. LLM dapat membuat efek senjata unik lainnya.'
  }
};

export const GLOBAL_LOOT_TABLES = {
  'loot_table_rabbit_pelt': {
    id: 'loot_table_rabbit_pelt',
    name: 'Loot Kelinci',
    description: 'Item yang bisa didapat dari kelinci.',
    items: [ // Daftar item yang bisa dijatuhkan
      { "itemId": "rabbit_pelt", "chance": 0.8, "minQuantity": 1, "maxQuantity": 2 }, // 80% peluang 1-2 kulit kelinci
      { "itemId": "small_bone", "chance": 0.5, "minQuantity": 1, "maxQuantity": 3 },   // 50% peluang 1-3 tulang kecil
      { "itemId": "rare_herb_a", "chance": 0.01, "minQuantity": 1, "maxQuantity": 1 }  // 1% peluang 1 herb langka
    ],
    currency_range: { "min": 1, "max": 5 }, // Jumlah Essence yang bisa dijatuhkan
    xp_reward: 5, // XP yang diberikan saat loot ini dijatuhkan
    narrative_implications: "Loot ini mencerminkan sifat kelinci sebagai sumber daya dasar di rimba."
  },
  'loot_table_dire_wolf_pelt': {
    id: 'loot_table_dire_wolf_pelt',
    name: 'Loot Serigala Buas',
    description: 'Item yang bisa didapat dari serigala buas.',
    items: [
      { "itemId": "dire_wolf_pelt", "chance": 0.7, "minQuantity": 1, "maxQuantity": 1 },
      { "itemId": "large_bone", "chance": 0.6, "minQuantity": 1, "maxQuantity": 2 },
      { "itemId": "wolf_fang", "chance": 0.3, "minQuantity": 1, "maxQuantity": 1 }
    ],
    currency_range: { "min": 10, "max": 25 },
    xp_reward: 20,
    narrative_implications: "Loot ini menunjukkan bahaya berburu serigala, menawarkan bahan yang lebih baik untuk kerajinan."
  }
};