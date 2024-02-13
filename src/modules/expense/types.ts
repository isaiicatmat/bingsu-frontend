export interface ExpenseState{
    expense: Expense
}
export interface Expense{
    concept: string,
    cardDateOut: string,
    id?: string,
    cardDateIn: string,
    amount: string,
    folio: string,
    invoice: string,
    xml: string
}

export interface getExpensePayload {
    startDate: string,
    endDate: string,
    userId: string,
}