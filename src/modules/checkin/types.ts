export interface CheckInState{
    checkIn: CheckIn
}

export interface CheckIn {
    date: string,
    id?: string,
}

export interface getCheckInPayload {
    startDate: string,
    endDate: string,
    userId: string
}