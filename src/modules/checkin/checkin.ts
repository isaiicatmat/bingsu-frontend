import { CheckIn, CheckInState } from "./types";
import { RootState } from "@/store/types";
import { ActionTree, GetterTree, Module } from "vuex";
import { getCheckIns, saveCheckIn } from "@/services/check_ins";

export const state: CheckInState = {
    checkIn: {
        date: "",
    }
};

const actions: ActionTree<CheckInState, RootState> = {
    async SAVE_CHECK_IN(_, checkIn: CheckIn) {
        await saveCheckIn(checkIn);
    },
    async GET_CHECK_INS(_, payload) {
        return await getCheckIns(payload);
    },
}

const getters: GetterTree<CheckInState, RootState> = {
    CHECK_IN(state){
        return state.checkIn;
    }
}

export const checkIn: Module<CheckInState, RootState> = {
    state,
    actions,
    getters
}