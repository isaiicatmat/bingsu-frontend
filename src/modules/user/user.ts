import {GetterTree, MutationTree} from 'vuex'
import {ActionTree} from "vuex";
import {RootState} from "@/store/types";
import {UserState} from "./types";
import {Module} from "vuex";
import {User} from './types';
import {getUsers, saveUser, getUser, updateUser, deleteUser} from "@/services/users";

export const state: UserState = {
    user: {
        name: "",
        firstLastName: "",
        secondLastName: "",
        phoneNumber: "",
        email: "",
        roles: "",
        address: "",
        curp: "",
        rfc: "",
        vacationDays: "",
        initialAmount: "",
        emergencyNumberOne: "",
        emergencyNumberTwo: "",
        socialSecurityNumber: "",
        ine: "",
        birthCertificate: "",
        bachelorCertificate: "",
        addressCertificate: "",
        avatar: "",
        employeeId: "",
        hiringDate: "",
        birthday: "",
    }
};
 
const actions: ActionTree<UserState, RootState> = {
    async SAVE_USER(_, user: User) {
        try {
            await saveUser(user);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            switch (error['response']['data']['error']) {
                case 'Payload Too Large':
                    throw new Error("Los archivos deben de pesar menos de 10 MB en total");
                case 'Conflict':
                    throw new Error("El correo ya ha sido registrado previamente");
                case 'Internal Server Error':
                    throw new Error("Ha pasado algo inesperado en el servidor");
                case 'wrong_mimetype':
                    throw new Error("El documento tiene que ser PDF o una imagen");
                default:
                    throw new Error("Ha ocurrido un error al agregar un usario");
            }
        }
    },
    async GET_USERS() {
        return getUsers();
    },
    async GET_USER(_, id) {
        return getUser(id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async UPDATE_USER(_, payload: any) {
        return updateUser(payload.id, payload.user);
    },
    async DELETE_USER(_, id) {
        return deleteUser(id);
    }
};

const getters: GetterTree<UserState, RootState> = {
    USER(state): User {
        const {user} = state;
        return user;
    }
}

const mutations: MutationTree<UserState> = {
    SET_USER(state, user: User) {
        state.user = user;
    }
}

export const user: Module<UserState, RootState> = {
    state,
    actions,
    getters,
    mutations
}

