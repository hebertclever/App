# Expensify Proposal Patterns (Learned from Accepted Proposals)

## 📋 Official Template Structure

Based on `contributingGuides/PROPOSAL_TEMPLATE.md`:

1. **Problem Statement** - "Please re-state the problem that we are trying to solve in this issue."
2. **Root Cause** - "What is the root cause of that problem?"
3. **Proposed Solution** - "What changes do you think we should make in order to solve the problem?"
4. **Alternative Approaches** (Optional) - "What alternative solutions did you explore?"

---

## 🎯 Key Requirements from Contributing Guidelines

### Format Guidelines
- ✅ Use plain English, be brief, avoid jargon
- ✅ Use images, charts, or pseudo-code if necessary
- ❌ NO large code diffs
- ❌ NO lengthy prose
- ⚠️ Only ONE proposal per issue
- 🔴 **ALL NEW PROPOSALS MUST BE DIFFERENT FROM EXISTING PROPOSALS**

### Problem Statement Best Practices
- Follow cause-and-effect: "When X happens, it causes Y, which prevents us from Z"
- ❌ Avoid reverse solution statements (describing fix instead of problem)
- ❌ Avoid vague language like "inefficient" or "error-prone" without measurable impact
- ❌ Don't bundle multiple unrelated problems
- ❌ Don't miss the actual consequence
- ✅ Multiple viable solutions = good problem-focused statement

### Testing Requirements
- Test on ALL 5 platforms: Web, iOS, Android, Mobile Web, macOS
- Include numbered steps for each platform in PR
- Provide screenshots for every platform
- Create high-traffic test accounts for staging/production

### Technical Requirements
- Follow JavaScript/React style guide
- All commits must be GPG-signed
- Sign Contributor License Agreement
- Pass all tests and lint checks

---

## 🏆 Patterns from Accepted Proposals

### Pattern 1: Problem Statement Style

**Good Examples:**
```
"When clicking the header in a self DM report, the header displays incorrect
information and navigates to the wrong profile."

"When a user replies in thread to the 'moved this expense to your personal space'
system message, the thread title in LHN displays raw HTML tags instead of plain text."
```

**Characteristics:**
- User-centric ("When a user...")
- Specific action trigger
- Clear consequence
- Reproducible scenario

### Pattern 2: Root Cause Depth

**Winning format includes:**
- Specific file location (`App/src/libs/ReportUtils.ts`, line 5701-5702)
- Function name responsible (`getReportName`)
- Technical explanation of WHY it happens
- Reference to related code or PR that introduced it

**Example:**
```
The issue emerged after PR #75542 allowed zero-amount expenses. The code added
a check for `transaction?.comment?.customUnit?.name`, which remains undefined
in certain scenarios, causing the pending state to display.
```

**What makes it excellent:**
- Points to PR that caused regression
- Explains the specific condition check
- Shows understanding of data flow

### Pattern 3: Solution Specificity

**Winning solutions:**
- ✅ Provide exact file:line locations
- ✅ Show minimal code changes
- ✅ Reference existing patterns in codebase
- ✅ Demonstrate why it works technically
- ✅ Note what functions are already imported

**Example structure:**
```javascript
// In src/libs/ReportUtils.ts (line 5701)
// Current code returns HTML
return getUnreportedTransactionMessage();

// Proposed change - wrap with Parser (already imported line 15)
return Parser.htmlToText(getUnreportedTransactionMessage());

// Why: Parser.htmlToText() is used in similar context at OptionsListUtils line 785
```

**What makes it win:**
- Shows "already imported" (no new dependencies)
- References similar usage elsewhere (proves pattern exists)
- Minimal change
- Clear before/after

### Pattern 4: Demonstrating Codebase Knowledge

**Phrases that show expertise:**
- "Parser is already imported at line X"
- "This pattern is used in OptionsListUtils line 785"
- "Similar to how we handle X in ComponentName"
- "This is consistent with existing check in FileY:LineZ"

**What this does:**
- Proves you've studied the codebase
- Shows solution fits existing patterns
- Reduces reviewer concern about consistency

### Pattern 5: Alternative Solutions Format

**Structure:**
```
### Alternative 1: [Brief name]
[Description]

**Why rejected:**
- ❌ Reason 1
- ❌ Reason 2

### Alternative 2: [Brief name]
[Description]

**Why rejected:**
- ❌ Reason 1

**Why our solution is best:**
- ✅ Advantage 1
- ✅ Advantage 2
```

**Key points:**
- Show you considered multiple approaches
- Explain rejection reasons clearly
- End with positive comparison

---

## 📐 Length and Detail Guidelines

### Problem Statement
- **Length**: 2-4 sentences
- **Focus**: User impact, not technical details
- **Include**: Specific trigger and consequence

### Root Cause
- **Length**: 1-2 paragraphs (150-300 words)
- **Include**:
  - File paths with line numbers
  - Function names
  - Technical explanation
  - Related PRs/issues if applicable

### Proposed Solution
- **Length**: 2-3 paragraphs + code snippet
- **Include**:
  - Exact change location
  - Code example (10-30 lines max)
  - Technical justification ("Why this works")
  - Impact on other parts of system
- **Format**: Use code blocks with syntax highlighting

### Alternative Solutions
- **Length**: 1 paragraph per alternative
- **Number**: 2-3 alternatives maximum
- **Include**: Brief description + rejection reasons

---

## ✅ Checklist for Winning Proposals

Before submitting:

**Problem Statement:**
- [ ] States user-facing impact
- [ ] Includes specific trigger
- [ ] Describes observable consequence
- [ ] Avoids technical jargon
- [ ] Is reproducible

**Root Cause:**
- [ ] Provides file paths with line numbers
- [ ] Names specific functions/variables
- [ ] Explains WHY technically
- [ ] References related PRs/issues if relevant
- [ ] Shows data flow understanding

**Proposed Solution:**
- [ ] Exact file:line locations
- [ ] Minimal code snippet (< 30 lines)
- [ ] References existing patterns
- [ ] Notes what's already imported
- [ ] Explains technical reasoning
- [ ] Lists affected callers/consumers
- [ ] Shows understanding of side effects

**Alternative Solutions:**
- [ ] Shows 2-3 alternatives considered
- [ ] Clear rejection reasons
- [ ] Comparative advantages listed

**Overall:**
- [ ] Plain English (no jargon)
- [ ] Brief (avoid lengthy prose)
- [ ] No large code diffs
- [ ] Professional tone
- [ ] Demonstrates codebase knowledge

---

## 🚫 Common Mistakes to Avoid

### ❌ Mistake 1: Solution-Focused Problem Statement
**Bad:**
"We should filter deleted transactions in getTransactionsWithReceipts"

**Good:**
"Deleted expenses appear duplicated in the report preview"

### ❌ Mistake 2: Vague Root Cause
**Bad:**
"The function doesn't handle deleted transactions properly"

**Good:**
"getTransactionsWithReceipts() at line 1532 doesn't check isDeletedParentAction flag set by deleteMoneyRequest() at line 1974"

### ❌ Mistake 3: Too Much Code
**Bad:**
Pasting 100+ lines of code diff

**Good:**
10-20 lines showing the specific change with context

### ❌ Mistake 4: No References to Existing Patterns
**Bad:**
"Add this new function to handle it"

**Good:**
"Use existing isDeletedParentAction() helper (same pattern as shouldReportActionBeVisible at line 337)"

### ❌ Mistake 5: Ignoring Alternative Solutions
**Bad:**
Only providing one solution

**Good:**
Showing 2-3 alternatives and explaining why yours is best

---

## 💡 Pro Tips

### Tip 1: Study Similar Fixed Issues
Before proposing, search closed issues with similar problems and see what made those proposals win.

### Tip 2: Reference Existing Patterns
Reviewers love when you show awareness of existing codebase patterns. Use phrases like:
- "Similar to how we handle X in Y"
- "Following the pattern in Z"
- "Consistent with existing check in..."

### Tip 3: Show Impact Analysis
Mention what else is affected:
- "This change benefits all 3 callers: A, B, and C"
- "No breaking changes to existing API"
- "Backwards compatible with..."

### Tip 4: Be Conservative
When in doubt, prefer filtering/excluding over showing potentially bad data:
- "Conservative approach: filter when unclear"
- "Safer to exclude edge case than risk duplication"

### Tip 5: Demonstrate Testing Thought
Show you've thought about testing:
- "Testing approach: cover scenarios X, Y, Z"
- "Edge cases to test: A, B, C"
- "Regression tests needed for..."

---

## 📊 Success Metrics (Based on Accepted Proposals)

**Optimal proposal length:**
- Problem: 2-4 sentences
- Root Cause: 150-300 words
- Solution: 200-400 words + 10-30 lines code
- Alternatives: 100-200 words
- **Total: 500-800 words**

**Code snippet size:**
- Main solution: 10-30 lines
- Context snippets: 3-5 lines each
- **Total: 20-50 lines maximum**

**File references:**
- Minimum: 2-3 specific file:line citations
- Optimal: 4-6 specific locations
- Include: Function names, variable names

---

## 🎯 Template for Quick Start

```markdown
# Proposal

## Please re-state the problem that we are trying to solve in this issue.

[User-centric description: "When user does X, Y happens, which prevents Z"]

## What is the root cause of that problem?

[Technical explanation with file:line references]

The issue is in `src/path/to/file.js:123` where `functionName()` does X.

When [trigger] happens, it causes [technical consequence] because [reason].

**Files involved:**
- `src/file1.js:123` - [what it does]
- `src/file2.js:456` - [how it relates]

## What changes do you think we should make in order to solve the problem?

[Description of change]

```javascript
// In src/path/to/file.js:123
// Proposed change (MyFunction already imported)
```

**Why this works:**
- [Technical justification]
- [Reference to existing pattern]
- [Impact analysis]

## What alternative solutions did you explore?

**Alt 1**: [Brief description]
- ❌ [Rejection reason 1]
- ❌ [Rejection reason 2]

**Alt 2**: [Brief description]
- ❌ [Rejection reason]

**Why our solution is best:**
- ✅ [Advantage 1]
- ✅ [Advantage 2]
```

---

## 🔗 Resources

- [Official Template](https://github.com/Expensify/App/blob/main/contributingGuides/PROPOSAL_TEMPLATE.md)
- [Contributing Guidelines](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md)
- [Style Guide](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md)
- [Closed Issues for Examples](https://github.com/Expensify/App/issues?q=is%3Aissue+state%3Aclosed+label%3AExternal+label%3A%22Help+Wanted%22)

---

*Last updated based on analysis of accepted proposals from issues #76845, #76426, #75942, and contributing guidelines.*