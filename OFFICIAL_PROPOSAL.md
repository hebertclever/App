# Proposal for Issue #76982

## Please re-state the problem that we are trying to solve in this issue.

When a user rejects/deletes an expense from an expense report, the rejected expense appears **duplicated** in the report preview:
1. Once as a "[Deleted request]" text message in the IOU report thread
2. Once as a visible receipt thumbnail in the report preview

This creates confusion as users see the same rejected expense appearing twice in different views, making it unclear whether the expense was actually removed from the report.

---

## What is the root cause of that problem?

The root cause is in the `getTransactionsWithReceipts()` function at `src/libs/ReportUtils.js:1532`.

When `deleteMoneyRequest()` is called (`src/libs/actions/IOU.js:1945`), it performs three operations:
1. Sets the transaction to `null` in Onyx (line 2028-2030)
2. Sets `IOUTransactionID` to `null` in the report action's originalMessage (line 1978)
3. Marks the report action with `isDeletedParentAction: true` (line 1974)

However, `getTransactionsWithReceipts()` doesn't check the deletion state of the linked report action. It relies solely on `TransactionUtils.getAllReportTransactions()`, which filters out `null` transactions but **cannot detect transactions whose actions have been marked as deleted**.

This creates a race condition where:
- The transaction still exists in Onyx temporarily (before becoming null)
- `getAllReportTransactions()` returns it
- `getTransactionsWithReceipts()` includes it in the receipt list
- The report preview shows the receipt thumbnail
- Simultaneously, the IOU report shows "[Deleted request]" because `isDeletedParentAction` is true

**Files involved:**
- `src/libs/ReportUtils.js:1532` - `getTransactionsWithReceipts()`
- `src/components/ReportActionItem/ReportPreview.js:123` - Uses getTransactionsWithReceipts()
- `src/libs/actions/IOU.js:1945` - `deleteMoneyRequest()` sets deletion flags

---

## What changes do you think we should make in order to solve the problem?

Modify `getTransactionsWithReceipts()` in `src/libs/ReportUtils.js:1532` to filter out transactions whose linked report actions have been deleted.

**Implementation:**

```javascript
function getTransactionsWithReceipts(iouReportID) {
    const allTransactions = TransactionUtils.getAllReportTransactions(iouReportID);
    const reportActions = ReportActionsUtils.getAllReportActions(iouReportID);

    // Filter out deleted/rejected transactions by checking their linked report actions
    const activeTransactions = _.filter(allTransactions, (transaction) => {
        if (!transaction?.transactionID) {
            return false;
        }

        // Find the IOU report action linking to this transaction
        const linkedAction = _.find(reportActions, (action) =>
            action?.actionName === CONST.REPORT.ACTIONS.TYPE.IOU &&
            lodashGet(action, 'originalMessage.IOUTransactionID') === transaction.transactionID,
        );

        // Exclude if no valid linked action or if the action is deleted
        return linkedAction && !ReportActionsUtils.isDeletedParentAction(linkedAction);
    });

    return _.filter(activeTransactions, (transaction) => TransactionUtils.hasReceipt(transaction));
}
```

**Why this works:**

1. **Leverages existing deletion check**: Uses `ReportActionsUtils.isDeletedParentAction()` which is the same function used throughout the codebase to check deletion state (see `src/libs/ReportActionsUtils.js:67`)

2. **Handles both deletion scenarios**:
   - When `IOUTransactionID` is null → `_.find()` won't match, linkedAction will be undefined → filtered out
   - When `isDeletedParentAction` is true → explicitly filtered out

3. **Conservative approach**: Filters out transactions without valid linked actions (edge case handling)

4. **Single source of truth**: All callers of `getTransactionsWithReceipts()` benefit automatically:
   - `ReportPreview.js:123` (receipt thumbnails)
   - `areAllRequestsBeingSmartScanned():1577` (scanning status)
   - `hasMissingSmartscanFields():1591` (validation)

**Testing approach:**

Create comprehensive tests covering:
- Transactions with valid actions → should appear
- Transactions with deleted actions (`isDeletedParentAction: true`) → should NOT appear
- Transactions without linked actions → should NOT appear
- Mixed scenarios (some deleted, some active) → only active should appear

---

## What alternative solutions did you explore? (Optional)

### Alternative 1: Fix at Data Layer (TransactionUtils)

Add an `isDeleted` field to Transaction and filter in `getAllReportTransactions()`.

**Why rejected:**
- Requires adding new field to Transaction type
- `TransactionUtils` shouldn't know about report actions (breaks separation of concerns)
- Affects ALL uses of `getAllReportTransactions()`, not just receipts
- Higher risk of regression

### Alternative 2: Fix at Component Level (ReportPreview)

Filter deleted transactions directly in the `ReportPreview` component.

**Why rejected:**
- Violates DRY principle (would need to duplicate in multiple components)
- Puts business logic in UI layer
- Easy to forget in new components that use `getTransactionsWithReceipts()`
- `areAllRequestsBeingSmartScanned()` and `hasMissingSmartscanFields()` would still be broken

### Alternative 3: Fix at Action Level

Create a new helper like `shouldShowReceiptForAction()` and check it everywhere.

**Why rejected:**
- Indirect solution that doesn't address where the problem manifests
- Still requires changes in multiple places
- Unclear ownership of the filtering logic

### Why Our Solution is Best:

The proposed solution fixes the issue at the **optimal abstraction level** - the utility function responsible for returning "transactions with receipts". This ensures:
- Single point of change
- All consumers benefit automatically
- Clear responsibility and intent
- Minimal code changes (21 lines)
- Leverages existing functions (`isDeletedParentAction`)

---

## Additional Notes

**Impact**: Low risk - only affects how receipts are displayed in report previews. The underlying data and deletion logic remain unchanged.

**Performance**: O(n × m) where n = transactions, m = actions. For typical reports (5-10 transactions, 10-20 actions), this is negligible (< 1ms).

**Backwards compatibility**: No breaking changes. This is purely additive filtering logic.