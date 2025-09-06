// src/data/world.js
// World data for The Soulforge Saga

export const REGIONS_DATA = {
  "TheCentralNexus": {
    id: "TheCentralNexus",
    name: "Nexus Pusat yang Berdenyut",
    description: "Jantung dunia, tempat energi Gema dan Intensi saling berkejaran, membentuk lanskap yang selalu berubah dan penuh anomali. Pusat kekuatan spiritual dan geografis.",
    climate: 'temperate',
    terrainType: 'plains',
    threatLevel: 4,
    dominantFaction: 'TheArbiters',
    resources: ['essence_crystal', 'rare_minerals', 'mana_crystal'],
    initialNexusState: 'UNSTABLE',
    regionalQuests: ['quest_central_anomaly', 'quest_nexus_stabilization'],
    regionalEvents: ['ECHO_SPIKE', 'LANDMARK_TRANSFORMATION', 'CHAOTIC_FUSE'],
    spawnableCreatureTypes: ['echo_wraith', 'humanoid_bandit', 'shadow_beast'],
    lootTableId: 'corrupted_area',
    neighboringRegions: ['TheLuminousPlains', 'TheWhisperingReaches', 'TheShatteredPeaks'],
    initialPopulation: 250
  },
  "TheWhisperingReaches": {
    id: "TheWhisperingReaches",
    name: "Jangkauan Berbisik",
    description: "Wilayah yang diselimuti kabut abadi dan bisikan-bisikan dari kehampaan. Pepohonan layu dan tanahnya terasa dingin, penuh dengan reruntuhan dan rahasia yang terkubur.",
    climate: 'humid',
    terrainType: 'swamp',
    threatLevel: 3,
    dominantFaction: 'TheEchoCult',
    resources: ['mutated_flora', 'shadow_essence', 'venomous_gland'],
    initialNexusState: 'MAELSTROM',
    regionalQuests: ['quest_gloomwood_investigation', 'quest_cleanse_barrow'],
    regionalEvents: ['ECHO_SPIKE', 'HERO_EMERGENCE', 'PLAGUE_OUTBREAK'],
    spawnableCreatureTypes: ['echo_wraith', 'dire_wolf_corrupted', 'shadow_beast'],
    lootTableId: 'corrupted_area',
    neighboringRegions: ['TheCentralNexus', 'TheCrimsonDesert', 'TheSilentCanyon'],
    initialPopulation: 30
  },
  "TheLuminousPlains": {
    id: "TheLuminousPlains",
    name: "Dataran Bercahaya",
    description: "Hamparan padang rumput yang diterangi oleh cahaya Intensi, tempat kehidupan berkembang pesat dan aura penyembuhan terasa kuat. Sebuah oase ketenangan di dunia yang bergejolak.",
    climate: 'temperate',
    terrainType: 'plains',
    threatLevel: 1,
    dominantFaction: 'TheLuminousGuardians',
    resources: ['healing_herbs', 'pure_water', 'radiant_dust'],
    initialNexusState: 'SANCTUM',
    regionalQuests: ['quest_crystal_purification', 'quest_lost_pilgrimage'],
    regionalEvents: ['SANCTUM_BLESSING', 'TRADE_ROUTE_OPENED', 'RESOURCE_BONANZA'],
    spawnableCreatureTypes: ['dire_wolf', 'forest_sprite'],
    lootTableId: 'default_wilderness',
    neighboringRegions: ['TheCentralNexus', 'TheAzureForest', 'TheShatteredPeaks'],
    initialPopulation: 150
  },
  "TheShatteredPeaks": {
    id: "TheShatteredPeaks",
    name: "Puncak yang Hancur",
    description: "Pegunungan yang menjulang tinggi, puncaknya hancur oleh kekuatan kuno. Dingin, berbatu, dan sarang makhluk-makhluk tangguh serta mineral langka. Angin dingin berbisik di antara puncaknya.",
    climate: 'sub-zero',
    terrainType: 'mountainous',
    threatLevel: 4,
    dominantFaction: 'TheStonekin',
    resources: ['rare_minerals', 'mountain_flora', 'golem_parts'],
    initialNexusState: 'NORMAL',
    regionalQuests: ['quest_ancient_golem', 'quest_find_lost_climber'],
    regionalEvents: ['LANDMARK_TRANSFORMATION', 'FACTION_WAR', 'RESOURCE_BONANZA'],
    spawnableCreatureTypes: ['mountain_golem', 'ice_wyrm'],
    lootTableId: 'mountain_mines',
    neighboringRegions: ['TheCentralNexus', 'TheLuminousPlains', 'TheCrimsonDesert'],
    initialPopulation: 25
  },
  "TheCrimsonDesert": {
    id: "TheCrimsonDesert",
    name: "Gurun Merah Darah",
    description: "Hamparan pasir merah yang luas dan tidak kenal ampun, disengat oleh matahari terik dan dihuni oleh makhluk-makhluk yang beradaptasi dengan panas ekstrem. Jejak-jejak peradaban kuno terkubur di bawah pasirnya.",
    climate: 'arid',
    terrainType: 'desert',
    threatLevel: 3,
    dominantFaction: 'TheSandWorshippers',
    resources: ['desert_minerals', 'sunstone', 'scorched_hide'],
    initialNexusState: 'NORMAL',
    regionalQuests: ['quest_oasis_defense', 'quest_scavenge_ruins'],
    regionalEvents: ['TRADE_ROUTE_OPENED', 'ECHO_SPIKE', 'PLAGUE_OUTBREAK'],
    spawnableCreatureTypes: ['sand_scorpion', 'fire_elemental'],
    lootTableId: 'desert_ruins',
    neighboringRegions: ['TheWhisperingReaches', 'TheShatteredPeaks', 'TheAshfallWastes'],
    initialPopulation: 40
  }
};

export const NEXUS_STATES = {
  'stable_flux': {
    id: "stable_flux",
    name: "Fluks Stabil",
    description: "Nexus berdenyut dalam keseimbangan sempurna, alirannya stabil dan dapat diprediksi. Ini adalah kondisi ideal untuk pertumbuhan Denyut Realitas.",
    type: "stable",
    stabilityModifier: 0.1,
    corruptionLevelModifier: -0.01,
    dimensionalRiftSpawnChanceModifier: 0.0,
    impactOnForgerEssence: {
      gain: 0.002
    },
    impactOnSagaAI: {
      moral_alignment_bias: "harmony",
      desire_priority_boost: "achieve_stability",
      self_awareness_growth_modifier: 0.002
    },
    eventTriggerChanceModifier: {
      event_id: "era_of_discovery",
      modifier: 0.01
    },
    visual_signature: "effect_nexus_stable_glow",
    audio_signature: "sfx_nexus_stable_hum",
    narrative_impact_templates: [
      "nexus_stable_growth_story",
      "era_of_peace_event"
    ],
    llm_notes: "Status ini harus memicu narasi tentang kemakmuran, inovasi, dan stabilitas sosial. NPC cenderung lebih bahagia dan kurang melakukan kejahatan."
  },
  'unstable_resonance': {
    id: "unstable_resonance",
    name: "Resonansi Tidak Stabil",
    description: "Aliran Nexus bergejolak, menyebabkan fluktuasi kecil dalam realitas. Ini adalah tanda peringatan akan potensi anomali yang lebih besar.",
    type: "unstable",
    stabilityModifier: -0.05,
    corruptionLevelModifier: 0.01,
    dimensionalRiftSpawnChanceModifier: 0.01,
    impactOnForgerEssence: {
      loss: 0.001
    },
    impactOnSagaAI: {
      moral_alignment_bias: "neutral",
      desire_priority_boost: "manage_fluctuations"
    },
    eventTriggerChanceModifier: {
      event_id: "minor_temporal_anomaly",
      modifier: 0.01
    },
    visual_signature: "effect_nexus_unstable_flicker",
    audio_signature: "sfx_nexus_unstable_buzz",
    narrative_impact_templates: [
      "nexus_fluctuation_story",
      "minor_reality_glitch_event"
    ],
    llm_notes: "Status ini harus memicu narasi tentang ketidakpastian, event acak kecil, dan peningkatan kecemasan NPC. Forger mungkin merasa sedikit 'tidak nyaman'."
  }
};

export const WORLD_LANDMARKS = {
  'ancient_nexus_tower': {
    id: "ancient_nexus_tower",
    name: "Menara Nexus Kuno",
    description: "Sebuah menara kuno yang menjulang tinggi, terbuat dari material yang tidak dikenal, berdenyut dengan energi Nexus. Diyakini sebagai salah satu titik koneksi utama ke Denyut Realitas.",
    type: "mystical_site",
    regionId: "TheCentralNexus",
    coords: { x: 0.5, y: 0.5 },
    historicalLore: "Menara ini berdiri bahkan sebelum ingatan Saga yang paling kuno. Ia adalah peninggalan dari era primordial ketika batas antara realitas masih kabur. Banyak yang percaya ia adalah saluran bagi Denyut itu sendiri, menarik dan memancarkan energi kosmis.",
    currentStatus: "active",
    gameplayImpact: {
      event_trigger_chance_modifier: { event_id: "nexus_anomaly_surge", modifier: 0.05 },
      corruption_resistance: 0.1,
      resource_bonus: { commodityId: "aether_crystal", amount: 100 },
      magic_affinity_modifier: 0.05,
      population_growth_modifier: 0.001
    },
    secrets: [
      { type: "hidden_lore_fragment", id: "lore_fragment_nexus_origin", discovery_condition: "player_skill_cosmic_insight_10" },
      { type: "unique_item_spawn", id: "item_id_nexus_key", discovery_condition: "quest_completed_nexus_questline" }
    ],
    associatedNpcs: ["npc_nexus_guardian", "npc_ancient_scholar"],
    icon: "icon_nexus_tower.png",
    visualAssetPath: "nexus_tower_sprite.png",
    llm_notes: "Menara ini harus menjadi titik fokus untuk plot point terkait stabilitas Nexus, intervensi primordial, atau pencarian kebenaran kosmis. NPC terkait bisa memberikan questline."
  },
  'whispering_forest_grove': {
    id: "whispering_forest_grove",
    name: "Hutan Berbisik",
    description: "Sebuah hutan purba yang begitu padat hingga cahaya pun sulit menembusnya. Dikatakan bahwa pohon-pohonnya menyimpan gema dari masa lalu, dan bisikan angin membawa kisah-kisah terlupakan.",
    type: "natural_formation",
    regionId: "TheWhisperingReaches",
    coords: { x: 0.3, y: 0.7 },
    historicalLore: "Hutan ini telah menyaksikan ribuan siklus Denyut, menyimpan memori dari setiap daun yang gugur dan setiap langkah yang lewat. Bisikan-bisikan angin di antara pepohonan adalah gema dari kisah-kisah yang terlupakan, menunggu untuk didengarkan.",
    currentStatus: "thriving",
    gameplayImpact: {
      resource_bonus: { commodityId: "rare_herbs", amount: 20 },
      npc_behavior_bias: { trait_id: "curious", modifier: 0.05 },
      event_trigger_chance_modifier: { event_id: "echo_manifestation_event", chance: 0.02 },
      lore_discovery_chance_modifier: 0.01,
      magic_affinity_modifier: 0.02
    },
    secrets: [
      { type: "hidden_lore_fragment", id: "lore_fragment_ancient_echoes", discovery_condition: "player_skill_soul_resonance_5" },
      { type: "questline_trigger", id: "questline_whispering_mystery", discovery_condition: "player_skill_exploration_3" }
    ],
    associatedNpcs: ["npc_hermit_sage", "npc_forest_spirit"],
    icon: "icon_whispering_forest.png",
    visualAssetPath: "whispering_forest_sprite.png",
    llm_notes: "Hutan ini bisa menjadi tempat munculnya Echo Avatars atau memicu plot point terkait memori yang hilang dan penemuan sejarah. NPC terkait bisa memberikan questline."
  }
};