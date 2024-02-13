export interface ContractState {
    contract: Contract
}

export interface Contract {
    amount: string,
    startDate:  string,
    endDate: string,
    indeterminate: boolean,
    client: string,
    id?: string,
}