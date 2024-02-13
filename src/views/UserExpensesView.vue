<template>
  <div
    class="grey lighten-3 mt-3"
    style="height: 808px">

      <div v-if="userName"
          class="row white mb-4 mx-5 mt-0 align-center rounded-lg"
          style="min-height: 8vh; flex-grow: 1;">
        <div class="d-flex align-center" style="flex-grow: 1">
          <h1 class="ml-8 text-truncate"
              style="width: 390px">{{ userName }}</h1>
        </div>
      </div>
      
      <v-row :style="userName ? 'margin: 0px 20px' : 'margin: 0px'">
        <v-col class="white mb-6 mr-6 rounded-lg"
              style="min-height: 18vh; max-width: 342px; max-height: 250px;"
        >
          <div class="mx-6 mt-2">
            <p class="text-lg-h6 font-weight-bold">Filtro</p>
            <div>
              <p class="body-2 mb-0" style="color:#95999a">Fecha</p>
              <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  max-width="290px"
                  min-width="auto"
                  offset-y
                  transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      :value="fmtMonth"
                      dense
                      hide-details
                      max-width="290px"
                      outlined
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                    v-model="month"
                    :allowed-dates="allowedDates"
                    type="month"
                    @input="menu = false"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-col>
      </v-row>
      <div
          :style="userName ? 'margin: 0 20px 0 20px' : 'margin: 0'"
          class="row white mb-4 rounded-lg">
        <div
            class="row white mb-0 align-center rounded-lg mx-5 mt-2"
            style="min-height: 0vh; flex-grow: 1;">

          <div class="col d-flex" style="justify-content: flex-start;" v-if="userRole !== 'admin'">
            <div>
              <v-btn
                  v-if="noExpenses"
                  color="primary"
                  @click="newUserExpenseDialog = true"
              >Nuevo gasto
              </v-btn>
              <v-sheet v-else>
                <v-skeleton-loader type="button" class="expensesButton"></v-skeleton-loader>
              </v-sheet>
            </div>
          </div>
          
        </div>
        <div class="col-12">
          <div>
            <template>
              <UserExpensesTable :expenses="userExpenses"
                                @openDeleteExpense="openDeleteUserExpense"
                                @openIndividualExpense="openIndividualExpense"
                                @openUpdateExpense="openUpdateUserExpense"
                                v-if="noExpenses"
              >
              </UserExpensesTable>
              <v-sheet v-else>
                <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
                  <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
                    <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '6%' : '10%', 'margin-right' : isDesktopWidth ? '13%' : '9.2%', 'margin-left' : '1%'}"></div>
                    <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '4%' : '7%', 'margin-right' : isDesktopWidth ? '15%' : '12.2%'}"></div>
                    <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '6%' : '11%', 'margin-right': isDesktopWidth ? '14.5%' : '9.4%'}"></div>
                    <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '6%' : '11%', 'margin-right' : isDesktopWidth ? '15.8%' : '11%'}"></div>
                    <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': isDesktopWidth ? '5%' : '8%'}"></div>
                  </div>

                  <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 28.4vh">
                    <div v-for="i in 5" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                      <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                      <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" style="width: 100%; height: 46.5px">
                        <div v-for="i in 4" :key="i" class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                                  :style="{
                                  'width': skeletonStyle('width', i), 
                                  'margin-right': skeletonStyle('mr', i)}"
                        >
                          <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
                        </div>
                        <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2 mr-1"></div>
                        <div class="v-skeleton-loader__avatar v-skeleton-loader__bone mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <v-skeleton-loader class=" mr-10" type="table-tfoot"></v-skeleton-loader>
              </v-sheet>
            </template>
          </div>
        </div>
      </div>
      <v-dialog v-model="newUserExpenseDialog"
                persistent
                transition="dialog-bottom-transition"
                width="600">
        <template v-slot:default="dialog">
          <v-card width="600px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">Nuevo gasto</div>
            </v-card-title>
            <v-card-text>
              <expense-form :active-dialog="dialog.value"
                            @onAddUserExpense="handleAddUserExpense"
                            @close-dialog="dialog.value = false">
              </expense-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog v-model="updateUserExpenseDialog"
                persistent
                transition="dialog-bottom-transition"
                width="600">
        <template v-slot:default="dialog">
          <v-card width="600px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">Editar gasto</div>
            </v-card-title>
            <v-card-text>
              <expense-form :active-dialog="dialog.value"
                            update
                            @onUpdateUserExpense="handleUpdateUserExpense"
                            @close-dialog="dialog.value = false">
              </expense-form>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>

      <v-dialog v-model="individualExpenseDialog"
                transition="dialog-bottom-transition"
                width="400">
        <v-card width="400px">
          <v-card-title class="mb-2">
            <div class="text-h5 font-weight-bold">{{ EXPENSE.concept }}</div>
          </v-card-title>
          <v-card-text>
            <IndividualExpenseUserView :expense="EXPENSE"></IndividualExpenseUserView>
          </v-card-text>
          <div class="d-flex white justify-center pb-5">
            <v-btn color="#F5223B"
                  @click="individualExpenseDialog = false">
              <div style="color:white">Cerrar</div>
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteUserExpenseDialog"
                transition="dialog-bottom-transition"
                width="400">
        <ConfirmDelete confirmation-text="¿Estás seguro que deseas eliminar este gasto?"
                      title="Borrar gasto"
                      @cancel="deleteUserExpenseDialog = false"
                      @confirm="handleDeleteUserExpense">
        </ConfirmDelete>
      </v-dialog>
    
  </div>
</template>

<script>
import UserExpensesTable from "@/components/UserExpenses/UserExpensesTable.vue";
import ExpenseForm from "@/components/UserExpenses/ExpenseForm.vue";
import Vue from "vue";
import IndividualExpenseUserView from "@/components/UserExpenses/IndividualExpenseUserView.vue"
import {mapActions, mapGetters, mapMutations} from "vuex";
import ConfirmDelete from "../components/ConfirmDelete";
import MonthPicker from "../mixins/MonthPicker";
import authService from "../services/auth";
import {getFmtAmount} from "../services/utils";

export default Vue.extend({
  name: "UserExpensesView",
  components: {
    UserExpensesTable,
    ExpenseForm,
    ConfirmDelete,
    IndividualExpenseUserView,
  },
  mixins: [MonthPicker],
  data: () => {
    return {
      authService,
      userExpenses: [],
      userYearExpenses: [],
      newUserExpenseDialog: false,
      updateUserExpenseDialog: false,
      deleteUserExpenseDialog: false,
      individualExpenseDialog: false,
      isDesktopWidth: window.innerWidth > 1903,
      noExpenses: false,
      userRole: null,
      currentUserExpenseId: null,
      yearAssignedAmounts: null,
    }
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    userName: {
      type: String,
      default: null
    },
    initialDate: {
      type: String,
      default: null
    }
  },
  watch: {
    async month() {
      await this.getExpenses();
    }
  },
  computed: {
    ...mapGetters([
      'EXPENSE'
    ]),
  },
  methods: {
    getFmtAmount,
    ...mapActions([
      'GET_EXPENSE',
      'SAVE_EXPENSE',
      'DELETE_EXPENSE',
      'UPDATE_EXPENSE',
      'GET_EXPENSES'
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SET_EXPENSE',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT'
    ]),
    async handleAddUserExpense(expense) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_EXPENSE(expense);
        this.SHOW_SUCCESS_ALERT("El gasto con tarjeta empresarial se ha agregado");
        await this.getExpenses();
        this.newUserExpenseDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openIndividualExpense(expenseId) {
      try {
        this.SET_LOADING(true);
        const expense = await this.GET_EXPENSE(expenseId);
        this.SET_EXPENSE(expense);
        this.individualExpenseDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getExpenses() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        this.userExpenses = await this.GET_EXPENSES({startDate, endDate, userId: this.userId});
        this.noExpenses = true;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeleteUserExpense() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_EXPENSE(this.currentUserExpenseId);
        this.SHOW_SUCCESS_ALERT("El gasto con tarjeta empresarial se ha sido eliminado");
        await this.getExpenses();
        this.deleteUserExpenseDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openDeleteUserExpense(expenseId) {
      try {
        this.SET_LOADING(true);
        this.currentUserExpenseId = expenseId;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deleteUserExpenseDialog = true;
    },
    async openUpdateUserExpense(expenseId) {
      try {
        this.SET_LOADING(true);
        const expense = await this.GET_EXPENSE(expenseId);
        this.SET_EXPENSE(expense);
        this.updateUserExpenseDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdateUserExpense(expense) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_EXPENSE(expense);
        this.SHOW_SUCCESS_ALERT("El gasto con tarjeta empresarial se ha actualizado");
        await this.getExpenses();
        this.updateUserExpenseDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    skeletonStyle(type, idx){
      let widthAndMarginRigth = '';
      switch(idx){
        case 1:
          type === 'width' ? widthAndMarginRigth = '7%' : widthAndMarginRigth = '12.2%'; 
          break;
        case 2:
          type === 'width' ? widthAndMarginRigth = '9%' : widthAndMarginRigth = '10.8%'; 
          break;
        case 3:
          type === 'width' ? widthAndMarginRigth = '7%' : widthAndMarginRigth = '13.8%'; 
          break;
        case 4:
          type === 'width' ? widthAndMarginRigth = '8%' : widthAndMarginRigth = '14.6%'; 
          break;
      }
      return widthAndMarginRigth
    }
  },
  async mounted() {
    if (this.initialDate) {
      this.month = this.initialDate;
    }
    this.userRole = await authService.getRole();
    await this.getExpenses();
  }
})
</script>

<style>
.expensesButton .v-skeleton-loader__button  {
  width: 110px !important;
}

.v-skeleton-loader__avatar{
  height: 30px;
  width: 30px;
}
</style>
