import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {AlertState} from "@/modules/alert/types";

export const state: AlertState = {
    show: false,
    message: "",
    type: ""
};

const actions: ActionTree<AlertState, RootState> = {};

const getters: GetterTree<AlertState, RootState> = {
    SHOW(state): boolean {
        const {show} = state;
        return show;
    },
    MESSAGE(state): string {
        const {message} = state;
        return message;
    },
    TYPE(state): string {
        const {type} = state;
        return type;
    }
}

const mutations: MutationTree<AlertState> = {
    SHOW_ALERT(state) {
        state.show = true;
    },
    SHOW_ERROR_ALERT(state, message: string) {
        state.message = message;
        state.type = 'error';
        state.show = true;
    },
    SHOW_SUCCESS_ALERT(state, message: string) {
        state.message = message;
        state.type = 'success';
        state.show = true;
    },
    SHOW_INFO_ALERT(state, message: string) {
        state.message = message;
        state.type = 'secondary';
        state.show = true;
    },
    CLOSE_ALERT(state) {
        state.show = false;
    },
}

export const alert: Module<AlertState, RootState> = {
    state,
    actions,
    getters,
    mutations
}