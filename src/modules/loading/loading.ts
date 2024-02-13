import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {LoadingState} from "@/modules/loading/types";

export const state: LoadingState = {
    loading: false,
};

const actions: ActionTree<LoadingState, RootState> = {};

const getters: GetterTree<LoadingState, RootState> = {
    LOADING(state): boolean {
        const {loading} = state;
        return loading;
    }
}

const mutations: MutationTree<LoadingState> = {
    SET_LOADING(state, loading: boolean) {
        state.loading = loading;
    }
}

export const loading: Module<LoadingState, RootState> = {
    state,
    actions,
    getters,
    mutations
}

