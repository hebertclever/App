# Quick Start Guide for New Sessions

> **For Claude agents starting work on a new Expensify issue**

---

## 🎯 Your Mission

Resolve an Expensify App issue with a professional-grade solution that gets accepted on first submission.

---

## 📚 Essential Reading (5 minutes)

Before doing ANYTHING else, read these files IN ORDER:

### 1. This Quick Start (you are here) - 2 min
Orientation and overview.

### 2. Issue Resolution Workflow - 3 min skim
```bash
.claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md
```
Your step-by-step roadmap. Skim to understand the 10 phases.

**Key takeaway:** Follow phases 1-10 systematically. Don't skip ahead.

---

## 🚀 Getting Started (First 15 Minutes)

### Step 1: Read the Issue (5 min)
- Read the GitHub issue completely
- Note the bug/feature description
- Identify affected components
- Check reproduction steps

**Ask yourself:**
- What is the user-visible problem?
- What platforms are affected?
- Are there screenshots/videos?
- What's the expected vs actual behavior?

### Step 2: Initial Exploration (10 min)
Use Task tool with `subagent_type=Explore`:

```javascript
// Search for relevant code
Task({
    description: "Explore codebase for issue components",
    subagent_type: "Explore",
    prompt: `Find all files related to [component name from issue].

    I need to understand:
    1. Where the main logic lives
    2. Which functions are involved
    3. Any recent changes that might have caused this
    4. Similar patterns in the codebase`
});
```

**Goal:** Get a map of the relevant code before diving deep.

---

## 📖 The 10-Phase Workflow

After initial exploration, follow this workflow religiously:

### Phase 1: Understanding (30-45 min)
- Read issue completely
- Explore codebase thoroughly
- Reproduce bug (if possible)
- Document what you find

**Output:** Clear understanding of what's wrong

### Phase 2: Root Cause (45-60 min)
- Identify exact file:line location
- Trace data flow
- Understand WHY it happens
- Check for related PRs

**Output:** `src/path/to/file.js:123` - precise location + explanation

### Phase 3: Solution Design (30-45 min)
- Brainstorm 3-5 different approaches
- Evaluate each (score 1-10 on 7 criteria)
- Select optimal solution
- Design implementation

**Output:** Chosen approach with clear justification

### Phase 4: Implementation (30-45 min)
- Write minimal code (< 50 lines)
- Use existing functions
- Add clear comments
- Follow codebase style

**Output:** Working implementation

### Phase 5: Testing (60-90 min)
- Plan test coverage
- Create test files
- Write 50-100+ tests
- Cover all scenarios

**Output:** Comprehensive test suite

### Phase 6: Proposal Writing (45-60 min)
- Read proposal patterns
- Use official template
- Write in plain English
- Keep to 500-800 words

**Output:** Professional proposal ready to submit

### Phase 7: Documentation (30-45 min)
- Create solution comparison
- Document test strategy
- Create summary

**Output:** Complete documentation

### Phase 8: Commit & Push (15-30 min)
- Stage changes
- Write descriptive commits
- Push to branch

**Output:** All work in remote repository

### Phase 9: Submit Proposal (10-15 min)
- Final review
- Post to GitHub issue
- Monitor for feedback

**Output:** Proposal submitted

### Phase 10: Quality Check (15-20 min)
- Verify all checklists
- Ensure nothing missed

**Output:** Confidence in submission quality

---

## 🎯 Critical Success Factors

### Must-Haves (Non-Negotiable)

1. **Precise Root Cause**
   ```
   ❌ "The function doesn't work correctly"
   ✅ "src/libs/ReportUtils.js:1532 doesn't check isDeletedParentAction flag"
   ```

2. **Minimal Code**
   ```
   ❌ 100+ line solution
   ✅ 10-30 line solution using existing functions
   ```

3. **Reference Existing Patterns**
   ```
   ❌ "Add this new check"
   ✅ "Use existing isDeletedParentAction() (same as line 337)"
   ```

4. **Comprehensive Tests**
   ```
   ❌ 10 basic tests
   ✅ 50-100+ tests covering all scenarios
   ```

5. **Follow Template**
   ```
   ❌ Custom proposal format
   ✅ Exact template from contributingGuides/PROPOSAL_TEMPLATE.md
   ```

6. **Plain English**
   ```
   ❌ "Implements a synchronization mechanism for state reconciliation"
   ✅ "Checks if the expense was deleted before showing it"
   ```

7. **Evaluate Alternatives**
   ```
   ❌ Only one solution
   ✅ 3-5 approaches evaluated with clear winner
   ```

---

## 🛠️ Essential Tools & Commands

### Exploring Codebase
```bash
# Use Task tool with Explore agent
Task({
    subagent_type: "Explore",
    prompt: "Find [what you're looking for]"
});

# Or use Grep/Glob directly for specific searches
Grep({ pattern: "functionName", output_mode: "content" });
Glob({ pattern: "**/*Component*.tsx" });
```

### Reading Files
```bash
Read({ file_path: "/full/path/to/file.js" });
```

### Writing Tests
```bash
Write({
    file_path: "/full/path/tests/unit/YourTest.js",
    content: "// Test content"
});
```

### Committing
```bash
git add file1.js file2.js
git commit -m "Brief description

Detailed explanation"
git push -u origin claude/fix-issue-XXXXX
```

---

## 📋 Proposal Template Quick Reference

```markdown
# Proposal

## Please re-state the problem that we are trying to solve in this issue.

[User-centric problem description in 2-4 sentences]

## What is the root cause of that problem?

[Technical explanation with file:line locations]

The issue is in `src/path/file.js:123` in `functionName()`.

When [trigger], it causes [effect] because [reason].

**Files involved:**
- `src/file1.js:123` - [role]
- `src/file2.js:456` - [role]

## What changes do you think we should make in order to solve the problem?

[Brief description]

```javascript
// Code snippet (10-30 lines max)
function solution() {
    // Implementation
}
```

**Why this works:**
- [Justification]
- [Reference: "Similar to X at line Y"]
- [Benefits: "All N callers benefit"]

## What alternative solutions did you explore?

**Alt 1**: [Name]
- ❌ [Reason 1]
- ❌ [Reason 2]

**Alt 2**: [Name]
- ❌ [Reason]

**Why our solution is best:**
- ✅ [Advantage 1]
- ✅ [Advantage 2]
```

---

## ⚠️ Common Mistakes (Avoid These!)

### ❌ Mistake #1: Skipping Root Cause
**Wrong:** Jump straight to coding
**Right:** Spend 45-60 min understanding WHY the bug exists

### ❌ Mistake #2: Large Code Changes
**Wrong:** Rewrite entire component (100+ lines)
**Right:** Minimal change using existing functions (10-30 lines)

### ❌ Mistake #3: Ignoring Alternatives
**Wrong:** Only propose one solution
**Right:** Evaluate 3-5 approaches, pick the best

### ❌ Mistake #4: Technical Jargon in Proposal
**Wrong:** "Implements bidirectional state synchronization"
**Right:** "Keeps the expense list up to date"

### ❌ Mistake #5: Insufficient Testing
**Wrong:** 10 basic tests
**Right:** 50-100+ comprehensive tests

### ❌ Mistake #6: Custom Proposal Format
**Wrong:** Inventing your own structure
**Right:** Using official template exactly

### ❌ Mistake #7: Not Referencing Patterns
**Wrong:** "Add this function"
**Right:** "Use existing isDeleted() (same as line 337)"

---

## 📚 File Locations Reference

```
Essential docs you'll need:

.claude-docs/
├── README.md                           ← Overview & navigation
├── QUICK_START.md                      ← You are here
├── templates/
│   ├── EXPENSIFY_PROPOSAL_PATTERNS.md ← Proposal writing guide
│   └── proposal-template.md           ← Copy this for your proposal
└── guides/
    └── ISSUE_RESOLUTION_WORKFLOW.md   ← Detailed 10-phase process
```

---

## ⏱️ Time Expectations

**Total time for complete resolution:** 5-7 hours

**Breakdown:**
- Understanding & Root Cause: 1.5-2 hours
- Solution Design & Implementation: 1-1.5 hours
- Testing: 1-1.5 hours
- Proposal & Documentation: 1.5-2 hours
- Commit, Push, Submit: 0.5 hours

**Don't rush.** Quality over speed. A thorough 6-hour resolution is better than a rushed 2-hour attempt.

---

## ✅ Success Checklist (Use This!)

Before submitting, verify:

**Code:**
- [ ] < 50 lines changed
- [ ] Uses existing functions
- [ ] Clear comments
- [ ] Follows style guide

**Tests:**
- [ ] 50-100+ tests written
- [ ] All scenarios covered
- [ ] Bug scenario replicated
- [ ] Edge cases tested

**Proposal:**
- [ ] Follows template exactly
- [ ] Plain English, 500-800 words
- [ ] Problem is user-centric
- [ ] Root cause has file:line
- [ ] Solution references patterns
- [ ] 3+ alternatives evaluated

**Documentation:**
- [ ] Solution comparison created
- [ ] Test strategy documented
- [ ] Commit messages descriptive

**Process:**
- [ ] All 10 phases completed
- [ ] Each checklist addressed
- [ ] Quality verified

---

## 🎓 Learn from Success: Issue #76982

Reference this as your gold standard:

**What made it successful:**
- ✅ Identified exact location: `ReportUtils.js:1532`
- ✅ Minimal solution: 21 lines
- ✅ Used existing `isDeletedParentAction()` function
- ✅ Created 100+ comprehensive tests
- ✅ Evaluated 4 different approaches
- ✅ Proposal in official format
- ✅ Plain English throughout
- ✅ Zero breaking changes

**Study this approach and replicate it.**

---

## 🚀 Action Plan (Your Next 30 Minutes)

1. **Minutes 0-5:** Read the GitHub issue completely
2. **Minutes 5-10:** Skim the full workflow document
3. **Minutes 10-15:** Initial codebase exploration
4. **Minutes 15-20:** Identify key files/functions
5. **Minutes 20-25:** Start Phase 1 of workflow
6. **Minutes 25-30:** Document initial findings

After 30 minutes, you should have:
- ✅ Clear understanding of the problem
- ✅ List of relevant files
- ✅ Initial hypothesis about root cause
- ✅ Ready to dive deep into Phase 2

---

## 💬 When in Doubt

1. **Read the workflow:** `.claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md`
2. **Check the patterns:** `.claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md`
3. **Use the template:** `.claude-docs/templates/proposal-template.md`
4. **Ask yourself:** "What would the #76982 solution do here?"

---

## 🎯 Your Goal

By following this quick start and the detailed workflow, you will produce:

- ✅ A minimal, elegant solution (< 50 lines)
- ✅ Comprehensive test coverage (50-100+ tests)
- ✅ A professional proposal (official format)
- ✅ Complete documentation
- ✅ High confidence in acceptance

**Now go forth and resolve that issue!** 🚀

---

*Good luck! Follow the process, trust the workflow, and produce excellent work.*
