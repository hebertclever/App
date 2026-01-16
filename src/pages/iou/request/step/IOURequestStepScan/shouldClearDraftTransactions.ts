function shouldClearDraftTransactions(isMultiScanEnabled: boolean, isReplacingReceipt: boolean): boolean {
    if (isMultiScanEnabled) {
        return false;
    }

    return !isReplacingReceipt;
}

export default shouldClearDraftTransactions;
