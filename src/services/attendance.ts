import {axiosInstance} from "@/plugins/axios";
import { getAttendancePayload} from "@/modules/attendance/types";

export async function getAttendanceRecord(payload: getAttendancePayload) {
    let url = `/attendances?gte=${payload.startDate}&lte=${payload.endDate}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}
