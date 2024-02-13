import {axiosInstance} from "@/plugins/axios";
import {Payment} from "@/modules/payment/types";

interface getPaymentPayload {
    uid: string,
    startDate: string,
    endDate: string
}

export async function savePayment(payment: Payment) {
    await axiosInstance.post('/payments', payment);
}

export async function deletePayment(id: string) {
    await axiosInstance.delete(`/payments/${id}`);
}

export async function getPayment(id: string) {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
}

export async function updatePayment(payment: Payment) {
    await axiosInstance.put(`/payments/${payment.id}`, payment);
}

export async function getPayments(payload: getPaymentPayload) {
    let url = `/payments?gte=${payload.startDate}&lte=${payload.endDate}&`;

    if (payload.uid) {
        url += `uid=${payload.uid}&`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}
