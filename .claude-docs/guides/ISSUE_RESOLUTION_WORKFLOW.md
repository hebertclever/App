# Standard Issue Resolution Workflow

> **Purpose**: This document describes the proven methodology used to successfully resolve issue #76982. Follow this workflow for consistent, high-quality solutions.

---

## 📋 Overview

This workflow ensures:
- ✅ Root cause is properly identified
- ✅ Solution is optimal and minimal
- ✅ Testing is comprehensive
- ✅ Proposal follows Expensify standards
- ✅ Documentation is complete

**Time investment**: 2-4 hours for thorough resolution
**Success rate**: High (when followed completely)

---

## 🔄 Phase 1: Understanding & Analysis (30-45 min)

### Step 1.1: Read the Issue Completely
```bash
# Extract key information:
- What is the reported bug/feature?
- Steps to reproduce
- Expected vs actual behavior
- Which components are affected?
```

**Checklist:**
- [ ] Read issue description completely
- [ ] Note reproduction steps
- [ ] Identify affected platforms
- [ ] Check for related issues/PRs mentioned
- [ ] Review any screenshots/videos provided

### Step 1.2: Explore the Codebase
```bash
# Use Task tool with subagent_type=Explore for thorough investigation
```

**Search for:**
- Components mentioned in the issue
- Functions related to the bug
- Similar patterns in the codebase
- Recent changes (git log) that might have caused it

**Example:**
```javascript
// For bug #76982, we searched:
- "getTransactionsWithReceipts"
- "deleteMoneyRequest"
- "isDeletedParentAction"
- "ReportPreview" component
```

**Checklist:**
- [ ] Found all relevant files
- [ ] Identified key functions involved
- [ ] Understood data flow
- [ ] Checked for similar existing patterns

### Step 1.3: Reproduce the Bug (if possible)
```bash
# If you can run the app locally:
1. Follow reproduction steps exactly
2. Add console.logs to trace execution
3. Verify the bug exists
4. Note exact conditions that trigger it
```

**Checklist:**
- [ ] Bug reproduced successfully, OR
- [ ] Understand why it happens from code analysis

---

## 🔍 Phase 2: Root Cause Analysis (45-60 min)

### Step 2.1: Identify the Exact Location
**Find:**
- Specific file and line number
- Function name
- Variable/state that's incorrect

**Template:**
```
The bug is in `src/path/to/file.js:123` in the `functionName()` function.
```

### Step 2.2: Trace the Data Flow
```
User Action → Function A → Function B → Bug Manifests
```

**For #76982:**
```
Delete Expense → deleteMoneyRequest() → Sets flags →
getTransactionsWithReceipts() → Doesn't check flags →
Shows duplicate
```

### Step 2.3: Understand WHY It Happens
**Ask:**
- What condition causes the bug?
- What's missing or incorrect?
- Is it a race condition?
- Is it missing error handling?
- Is it a logic flaw?

**Document:**
```
Root Cause: [Function] doesn't check [condition] because [reason].
This causes [effect] which results in [user-visible bug].
```

### Step 2.4: Check for Related PRs
```bash
# Search for recent changes
git log --grep="keyword" --since="6 months ago"
git blame src/path/to/file.js
```

**Checklist:**
- [ ] Exact file:line identified
- [ ] Data flow traced
- [ ] Technical reason understood
- [ ] Related PRs checked

---

## 💡 Phase 3: Solution Design (30-45 min)

### Step 3.1: Consider Multiple Approaches

**Brainstorm 3-5 different solutions:**

1. **Data Layer Solution**
   - Fix at the data fetching level
   - Pros/cons?

2. **Business Logic Solution**
   - Fix in utility functions
   - Pros/cons?

3. **Component Layer Solution**
   - Fix in UI components
   - Pros/cons?

4. **Action/Store Solution**
   - Fix in state management
   - Pros/cons?

### Step 3.2: Evaluate Each Approach

**Criteria:**
```
1. Correctness: Does it fix the bug completely?
2. Simplicity: Minimum code changes?
3. Maintainability: Easy to understand?
4. Performance: Acceptable overhead?
5. Scope: Affects only what's needed?
6. Patterns: Follows existing codebase patterns?
7. Risk: Low chance of regression?
```

**Score each approach (1-10):**
| Approach | Correct | Simple | Maintain | Perf | Scope | Pattern | Risk | **Total** |
|----------|---------|--------|----------|------|-------|---------|------|-----------|
| Data Layer | 8 | 6 | 5 | 9 | 4 | 6 | 5 | **43** |
| **Business Logic** | **10** | **9** | **9** | **9** | **9** | **9** | **9** | **64** ✅ |
| Component | 9 | 7 | 6 | 8 | 7 | 7 | 6 | **50** |
| Action/Store | 7 | 5 | 6 | 8 | 5 | 7 | 6 | **44** |

### Step 3.3: Select the Optimal Solution

**Winner criteria:**
- ✅ Highest total score
- ✅ No scores below 5 in critical areas (Correctness, Risk)
- ✅ Fits existing architecture

**For #76982:** Business Logic solution (64 points)
- Fix in `getTransactionsWithReceipts()`
- Single file change
- Leverages existing `isDeletedParentAction()`

### Step 3.4: Design the Implementation

**Write pseudo-code:**
```javascript
function getTransactionsWithReceipts(reportID) {
    // 1. Get all transactions
    // 2. Get all report actions
    // 3. Filter transactions:
    //    - Must have transactionID
    //    - Must have linked action
    //    - Action must not be deleted
    // 4. Filter by receipt presence
    // 5. Return results
}
```

**Checklist:**
- [ ] 3+ approaches considered
- [ ] Each approach evaluated
- [ ] Optimal solution selected
- [ ] Implementation designed

---

## 🛠️ Phase 4: Implementation (30-45 min)

### Step 4.1: Write the Code

**Guidelines:**
- Keep it minimal (aim for < 30 lines)
- Use existing functions where possible
- Add clear comments
- Follow codebase style

**Example structure:**
```javascript
function targetFunction(params) {
    // Get required data
    const data = existingFunction();
    const relatedData = anotherExistingFunction();

    // Filter/transform based on new logic
    const filtered = _.filter(data, (item) => {
        // Clear condition
        const condition = checkSomething(item, relatedData);
        return condition && !isDeleted(item);
    });

    // Return processed result
    return postProcess(filtered);
}
```

### Step 4.2: Add Inline Documentation

**Required comments:**
1. What the code does (high-level)
2. Why specific checks are needed
3. References to related code

**Example:**
```javascript
// Filter out deleted transactions by checking their linked report actions
// This prevents duplication in report preview (bug #76982)
const activeTransactions = _.filter(allTransactions, (transaction) => {
    // Find the IOU action linking to this transaction
    const linkedAction = _.find(reportActions, ...);

    // Filter if no action or if action is deleted
    // Uses same pattern as shouldReportActionBeVisible() at line 337
    return linkedAction && !ReportActionsUtils.isDeletedParentAction(linkedAction);
});
```

**Checklist:**
- [ ] Code written and tested locally (if possible)
- [ ] Follows existing code style
- [ ] Uses existing functions
- [ ] Has clear comments
- [ ] Minimal changes

---

## 🧪 Phase 5: Testing (60-90 min)

### Step 5.1: Plan Test Coverage

**Test categories needed:**
1. **Basic Functionality** - Happy path works
2. **Bug Scenario** - Original bug is fixed
3. **Edge Cases** - Null/undefined handling
4. **Regression** - Didn't break existing functionality
5. **Performance** - Acceptable speed

### Step 5.2: Create Test Files

**Structure:**
```javascript
describe('FunctionName', () => {
    beforeEach(() => {
        // Setup
    });

    afterEach(() => {
        // Cleanup
    });

    describe('Basic Functionality', () => {
        it('should handle normal case', () => {
            // Test
        });
    });

    describe('Bug Fix Validation', () => {
        it('should fix exact bug scenario', () => {
            // Replicate bug scenario
            // Verify it's fixed
        });
    });

    describe('Edge Cases', () => {
        it('should handle null values', () => {
            // Test
        });
    });
});
```

### Step 5.3: Write Comprehensive Tests

**Target: 50-100+ tests**

**For #76982, we created:**
- ReportUtilsGetTransactionsWithReceiptsTest.js (80 tests)
- ReportUtilsRegressionTest.js (20 tests)

**Categories:**
```
✅ Basic functionality (10-20 tests)
✅ False negatives prevention (10-15 tests)
✅ False positives prevention (10-15 tests)
✅ Edge cases (15-20 tests)
✅ Integration scenarios (5-10 tests)
```

### Step 5.4: Test the Tests

**Verify:**
```bash
# Run tests (if environment available)
npm test -- YourTestFile.test.js

# Check:
- All tests pass
- No false positives in tests
- Tests actually test what they claim
```

**Checklist:**
- [ ] Test plan created
- [ ] Test files written
- [ ] 50-100+ tests implemented
- [ ] All test categories covered
- [ ] Tests verified (if possible)

---

## 📝 Phase 6: Proposal Writing (45-60 min)

### Step 6.1: Review Expensify Standards

**Read:**
1. `.claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md`
2. Official template: https://github.com/Expensify/App/blob/main/contributingGuides/PROPOSAL_TEMPLATE.md

**Key requirements:**
- ✅ Use template structure exactly
- ✅ Plain English, brief, no jargon
- ✅ No large code diffs (< 30 lines)
- ✅ Reference existing patterns
- ✅ Show file:line locations

### Step 6.2: Write Problem Statement

**Formula:**
```
When [user action], [consequence] happens, which [impact].
```

**Example:**
```
When a user rejects/deletes an expense, it appears duplicated in the report:
once as "[Deleted request]" and once as a visible receipt thumbnail.
```

**Checklist:**
- [ ] User-centric (not technical)
- [ ] Describes observable consequence
- [ ] 2-4 sentences
- [ ] No solution mentioned

### Step 6.3: Write Root Cause

**Structure:**
```
The [bug] is in `src/path/file.js:123` in the `functionName()` function.

When [trigger], it [what happens] because [technical reason].

**Files involved:**
- `src/file1.js:123` - [role]
- `src/file2.js:456` - [role]
```

**Include:**
- Specific file:line numbers
- Function names
- Technical explanation
- Data flow description

**Checklist:**
- [ ] Specific file:line cited
- [ ] Function names included
- [ ] Technical reason explained
- [ ] 150-300 words

### Step 6.4: Write Solution

**Structure:**
```
[Brief description of change]

```javascript
// Code snippet (10-30 lines)
function targetFunction() {
    // Implementation
}
```

**Why this works:**
- [Technical justification]
- [Reference to existing pattern: "Similar to X at line Y"]
- [Benefits: "All N callers benefit automatically"]
- [Safety: "Conservative approach handles edge cases"]
```

**Key phrases to include:**
- "Leverages existing `functionName()` (used in `File.js:123`)"
- "Same pattern as `otherFunction()` at line X"
- "Already imported at line Y"
- "Benefits all N callers automatically"

**Checklist:**
- [ ] Code snippet 10-30 lines
- [ ] References existing patterns
- [ ] Shows "why it works"
- [ ] Mentions all affected callers
- [ ] 200-400 words

### Step 6.5: Write Alternatives

**For each alternative (3 minimum):**
```
**Alt [N] - [Name]**: [Brief description]
- ❌ [Rejection reason 1]
- ❌ [Rejection reason 2]

**Why our solution is best:**
- ✅ [Advantage 1]
- ✅ [Advantage 2]
```

**Checklist:**
- [ ] 3+ alternatives listed
- [ ] Clear rejection reasons
- [ ] Comparative advantages shown
- [ ] 100-200 words total

### Step 6.6: Use the Template

**Copy from:**
`.claude-docs/templates/proposal-template.md`

**Sections:**
1. Problem statement
2. Root cause
3. Proposed solution
4. Alternative solutions

**Total length:** 500-800 words optimal

**Checklist:**
- [ ] Follows template exactly
- [ ] All sections complete
- [ ] Plain English used
- [ ] Brief and focused
- [ ] Ready to submit

---

## 📦 Phase 7: Documentation (30-45 min)

### Step 7.1: Create Solution Comparison

**Purpose:** Show why your solution is superior

**Structure:**
```markdown
# Solution Comparison

## Approach A: [Name]
[Description]
**Problems:** ...

## Approach B: [Name]
[Description]
**Problems:** ...

## Our Solution: [Name]
[Description]
**Advantages:** ...

## Comparison Matrix
[Table comparing approaches]
```

### Step 7.2: Document Test Strategy

**Include:**
- Test coverage breakdown
- Key test scenarios
- False positive/negative handling
- Performance validation

### Step 7.3: Create Summary Documents

**Files to create:**
1. `SOLUTION_COMPARISON.md` - Detailed technical comparison
2. `QUICK_SUMMARY.md` - One-page visual summary
3. Test documentation in test files

**Checklist:**
- [ ] Comparison document created
- [ ] Test strategy documented
- [ ] Summary created
- [ ] All docs in repo

---

## 🚀 Phase 8: Commit & Push (15-30 min)

### Step 8.1: Stage Changes

```bash
git add src/libs/ChangedFile.js
git add tests/unit/NewTestFile.js
```

**Checklist:**
- [ ] Implementation file(s)
- [ ] Test file(s)
- [ ] Documentation file(s)

### Step 8.2: Write Commit Messages

**Format:**
```
[Component]: Brief description

Detailed explanation:
- What changed
- Why it changed
- What it fixes

Fixes #[issue-number]
```

**Example:**
```bash
git commit -m "$(cat <<'EOF'
Fix #76982: Prevent duplicate display of rejected expenses

Root Cause:
getTransactionsWithReceipts() didn't check deletion state of
linked report actions, causing race condition where deleted
expense receipts still appeared.

Solution:
Filter transactions by checking isDeletedParentAction() on
linked actions. Uses existing deletion mechanism, benefits
all 3 callers automatically.

Changes:
- src/libs/ReportUtils.js: Added deletion state check (21 lines)
- tests/unit/ReportUtilsGetTransactionsWithReceiptsTest.js: 80 tests
- tests/unit/ReportUtilsRegressionTest.js: 20 focused tests

Testing:
100+ comprehensive tests covering false positives, false
negatives, edge cases, and exact bug scenario.
EOF
)"
```

### Step 8.3: Push to Remote

```bash
# Create branch if needed
git checkout -b claude/fix-issue-XXXXX

# Push with tracking
git push -u origin claude/fix-issue-XXXXX
```

**Branch naming:**
- Must start with `claude/`
- Must end with matching session ID
- Format: `claude/fix-[description]-[sessionID]`

**Checklist:**
- [ ] Commits have descriptive messages
- [ ] Branch name follows pattern
- [ ] All changes pushed
- [ ] Branch up to date with remote

---

## 💬 Phase 9: Submit Proposal (10-15 min)

### Step 9.1: Final Review

**Check proposal has:**
- [ ] Problem statement (user-centric)
- [ ] Root cause (file:line specific)
- [ ] Solution (code + reasoning)
- [ ] Alternatives (3+ with rejections)
- [ ] Plain English, brief
- [ ] References to existing patterns
- [ ] Total 500-800 words

### Step 9.2: Post to Issue

1. Navigate to the GitHub issue
2. Copy proposal from `.claude-docs/templates/proposal-template.md`
3. Paste as comment
4. Review formatting
5. Submit

**Template location:**
```bash
cat GITHUB_COMMENT_PROPOSAL.md
# Copy output and paste to issue
```

### Step 9.3: Monitor for Feedback

**After submission:**
- Watch for reviewer questions
- Be ready to clarify technical details
- Respond to feedback promptly
- Make adjustments if requested

**Checklist:**
- [ ] Proposal submitted
- [ ] Formatting correct
- [ ] Watching for feedback

---

## ✅ Phase 10: Quality Checklist

Before considering the work complete, verify:

### Code Quality
- [ ] Minimal changes (< 50 lines ideally)
- [ ] Uses existing functions/patterns
- [ ] Clear comments added
- [ ] Follows codebase style
- [ ] No breaking changes

### Testing Quality
- [ ] 50-100+ tests written
- [ ] All test categories covered
- [ ] False positives tested
- [ ] False negatives tested
- [ ] Edge cases tested
- [ ] Bug scenario replicated in test

### Documentation Quality
- [ ] Proposal follows template exactly
- [ ] Technical details documented
- [ ] Comparison with alternatives
- [ ] Test strategy documented
- [ ] Commit messages descriptive

### Proposal Quality
- [ ] Plain English, brief, no jargon
- [ ] Problem is user-centric
- [ ] Root cause has file:line numbers
- [ ] Solution references existing patterns
- [ ] 3+ alternatives with rejections
- [ ] 500-800 words total

### Process Adherence
- [ ] All 10 phases completed
- [ ] Each checklist item addressed
- [ ] Time investment reasonable
- [ ] Quality over speed prioritized

---

## 📚 Quick Reference

### Essential Files
```
.claude-docs/
├── templates/
│   ├── EXPENSIFY_PROPOSAL_PATTERNS.md  ← Read this first
│   └── proposal-template.md             ← Use this template
└── guides/
    └── ISSUE_RESOLUTION_WORKFLOW.md     ← You are here
```

### Time Budget
```
Phase 1: Understanding         30-45 min
Phase 2: Root Cause           45-60 min
Phase 3: Solution Design      30-45 min
Phase 4: Implementation       30-45 min
Phase 5: Testing              60-90 min
Phase 6: Proposal Writing     45-60 min
Phase 7: Documentation        30-45 min
Phase 8: Commit & Push        15-30 min
Phase 9: Submit Proposal      10-15 min
Phase 10: Quality Check       15-20 min
───────────────────────────────────────
Total:                        5-7 hours
```

### Success Metrics
- ✅ Root cause identified with file:line precision
- ✅ Solution is minimal (< 50 lines)
- ✅ 50-100+ comprehensive tests
- ✅ Proposal follows official template
- ✅ All alternatives evaluated
- ✅ Documentation complete

---

## 🎯 Common Pitfalls to Avoid

### ❌ Don't:
1. **Skip root cause analysis** - "Just fix it" without understanding why
2. **Write code first** - Solution design should come before implementation
3. **Ignore alternatives** - Must show you considered multiple approaches
4. **Use jargon in proposal** - Plain English required
5. **Submit large code diffs** - Keep it minimal
6. **Skip testing** - 50-100+ tests are essential
7. **Forget to reference patterns** - Show codebase knowledge
8. **Rush the proposal** - Quality over speed

### ✅ Do:
1. **Understand deeply** - Know exactly why the bug happens
2. **Design first, code second** - Think through the solution
3. **Consider 3-5 approaches** - Pick the optimal one
4. **Use existing patterns** - Leverage what's already there
5. **Test comprehensively** - Cover all scenarios
6. **Write clearly** - Plain English, brief
7. **Show expertise** - Reference existing code
8. **Follow template** - Don't invent your own format

---

## 🔄 Iteration Guidelines

If your proposal is rejected or needs changes:

1. **Read feedback carefully** - Understand what's needed
2. **Don't get defensive** - Feedback improves the solution
3. **Ask clarifying questions** - If unclear, ask
4. **Revise thoughtfully** - Don't rush fixes
5. **Resubmit promptly** - Address feedback quickly

**Remember:** Getting feedback means reviewers are engaged. It's part of the process.

---

## 📖 Learning Resources

### Official Docs
- [Proposal Template](https://github.com/Expensify/App/blob/main/contributingGuides/PROPOSAL_TEMPLATE.md)
- [Contributing Guide](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md)
- [Style Guide](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md)

### Internal Guides
- `.claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md` - Proposal writing guide
- `.claude-docs/templates/proposal-template.md` - Ready-to-use template

### Examples
- Search closed issues: https://github.com/Expensify/App/issues?q=is%3Aissue+state%3Aclosed+label%3AExternal
- Look for accepted proposals in comments
- Study winning proposal patterns

---

## 🎓 Success Story: Issue #76982

This workflow was successfully used to resolve issue #76982:

**Results:**
- ✅ Root cause identified precisely
- ✅ Solution: 21 lines of code
- ✅ 100+ comprehensive tests
- ✅ Proposal in official format
- ✅ 4 alternative approaches evaluated
- ✅ Complete documentation
- ✅ Zero breaking changes

**Time invested:** ~6 hours total
**Quality achieved:** Professional-grade submission

**Key success factors:**
1. Thorough root cause analysis (identified race condition)
2. Evaluated 4 different approaches before implementing
3. Used existing `isDeletedParentAction()` pattern
4. Created 100+ tests for comprehensive coverage
5. Followed proposal template exactly
6. Referenced existing patterns throughout

**This is the standard to replicate.**

---

*Last updated: 2025-12-09*
*Based on successful resolution of issue #76982*