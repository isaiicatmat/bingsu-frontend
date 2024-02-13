import { Attendance, AttendanceState } from "./types";
import { RootState } from "@/store/types";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import {
    getAttendances,
    saveAttendance,
    updateAttendance,
    getAttendance,
    getAttendancesOut,
    saveAttendances
} from "@/services/attendances";
import {getAttendanceRecord} from  "@/services/attendance";

export const state: AttendanceState = {
    attendance: {
        in: "",
        out: "",
        summary: "",
        date: "",
        id: "",
        uid: ""
    }
};

const actions: ActionTree<AttendanceState, RootState> = {
    async SAVE_ATTENDANCE(_, attendance: Attendance) {
        await saveAttendance(attendance);
    },
    async SAVE_ATTENDANCES(_, attendances: Attendance[]) {
        await saveAttendances(attendances);
    },
    async GET_ATTENDANCES(_, payload) {
        return await getAttendances(payload);
    },
    async GET_ATTENDANCES_OUT(_, payload) {
        return await getAttendancesOut(payload);
    },
    async UPDATE_ATTENDANCE(_, attendance: Attendance) {
        return updateAttendance(attendance);
    },
    async GET_ATTENDANCE(_, id: string) {
        return getAttendance(id);
    },
    async GET_ATTENDANCE_RECORD(_, payload) {
        return await getAttendanceRecord(payload);
    }
}

const mutations: MutationTree<AttendanceState> = {
    SET_ATTENDANCE(state, attendance: Attendance) {
        state.attendance = attendance;
    }
}

const getters: GetterTree<AttendanceState, RootState> = {
    ATTENDANCE(state): Attendance{
        const {attendance} = state;
        return attendance;
    }
}

export const attendance: Module<AttendanceState, RootState> = {
    state,
    actions,
    getters,
    mutations
}
