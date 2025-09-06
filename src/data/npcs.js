// src/data/npcs.js
// NPC data for The Soulforge Saga

export const CREATURES_DATA = {
  'human': {
    "id": "human",
    "name": "Manusia",
    "description": "Makhluk cerdas yang memiliki kemampuan beradaptasi tinggi, membentuk komunitas, dan menciptakan peradaban.",
    "baseAttributes": {
      "strength": 10,
      "dexterity": 10,
      "constitution": 10,
      "intelligence": 10,
      "wisdom": 10,
      "charisma": 10
    },
    "lifespan": {
      "minAge": 0,
      "maxAge": 100
    },
    "visualAssetId": "creature_human.png",
    "audioSignature": "sfx_human_voice",
    "llm_notes": "Makhluk paling umum dalam Denyut Realitas. Dapat memicu berbagai plot point terkait interaksi sosial, konflik, dan pembangunan peradaban."
  },
  'dire_wolf': {
    "id": "dire_wolf",
    "name": "Serigala Buas",
    "description": "Predator besar yang mengintai di hutan dan dataran, dikenal karena kekuatannya dan kecerdasannya dalam berburu.",
    "baseAttributes": {
      "strength": 15,
      "dexterity": 14,
      "constitution": 12,
      "intelligence": 6,
      "wisdom": 10,
      "charisma": 6
    },
    "lifespan": {
      "minAge": 0,
      "maxAge": 15
    },
    "visualAssetId": "creature_dire_wolf.png",
    "audioSignature": "sfx_dire_wolf_howl",
    "llm_notes": "Makhluk buas yang bisa menjadi ancaman atau bahkan sekutu jika dijinakkan. Dapat menjatuhkan kulit dan tulang."
  },
  'echo_wraith': {
    "id": "echo_wraith",
    "name": "Hantu Gema",
    "description": "Manifestasi dari memori yang hilang, makhluk ini terbentuk dari energi Gema yang terdistorsi.",
    "baseAttributes": {
      "strength": 8,
      "dexterity": 16,
      "constitution": 6,
      "intelligence": 12,
      "wisdom": 14,
      "charisma": 4
    },
    "lifespan": {
      "minAge": 0,
      "maxAge": 1000 // Mereka tidak benar-benar mati kecuali dimurnikan
    },
    "visualAssetId": "creature_echo_wraith.png",
    "audioSignature": "sfx_echo_wraith_whisper",
    "llm_notes": "Makhluk mistis yang bisa memberikan informasi atau menjadi ancaman. Terkait dengan mekanik Echoes of Divergence."
  }
};

export const NPC_LIFESTAGES = [
  {
    "id": "infant",
    "name": "Bayi",
    "minAge": 0,
    "maxAge": 2,
    "fertilityFactor": 0.0,
    "mortalityChance": 0.05,
    "attributeDecayRates": {},
    "diseaseSusceptibilityModifiers": {
      "common_cold": 0.15,
      "infant_fever": 0.2
    },
    "societalRoleChanges": "Sepenuhnya bergantung pada orang tua atau pengasuh, belajar tentang dunia melalui sensasi dasar.",
    "narrativeThemes": "Inosensi dan Awal Baru, Kerentanan dan Perlindungan.",
    "visualChangesDescription": "Kulit halus, mata lebar, ukuran tubuh sangat kecil.",
    "llm_notes": "Fase ini harus memicu plot point terkait perlindungan keluarga atau krisis kesehatan awal."
  },
  {
    "id": "child",
    "name": "Anak-anak",
    "minAge": 3,
    "maxAge": 12,
    "fertilityFactor": 0.0,
    "mortalityChance": 0.005,
    "attributeDecayRates": {},
    "diseaseSusceptibilityModifiers": {
      "common_cold": 0.05
    },
    "societalRoleChanges": "Mulai belajar keterampilan dasar dari keluarga atau komunitas, bermain, dan mengembangkan kepribadian awal.",
    "narrativeThemes": "Penemuan dan Pembelajaran, Persahabatan dan Konflik Kecil.",
    "visualChangesDescription": "Tumbuh dengan cepat, fitur wajah mulai terbentuk, sering terlihat aktif dan penasaran.",
    "llm_notes": "Plot point terkait pendidikan, kenakalan, atau petualangan kecil."
  },
  {
    "id": "adolescent",
    "name": "Remaja",
    "minAge": 13,
    "maxAge": 17,
    "fertilityFactor": 0.1,
    "mortalityChance": 0.002,
    "attributeDecayRates": {},
    "diseaseSusceptibilityModifiers": {},
    "societalRoleChanges": "Mulai mengambil tanggung jawab yang lebih besar, mempertanyakan norma sosial, dan mencari identitas diri. Fase transisi menuju kedewasaan.",
    "narrativeThemes": "Pemberontakan dan Pencarian Identitas, Cinta Pertama dan Persahabatan Mendalam.",
    "visualChangesDescription": "Perubahan fisik yang signifikan, ekspresi wajah yang lebih kompleks, sering menunjukkan tanda-tanda ketidakpastian atau tekad.",
    "llm_notes": "Plot point terkait pilihan karir, konflik keluarga, atau partisipasi dalam event sosial."
  },
  {
    "id": "young_adult",
    "name": "Dewasa Muda",
    "minAge": 18,
    "maxAge": 35,
    "fertilityFactor": 0.8,
    "mortalityChance": 0.001,
    "attributeDecayRates": {},
    "diseaseSusceptibilityModifiers": {},
    "societalRoleChanges": "Memasuki dunia kerja atau petualangan, membentuk keluarga, dan membangun reputasi. Fase puncak energi dan ambisi.",
    "narrativeThemes": "Ambisi dan Pencapaian, Romansa dan Pembentukan Keluarga, Pahlawan yang Bangkit.",
    "visualChangesDescription": "Fisik prima, ekspresi wajah penuh energi dan tekad, sering terlihat aktif dan berani.",
    "llm_notes": "Fase ini harus memicu plot point terkait pencarian misi, konflik faksi, atau pembentukan pemukiman baru."
  },
  {
    "id": "adult",
    "name": "Dewasa",
    "minAge": 36,
    "maxAge": 60,
    "fertilityFactor": 0.5,
    "mortalityChance": 0.003,
    "attributeDecayRates": {
      "strength": 0.0001,
      "dexterity": 0.0001
    },
    "diseaseSusceptibilityModifiers": {
      "common_cold": 0.02,
      "chronic_fatigue": 0.01
    },
    "societalRoleChanges": "Menjadi pilar komunitas, memegang posisi kepemimpinan atau keahlian, dan membesarkan generasi berikutnya. Fase stabilitas dan pengaruh.",
    "narrativeThemes": "Warisan dan Tanggung Jawab, Krisis Paruh Baya dan Refleksi, Intrik Politik dan Kekuasaan.",
    "visualChangesDescription": "Tanda-tanda kematangan, mungkin beberapa kerutan halus, ekspresi wajah yang lebih bijaksana atau lelah.",
    "llm_notes": "Plot point terkait kepemimpinan faksi, manajemen sumber daya, atau konflik keluarga yang kompleks."
  },
  {
    "id": "elder",
    "name": "Lansia",
    "minAge": 61,
    "maxAge": 80,
    "fertilityFactor": 0.1,
    "mortalityChance": 0.01,
    "attributeDecayRates": {
      "strength": 0.001,
      "dexterity": 0.001,
      "constitution": 0.0005
    },
    "diseaseSusceptibilityModifiers": {
      "common_cold": 0.05,
      "plague_of_shadows": 0.02,
      "age_related_ailment": 0.03
    },
    "societalRoleChanges": "Menarik diri dari pekerjaan fisik, menjadi penasihat, tetua, atau penjaga *lore*. Fokus pada kebijaksanaan dan transmisi pengetahuan.",
    "narrativeThemes": "Kebijaksanaan dan Penyesalan, Warisan dan Kehilangan, Penyakit dan Kematian.",
    "visualChangesDescription": "Rambut memutih atau menipis, kulit keriput, gerakan melambat, ekspresi wajah yang tenang atau penuh pengalaman.",
    "llm_notes": "Plot point terkait transmisi pengetahuan, konflik generasi, atau mencari penyembuhan langka."
  },
  {
    "id": "venerable",
    "name": "Sepuh",
    "minAge": 81,
    "maxAge": Infinity,
    "fertilityFactor": 0.0,
    "mortalityChance": 0.05,
    "attributeDecayRates": {
      "strength": 0.003,
      "dexterity": 0.003,
      "constitution": 0.002,
      "charisma": 0.0005
    },
    "diseaseSusceptibilityModifiers": {
      "common_cold": 0.1,
      "plague_of_shadows": 0.05,
      "age_related_ailment": 0.05,
      "terminal_illness": 0.01
    },
    "societalRoleChanges": "Menjadi simbol kebijaksanaan kuno atau beban masyarakat. Kehadiran mereka adalah pengingat akan siklus Denyut.",
    "narrativeThemes": "Akhir dari Sebuah Era, Keabadian Gema, Kematian dan Kelahiran Kembali.",
    "visualChangesDescription": "Sangat tua, mungkin rapuh, ekspresi wajah yang dalam dan penuh sejarah, seringkali terlihat lelah namun damai.",
    "llm_notes": "Plot point terkait pencarian makna hidup, menghadapi kematian, atau menjadi sumber inspirasi/ketakutan."
  }
];

export const NPC_HEALTH_STATES = {
  'healthy': {
    "id": "healthy",
    "name": "Sehat",
    "description": "NPC ini berada dalam kondisi fisik dan mental prima, mampu melakukan aktivitas penuh.",
    "type": "normal",
    "mortalityChanceModifier": 0.0,
    "attributeModifiers": {},
    "diseaseContagionModifier": 0.0,
    "recoveryChancePerDay": 0.0,
    "societalImpact": {},
    "narrativeThemes": "Kehidupan Sehari-hari, Pertumbuhan, Produktivitas.",
    "visualEffect": null,
    "audioEffect": null,
    "llm_notes": "Status default untuk NPC yang berfungsi penuh. Dapat memicu narasi tentang kemakmuran dan stabilitas."
  },
  'sick': {
    "id": "sick",
    "name": "Sakit",
    "description": "NPC ini menderita penyakit ringan, memengaruhi energi dan produktivitas mereka. Dapat menular.",
    "type": "illness",
    "mortalityChanceModifier": 0.001,
    "attributeModifiers": {
      "strength": -2,
      "dexterity": -1
    },
    "diseaseContagionModifier": 0.01,
    "recoveryChancePerDay": 0.15,
    "societalImpact": {
      "public_fear_increase": 0.001
    },
    "narrativeThemes": "Perjuangan Melawan Penyakit, Pencarian Obat, Ketergantungan.",
    "visualEffect": "effect_sick_green_aura",
    "audioEffect": "sfx_coughing_loop",
    "llm_notes": "Status ini harus memicu plot point terkait pencarian penyembuhan, isolasi, atau penyebaran penyakit."
  },
  'injured': {
    "id": "injured",
    "name": "Cedera",
    "description": "NPC ini mengalami cedera fisik, membatasi kemampuan mereka dalam aktivitas tertentu dan meningkatkan kerentanan.",
    "type": "injury",
    "mortalityChanceModifier": 0.005,
    "attributeModifiers": {
      "strength": -5,
      "dexterity": -5,
      "constitution": -3
    },
    "diseaseContagionModifier": 0.0,
    "recoveryChancePerDay": 0.05,
    "societalImpact": {
      "resource_drain_medical": 0.001
    },
    "narrativeThemes": "Pemulihan, Batasan Fisik, Bekas Luka Perang, Pengorbanan.",
    "visualEffect": "effect_injured_limp_anim",
    "audioEffect": "sfx_groaning_pain",
    "llm_notes": "Cedera dapat berasal dari pertempuran atau bencana. Memicu plot point terkait penyembuhan, atau NPC menjadi beban bagi komunitas."
  },
  'critical': {
    "id": "critical",
    "name": "Kritis",
    "description": "NPC ini berada di ambang kematian, membutuhkan perhatian medis segera. Setiap denyut adalah perjuangan.",
    "type": "fatal",
    "mortalityChanceModifier": 0.5,
    "attributeModifiers": {
      "strength": -10,
      "dexterity": -10,
      "constitution": -10,
      "charisma": -5,
      "intelligence": -5,
      "wisdom": -5
    },
    "diseaseContagionModifier": 0.05,
    "recoveryChancePerDay": 0.01,
    "societalImpact": {
      "public_fear_increase": 0.01,
      "resource_drain": 0.001
    },
    "narrativeThemes": "Perjuangan Terakhir, Harapan yang Memudar, Intervensi Ilahi/Medis, Kehilangan yang Mendekat.",
    "visualEffect": "effect_critical_red_pulse",
    "audioEffect": "sfx_critical_heartbeat_slow"
  },
  'deceased': {
    "id": "deceased",
    "name": "Meninggal",
    "description": "NPC ini telah mengakhiri Denyutnya dan tidak lagi aktif dalam simulasi. Jiwa mereka kini menjadi gema di The Eternal Echo.",
    "type": "fatal",
    "mortalityChanceModifier": 1.0,
    "attributeModifiers": {},
    "diseaseContagionModifier": 0.0,
    "recoveryChancePerDay": 0.0,
    "societalImpact": {
      "public_sadness_increase": 0.02,
      "faction_stability_drop": 0.01
    },
    "narrativeThemes": "Kehilangan, Warisan, Kematian dan Gema, Akhir dari Sebuah Kisah.",
    "visualEffect": "effect_deceased_fade_out",
    "audioEffect": "sfx_death_chime"
  }
};