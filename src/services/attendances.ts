import { axiosInstance } from "@/plugins/axios";
import { Attendance, getAttendancePayload } from "@/modules/attendance/types";

export async function saveAttendance(attendance: Attendance) {
    await axiosInstance.post('/attendances', attendance);
}

export async function getAttendances(payload: getAttendancePayload) {
    let url = `/attendances?gte=${payload.startDate}&lte=${payload.endDate}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}

export async function getAttendancesOut(payload: getAttendancePayload) {
    let url = `/attendances?gt=${payload.startDateOut}&lt=${payload.endDateOut}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}
export async function getAttendance(id: string) {
    const response = await axiosInstance.get(`/attendances/${id}`);
    return response.data;
}

export async function updateAttendance(attendance: Attendance) {
    const response = await axiosInstance.put(`/attendances/${attendance.id}`, attendance);
    return response.data
}

export async function saveAttendances(attendances: Attendance[]) {
    return await axiosInstance.post(`/attendances/create_or_update_many`, {
        attendances: attendances
    });
}
