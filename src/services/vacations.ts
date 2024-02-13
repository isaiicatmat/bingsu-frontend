import {axiosInstance} from "@/plugins/axios";

interface getVacationsPayload {
    startDate: string,
    endDate: string,
    uid: string
}

export async function getVacations(payload: getVacationsPayload) {
    let endpoint = '/vacations?';

    if (payload.uid) {
        endpoint += `uid=${payload.uid}&`;
    }

    if (payload.startDate && payload.endDate) {
        endpoint += `lte=${payload.endDate}&gte=${payload.startDate}&`;
    }

    const response = await axiosInstance.get(endpoint);
    return response.data;
}
