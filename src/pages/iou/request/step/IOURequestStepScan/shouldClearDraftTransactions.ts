function shouldClearDraftTransactions(isMultiScanEnabled: boolean, transactionCount: number): boolean {
    if (isMultiScanEnabled) {
        return false;
    }

    return transactionCount <= 1;
}

export default shouldClearDraftTransactions;

