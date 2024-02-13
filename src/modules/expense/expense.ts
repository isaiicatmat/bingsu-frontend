import {GetterTree, MutationTree} from 'vuex'
import {ActionTree} from "vuex";
import {RootState} from "@/store/types";
import { ExpenseState } from './types';
import {Module} from "vuex";
import {Expense} from './types';
import {saveExpense, getExpense, deleteExpense, updateExpense, getExpenses} from '@/services/expenses';

export const state: ExpenseState = {
    expense: {
        concept: "",
        cardDateOut: "",
        cardDateIn: "",
        amount: "",
        folio: "",
        invoice: "",
        xml: ""
    }
};

const actions:  ActionTree<ExpenseState, RootState> = {
    async SAVE_EXPENSE(_, expense: Expense) {
        await saveExpense(expense);
    },
    async GET_EXPENSES(_, payload) {
        return getExpenses(payload);
    },
    async GET_EXPENSE(_, id: string) {
        return getExpense(id);
    },
    async DELETE_EXPENSE(_, id: string) {
        return deleteExpense(id);
    },
    async UPDATE_EXPENSE(_, expense: Expense) {
        return updateExpense(expense);
    }
}

const mutations: MutationTree<ExpenseState> = {
    SET_EXPENSE(state, expense: Expense) {
        state.expense = expense;
    }
}

const getters: GetterTree<ExpenseState, RootState> = {
    EXPENSE(state): Expense {
        const {expense} = state;
        return expense;
    }
} 

export const expense: Module<ExpenseState, RootState> = {
    state,
    actions,
    getters,
    mutations
}