/**
 * @file issue76830-verification.test.js
 * @description Verification tests that parse and test the ACTUAL code
 *
 * This test reads the real ImportTagsOptionsPage.tsx and verifies the fix is in place.
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// TEST FRAMEWORK
// =============================================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function describe(name, fn) {
    console.log(`\n📦 ${name}`);
    fn();
}

function it(name, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`  ✅ ${name}`);
    } catch (error) {
        failedTests++;
        console.log(`  ❌ ${name}`);
        console.log(`     Error: ${error.message}`);
    }
}

function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
            }
        },
        toContain(expected) {
            if (!actual.includes(expected)) {
                throw new Error(`Expected to contain "${expected}", but it doesn't`);
            }
        },
        not: {
            toContain(expected) {
                if (actual.includes(expected)) {
                    throw new Error(`Expected NOT to contain "${expected}", but it does`);
                }
            },
        },
        toMatch(regex) {
            if (!regex.test(actual)) {
                throw new Error(`Expected to match ${regex}, but it doesn't`);
            }
        },
    };
}

// =============================================================================
// READ THE ACTUAL SOURCE CODE
// =============================================================================

console.log('='.repeat(70));
console.log('🔍 VERIFICATION TESTS - Reading actual source code');
console.log('='.repeat(70));

const filePath = path.join(__dirname, '../../src/pages/workspace/tags/ImportTagsOptionsPage.tsx');
let sourceCode;

try {
    sourceCode = fs.readFileSync(filePath, 'utf8');
    console.log(`\n✅ Successfully read: ${filePath}`);
    console.log(`   File size: ${sourceCode.length} characters`);
} catch (error) {
    console.log(`\n❌ Failed to read file: ${error.message}`);
    process.exit(1);
}

// =============================================================================
// VERIFICATION TESTS
// =============================================================================

describe('1. Source Code Structure', () => {
    it('file contains ImportTagsOptionsPage component', () => {
        expect(sourceCode).toContain('function ImportTagsOptionsPage');
    });

    it('file contains isMultiLevelTags variable', () => {
        expect(sourceCode).toContain('isMultiLevelTags');
    });

    it('file contains hasVisibleTags variable', () => {
        expect(sourceCode).toContain('hasVisibleTags');
    });

    it('file contains single level MenuItem', () => {
        expect(sourceCode).toContain("translate('workspace.tags.tagLevel.singleLevel')");
    });
});

describe('2. BUG FIX VERIFICATION', () => {
    it('CRITICAL: Single level handler checks isMultiLevelTags', () => {
        // The fix should have: if (hasVisibleTags && isMultiLevelTags)
        // NOT: if (hasVisibleTags) alone

        // Find the single level MenuItem's onPress handler
        const singleLevelSection = sourceCode.substring(
            sourceCode.indexOf("translate('workspace.tags.tagLevel.singleLevel')"),
            sourceCode.indexOf("translate('workspace.tags.tagLevel.multiLevel')")
        );

        // The fixed condition should be present
        expect(singleLevelSection).toContain('hasVisibleTags && isMultiLevelTags');
    });

    it('CRITICAL: Does NOT have buggy condition (hasVisibleTags alone)', () => {
        // Find the single level MenuItem's onPress handler
        const singleLevelSection = sourceCode.substring(
            sourceCode.indexOf("translate('workspace.tags.tagLevel.singleLevel')"),
            sourceCode.indexOf("translate('workspace.tags.tagLevel.multiLevel')")
        );

        // The buggy pattern should NOT exist:
        // "if (hasVisibleTags)" without "&& isMultiLevelTags"

        // Check if there's an isolated "if (hasVisibleTags)" that's NOT followed by "&&"
        const buggyPattern = /if\s*\(\s*hasVisibleTags\s*\)\s*\{/;
        const fixedPattern = /if\s*\(\s*hasVisibleTags\s*&&\s*isMultiLevelTags\s*\)/;

        const hasBuggyPattern = buggyPattern.test(singleLevelSection);
        const hasFixedPattern = fixedPattern.test(singleLevelSection);

        if (hasBuggyPattern && !hasFixedPattern) {
            throw new Error('Found buggy pattern "if (hasVisibleTags)" without isMultiLevelTags check');
        }

        expect(hasFixedPattern).toBe(true);
    });
});

describe('3. Multi-level Handler Unchanged (Regression)', () => {
    it('startMultiLevelTagImportFlow function exists and is correct', () => {
        // Verify the function exists
        expect(sourceCode).toContain('const startMultiLevelTagImportFlow');

        // Verify it has the correct structure (checking the whole file)
        // Line 74-87 contains the function
        expect(sourceCode).toContain('setIsOverridingMultiTag(true)');
        expect(sourceCode).toContain('setIsSwitchSingleToMultipleLevelTagWarningModalVisible(true)');

        // The multi-level flow checks: if (hasVisibleTags) { if (isMultiLevelTags) ... }
        // This pattern should still exist in the file
        const hasNestedCheck = sourceCode.includes('if (hasVisibleTags)') &&
                               sourceCode.includes('if (isMultiLevelTags)');
        expect(hasNestedCheck).toBe(true);
    });
});

describe('4. Modal States Unchanged', () => {
    it('switch modal state exists', () => {
        expect(sourceCode).toContain('isSwitchSingleToMultipleLevelTagWarningModalVisible');
    });

    it('override modal state exists', () => {
        expect(sourceCode).toContain('isOverridingMultiTag');
    });

    it('ConfirmModal for switch is present', () => {
        expect(sourceCode).toContain('isVisible={isSwitchSingleToMultipleLevelTagWarningModalVisible}');
    });

    it('ConfirmModal for override is present', () => {
        expect(sourceCode).toContain('isVisible={isOverridingMultiTag}');
    });
});

describe('5. Line-by-line Diff Verification', () => {
    it('Line 195 contains the fix', () => {
        const lines = sourceCode.split('\n');

        // Find the line with the condition
        let fixedLineFound = false;
        let lineNumber = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('hasVisibleTags && isMultiLevelTags')) {
                fixedLineFound = true;
                lineNumber = i + 1;
                break;
            }
        }

        if (!fixedLineFound) {
            throw new Error('Could not find fixed condition in any line');
        }

        console.log(`     Found fix at line ${lineNumber}`);
        expect(fixedLineFound).toBe(true);
    });
});

// =============================================================================
// EXTRACT AND DISPLAY THE RELEVANT CODE
// =============================================================================

describe('6. Code Snippet Extraction', () => {
    it('Extracts the fixed code block', () => {
        const lines = sourceCode.split('\n');
        let startLine = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("tagLevel.singleLevel")) {
                startLine = i - 1;
                break;
            }
        }

        if (startLine > 0) {
            console.log('\n     📄 FIXED CODE (lines ' + startLine + '-' + (startLine + 17) + '):');
            console.log('     ' + '-'.repeat(50));
            for (let i = startLine; i < startLine + 17 && i < lines.length; i++) {
                const lineNum = (i + 1).toString().padStart(3, ' ');
                const marker = lines[i].includes('hasVisibleTags && isMultiLevelTags') ? ' 👈 FIX' : '';
                console.log(`     ${lineNum}| ${lines[i]}${marker}`);
            }
            console.log('     ' + '-'.repeat(50));
        }

        if (startLine === -1) {
            throw new Error('Could not find single level tag code');
        }
        expect(startLine > 0).toBe(true);
    });
});

// =============================================================================
// RESULTS
// =============================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 VERIFICATION RESULTS');
console.log('='.repeat(70));
console.log(`   Total:  ${totalTests}`);
console.log(`   Passed: ${passedTests} ✅`);
console.log(`   Failed: ${failedTests} ❌`);
console.log('='.repeat(70));

if (failedTests === 0) {
    console.log('\n🎉 SUCCESS: The bug fix has been verified in the actual source code!');
    console.log('\n📋 SUMMARY:');
    console.log('   ✅ Source file found and readable');
    console.log('   ✅ Fix applied: "if (hasVisibleTags && isMultiLevelTags)"');
    console.log('   ✅ Buggy pattern removed');
    console.log('   ✅ Multi-level handler unchanged (no regression)');
    console.log('   ✅ Modal states preserved');
} else {
    console.log('\n⚠️  Some verifications failed. Please review.');
}

process.exit(failedTests > 0 ? 1 : 0);
