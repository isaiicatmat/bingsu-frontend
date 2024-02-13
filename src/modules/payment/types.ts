export interface PaymentState {
    payment: Payment
}

export interface Payment {
    amount: string,
    date: string,
    uid?: string,
    id?: string
}
