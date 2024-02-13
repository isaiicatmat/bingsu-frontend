import { Payroll, PayrollState } from "./types";
import { ActionTree, Module } from "vuex";
import { RootState } from "@/store/types";
import { deletePayroll, getPayroll, getPayrolls, savePayroll } from "@/services/payrolls";

export const state: PayrollState = {
  payroll: {
    date: "",
    file: "",
    type: "",
    uid: "", 
  }
};

const actions: ActionTree<PayrollState, RootState> = {
  async SAVE_PAYROLL(_, payroll: Payroll) {
    await savePayroll(payroll)
  },
  async GET_PAYROLLS(_, payload) {
    return getPayrolls(payload);
  },
  async DELETE_PAYROLL(_, id) {
    return deletePayroll(id);
  },
  async GET_PAYROLL(_, payload) {
    return getPayroll(payload);
  }
}

export const payroll: Module<PayrollState, RootState> = {
  state,
  actions,
}