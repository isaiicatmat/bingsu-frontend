export interface PermissionState {
    permission: Permission
}

export interface Permission {
    id?: string,
    uid?: string,
    description: string,
    request: string,
    status: string,
    startDate: string,
    endDate: string,
    type: string,
    availableDays: string,
    vacationId: string,
}

