import {axiosInstance} from "@/plugins/axios";
import {getTransactionPayload, Transaction} from "@/modules/transaction/types";
import {isPdfOrXml} from "@/mixins/File";

export async function saveTransaction(transaction: Transaction) {
    if (transaction.xml && transaction.xml) {
        isPdfOrXml(transaction.invoice);
        isPdfOrXml(transaction.xml);
    }
    await axiosInstance.post('/transactions', transaction);
}

export async function getTransactions(payload: getTransactionPayload) {
    let url = `/transactions?gte=${payload.startDate}&lte=${payload.endDate}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    if (payload.category !== 'Todas') {
        url += `&category=${payload.category}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}

export async function getTransaction(id: string) {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
}

export async function deleteTransaction(id: string) {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
}

export async function updateTransaction(transaction: Transaction) {
    const response = await axiosInstance.put(`/transactions/${transaction.id}`, transaction);
    return response.data;
}
