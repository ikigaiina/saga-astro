# The Soulforge Saga - Astro Version

A comprehensive, full-featured implementation of The Soulforge Saga using the Astro framework.

## Project Overview

The Soulforge Saga is an expansive, narrative-driven RPG that immerses players in a living, breathing world where every choice shapes the destiny of both the individual and the cosmos. Players can choose between two distinct roles:

1. **Wanderer** - A traveler exploring the mysteries of the world, engaging in combat, quests, and character progression
2. **Forger** - A cosmic architect with the power to manipulate and shape reality itself

## Key Features

### Core Systems
- **Character Creation & Progression**: Deep character customization with philosophical choices that influence gameplay
- **Inventory & Crafting**: Extensive item system with crafting recipes and equipment management
- **Quest & Mission System**: Rich narrative with branching storylines and meaningful choices
- **Combat Mechanics**: Dynamic real-time combat with various weapons and abilities
- **Exploration**: Vast open world with diverse regions and landmarks to discover
- **Save/Load System**: Persistent game state with multiple save slots

### Wanderer Features
- **Skill Trees**: Multiple specialization paths including combat, magic, survival, and diplomacy
- **Equipment System**: Weapons, armor, and accessories that can be crafted or found
- **Journal System**: Track discoveries, lore, and personal reflections
- **Achievement System**: Earn recognition for completing milestones and challenges

### Forger Features
- **World Manipulation Tools**: Powerful instruments to reshape reality
- **Nexus Management**: Stabilize or destabilize the cosmic heartbeat of the world
- **Dimensional Rift Explorer**: Investigate and manipulate interdimensional phenomena
- **Primordial Intervention Console**: Direct cosmic forces to alter fundamental laws
- **Environmental Sculptor**: Shape landscapes and ecosystems
- **Entity Inspector**: Examine and modify individual beings
- **Cosmic Pattern Weaver**: Influence the underlying fabric of reality

### Technical Features
- **Modular Architecture**: Well-organized codebase with clear separation of concerns
- **Responsive UI**: Pixel-art inspired interface with glassmorphism effects
- **Performance Optimized**: Efficient state management and rendering
- **Extensible Design**: Easy to add new content, systems, and features
- **Cross-Platform**: Runs in any modern browser

## Project Structure

```
saga-astro/
├── src/
│   ├── components/        # Reusable UI components
│   ├── data/             # Game data definitions
│   ├── game/             # Core game systems and managers
│   ├── layouts/          # Page layouts
│   ├── pages/            # Individual game pages
│   ├── scripts/          # Utility scripts and testing
│   ├── styles/           # CSS and styling
│   └── utils/            # Helper functions
├── public/               # Static assets
├── dist/                 # Built files
└── package.json          # Project dependencies
```

## Game Systems

### 1. State Management
- Centralized game state using a reactive system
- Modular state managers for different subsystems
- Persistence and serialization capabilities

### 2. Character System
- Dual-role system (Wanderer/Forger)
- Attribute-based progression (Strength, Intelligence, etc.)
- Skill trees with philosophical tenets
- Equipment and inventory management

### 3. World System
- Dynamic world simulation with events
- Region-based exploration
- Time progression and seasonal changes
- Nexus stability mechanics

### 4. Combat System
- Real-time combat with action points
- Weapon variety and special abilities
- Enemy AI with different behaviors
- Loot and experience rewards

### 5. Crafting System
- Recipe-based crafting with ingredients
- Quality tiers and item enhancements
- Specialized crafting stations
- Forger-exclusive cosmic crafting

### 6. Quest System
- Branching narrative with consequences
- Multiple quest types (exploration, combat, social)
- Reputation system with factions
- Journal integration for story tracking

### 7. Multiplayer Features
- Shared world exploration
- Cooperative questing
- Player trading and interaction
- Global events and challenges

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd saga-astro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The project uses Astro's component-based architecture with:
- `.astro` files for pages and components
- JavaScript modules for game logic
- Tailwind CSS for styling
- Pixel-art aesthetic with VT323 and Press Start 2P fonts

## Testing

The project includes comprehensive testing:
- Unit tests for core systems
- Integration tests for workflows
- Performance benchmarks
- Manual QA procedures

Run tests with:
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:performance
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic RPGs and modern narrative-driven games
- Built with Astro, Tailwind CSS, and Lucide Icons
- Pixel art aesthetic inspired by retro gaming
- Philosophical concepts drawn from various schools of thought

## Future Development

Planned enhancements:
- Enhanced AI-driven narrative generation
- Expanded multiplayer features
- Mobile optimization
- Additional regions and content
- Advanced graphics and audio effects
- Community content creation tools