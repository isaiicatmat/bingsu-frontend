import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {VacationState} from "@/modules/vacations/types";
import {getVacations} from "@/services/vacations";

export const state: VacationState = {
    vacation: {
        days: "",
        date: ""
    }
}

const actions: ActionTree<VacationState, RootState> = {
    async GET_VACATIONS(_, payload) {
        return await getVacations(payload);
    }
}

const mutations: MutationTree<VacationState> = {

}

const getters: GetterTree<VacationState, RootState> = {

}

export const vacation: Module<VacationState, RootState> = {
    state,
    actions,
    getters,
    mutations
}
