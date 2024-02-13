import {axiosInstance} from "@/plugins/axios";
import {getExpensePayload, Expense} from "@/modules/expense/types";
import {isPdfOrXml} from "@/mixins/File"

export async function saveExpense(expense: Expense) {
    if(expense.xml && expense.xml) {
        isPdfOrXml(expense.invoice);
        isPdfOrXml(expense.xml);
    }
    await axiosInstance.post('/expenses', expense);
}

export async function getExpenses(payload: getExpensePayload) {
    let url = `/expenses?gte=${payload.startDate}&lte=${payload.endDate}`;

    if (payload.userId) {
        url += `&uid=${payload.userId}`
    }

    const response = await axiosInstance.get(url);
    return response.data;
}

export async function getExpense(id: string) {
    const response = await axiosInstance.get(`/expenses/${id}`);
    return response.data;
}

export async function deleteExpense(id: string) {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
}

export async function updateExpense(expense: Expense) {
    const response = await axiosInstance.put(`/expenses/${expense.id}`, expense);
    return response.data;
}
