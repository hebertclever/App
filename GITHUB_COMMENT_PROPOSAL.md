# Proposal

## Please re-state the problem that we are trying to solve in this issue.

When a user rejects/deletes an expense, it appears **duplicated** in the report:
- Once as "[Deleted request]" in the IOU report thread
- Once as a visible receipt thumbnail in the report preview

## What is the root cause of that problem?

The `getTransactionsWithReceipts()` function (`src/libs/ReportUtils.js:1532`) doesn't check if the linked report action has been deleted.

When `deleteMoneyRequest()` runs (`src/libs/actions/IOU.js:1945`), it:
1. Sets transaction to `null` in Onyx (line 2028)
2. Sets `IOUTransactionID` to `null` (line 1978)
3. Marks action with `isDeletedParentAction: true` (line 1974)

But `getTransactionsWithReceipts()` only relies on `getAllReportTransactions()`, which filters null transactions but **can't detect transactions with deleted actions**. This creates a race condition where the transaction still exists but its action is marked deleted, causing the duplication.

## What changes do you think we should make in order to solve the problem?

Filter transactions by checking their linked report action's deletion state in `getTransactionsWithReceipts()`:

```javascript
function getTransactionsWithReceipts(iouReportID) {
    const allTransactions = TransactionUtils.getAllReportTransactions(iouReportID);
    const reportActions = ReportActionsUtils.getAllReportActions(iouReportID);

    const activeTransactions = _.filter(allTransactions, (transaction) => {
        if (!transaction?.transactionID) {
            return false;
        }

        // Find the IOU action linking to this transaction
        const linkedAction = _.find(reportActions, (action) =>
            action?.actionName === CONST.REPORT.ACTIONS.TYPE.IOU &&
            lodashGet(action, 'originalMessage.IOUTransactionID') === transaction.transactionID,
        );

        // Filter if no action or if action is deleted
        return linkedAction && !ReportActionsUtils.isDeletedParentAction(linkedAction);
    });

    return _.filter(activeTransactions, (transaction) => TransactionUtils.hasReceipt(transaction));
}
```

**Why this works:**
- Leverages existing `isDeletedParentAction()` check (same pattern used in `shouldReportActionBeVisible()` at `ReportActionsUtils.js:337`)
- Handles both deletion paths: `IOUTransactionID = null` and `isDeletedParentAction = true`
- Benefits all 3 callers automatically: `ReportPreview.js:123`, `areAllRequestsBeingSmartScanned():1577`, `hasMissingSmartscanFields():1591`
- Conservative: filters transactions without valid linked actions (edge case safety)

## What alternative solutions did you explore?

**Alt 1 - Data Layer**: Add `isDeleted` field to Transaction and filter in `getAllReportTransactions()`
- ❌ Breaks separation of concerns (TransactionUtils shouldn't know about actions)
- ❌ Requires type changes
- ❌ Affects all uses of getAllReportTransactions

**Alt 2 - Component Level**: Filter in ReportPreview component
- ❌ Violates DRY (needs duplication in multiple components)
- ❌ Business logic in UI layer

**Alt 3 - Action Level**: New helper like `shouldShowReceiptForAction()`
- ❌ Indirect solution
- ❌ Still needs changes in multiple places

**Our solution wins because:**
- ✅ Right abstraction level (utility function)
- ✅ Single point of change
- ✅ Minimal code (21 lines)
- ✅ Uses existing patterns
- ✅ All consumers benefit automatically