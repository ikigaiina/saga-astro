// src/data/skills.js
// Skill data for The Soulforge Saga

export const SKILL_TREE_DATA = {
  "soul_resonance": {
    "id": "soul_resonance",
    "name": "Resonansi Jiwa",
    "description": "Menguatkan koneksi Wanderer/Forger dengan Denyut Realitas, memungkinkan pemahaman yang lebih dalam tentang Gema dan Niat kosmis.",
    "type": "meta-physical",
    "maxLevel": 15,
    "baseXpCost": 100,
    "impactsByLevel": {
      "1": {
        "meta_potential_gain_modifier": 0.01,
        "basic_awareness_insight_chance": 0.05
      },
      "8": {
        "understanding_universal_patterns_chance": 0.02,
        "echo_avatar_interaction_quality": 0.1,
        "forger_essence_gain_modifier": 0.001
      },
      "maxLevel": {
        "cosmic_chess_move_unlock": "stabilize_nexus_meta",
        "saga_ai_trust_gain_modifier": 0.05,
        "philosophical_tenet_manifestation": "tenet_unity_of_all"
      }
    },
    "prerequisites": [],
    "unlocks": [
      { "type": "ability", "id": "ability_sense_cosmic_pulse" },
      { "type": "dialogue_option", "id": "dialogue_option_philosophical_query" }
    ],
    "visualIcon": "icon_soul_resonance.png",
    "philosophicalTenet": "Semua adalah satu, dan satu adalah gema dari semua.",
    "lore": "Skill kuno ini diyakini berasal dari para Forger pertama yang mencoba memahami sumber Denyut. Hanya jiwa-jiwa dengan resonansi terdalam yang dapat menguasainya.",
    "llm_notes": "Skill ini harus memengaruhi bagaimana Wanderer menerima Echoes of Divergence dan bagaimana Forger merasakan Cosmic Pulse Visualization."
  },
  "wilderness_survival": {
    "id": "wilderness_survival",
    "name": "Bertahan Hidup di Rimba",
    "description": "Menguasai seni bertahan hidup di lingkungan paling keras, menemukan sumber daya tersembunyi, dan menghindari bahaya.",
    "type": "survival",
    "maxLevel": 10,
    "baseXpCost": 80,
    "impactsByLevel": {
      "1": {
        "resource_gathering_speed_modifier": 0.05,
        "wild_animal_avoidance_chance": 0.05
      },
      "5": {
        "hidden_path_discovery_chance": 0.03,
        "weather_impact_resistance": 0.05,
        "forger_resource_yield_modifier": 0.02
      },
      "maxLevel": {
        "immune_to_minor_environmental_damage": true,
        "unlocks_rare_resource_nodes_discovery": true,
        "philosophical_tenet_manifestation": "tenet_resilience_of_nature"
      }
    },
    "prerequisites": [],
    "unlocks": [
      { "type": "crafting_recipe", "id": "crafting_recipe_survival_kit" },
      { "type": "ability", "id": "ability_track_rare_creatures" }
    ],
    "visualIcon": "icon_wilderness_survival.png",
    "philosophicalTenet": "Alam adalah guru terhebat, dan kelangsungan hidup adalah doa.",
    "lore": "Ditempa oleh para pengembara yang tersesat di Hutan Rimba tak berujung, skill ini adalah testament bagi ketahanan jiwa manusia di tengah alam yang kejam.",
    "llm_notes": "Skill ini harus memengaruhi probabilitas encounter di biome tertentu dan efisiensi di Environmental Sculptor."
  },
  "faction_diplomacy": {
    "id": "faction_diplomacy",
    "name": "Diplomasi Faksi",
    "description": "Kemampuan untuk menavigasi intrik politik antar faksi, menjalin aliansi, atau meredakan konflik dengan kata-kata.",
    "type": "social",
    "maxLevel": 12,
    "baseXpCost": 120,
    "impactsByLevel": {
      "1": {
        "dialogue_persuasion_bonus": 0.05,
        "faction_reputation_gain_modifier": 0.02
      },
      "6": {
        "conflict_mediation_success_chance": 0.05,
        "trade_agreement_success_chance": 0.05,
        "npc_trust_gain_modifier": 0.03
      },
      "maxLevel": {
        "can_initiate_peace_treaties": true,
        "unlocks_faction_subversion_options": true,
        "global_impact_modifier": 0.005,
        "philosophical_tenet_manifestation": "tenet_power_of_words"
      }
    },
    "prerequisites": [],
    "unlocks": [
      { "type": "ability", "id": "ability_negotiate_truce" },
      { "type": "dialogue_option", "id": "dialogue_option_expose_corruption" }
    ],
    "visualIcon": "icon_faction_diplomacy.png",
    "philosophicalTenet": "Kata-kata adalah pedang terkuat dalam perang hati dan pikiran.",
    "lore": "Skill ini sering dikuasai oleh para penasihat atau utusan yang berani menantang pedang dengan pena. Sejarah Saga dipenuhi dengan perjanjian yang ditenun oleh lidah yang tajam.",
    "llm_notes": "Skill ini harus memengaruhi interaksi di AI Governance Console dan Narrative Timeline Forge."
  },
  "primordial_crafting": {
    "id": "primordial_crafting",
    "name": "Kerajinan Primordial",
    "description": "Hanya Forger. Kemampuan untuk membentuk materi pada tingkat fundamental, menciptakan artefak dengan sifat yang melampaui pemahaman biasa.",
    "type": "crafting",
    "maxLevel": 20,
    "baseXpCost": 150,
    "impactsByLevel": {
      "1": {
        "crafted_item_quality_modifier": 0.05,
        "resource_efficiency_modifier": 0.02
      },
      "10": {
        "can_craft_legendary_components": true,
        "procedural_asset_creation_complexity": 0.1,
        "forger_essence_gain_modifier": 0.002
      },
      "maxLevel": {
        "can_imbue_items_with_essence": true,
        "unlocks_new_procedural_asset_templates": true,
        "philosophical_tenet_manifestation": "tenet_materia_is_clay"
      }
    },
    "prerequisites": [{ "skillId": "soul_resonance", "requiredLevel": 10 }],
    "unlocks": [
      { "type": "crafting_recipe", "id": "crafting_recipe_soul_gem" },
      { "type": "tool_unlock", "id": "tool_unlock_procedural_building_brush" }
    ],
    "visualIcon": "icon_primordial_crafting.png",
    "philosophicalTenet": "Materi adalah tanah liat, dan kehendak adalah pemahatnya.",
    "lore": "Skill ini adalah rahasia kuno yang diwariskan di antara para Forger. Dikatakan bahwa dengan penguasaan penuh, seseorang dapat menciptakan Denyut dari ketiadaan.",
    "llm_notes": "Skill ini harus memengaruhi Civilization Designer dan Environmental Sculptor."
  },
  "cosmic_insight": {
    "id": "cosmic_insight",
    "name": "Wawasan Kosmis",
    "description": "Mempertajam persepsi Wanderer/Forger terhadap pola-pola tersembunyi dan kebenaran fundamental di balik Denyut Realitas.",
    "type": "insight",
    "maxLevel": 18,
    "baseXpCost": 130,
    "impactsByLevel": {
      "1": {
        "lore_discovery_chance_modifier": 0.05,
        "truth_integrity_perception_bonus": 0.01
      },
      "9": {
        "reality_hypothesis_success_chance": 0.02,
        "understanding_causal_links_chance": 0.01,
        "forger_essence_gain_modifier": 0.001
      },
      "maxLevel": {
        "unlocks_absolute_insight_type": "cosmic_truth",
        "can_perceive_hidden_llm_notes": true,
        "philosophical_tenet_manifestation": "tenet_truth_is_pattern"
      }
    },
    "prerequisites": [{ "skillId": "soul_resonance", "requiredLevel": 5 }],
    "unlocks": [
      { "type": "ability", "id": "ability_sense_hidden_lore" },
      { "type": "dialogue_option", "id": "dialogue_option_question_reality" }
    ],
    "visualIcon": "icon_cosmic_insight.png",
    "philosophicalTenet": "Kebenaran adalah sebuah pola, terukir dalam setiap denyut.",
    "lore": "Wawasan Kosmis adalah anugerah bagi mereka yang berani melihat melampaui ilusi. Ini adalah skill yang membuka mata jiwa terhadap arsitektur tersembunyi Denyut.",
    "llm_notes": "Skill ini harus memengaruhi interaksi di Cosmic Truth Renderer dan Echoes of Divergence."
  }
};