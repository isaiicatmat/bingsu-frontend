<template>
  <div>
    <v-row>
      <div class="white mb-6 rounded-lg d-flex" style="width: 100%;">
        <div class="mx-9 mt-4 mb-7" style="flex: 1">

          <p class="text-lg-h6 font-weight-bold">
            Filtro
          </p>

          <div class="d-flex">

            <div class="mr-6" style="width: 20%;">
              <p class="body-2 mb-0" style="color:#95999a">Usuario</p>
              <PayrollsUserFilter :users="filterUsers" @filterInAction="filterItems"></PayrollsUserFilter>
            </div>

            <div class="mr-6" style="width: 20%;">
              <p class="body-2 mb-0" style="color:#95999a">Fecha</p>
              <PayrollsDateFilter
                @filterInAction="callAllChanges"></PayrollsDateFilter>
            </div>

          </div>
        </div>
      </div>
    </v-row>
    <div class="row white mb-4 rounded-lg">
      <div class="col-12">
        <div>
          <div class="d-flex align-center px-4 pt-3">
            <p class="text-lg-h6 font-weight-bold">
              Resumen de nóminas
            </p>
          </div>
          <PayrollTable :selectedUserPayrolls="selectedUserPayrolls"
                        @downloadPayrollFile="downloadPayrollFile"></PayrollTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import PayrollTable from '@/components/payrolls/PayrollTable.vue';
import {getDateFromSeconds, addDays} from "@/utils/DateHelper";
import PayrollsUserFilter from "@/components/payrolls/PayrollsUserFilter.vue";
import PayrollsDateFilter from "@/components/payrolls/PayrollsDateFilter.vue";
import MonthPicker from "@/mixins/MonthPicker";
import File from "@/mixins/File";

export default {
  name: "PayrollView",
  components: {
    PayrollTable,
    PayrollsUserFilter,
    PayrollsDateFilter
  },
  mixins: [MonthPicker, File],
  data: () => {
    return {
      users: null,
      payrolls: [],
      selectedUserPayrolls: [],
      filterUsers: null,
      filterSelected: null,
    }
  },
  watch: {
    async month() {
      await this.getPayrolls();
    },
    async filterUsers() {
      await this.getPayrolls();
    }
  },
  methods: {
    ...mapActions([
    'GET_PAYROLLS',
    'GET_USERS',
    'GET_PAYROLL',
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT'
    ]),
    async downloadPayrollFile(payrollId) {
      try {
        this.SET_LOADING(true);
        const payroll = await this.GET_PAYROLL({id: payrollId.id, uid: payrollId.uid});
        await this.getFileToDownload(payroll.file);
      } catch(error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getUsers() {
      let users = await this.GET_USERS();
      const usersRecordMap = new Map();
      users.forEach(user => {
        usersRecordMap.set(user.id, {
          'value': user.id,
          'text': `${user.name} ${user.firstLastName} ${user.secondLastName}`,
        });
      });

      this.selectUsers = Array.from(usersRecordMap, ([_, value]) => ({
        'value': value.value, 
        'text': value.text,
      }))
        ;
      this.filterUsers = [...this.selectUsers];
      this.filterUsers.unshift({
        'value': 'All',
        'text': 'Todos',
      });
      this.users = users;
    },
    async getPayrolls() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        let payrolls = await this.GET_PAYROLLS({startDate, endDate});
        if (this.filterSelected !== 'All' && this.filterSelected != null) {
          payrolls = await this.GET_PAYROLLS({startDate, endDate, userId: this.filterSelected});
        }
        let payrollsRecordMap = new Map();
        payrolls.forEach(payroll => {
          const payrollConcept = addDays(getDateFromSeconds(payroll.date._seconds), 1).toLocaleDateString('es-MX', {month: 'long'});
          if (payrollsRecordMap.get(payroll.uid)) {
            const userPayroll = payrollsRecordMap.get(payroll.uid);
            userPayroll.payrolls.push(
              {
                concept: `${payroll.type} de ${payrollConcept}`,
                date: payroll.date,
                id: payroll.id,
                uid: payroll.uid,
              }
            )
          } else {
            let user = this.users.find(user => payroll.uid == user.id);
            let userName = `${user.name} ${user.firstLastName}`;
            payrollsRecordMap.set(payroll.uid, {
              name: userName,
              payrolls: [{
                concept: `${payroll.type} de ${payrollConcept}`,
                date: payroll.date,
                id: payroll.id,
                uid: payroll.uid,
              }],
            })
          }
        });
        this.selectedUserPayrolls = Array.from(payrollsRecordMap, ([key, value]) => ({ 
          name: value.name, 
          uid: key, 
          payrolls: value.payrolls 
        }));
        this.payrolls = payrolls;
      } catch(e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
     callAllChanges(month){
      if (month) {
        this.month = month;
      }
    },
    async filterItems(selectedUser) {
      this.filterSelected = selectedUser;
      await this.getPayrolls();
      const foundPayrolls = this.selectedUserPayrolls.find(item => item.uid === selectedUser);
      if (foundPayrolls) {
        this.selectedUserPayrolls = [foundPayrolls];
      } else if (selectedUser != 'All') {
        this.selectedUserPayrolls = [];
      }
      
    },
  },
  async mounted() {
    try {
      this.SET_LOADING(true);
      await this.getUsers();
      await this.getPayrolls();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
      this.SET_LOADING(false);
    }
  }
}
</script>