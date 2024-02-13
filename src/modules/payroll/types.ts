export interface PayrollState {
  payroll: Payroll
}

export interface Payroll {
  uid?: string,
  id?: string,
  date: string,
  file: string,
  type: string,
}

export interface PayrollPayload {
  startDate: string,
  endDate: string,
  userId: string,
}