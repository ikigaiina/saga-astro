// src/scripts/testRunner.js
// Main test runner for The Soulforge Saga

import { testingFramework } from './testingFramework.js';
import { unitTests } from './unitTests.js';
import { integrationTests } from './integrationTests.js';
import { performanceTests } from './performanceTests.js';

class TestRunner {
  constructor() {
    this.framework = testingFramework;
    this.testSuites = {
      unit: unitTests,
      integration: integrationTests,
      performance: performanceTests
    };
  }

  // Run specific test suite
  async runTestSuite(suiteName) {
    console.log(`\n🚀 Running ${suiteName.toUpperCase()} test suite...`);
    
    switch (suiteName) {
      case 'unit':
        return await this.testSuites.unit.runAllUnitTests();
      case 'integration':
        return await this.testSuites.integration.runAllIntegrationTests();
      case 'performance':
        return await this.testSuites.performance.runAllPerformanceTests();
      default:
        throw new Error(`Unknown test suite: ${suiteName}`);
    }
  }

  // Run all test suites
  async runAllTestSuites() {
    console.log('🧪 STARTING COMPLETE TEST SUITE FOR THE SOULFORGE SAGA 🧪');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    const allResults = [];
    
    try {
      // Run unit tests
      console.log('\n📋 UNIT TESTS');
      console.log('-'.repeat(40));
      const unitResults = await this.runTestSuite('unit');
      allResults.push(...unitResults);
      
      // Run integration tests
      console.log('\n🔗 INTEGRATION TESTS');
      console.log('-'.repeat(40));
      const integrationResults = await this.runTestSuite('integration');
      allResults.push(...integrationResults);
      
      // Run performance tests
      console.log('\n⚡ PERFORMANCE TESTS');
      console.log('-'.repeat(40));
      const performanceResults = await this.runTestSuite('performance');
      allResults.push(...performanceResults);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Generate final report
      this.generateFinalReport(allResults, totalTime);
      
      return {
        success: true,
        message: 'All test suites completed',
        results: allResults,
        totalTime: totalTime
      };
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return {
        success: false,
        message: 'Test suite failed: ' + error.message,
        error: error
      };
    }
  }

  // Generate final comprehensive report
  generateFinalReport(results, totalTime) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(60));
    
    // Overall statistics
    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'passed').length;
    const failedTests = results.filter(r => r.status === 'failed').length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);
    
    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${failedTests}`);
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Total Time: ${totalTime}ms`);
    
    // Test suite breakdown
    console.log(`\n📁 TEST SUITE BREAKDOWN:`);
    
    const unitTests = results.filter(r => r.name.includes('Unit'));
    const integrationTests = results.filter(r => r.name.includes('Integration'));
    const performanceTests = results.filter(r => r.name.includes('Performance'));
    
    if (unitTests.length > 0) {
      const unitPassed = unitTests.filter(t => t.status === 'passed').length;
      const unitSuccessRate = ((unitPassed / unitTests.length) * 100).toFixed(1);
      console.log(`   Unit Tests: ${unitPassed}/${unitTests.length} (${unitSuccessRate}%)`);
    }
    
    if (integrationTests.length > 0) {
      const integrationPassed = integrationTests.filter(t => t.status === 'passed').length;
      const integrationSuccessRate = ((integrationPassed / integrationTests.length) * 100).toFixed(1);
      console.log(`   Integration Tests: ${integrationPassed}/${integrationTests.length} (${integrationSuccessRate}%)`);
    }
    
    if (performanceTests.length > 0) {
      const performancePassed = performanceTests.filter(t => t.status === 'passed').length;
      const performanceSuccessRate = ((performancePassed / performanceTests.length) * 100).toFixed(1);
      console.log(`   Performance Tests: ${performancePassed}/${performanceTests.length} (${performanceSuccessRate}%)`);
    }
    
    // Performance highlights
    console.log(`\n⚡ PERFORMANCE HIGHLIGHTS:`);
    
    const fastestTest = results.reduce((fastest, current) => 
      current.duration < fastest.duration ? current : fastest
    );
    
    const slowestTest = results.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
    
    console.log(`   Fastest Test: ${fastestTest.name} (${fastestTest.duration}ms)`);
    console.log(`   Slowest Test: ${slowestTest.name} (${slowestTest.duration}ms)`);
    
    // Average durations by category
    if (unitTests.length > 0) {
      const avgUnitTime = unitTests.reduce((sum, test) => sum + test.duration, 0) / unitTests.length;
      console.log(`   Avg Unit Test Time: ${avgUnitTime.toFixed(2)}ms`);
    }
    
    if (integrationTests.length > 0) {
      const avgIntegrationTime = integrationTests.reduce((sum, test) => sum + test.duration, 0) / integrationTests.length;
      console.log(`   Avg Integration Test Time: ${avgIntegrationTime.toFixed(2)}ms`);
    }
    
    if (performanceTests.length > 0) {
      const avgPerformanceTime = performanceTests.reduce((sum, test) => sum + test.duration, 0) / performanceTests.length;
      console.log(`   Avg Performance Test Time: ${avgPerformanceTime.toFixed(2)}ms`);
    }
    
    // Failed tests summary
    if (failedTests > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      const failed = results.filter(r => r.status === 'failed');
      failed.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.name}`);
        console.log(`      Error: ${test.error}`);
      });
    }
    
    // Final assessment
    console.log(`\n🎯 FINAL ASSESSMENT:`);
    if (successRate >= 95) {
      console.log(`   ✅ EXCELLENT - The Soulforge Saga is performing exceptionally well!`);
    } else if (successRate >= 85) {
      console.log(`   ✅ GOOD - The Soulforge Saga is performing well with minor issues.`);
    } else if (successRate >= 75) {
      console.log(`   ⚠️  FAIR - The Soulforge Saga needs some improvements.`);
    } else {
      console.log(`   ❌ POOR - The Soulforge Saga requires significant improvements.`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TESTING COMPLETE');
    console.log('='.repeat(60));
  }

  // Run specific tests
  async runSpecificTests(testNames) {
    console.log(`\n🎯 Running specific tests: ${testNames.join(', ')}`);
    
    // This would require implementing a way to select specific tests
    // For now, we'll run all tests
    return await this.runAllTestSuites();
  }

  // Run tests with specific tags
  async runTestsWithTags(tags) {
    console.log(`\n🏷️  Running tests with tags: ${tags.join(', ')}`);
    
    // This would require implementing tagging system for tests
    // For now, we'll run all tests
    return await this.runAllTestSuites();
  }
}

// Export test runner
export const testRunner = new TestRunner();

// Export default class
export default TestRunner;

// Run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location && window.location.pathname.includes('test')) {
  // In browser environment, expose test runner globally
  window.SagaTestRunner = testRunner;
  
  // Auto-run tests if requested
  if (window.location.search.includes('autorun=true')) {
    testRunner.runAllTestSuites().then(results => {
      console.log('🏁 All tests completed');
    }).catch(error => {
      console.error('💥 Test execution failed:', error);
    });
  }
} else if (import.meta.url === new URL(import.meta.url)) {
  // In Node.js or module environment, run tests
  testRunner.runAllTestSuites().then(results => {
    console.log('🏁 All tests completed');
  }).catch(error => {
    console.error('💥 Test execution failed:', error);
  });
}