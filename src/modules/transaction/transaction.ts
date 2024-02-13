import {GetterTree, MutationTree} from 'vuex'
import {ActionTree} from "vuex";
import {RootState} from "@/store/types";
import { TransactionState } from './types';
import {Module} from "vuex";
import {Transaction} from './types';
import {saveTransaction, getTransactions, getTransaction, deleteTransaction, updateTransaction} from '@/services/transactions';

export const state: TransactionState = {
    transaction: {
        concept: "",
        date: "",
        category: "",
        amount: "",
        folio: "",
        invoice: "",
        xml: "",
        applicationDate: "",
    }
};


const actions: ActionTree<TransactionState, RootState> = {
    async SAVE_TRANSACTION(_, transaction: Transaction) {
        await saveTransaction(transaction);
    },
    async GET_TRANSACTIONS(_, payload) {
        return getTransactions(payload);
    },
    async GET_TRANSACTION(_, id: string) {
        return getTransaction(id);
    },
    async DELETE_TRANSACTION(_, id: string) {
        return deleteTransaction(id);
    },
    async UPDATE_TRANSACTION(_, transaction: Transaction) {
        return updateTransaction(transaction);
    }
}

const mutations: MutationTree<TransactionState> = {
    SET_TRANSACTION(state, transaction: Transaction) {
        state.transaction = transaction;
    }
}

const getters: GetterTree<TransactionState, RootState> = {
    TRANSACTION(state): Transaction {
        const {transaction} = state;
        return transaction;
    }
}

export const transaction: Module<TransactionState, RootState> = {
    state,
    actions,
    getters,
    mutations
}
