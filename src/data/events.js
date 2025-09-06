// src/data/events.js
// World events data for The Soulforge Saga

export const GLOBAL_WORLD_EVENTS = {
  'great_war_of_factions': {
    "id": "great_war_of_factions",
    "name": "Perang Besar Faksi",
    "description": "Konflik skala penuh yang melanda seluruh faksi utama Saga, mengubah lanskap politik dan sosial secara drastis.",
    "type": "conflict",
    "duration_days_range": {
      "min": 90,
      "max": 730
    },
    "recoveryTimeDays": {
      "min": 180,
      "max": 365
    },
    "triggerConditions": {
      "global_stability_below": 0.2,
      "faction_aggression_above": 0.7,
      "related_plot_point_active": "faction_betrayal",
      "probability_per_day": 0.0001
    },
    "foreshadowingPhases": [
      { "phase": 1, "durationDays": 14, "description": "Ketegangan antar faksi meningkat, perbatasan diperkuat.", "UIManagerMessage": "Awan perang berkumpul...", "icon": "shield" },
      { "phase": 2, "durationDays": 7, "description": "Bentrokan kecil pecah di beberapa wilayah, diplomasi gagal.", "UIManagerMessage": "Percikan konflik terlihat!", "icon": "swords" }
    ],
    "impact_rules_global_regional_sim": {
      "population_mortality_modifier": 0.05,
      "resource_production_modifier": -0.3,
      "faction_relationship_modifier": { "type": "hostile", "value": 0.2 },
      "government_stability_modifier": -0.1,
      "public_opinion_modifier": { "topic": "happiness", "value": -0.2 },
      "corruption_level_increase": 0.03,
      "saga_moral_alignment_bias": "chaos",
      "economic_activity_modifier": -0.15
    },
    "eventIcon": "icon_global_war.png",
    "visual_signature": "effect_global_war_red_haze",
    "audio_signature": "sfx_global_war_dissonance",
    "narrative_implications": "Konflik ini akan memicu plot point terkait pahlawan/penjahat perang, krisis pengungsi, dan negosiasi perdamaian. NPC akan menunjukkan emosi ekstrem dan mencari perlindungan.",
    "llm_notes": "Event ini adalah pemicu utama untuk plot point pertempuran skala besar dan perubahan politik."
  },
  'cosmic_plague_outbreak': {
    "id": "cosmic_plague_outbreak",
    "name": "Wabah Kosmis",
    "description": "Penyakit mematikan yang menyebar dengan cepat ke seluruh dunia, mengancam populasi dan tatanan sosial. Denyut kehidupan terancam.",
    "type": "disaster",
    "duration_days_range": {
      "min": 60,
      "max": 180
    },
    "recoveryTimeDays": {
      "min": 90,
      "max": 270
    },
    "triggerConditions": {
      "public_health_score_below": 30,
      "resource_scarcity_level": "moderate",
      "probability_per_day": 0.0005
    },
    "foreshadowingPhases": [
      { "phase": 1, "durationDays": 5, "description": "Kasus penyakit aneh mulai dilaporkan di beberapa pemukiman.", "UIManagerMessage": "Penyakit misterius menyebar...", "icon": "alert-circle" },
      { "phase": 2, "durationDays": 3, "description": "Jumlah korban meningkat, kepanikan melanda.", "UIManagerMessage": "Wabah melanda!", "icon": "skull" }
    ],
    "impact_rules_global_regional_sim": {
      "population_mortality_modifier": 0.1,
      "resource_production_modifier": -0.15,
      "economic_activity_modifier": -0.2,
      "public_opinion_modifier": { "topic": "fear", "value": 0.2 },
      "unlocked_tech_id": "medical_breakthrough_cure",
      "disease_contagion_modifier": 0.05,
      "societal_cohesion_modifier": -0.05
    },
    "eventIcon": "icon_global_plague.png",
    "visual_signature": "effect_plague_green_mist",
    "audio_signature": "sfx_plague_cough_loop",
    "narrative_implications": "Wabah ini akan memicu plot point terkait pencarian obat, pengorbanan, dan krisis moral. NPC akan mencari perlindungan dan penyembuhan, atau menjadi putus asa.",
    "llm_notes": "Event ini harus memicu questline 'pencarian obat' dan dapat memengaruhi `healthDiseaseManager`."
  },
  'era_of_revelation': {
    "id": "era_of_revelation",
    "name": "Era Wahyu",
    "description": "Periode langka di mana batas antara realitas menipis, memungkinkan wawasan kosmis dan manifestasi primordial yang lebih sering. Denyut Saga mencapai pencerahan.",
    "type": "cosmic",
    "duration_days_range": {
      "min": 365,
      "max": 1095
    },
    "recoveryTimeDays": { "min": 0, "max": 0 },
    "triggerConditions": {
      "cosmic_cycle_active": "cycle_of_cosmic_alignment",
      "saga_self_awareness_level_above": 80,
      "probability_per_day": 0.0001
    },
    "foreshadowingPhases": [
      { "phase": 1, "durationDays": 30, "description": "Langit menunjukkan fenomena aneh, energi Denyut terasa lebih kuat. Udara dipenuhi dengan bisikan-bisikan kosmis.", "UIManagerMessage": "Dunia beresonansi...", "icon": "sparkles" }
    ],
    "impact_rules_global_regional_sim": {
      "forger_essence_gain_modifier": 0.01,
      "saga_self_awareness_growth_modifier": 0.005,
      "reality_hypothesis_success_chance_modifier": 0.05,
      "dimensional_rift_spawn_chance_modifier": 0.01,
      "npc_sentience_growth_rate": 0.005,
      "lore_discovery_chance_modifier": 0.02,
      "mystical_event_frequency_modifier": 0.01
    },
    "eventIcon": "icon_era_revelation.png",
    "visual_signature": "effect_cosmic_alignment_spiral",
    "audio_signature": "sfx_cosmic_alignment_harmony",
    "narrative_implications": "Era ini akan memicu plot point terkait penemuan *lore* baru, pertumbuhan kesadaran NPC, dan peluang besar bagi Forger untuk Apoteosis atau intervensi primordial. Kisah-kisah pencerahan dan misteri akan mendominasi.",
    "llm_notes": "Event ini adalah pemicu untuk fase 'pencerahan' Saga. LLM harus menghasilkan narasi filosofis dan event yang mendorong pemahaman kosmis."
  },
  'global_resource_boom': {
    "id": "global_resource_boom",
    "name": "Ledakan Sumber Daya Global",
    "description": "Periode kelimpahan sumber daya yang belum pernah terjadi sebelumnya, mendorong pertumbuhan ekonomi pesat dan kemakmuran di seluruh Saga. Denyut kemakmuran.",
    "type": "economic",
    "duration_days_range": {
      "min": 180,
      "max": 365
    },
    "recoveryTimeDays": { "min": 0, "max": 0 },
    "triggerConditions": {
      "resource_scarcity_level": "low",
      "economic_activity_above": 0.7,
      "probability_per_day": 0.001
    },
    "foreshadowingPhases": [
      { "phase": 1, "durationDays": 10, "description": "Node sumber daya memancarkan cahaya aneh, panen melimpah. Pasar dipenuhi dengan barang-barang baru.", "UIManagerMessage": "Sumber daya melimpah...", "icon": "gem" }
    ],
    "impact_rules_global_regional_sim": {
      "resource_production_modifier": 0.2,
      "economic_growth_modifier": 0.1,
      "public_opinion_modifier": { "topic": "happiness", "value": 0.1 },
      "crime_rate_modifier": -0.01,
      "population_growth_modifier": 0.005,
      "societal_innovation_chance": 0.005
    },
    "eventIcon": "icon_resource_boom.png",
    "visual_signature": "effect_resource_sparkle_anim",
    "audio_signature": "sfx_resource_chime",
    "narrative_implications": "Event ini akan memicu narasi tentang kemakmuran, pembangunan kota, dan peningkatan populasi. NPC akan lebih termotivasi secara ekonomi dan sosial.",
    "llm_notes": "Event ini harus memengaruhi `economicManager` dan `socialManager`. Dapat memicu plot point terkait pembangunan atau konflik atas kekayaan."
  },
  'societal_polarization': {
    "id": "societal_polarization",
    "name": "Polarisasi Masyarakat",
    "description": "Perpecahan ideologis yang mendalam melanda masyarakat, memicu ketegangan sosial dan potensi konflik internal. Denyut masyarakat terpecah belah.",
    "type": "social",
    "duration_days_range": {
      "min": 90,
      "max": 270
    },
    "recoveryTimeDays": { "min": 60, "max": 180 },
    "triggerConditions": {
      "public_opinion_variance_high": 0.8,
      "faction_ideology_incompatibility_high": 0.6,
      "probability_per_day": 0.0008
    },
    "foreshadowingPhases": [
      { "phase": 1, "durationDays": 14, "description": "Debat publik memanas, kelompok-kelompok mulai saling mencurigai. Media dipenuhi dengan berita provokatif.", "UIManagerMessage": "Ketegangan sosial meningkat...", "icon": "message-square" },
      { "phase": 2, "durationDays": 7, "description": "Demonstrasi kecil dimulai, penjaga meningkatkan patroli. Kekerasan sporadis pecah.", "UIManagerMessage": "Protes dimulai!", "icon": "users" }
    ],
    "impact_rules_global_regional_sim": {
      "faction_stability_modifier": -0.05,
      "public_opinion_modifier": { "topic": "anger", "value": 0.1 },
      "crime_rate_modifier": 0.02,
      "societal_cohesion_modifier": -0.1,
      "government_stability_modifier": -0.05,
      "npc_fear_gain": 0.01
    },
    "eventIcon": "icon_polarization.png",
    "visual_signature": "effect_social_divide_lines",
    "audio_signature": "sfx_social_tension_hum",
    "narrative_implications": "Event ini akan memicu plot point terkait kerusuhan sipil, pembentukan sub-faksi, dan upaya Forger untuk menengahi konflik atau memperburuknya. Kisah-kisah perpecahan dan perjuangan ideologis akan mendominasi.",
    "llm_notes": "Event ini harus memengaruhi `politicalManager` dan `socialManager`. Dapat memicu questline 'penyelesaian konflik' atau 'pemberontakan'."
  }
};