import shouldClearDraftTransactions from '@pages/iou/request/step/IOURequestStepScan/shouldClearDraftTransactions';

describe('shouldClearDraftTransactions', () => {
    it('returns false when multi-scan is enabled', () => {
        expect(shouldClearDraftTransactions(true)).toBe(false);
        expect(shouldClearDraftTransactions(true, 'someRoute')).toBe(false);
    });

    it('returns true when multi-scan is disabled and there is no backTo param', () => {
        expect(shouldClearDraftTransactions(false)).toBe(true);
        expect(shouldClearDraftTransactions(false, '')).toBe(true);
    });

    it('returns false when multi-scan is disabled and backTo is present', () => {
        expect(shouldClearDraftTransactions(false, 'someRoute')).toBe(false);
    });
});
