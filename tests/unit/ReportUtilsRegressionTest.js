/**
 * Regression tests for bug #76982
 * Tests edge cases and potential false positives/negatives
 */
import Onyx from 'react-native-onyx';
import CONST from '../../src/CONST';
import ONYXKEYS from '../../src/ONYXKEYS';
import * as ReportUtils from '../../src/libs/ReportUtils';
import waitForBatchedUpdates from '../utils/waitForBatchedUpdates';

describe('ReportUtils - Bug #76982 Regression Tests', () => {
    const IOU_REPORT_ID = 'regressionReport';
    const TRANS_ID_1 = 'regTrans1';
    const TRANS_ID_2 = 'regTrans2';
    const ACTION_ID_1 = 'regAction1';
    const ACTION_ID_2 = 'regAction2';

    beforeAll(() => {
        Onyx.init({
            keys: ONYXKEYS,
            registerStorageEventListener: () => {},
        });
    });

    beforeEach(() => {
        global.fetch = jest.fn();
        return Onyx.clear().then(waitForBatchedUpdates);
    });

    afterEach(() => {
        jest.clearAllMocks();
        return Onyx.clear().then(waitForBatchedUpdates);
    });

    describe('False Negative Tests (should NOT show deleted transactions)', () => {
        it('should not show transaction when action IOUTransactionID is set to null (simulating delete)', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            // This simulates the state AFTER deleteMoneyRequest sets IOUTransactionID to null
            const deletedAction = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: null, // Set to null when deleted
                },
                message: [{
                    type: 'COMMENT',
                    html: '',
                    text: '',
                    isDeletedParentAction: true,
                }],
                childVisibleActionCount: 1,
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: deletedAction,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Transaction should be filtered out because linkedAction won't be found
                    // (IOUTransactionID is null, so _.find won't match)
                    expect(result).toHaveLength(0);
                });
        });

        it('should not show transaction when action has isDeletedParentAction true', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            // This simulates state where IOUTransactionID still points to transaction
            // but isDeletedParentAction flag is set
            const deletedAction = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1, // Still points to transaction
                },
                message: [{
                    isDeletedParentAction: true,
                }],
                childVisibleActionCount: 1,
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: deletedAction,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Transaction should be filtered by isDeletedParentAction check
                    expect(result).toHaveLength(0);
                });
        });

        it('should not show deleted transaction among multiple active transactions', () => {
            const activeTransaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt1.jpg'},
            };

            const deletedTransaction = {
                transactionID: TRANS_ID_2,
                reportID: IOU_REPORT_ID,
                amount: 3000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt2.jpg'},
            };

            const activeAction = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
            };

            const deletedAction = {
                reportActionID: ACTION_ID_2,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_2,
                },
                message: [{
                    isDeletedParentAction: true,
                }],
                childVisibleActionCount: 1,
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: activeTransaction,
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_2}`]: deletedTransaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: activeAction,
                    [ACTION_ID_2]: deletedAction,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    expect(result).toHaveLength(1);
                    expect(result[0].transactionID).toBe(TRANS_ID_1);
                });
        });
    });

    describe('False Positive Tests (should NOT filter valid transactions)', () => {
        it('should show transaction with valid linked action', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            const validAction = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: validAction,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    expect(result).toHaveLength(1);
                    expect(result[0].transactionID).toBe(TRANS_ID_1);
                });
        });

        it('should show transaction when isDeletedParentAction is false', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            const action = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
                message: [{
                    isDeletedParentAction: false,
                }],
                childVisibleActionCount: 1,
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: action,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    expect(result).toHaveLength(1);
                });
        });

        it('should show transaction when isDeletedParentAction is true but childVisibleActionCount is 0', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            // isDeletedParentAction requires childVisibleActionCount > 0 to return true
            const action = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
                message: [{
                    isDeletedParentAction: true,
                }],
                childVisibleActionCount: 0, // This makes isDeletedParentAction return false
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: action,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Should include because isDeletedParentAction returns false
                    expect(result).toHaveLength(1);
                });
        });
    });

    describe('Edge Case Tests', () => {
        it('should handle transaction without linked action (conservative filtering)', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            // No report actions at all
            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {},
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Conservative: filter out transactions without valid linked actions
                    expect(result).toHaveLength(0);
                });
        });

        it('should handle action with wrong actionName', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            const wrongTypeAction = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.ADDCOMMENT, // Not IOU
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: wrongTypeAction,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Should filter because action is not IOU type
                    expect(result).toHaveLength(0);
                });
        });

        it('should handle null/undefined report actions gracefully', () => {
            const transaction = {
                transactionID: TRANS_ID_1,
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Should handle gracefully and return empty
                    expect(result).toHaveLength(0);
                });
        });

        it('should handle transaction without transactionID', () => {
            const transaction = {
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/receipt.jpg'},
                // No transactionID
            };

            const action = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: transaction,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: action,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // Should filter out transaction without transactionID
                    expect(result).toHaveLength(0);
                });
        });

        it('should handle null transaction objects', () => {
            const action = {
                reportActionID: ACTION_ID_1,
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANS_ID_1,
                },
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}${TRANS_ID_1}`]: null,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    [ACTION_ID_1]: action,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);
                    // getAllReportTransactions already filters null transactions
                    expect(result).toHaveLength(0);
                });
        });
    });

    describe('Exact Bug #76982 Scenario', () => {
        it('should replicate and fix the exact bug scenario from #76982', () => {
            // Setup: 2 expenses created, 1 submitted, then 1 rejected
            const expense1 = {
                transactionID: 'expense1',
                reportID: IOU_REPORT_ID,
                amount: 10000,
                currency: 'USD',
                receipt: {source: 'https://example.com/expense1.jpg'},
                merchant: 'Restaurant A',
            };

            const expense2 = {
                transactionID: 'expense2',
                reportID: IOU_REPORT_ID,
                amount: 5000,
                currency: 'USD',
                receipt: {source: 'https://example.com/expense2.jpg'},
                merchant: 'Store B',
            };

            const action1 = {
                reportActionID: 'action1',
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: 'expense1',
                },
            };

            // Expense 2 was rejected - this is the state after rejection
            const action2Rejected = {
                reportActionID: 'action2',
                actionName: CONST.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: null, // Set to null when rejected
                },
                message: [{
                    type: 'COMMENT',
                    html: '',
                    text: '',
                    isEdited: true,
                    isDeletedParentAction: true,
                }],
                childVisibleActionCount: 1,
                pendingAction: 'UPDATE',
            };

            return Onyx.multiSet({
                [`${ONYXKEYS.COLLECTION.TRANSACTION}expense1`]: expense1,
                [`${ONYXKEYS.COLLECTION.TRANSACTION}expense2`]: expense2,
                [`${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${IOU_REPORT_ID}`]: {
                    action1: action1,
                    action2: action2Rejected,
                },
            })
                .then(waitForBatchedUpdates)
                .then(() => {
                    const result = ReportUtils.getTransactionsWithReceipts(IOU_REPORT_ID);

                    // BEFORE FIX: Would return 2 transactions (duplicated expense)
                    // AFTER FIX: Should return only 1 transaction (the active one)
                    expect(result).toHaveLength(1);
                    expect(result[0].transactionID).toBe('expense1');
                    expect(result[0].merchant).toBe('Restaurant A');

                    // Verify rejected expense is NOT in results
                    const hasRejectedExpense = result.some((t) => t.transactionID === 'expense2');
                    expect(hasRejectedExpense).toBe(false);
                });
        });
    });
});
