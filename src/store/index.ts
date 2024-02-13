import Vue from 'vue';
import Vuex from 'vuex';
import {user} from '@/modules/user/user';
import {loading} from '@/modules/loading/loading'
import {alert} from '@/modules/alert/alert'
import { RootState } from './types';
import {transaction} from '@/modules/transaction/transaction'
import {contract} from '@/modules/contract/contract'
import {permission} from '@/modules/permission/permission';
import {vacation} from "@/modules/vacations/vacation";
import {payment} from "@/modules/payment/payment";
import {expense} from "@/modules/expense/expense"
import {checkIn} from "@/modules/checkin/checkin";
import {attendance} from "@/modules/attendance/attendance";
import {article} from "@/modules/article/article"
import {payroll} from '@/modules/payroll/payroll';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    version: '1.0.0', // a simple property
  },
  modules: {
    user,
    loading,
    alert,
    transaction,
    contract,
    permission,
    vacation,
    payment,
    expense,
    checkIn,
    attendance,
    article,
    payroll,
  },
    mutations: {
  },
    actions: {
  },
});
