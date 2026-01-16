import shouldClearDraftTransactions from '@pages/iou/request/step/IOURequestStepScan/shouldClearDraftTransactions';

describe('shouldClearDraftTransactions', () => {
    it('returns false when multi-scan is enabled', () => {
        expect(shouldClearDraftTransactions(true, false)).toBe(false);
        expect(shouldClearDraftTransactions(true, true)).toBe(false);
    });

    it('returns true when multi-scan is disabled and not replacing', () => {
        expect(shouldClearDraftTransactions(false, false)).toBe(true);
    });

    it('returns false when multi-scan is disabled and replacing', () => {
        expect(shouldClearDraftTransactions(false, true)).toBe(false);
    });
});
