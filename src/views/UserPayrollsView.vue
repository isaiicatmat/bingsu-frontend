<template>
  <div  class="grey lighten-3 mt-3"
        style="height: 808px">
      <v-row>
        <UserPayrollFilter @filterInAction="callAllChanges"></UserPayrollFilter>
      </v-row>
      <div class="row white mb-4 rounded-lg">
        <div class="col-12">
          <div>
            <div class="d-flex justify-start mx-5 mt-2">
              <div>
                <v-btn
                  class="pl-3"
                  color="primary"
                  depressed
                  @click="registerPayrollDialog = true">
                  Nueva nómina
                </v-btn>
              </div>
            </div>
            <UserPayrollTable :payrolls="userPayrolls"
                              @openDeletePayroll="openDeletePayroll"
                              @downloadPayrollFile="downloadPayrollFile">
            </UserPayrollTable>
          </div>
        </div>
      </div>

      <v-dialog v-model="registerPayrollDialog" transition="dialog-bottom-transition" width="960">
        <template v-slot:default="dialog">
          <v-card width="960px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">Nueva nómina</div>
            </v-card-title>
            <v-card-text>
              <UserPayrollForm :active-dialog="dialog.value" @onAddPayroll="addPayroll"
                @close-dialog="dialog.value = false">
              </UserPayrollForm>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog transition="dialog-bottom-transition"
                width="400"
                v-model="deletePayrollDialog">
        <ConfirmDelete title="Borrar nómina"
                      :action-button-color="'error'"
                      @cancel="deletePayrollDialog = false"
                      @confirm="handleDeletePayroll"
                      confirmation-text="¿Estás seguro que deseas eliminar esta nómina?">
        </ConfirmDelete>
      </v-dialog>

  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import UserPayrollForm from '@/components/UserPayrolls/UserPayrollForm.vue';
import authService from "../services/auth";
import UserPayrollTable from "@/components/UserPayrolls/UserPayrollTable.vue";
import ConfirmDelete from "@/components/ConfirmDelete";
import UserPayrollFilter from "@/components/UserPayrolls/UserPayrollFilter.vue";
import {getDateFromSeconds, addDays} from "@/utils/DateHelper";
import File from "@/mixins/File";

export default {
  name: "UserPayrollsView",
  components: {
    UserPayrollForm,
    UserPayrollTable,
    ConfirmDelete,
    UserPayrollFilter,
    
  },
  data: () => {
    return{
      authService,
      payroll: [],
      registerPayrollDialog: false,
      userPayrolls: [],
      user: null,
      deletePayrollDialog: false,
      currentPayrollId: null,
      year: new Date().getFullYear(),
    }
  },
  mixins: [File],
  watch: {
    async year() {
      await this.getPayrolls();
    }
  },
  methods: {
    ...mapActions([
      'SAVE_PAYROLL',
      'GET_PAYROLLS',
      'GET_USER',
      'DELETE_PAYROLL',
      'GET_PAYROLL',
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT'
    ]),
    openDeletePayroll(id) {
      this.currentPayrollId = id;
      this.deletePayrollDialog = true;
    },
    callAllChanges(value){
      if (value) {
        this.year = value
      }
    },
    async addPayroll(payroll) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_PAYROLL(payroll);
        await this.getPayrolls();
        this.SHOW_SUCCESS_ALERT("La nómina se ha agregado");
        this.registerPayrollDialog = false;
      } catch(error) {
        if (error.response.data.message  == 'wrong_mimetype') {
          this.SHOW_ERROR_ALERT('Extensión no valida');
        } else {
          this.SHOW_ERROR_ALERT(error.response.data.message);
        }
      } finally {
        this.SET_LOADING(false)
      }
    },
    async handleDeletePayroll() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_PAYROLL(this.currentPayrollId);
        this.SHOW_SUCCESS_ALERT('La nómina ha sido eliminada');
        await this.getPayrolls();
        this.deletePayrollDialog = false;
      } catch(error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async downloadPayrollFile(payrollId) {
      try {
        this.SET_LOADING(true);
        const payroll = await this.GET_PAYROLL({uid: payrollId.uid, id: payrollId.id});
        await this.getFileToDownload(payroll.file);
      } catch(error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getPayrolls() {
      const startDate = new Date(this.year, 0, 1).toISOString().slice(0, 10);
      const endDate = new Date(this.year, 11, 31).toISOString().slice(0, 10);
      const currentPayrolls = await this.GET_PAYROLLS({userId: this.user.id, startDate, endDate});
      let payrolls = [];
      currentPayrolls.forEach(currentPayroll => {
        const payrollConcept = addDays(getDateFromSeconds(currentPayroll.date._seconds), 1).toLocaleDateString('es-MX', {month: 'long'})
        payrolls.push({
          concept: `${currentPayroll.type} de ${payrollConcept}`,
          date: currentPayroll.date,
          id: currentPayroll.id,
          uid: currentPayroll.uid,
        })
      });
      this.userPayrolls = payrolls
    },
  },
  async mounted() {
    try {
      this.SET_LOADING(true);
      this.user = await this.GET_USER(authService.user.uid);
      await this.getPayrolls();
    } catch (e) {
      this.SHOW_ERROR_ALERT(e.response.data.message);
    } finally {
      this.SET_LOADING(false);
    }
  }
}
</script>