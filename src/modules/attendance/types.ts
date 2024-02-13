export interface AttendanceState{
    attendance: Attendance
}
export interface Attendance{
    in: string,
    out?: string,
    id?: string,
    date: string,
    summary: string,
    uid?: string
}

export interface getAttendancePayload {
    startDate: string,
    endDate: string,
    startDateOut: string,
    endDateOut: string,
    userId?: string,
}
