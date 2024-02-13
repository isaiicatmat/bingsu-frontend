import { isPDF } from "@/mixins/File";
import { Payroll, PayrollPayload } from "@/modules/payroll/types";
import { axiosInstance } from "@/plugins/axios";

export async function savePayroll(payroll: Payroll) {
  if (payroll.file) {
    isPDF(payroll.file);
  }
  await axiosInstance.post('/payrolls', payroll);
}

export async function getPayrolls(payload: PayrollPayload) {
  let endpoint = '/payrolls?';

  if (payload.userId) {
    endpoint += `uid=${payload.userId}&`
  }

  if (payload.startDate && payload.endDate) {
    endpoint += `lte=${payload.endDate}&gte=${payload.startDate}&`
  }

  const response = await axiosInstance.get(endpoint);
  return response.data;
}

export async function getPayroll(payload: Payroll) {
  let endpoint = `/payrolls/${payload.id}?`;
  
  if (payload.uid) {
    endpoint += `uid=${payload.uid}&`
  }


  const response = await axiosInstance.get(endpoint);
  return response.data;
}

export async function deletePayroll(id: string) {
  await axiosInstance.delete(`/payrolls/${id}`);
}