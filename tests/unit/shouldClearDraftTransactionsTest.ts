import shouldClearDraftTransactions from '@pages/iou/request/step/IOURequestStepScan/shouldClearDraftTransactions';

describe('shouldClearDraftTransactions', () => {
    it('returns false when multi-scan is enabled', () => {
        expect(shouldClearDraftTransactions(true, 1)).toBe(false);
        expect(shouldClearDraftTransactions(true, 2)).toBe(false);
    });

    it('returns true when multi-scan is disabled and there is only one transaction', () => {
        expect(shouldClearDraftTransactions(false, 0)).toBe(true);
        expect(shouldClearDraftTransactions(false, 1)).toBe(true);
    });

    it('returns false when multi-scan is disabled but there are multiple transactions', () => {
        expect(shouldClearDraftTransactions(false, 2)).toBe(false);
    });
});

