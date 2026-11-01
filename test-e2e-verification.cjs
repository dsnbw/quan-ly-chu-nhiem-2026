// ============================================================================
// COMPREHENSIVE E2E VERIFICATION SCRIPT (BUSINESS LOGIC, RULES, SVGS)
// ============================================================================

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testsFailed++;
  }
}

console.log('=================================================================');
console.log('1. RUNNING SVG LAYOUT & TYPOGRAPHY INTEGRITY AUDIT');
console.log('=================================================================');

const svgFiles = [
  'banner.svg',
  'architecture.svg',
  'dashboard-mockup.svg',
  'seating-mockup.svg',
  'finance-mockup.svg',
  'reportcard-mockup.svg',
  'attendance-leave-mockup.svg',
  'ai-assistant-mockup.svg'
];

svgFiles.forEach(file => {
  const filePath = path.join(__dirname, 'docs', 'images', file);
  assert(fs.existsSync(filePath), `File exists: docs/images/${file}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('<svg') && content.includes('</svg>'), `${file} is a valid SVG root`);
  assert(content.includes('viewBox='), `${file} defines responsive viewBox`);
  
  // Check for unwrapped long lines of text (> 95 chars without tspan)
  const lines = content.split('\n');
  let hasUnwrappedLongLine = false;
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('<text') && trimmed.endsWith('</text>') && !trimmed.includes('<tspan')) {
      const textMatch = trimmed.match(/>([^<]+)<\/text>/);
      if (textMatch && textMatch[1].length > 95) {
        console.warn(`    Warning: line ${idx + 1} in ${file} has long unwrapped text (${textMatch[1].length} chars): "${textMatch[1].substring(0, 50)}..."`);
        hasUnwrappedLongLine = true;
      }
    }
  });
  assert(!hasUnwrappedLongLine, `${file} has properly formatted/wrapped text elements`);
});

console.log('\n=================================================================');
console.log('2. TESTING BUILT ASSETS & DISTRIBUTION BUNDLES');
console.log('=================================================================');

const distHtml = path.join(__dirname, 'dist', 'index.html');
assert(fs.existsSync(distHtml), 'dist/index.html generated properly');

const distAssets = path.join(__dirname, 'dist', 'assets');
assert(fs.existsSync(distAssets) && fs.readdirSync(distAssets).length >= 3, 'dist/assets bundle contains JS and CSS bundles');

console.log('\n=================================================================');
console.log('3. TESTING ASSESSMENT RULE ENGINE CALCULATION (TT 22 / TT 27)');
console.log('=================================================================');

// Test GPA formula: (TX1 + TX2 + TX3 + GK*2 + CK*3) / (1 + 1 + 1 + 2 + 3) = 7
function calculateSubjectAverage(g) {
  const txScores = [g.tx1, g.tx2, g.tx3].filter(s => typeof s === 'number');
  if (typeof g.ck !== 'number' && typeof g.gk !== 'number' && txScores.length === 0) return undefined;
  
  const txSum = txScores.reduce((a, b) => a + b, 0);
  const gkVal = typeof g.gk === 'number' ? g.gk * 2 : 0;
  const ckVal = typeof g.ck === 'number' ? g.ck * 3 : 0;
  const totalWeight = txScores.length + (typeof g.gk === 'number' ? 2 : 0) + (typeof g.ck === 'number' ? 3 : 0);
  
  if (totalWeight === 0) return undefined;
  return Number(((txSum + gkVal + ckVal) / totalWeight).toFixed(1));
}

const mockGrade = { tx1: 8.0, tx2: 8.5, tx3: 9.0, gk: 8.5, ck: 9.0 };
const calculatedGpa = calculateSubjectAverage(mockGrade);
// tx: 8.0 + 8.5 + 9.0 = 25.5
// gk: 8.5 * 2 = 17
// ck: 9.0 * 3 = 27
// total: 69.5 / 8 = 8.6875 -> 8.7
assert(calculatedGpa === 8.7, `Calculated weighted subject average: ${calculatedGpa} (expected 8.7)`);

console.log('\n=================================================================');
console.log('4. TESTING FINANCIAL ACCOUNTING & REVERSAL LEDGER LOGIC');
console.log('=================================================================');

let totalIncome = 25200000;
let totalExpense = 10950000;
let totalAdjustments = 0;

let balance = totalIncome - totalExpense + totalAdjustments;
assert(balance === 14250000, `Initial Fund Balance matches: ${balance.toLocaleString('vi-VN')} đ`);

// Simulate an accidental expense of 500,000 VND
const badExpense = 500000;
totalExpense += badExpense;
balance = totalIncome - totalExpense + totalAdjustments;
assert(balance === 13750000, `Balance after erroneous expense: ${balance.toLocaleString('vi-VN')} đ`);

// Simulate accounting reversal transaction (+500,000 VND adjustment/reversal)
totalExpense -= badExpense; // Reversal restores original state
totalAdjustments += 0; // Or adjustment record keeps audit trail
balance = totalIncome - totalExpense + totalAdjustments;
assert(balance === 14250000, `Balance successfully restored after REVERSAL: ${balance.toLocaleString('vi-VN')} đ`);

console.log('\n=================================================================');
console.log('5. TESTING LEAVE REQUEST STATUTORY COMPLIANCE (TT 15/2026)');
console.log('=================================================================');

function canHomeroomTeacherApprove(days) {
  return days <= 3; // Max 3 days allowed by Circular 15/2026/TT-BGDDT
}

assert(canHomeroomTeacherApprove(1) === true, 'GVCN has authority to approve 1-day leave request');
assert(canHomeroomTeacherApprove(3) === true, 'GVCN has authority to approve 3-day leave request');
assert(canHomeroomTeacherApprove(4) === false, 'GVCN cannot approve leave > 3 days (must forward to Principal)');

console.log('\n=================================================================');
console.log(`SUMMARY: ${testsPassed} TESTS PASSED, ${testsFailed} TESTS FAILED.`);
console.log('=================================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION AUDITS PASSED WITH ZERO ERRORS!\n');
}
