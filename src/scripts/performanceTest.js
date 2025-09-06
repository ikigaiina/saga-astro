// src/scripts/performanceTest.js
// Performance testing script for The Soulforge Saga

class PerformanceTester {
  constructor() {
    this.results = [];
    this.tests = [
      { name: 'Game State Initialization', fn: () => this.testGameStateInit() },
      { name: 'UI Rendering Performance', fn: () => this.testUIRendering() },
      { name: 'Save/Load Operations', fn: () => this.testSaveLoad() },
      { name: 'Combat System Stress Test', fn: () => this.testCombatSystem() },
      { name: 'World Simulation Performance', fn: () => this.testWorldSimulation() },
      { name: 'Memory Usage Analysis', fn: () => this.testMemoryUsage() }
    ];
  }

  // Run all performance tests
  async runAllTests() {
    console.log('Starting performance tests...');
    
    for (const test of this.tests) {
      try {
        console.log(`Running test: ${test.name}`);
        const result = await test.fn();
        this.results.push({
          testName: test.name,
          ...result
        });
      } catch (error) {
        console.error(`Test ${test.name} failed:`, error);
        this.results.push({
          testName: test.name,
          success: false,
          error: error.message
        });
      }
    }
    
    this.generateReport();
    return this.results;
  }

  // Test game state initialization performance
  testGameStateInit() {
    const startTime = performance.now();
    
    // Simulate game state initialization
    const gameState = {
      player: {
        id: 'test-player-' + Date.now(),
        name: 'Test Player',
        level: 1,
        experience: 0,
        attributes: {
          strength: 10,
          intelligence: 10,
          charisma: 10,
          dexterity: 10,
          constitution: 10,
          wisdom: 10
        },
        skills: {},
        inventory: [],
        equipment: {},
        location: 'TheCentralNexus',
        health: 100,
        maxHealth: 100,
        essence: 0,
        reputation: {},
        journal: [],
        achievements: [],
        quests: []
      },
      world: {
        regions: {},
        time: {
          day: 1,
          hour: 12,
          minute: 0,
          season: 'spring',
          year: 1
        },
        events: [],
        nexusState: 'stable_flux',
        corruptionLevel: 0.0
      }
    };
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      message: `Game state initialized in ${duration.toFixed(2)}ms`
    };
  }

  // Test UI rendering performance
  testUIRendering() {
    const startTime = performance.now();
    
    // Simulate UI rendering
    for (let i = 0; i < 1000; i++) {
      // Create dummy UI elements
      const element = document.createElement('div');
      element.className = 'test-element';
      element.innerHTML = `<p>Test element ${i}</p>`;
      document.body.appendChild(element);
    }
    
    // Clean up
    const testElements = document.querySelectorAll('.test-element');
    testElements.forEach(el => el.remove());
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      message: `UI rendering test completed in ${duration.toFixed(2)}ms`
    };
  }

  // Test save/load operations
  testSaveLoad() {
    const startTime = performance.now();
    
    // Create test data
    const testData = {
      id: 'performance-test-' + Date.now(),
      data: Array(1000).fill().map((_, i) => ({
        id: i,
        value: Math.random() * 1000,
        timestamp: Date.now()
      }))
    };
    
    // Simulate save
    try {
      localStorage.setItem('performance_test_data', JSON.stringify(testData));
    } catch (error) {
      return {
        success: false,
        error: 'Failed to save test data: ' + error.message
      };
    }
    
    // Simulate load
    try {
      const loadedData = JSON.parse(localStorage.getItem('performance_test_data'));
      if (!loadedData) {
        throw new Error('Failed to load test data');
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to load test data: ' + error.message
      };
    }
    
    // Clean up
    localStorage.removeItem('performance_test_data');
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      message: `Save/load operations completed in ${duration.toFixed(2)}ms`
    };
  }

  // Test combat system performance
  testCombatSystem() {
    const startTime = performance.now();
    
    // Simulate combat calculations
    const combatants = [];
    for (let i = 0; i < 100; i++) {
      combatants.push({
        id: `combatant-${i}`,
        health: 100,
        maxHealth: 100,
        strength: Math.floor(Math.random() * 50) + 10,
        defense: Math.floor(Math.random() * 30) + 5
      });
    }
    
    // Simulate combat rounds
    for (let round = 0; round < 100; round++) {
      for (let i = 0; i < combatants.length; i++) {
        const attacker = combatants[i];
        const defender = combatants[(i + 1) % combatants.length];
        
        // Calculate damage
        const damage = Math.max(1, attacker.strength - defender.defense);
        defender.health = Math.max(0, defender.health - damage);
        
        // Heal slightly
        attacker.health = Math.min(attacker.maxHealth, attacker.health + 1);
      }
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      message: `Combat system stress test completed in ${duration.toFixed(2)}ms`
    };
  }

  // Test world simulation performance
  testWorldSimulation() {
    const startTime = performance.now();
    
    // Simulate world entities
    const entities = [];
    for (let i = 0; i < 500; i++) {
      entities.push({
        id: `entity-${i}`,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        update: function() {
          this.x += (Math.random() - 0.5) * 2;
          this.y += (Math.random() - 0.5) * 2;
        }
      });
    }
    
    // Simulate world updates
    for (let frame = 0; frame < 1000; frame++) {
      entities.forEach(entity => entity.update());
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      message: `World simulation test completed in ${duration.toFixed(2)}ms`
    };
  }

  // Test memory usage
  testMemoryUsage() {
    const startTime = performance.now();
    
    // Measure memory before
    const memoryBefore = performance.memory ? {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    } : null;
    
    // Create memory-intensive operation
    const bigArray = [];
    for (let i = 0; i < 100000; i++) {
      bigArray.push({
        id: i,
        data: Array(100).fill().map(() => Math.random()),
        timestamp: Date.now()
      });
    }
    
    // Measure memory after
    const memoryAfter = performance.memory ? {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    } : null;
    
    // Clean up
    bigArray.length = 0;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      success: true,
      duration: duration,
      memoryBefore: memoryBefore,
      memoryAfter: memoryAfter,
      message: `Memory usage test completed in ${duration.toFixed(2)}ms`
    };
  }

  // Generate performance report
  generateReport() {
    console.log('\n=== PERFORMANCE TEST REPORT ===');
    console.log(`Generated at: ${new Date().toISOString()}\n`);
    
    let totalDuration = 0;
    let passedTests = 0;
    let failedTests = 0;
    
    this.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.testName}`);
      
      if (result.success) {
        console.log(`   ✓ Duration: ${result.duration.toFixed(2)}ms`);
        console.log(`   ✓ ${result.message}`);
        passedTests++;
      } else {
        console.log(`   ✗ Error: ${result.error}`);
        failedTests++;
      }
      
      if (result.duration) {
        totalDuration += result.duration;
      }
      
      console.log('');
    });
    
    console.log('=== SUMMARY ===');
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`Average Test Duration: ${(totalDuration / this.results.length).toFixed(2)}ms`);
    
    // Performance recommendations
    console.log('\n=== RECOMMENDATIONS ===');
    if (totalDuration > 1000) {
      console.log('⚠️  Overall performance could be improved');
    } else {
      console.log('✅ Performance is within acceptable range');
    }
    
    console.log('\nPerformance testing completed.');
  }
}

// Export the tester
export const performanceTester = new PerformanceTester();

// Export the class for potential extension
export default PerformanceTester;