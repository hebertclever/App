# Claude Agent Documentation

> **Purpose**: This directory contains templates, guides, and standards for working on Expensify App issues. Use these resources to maintain consistency and quality across all contributions.

---

## 📁 Directory Structure

```
.claude-docs/
├── README.md                        ← You are here (navigation guide)
├── templates/
│   ├── EXPENSIFY_PROPOSAL_PATTERNS.md  ← Proposal writing standards
│   └── proposal-template.md            ← Ready-to-use proposal template
└── guides/
    └── ISSUE_RESOLUTION_WORKFLOW.md    ← Step-by-step resolution process
```

---

## 🚀 Quick Start for New Issues

### When starting work on a new issue:

1. **Read the workflow first:**
   ```bash
   cat .claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md
   ```
   This is your roadmap. Follow all 10 phases.

2. **Study proposal patterns:**
   ```bash
   cat .claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md
   ```
   Learn what makes proposals successful.

3. **Use the template when ready:**
   ```bash
   cat .claude-docs/templates/proposal-template.md
   ```
   Copy this for your proposal submission.

---

## 📚 Document Descriptions

### Templates

#### `EXPENSIFY_PROPOSAL_PATTERNS.md`
**What it is:** Comprehensive guide to writing winning proposals
**When to use:** Before writing your proposal
**Contains:**
- Official template structure
- Patterns from accepted proposals
- Common mistakes to avoid
- Success metrics (word counts, structure)
- Quick-start template
- Pro tips for demonstrating expertise

**Key sections:**
- Template requirements
- Problem statement best practices
- Root cause depth guidelines
- Solution specificity requirements
- Alternative solution format
- Length guidelines (500-800 words optimal)

#### `proposal-template.md`
**What it is:** Ready-to-use template for GitHub comments
**When to use:** When writing your final proposal
**How to use:**
1. Copy entire file
2. Fill in each section with your content
3. Paste to GitHub issue as comment

**Sections:**
- Problem restatement
- Root cause
- Proposed solution
- Alternative solutions

---

### Guides

#### `ISSUE_RESOLUTION_WORKFLOW.md`
**What it is:** Complete step-by-step methodology
**When to use:** At the start of every issue
**Contains:**
- 10 phases of issue resolution
- Detailed checklists for each phase
- Time estimates per phase
- Quality standards
- Common pitfalls to avoid
- Success metrics

**Phases:**
1. Understanding & Analysis (30-45 min)
2. Root Cause Analysis (45-60 min)
3. Solution Design (30-45 min)
4. Implementation (30-45 min)
5. Testing (60-90 min)
6. Proposal Writing (45-60 min)
7. Documentation (30-45 min)
8. Commit & Push (15-30 min)
9. Submit Proposal (10-15 min)
10. Quality Checklist (15-20 min)

**Total time:** 5-7 hours for thorough resolution

---

## 🎯 Success Pattern (Issue #76982)

These documents are based on the successful resolution of issue #76982:

**What we achieved:**
- ✅ 21-line minimal solution
- ✅ 100+ comprehensive tests
- ✅ Official format proposal
- ✅ 4 alternatives evaluated
- ✅ Zero breaking changes
- ✅ Complete documentation

**This is the standard to replicate.**

---

## 📋 Workflow Summary (TL;DR)

For experienced contributors who've read the full workflow:

```
1. Read issue completely → Understand the problem
2. Explore codebase → Find root cause (file:line)
3. Design solution → Evaluate 3-5 approaches
4. Implement → Keep it minimal (< 50 lines)
5. Test thoroughly → 50-100+ tests
6. Write proposal → Follow template exactly
7. Document → Create comparison & summary
8. Commit & push → Descriptive messages
9. Submit → Post to GitHub issue
10. Quality check → Verify all criteria met
```

**Critical rules:**
- ✅ Plain English, brief, no jargon
- ✅ Reference existing patterns ("Similar to X at line Y")
- ✅ Show file:line locations
- ✅ Evaluate 3+ alternatives
- ✅ 500-800 words total

---

## 🔍 How to Use These Docs

### Scenario 1: Starting a new issue
```bash
# Step 1: Read the workflow
less .claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md

# Step 2: Follow Phase 1 (Understanding)
# ... work through each phase ...

# Step 3: When ready to write proposal, read patterns
less .claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md

# Step 4: Use the template
cp .claude-docs/templates/proposal-template.md MY_PROPOSAL.md
# Fill in your content
```

### Scenario 2: Need a quick template
```bash
# Just copy and fill
cat .claude-docs/templates/proposal-template.md
```

### Scenario 3: Reviewing proposal quality
```bash
# Check against patterns
grep -A 10 "Checklist for Winning Proposals" \
  .claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md
```

### Scenario 4: Estimating time
```bash
# See time budget in workflow
grep -A 15 "Time Budget" \
  .claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md
```

---

## ⚠️ Important Notes

### DO:
- ✅ Read workflow completely before starting
- ✅ Follow all 10 phases in order
- ✅ Use existing patterns and functions
- ✅ Write 50-100+ tests
- ✅ Keep proposals 500-800 words
- ✅ Reference codebase (file:line)
- ✅ Evaluate 3+ alternatives

### DON'T:
- ❌ Skip root cause analysis
- ❌ Write code before designing solution
- ❌ Submit without comprehensive tests
- ❌ Use jargon in proposals
- ❌ Ignore the template structure
- ❌ Post large code diffs
- ❌ Forget to reference existing patterns

---

## 🔄 Maintenance

These documents should be updated when:
- New successful patterns are discovered
- Official Expensify guidelines change
- Workflow improvements are identified
- New categories of issues are encountered

**Last major update:** 2025-12-09 (Based on #76982)

---

## 📞 Quick Reference Links

### External Resources
- [Official Proposal Template](https://github.com/Expensify/App/blob/main/contributingGuides/PROPOSAL_TEMPLATE.md)
- [Contributing Guidelines](https://github.com/Expensify/App/blob/main/contributingGuides/CONTRIBUTING.md)
- [Style Guide](https://github.com/Expensify/App/blob/main/contributingGuides/STYLE.md)
- [Closed Issues (Examples)](https://github.com/Expensify/App/issues?q=is%3Aissue+state%3Aclosed+label%3AExternal)

### Internal Guides
- [Workflow](.claude-docs/guides/ISSUE_RESOLUTION_WORKFLOW.md)
- [Proposal Patterns](.claude-docs/templates/EXPENSIFY_PROPOSAL_PATTERNS.md)
- [Template](.claude-docs/templates/proposal-template.md)

---

## 🎓 Philosophy

These documents embody a philosophy of:

1. **Quality over Speed** - Take time to do it right
2. **Systematic Approach** - Follow proven processes
3. **Learn from Success** - Based on real accepted proposals
4. **Minimize Risk** - Comprehensive testing and evaluation
5. **Clear Communication** - Plain English, well-structured
6. **Respect Existing Patterns** - Leverage what's already there

**Goal:** Consistently produce professional-grade solutions that get accepted on first submission.

---

## 📈 Success Metrics

A successful issue resolution has:
- ✅ Minimal code changes (< 50 lines ideal)
- ✅ Comprehensive tests (50-100+)
- ✅ Clear proposal (500-800 words)
- ✅ Multiple alternatives evaluated (3+)
- ✅ References to existing patterns
- ✅ Zero breaking changes
- ✅ Complete documentation
- ✅ Follows official template exactly

**If you achieve all of these, your proposal has a high chance of acceptance.**

---

*These documents represent the collective knowledge from successfully resolving Expensify App issues. Use them as your foundation for excellence.*
