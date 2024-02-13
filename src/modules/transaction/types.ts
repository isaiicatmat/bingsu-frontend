export interface TransactionState{
    transaction: Transaction
}


export interface Transaction {
    concept: string,
    date: string,
    id?: string,
    category: string,
    folio: string,
    amount: string,
    applicationDate: string,
    invoice: string,
    xml: string,
}

export interface getTransactionPayload {
    startDate: string,
    endDate: string,
    userId: string,
    categories: string[],
    category: string,
}