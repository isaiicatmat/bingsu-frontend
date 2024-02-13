import {Contract, ContractState} from "@/modules/contract/types";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootState} from "@/store/types";
import {saveContract, getContracts, deleteContract} from "@/services/contract";

export const state: ContractState = {
    contract: {
        amount: "",
        client: "",
        endDate: "",
        id: "",
        indeterminate: false,
        startDate: ""
    }
}

const actions: ActionTree<ContractState, RootState> = {
    async SAVE_CONTRACT(_, contract: Contract) {
        await saveContract(contract);
    },
    async GET_CONTRACTS(_, payload) {
        return await getContracts(payload);
    },
    async DELETE_CONTRACT(_, id) {
        await deleteContract(id);
    }
}

const mutations: MutationTree<ContractState> = {
    SET_CONTRACT(state, contract: Contract) {
        state.contract = contract;
    }
}

const getters: GetterTree<ContractState, RootState> = {
    CONTRACT(state): Contract {
        const {contract} = state;
        return {...contract};
    }
}

export const contract: Module<ContractState, RootState> = {
    state,
    actions,
    getters,
    mutations
}