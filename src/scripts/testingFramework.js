// src/scripts/testingFramework.js
// Comprehensive testing framework for The Soulforge Saga

class TestingFramework {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
    this.testStartTime = null;
  }

  // Run a single test
  async runTest(testName, testFunction) {
    console.log(`🧪 Running test: ${testName}`);
    
    this.currentTest = testName;
    this.testStartTime = Date.now();
    
    try {
      const result = await testFunction();
      
      const testResult = {
        name: testName,
        status: 'passed',
        duration: Date.now() - this.testStartTime,
        result: result,
        timestamp: new Date().toISOString()
      };
      
      this.testResults.push(testResult);
      console.log(`✅ Test passed: ${testName} (${testResult.duration}ms)`);
      return testResult;
    } catch (error) {
      const testResult = {
        name: testName,
        status: 'failed',
        duration: Date.now() - this.testStartTime,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
      
      this.testResults.push(testResult);
      console.error(`❌ Test failed: ${testName}`, error);
      return testResult;
    }
  }

  // Run multiple tests
  async runTests(tests) {
    console.log(`🚀 Starting test suite with ${tests.length} tests`);
    
    const results = [];
    
    for (const test of tests) {
      const result = await this.runTest(test.name, test.fn);
      results.push(result);
    }
    
    this.generateTestReport(results);
    return results;
  }

  // Generate test report
  generateTestReport(results) {
    console.log('\n==================== TEST REPORT ====================');
    console.log(`Generated at: ${new Date().toISOString()}`);
    console.log('=====================================================');
    
    let passed = 0;
    let failed = 0;
    let totalDuration = 0;
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      
      if (result.status === 'passed') {
        console.log(`   ✅ PASSED (${result.duration}ms)`);
        passed++;
      } else {
        console.log(`   ❌ FAILED (${result.duration}ms)`);
        console.log(`      Error: ${result.error}`);
        failed++;
      }
      
      totalDuration += result.duration;
    });
    
    console.log('=====================================================');
    console.log(`TOTAL TESTS: ${results.length}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log(`SUCCESS RATE: ${((passed / results.length) * 100).toFixed(2)}%`);
    console.log(`TOTAL DURATION: ${totalDuration}ms`);
    console.log('=====================================================');
  }

  // Assert functions
  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Assertion failed: ${message || 'Expected values to be equal'}
Expected: ${expected}
Actual: ${actual}`);
    }
  }

  assertNotEqual(actual, expected, message = '') {
    if (actual === expected) {
      throw new Error(`Assertion failed: ${message || 'Expected values to be different'}
Value: ${actual}`);
    }
  }

  assertTrue(value, message = '') {
    if (value !== true) {
      throw new Error(`Assertion failed: ${message || 'Expected value to be true'}
Actual: ${value}`);
    }
  }

  assertFalse(value, message = '') {
    if (value !== false) {
      throw new Error(`Assertion failed: ${message || 'Expected value to be false'}
Actual: ${value}`);
    }
  }

  assertExists(value, message = '') {
    if (value === null || value === undefined) {
      throw new Error(`Assertion failed: ${message || 'Expected value to exist'}
Actual: ${value}`);
    }
  }

  // Performance assertion
  assertPerformance(duration, maxDuration, message = '') {
    if (duration > maxDuration) {
      throw new Error(`Performance assertion failed: ${message || 'Operation took too long'}
Expected: <${maxDuration}ms
Actual: ${duration}ms`);
    }
  }
}

// Export testing framework
export const testingFramework = new TestingFramework();

// Export assert functions
export const { 
  assertEqual, 
  assertNotEqual, 
  assertTrue, 
  assertFalse, 
  assertExists,
  assertPerformance
} = testingFramework;

// Export default class
export default TestingFramework;