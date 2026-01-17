/**
 * Test Script for IELTS Writing Band Score Calculation
 * Tests the new official IELTS formula: (Task 1 + Task 2 × 2) ÷ 3
 * Run with: node test-writing-scoring.js
 */

function roundToNearestHalf(score) {
  return Math.round(score * 2) / 2;
}

function calculateWritingBandScore(task1Score, task2Score) {
  // Official IELTS formula: (Task 1 + Task 2 × 2) ÷ 3
  const rawAverage = (task1Score + task2Score * 2) / 3;
  return roundToNearestHalf(rawAverage);
}

// Test cases
const testCases = [
  // [Task 1, Task 2, Expected Result, Description]
  [6.0, 7.0, 6.5, "Task 1: 6.0, Task 2: 7.0 → (6 + 7×2) / 3 = 6.67 → 6.5"],
  [5.0, 6.0, 5.5, "Task 1: 5.0, Task 2: 6.0 → (5 + 6×2) / 3 = 5.67 → 5.5"],
  [7.0, 7.0, 7.0, "Task 1: 7.0, Task 2: 7.0 → (7 + 7×2) / 3 = 7.00 → 7.0"],
  [5.0, 7.0, 6.5, "Task 1: 5.0, Task 2: 7.0 → (5 + 7×2) / 3 = 6.33 → 6.5"],
  [6.5, 6.5, 6.5, "Task 1: 6.5, Task 2: 6.5 → (6.5 + 6.5×2) / 3 = 6.50 → 6.5"],
  [6.0, 6.0, 6.0, "Task 1: 6.0, Task 2: 6.0 → (6 + 6×2) / 3 = 6.00 → 6.0"],
  [5.5, 6.5, 6.0, "Task 1: 5.5, Task 2: 6.5 → (5.5 + 6.5×2) / 3 = 6.17 → 6.0"],
  [7.5, 8.0, 7.5, "Task 1: 7.5, Task 2: 8.0 → (7.5 + 8×2) / 3 = 7.83 → 8.0"],
  [4.0, 5.0, 4.5, "Task 1: 4.0, Task 2: 5.0 → (4 + 5×2) / 3 = 4.67 → 4.5"],
  [8.0, 9.0, 8.5, "Task 1: 8.0, Task 2: 9.0 → (8 + 9×2) / 3 = 8.67 → 8.5"],
  [6.0, 7.5, 7.0, "Task 1: 6.0, Task 2: 7.5 → (6 + 7.5×2) / 3 = 7.00 → 7.0"],
  [5.5, 5.5, 5.5, "Task 1: 5.5, Task 2: 5.5 → (5.5 + 5.5×2) / 3 = 5.50 → 5.5"],
];

console.log("=".repeat(80));
console.log("IELTS Writing Band Score Calculation Test");
console.log("Official Formula: (Task 1 + Task 2 × 2) ÷ 3");
console.log("=".repeat(80));
console.log("");

let passed = 0;
let failed = 0;

testCases.forEach(([task1, task2, expected, description], index) => {
  const result = calculateWritingBandScore(task1, task2);
  const rawAverage = (task1 + task2 * 2) / 3;
  const isPass = result === expected;
  
  if (isPass) {
    passed++;
    console.log(`✓ Test ${index + 1}: PASSED`);
  } else {
    failed++;
    console.log(`✗ Test ${index + 1}: FAILED`);
  }
  
  console.log(`  ${description}`);
  console.log(`  Raw Average: ${rawAverage.toFixed(3)}`);
  console.log(`  Expected: ${expected.toFixed(1)}`);
  console.log(`  Got: ${result.toFixed(1)}`);
  console.log("");
});

console.log("=".repeat(80));
console.log(`Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
console.log("=".repeat(80));

// Verify all results are valid band scores (.0 or .5)
console.log("\nValidating that all results are valid band scores (.0 or .5):");
testCases.forEach(([task1, task2]) => {
  const result = calculateWritingBandScore(task1, task2);
  const isValid = (result * 2) % 1 === 0; // Check if it's .0 or .5
  console.log(`  Task 1: ${task1}, Task 2: ${task2} → ${result.toFixed(1)} ${isValid ? '✓' : '✗'}`);
});

if (failed === 0) {
  console.log("\n🎉 All tests passed! The writing scoring formula is working correctly.");
  process.exit(0);
} else {
  console.log("\n❌ Some tests failed. Please review the implementation.");
  process.exit(1);
}
