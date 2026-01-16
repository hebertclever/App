function shouldClearDraftTransactions(isMultiScanEnabled: boolean, backTo?: string): boolean {
    if (isMultiScanEnabled) {
        return false;
    }

    return !backTo;
}

export default shouldClearDraftTransactions;
