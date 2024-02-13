import {axiosInstance} from "@/plugins/axios";
import {Contract} from "@/modules/contract/types";

interface getContractPayload {
    startDate: string,
    endDate: string,
}

export async function saveContract(contract: Contract) {
    await axiosInstance.post('/contracts', contract);
}

export async function getContracts(payload: getContractPayload) {
    const response = await axiosInstance.get(`/contracts?gte=${payload.startDate}&lte=${payload.endDate}`);
    return response.data;
}

export async function deleteContract(id: string) {
    await axiosInstance.delete(`/contracts/${id}`)
}