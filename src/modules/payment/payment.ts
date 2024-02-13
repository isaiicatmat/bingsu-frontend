import {Payment, PaymentState} from "@/modules/payment/types";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {savePayment, getPayments, deletePayment, getPayment, updatePayment} from "@/services/payment";

export const state: PaymentState = {
    payment: {
        amount: "",
        date: "",
    }
}

const actions: ActionTree<PaymentState, RootState> = {
    async SAVE_PAYMENT(_, payment: Payment) {
        await savePayment(payment);
    },
    async GET_PAYMENTS(_, payload) {
        return await getPayments(payload);
    },
    async DELETE_PAYMENT(_, id) {
        return await deletePayment(id);
    },
    async GET_PAYMENT(_, id) {
        return await getPayment(id);
    },
    async UPDATE_PAYMENT(_, payment: Payment) {
        return await updatePayment(payment);
    },
}

const mutations: MutationTree<PaymentState> = {
    SET_PAYMENT(state, payment: Payment) {
        state.payment = payment;
    }
}

const getters: GetterTree<PaymentState, RootState> = {
    PAYMENT(state) {
        return state.payment;
    }
}


export const payment: Module<PaymentState, RootState> = {
    state,
    actions,
    getters,
    mutations
}
