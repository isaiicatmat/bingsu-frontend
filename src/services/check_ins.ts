import { axiosInstance } from "@/plugins/axios";
import { CheckIn, getCheckInPayload } from "@/modules/checkin/types";

export async function saveCheckIn(checkIn: CheckIn) {
    await axiosInstance.post('/check_ins', checkIn);
}


export async function getCheckIns(payload: getCheckInPayload) {
    let url = `/check_ins?gte=${payload.startDate}&lte=${payload.endDate}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}