import {Permission, PermissionState} from "@/modules/permission/types";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {savePermission, getPermissions, updatePermission, deletePermission, getPermission} from "@/services/permissions";

export const state: PermissionState = {
    permission: {
        description: "",
        request: "",
        startDate: "",
        endDate: "",
        type: "",
        status: "",
        availableDays: "",
        vacationId: "",
    }
}

const actions: ActionTree<PermissionState, RootState> = {
    async SAVE_PERMISSION(_, permission: Permission) {
        await savePermission(permission);
    },
    async GET_PERMISSIONS(_, payload) {
        return await getPermissions(payload);
    },
    async UPDATE_PERMISSION(_, payload) {
        return await updatePermission(payload);
    },
    async GET_PERMISSION(_, id) {
        return await getPermission(id);
    },
    async DELETE_PERMISSION(_, id) {
        await deletePermission(id);
    }
}

const mutations: MutationTree<PermissionState> = {
    SET_PERMISSION(state, permission: Permission) {
        state.permission = permission;
    }
}

const getters: GetterTree<PermissionState, RootState> = {
    PERMISSION(state) {
        return state.permission;
    }
}

export const permission: Module<PermissionState, RootState> = {
    state,
    actions,
    getters,
    mutations
}
