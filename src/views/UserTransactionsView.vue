<template>
    <div
      class="grey lighten-3 mt-3"
      :style="{'height': !userName ? '80vh' : heightSevenTwenty ? '92vh' : '90vh'}">

      

        <div v-if="userName"
            class="row white mb-4 mt-0 mx-5 align-center rounded-lg"
            style="min-height: 8vh; flex-grow: 1;">
          <div class="d-flex align-center" style="flex-grow: 1">
            <h1 class="ml-8 text-truncate"
                style="width: 390px">{{ userName ? userName : 'Mis transacciones' }}
            </h1>

            <v-list-item style="flex: 0"
                        two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Ingresos anuales</v-list-item-subtitle>
                <v-list-item-title class="font-weight-bold text-lg-h6">{{ getFmtAmount(totalPayments) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Gastos anuales</v-list-item-subtitle>
                <v-list-item-title class="font-weight-bold text-lg-h6">{{
                    getFmtAmount(totalTransactions)
                  }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div class="d-flex justify-content-end mr-5">
            <div>
              <v-btn
                  v-if="userRole === 'admin'"
                  color="primary"
                  @click="newPaymentDialog = true">Nueva transferencia
              </v-btn>
            </div>
          </div>
        </div>

        <v-row :style="{'margin' : userName ? '0px 20px' : '0'}">
          <v-col class="white mb-6 mr-6 rounded-lg"
                :style="{'min-height': '18vh', 'max-width': widthThirteenSixtySix ? '240px' : '342px', 'max-height': '250px'}"
          >
            <div class="mx-6 mt-2">
              <p class="text-lg-h6 font-weight-bold">
                Filtro
              </p>

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
                      @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </div>

              <div class="pb-6">
                <p class="body-2 mb-0 mt-6" style="color:#95999a">Categoría</p>
                <v-select v-model="selectedCategory"
                          :items="categories"
                          dense
                          hide-details
                          outlined>
                </v-select>
              </div>
            </div>
          </v-col>

          <v-col class="white mb-6 rounded-lg"
                :style="{'min-height': '18vh', 'max-width' : widthThirteenSixtySix ? '80%' : '90%', 'max-height' : '250px'}"
          >
            <div class="mx-6 mt-2">
              <p class="text-lg-h6 font-weight-bold">
                {{ year }}
              </p>
              <div>
                <YearTransactionChart v-if="yearAssignedAmounts && yearTransactionAmounts"
                                      :year-assigned-amounts="yearAssignedAmounts"
                                      :year-transaction-amounts="yearTransactionAmounts"
                                      class="year-chart-container mx-8 mb-3">
                </YearTransactionChart>
                <div v-else class="year-chart-loader d-flex justify-center align-center mb-3">
                  <v-progress-linear indeterminate style="width: 50%"></v-progress-linear>
                </div>
              </div>
            </div>
          </v-col>

          <v-col v-if="!userName" class="white mb-6 ml-6 rounded-lg" cols="2">
            <div class="mx-6 mt-2">
              <p class="text-lg-h6 font-weight-bold mb-2">
                Resumen por año
              </p>
              <v-list-item style="flex:0; padding:0;" two-line>
                <v-list-item-content style="padding: 0;">
                  <v-list-item-subtitle>Ingresos</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold text-lg-h6">{{
                      getFmtAmount(totalPayments)
                    }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item style="padding: 0;" two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>Gastos</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold text-lg-h6">{{
                      getFmtAmount(totalTransactions)
                    }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-col>
        </v-row>

        <div :style="userName ? 'margin:0px 20px' : 'margin: 0'"
            class="row white align-center rounded-lg">

          <div  v-if="userRole !== 'admin'"
                class="col-12 d-flex" style="justify-content: flex-start;">
            <div>
              <div
                  class="row white mb-0 align-center rounded-lg mx-5 mt-2"
                  style="min-height: 0vh; flex-grow: 1;">
                <v-btn
                    
                    color="primary"
                    @click="newUserTransactionDialog = true">Nuevo gasto
                </v-btn>
              </div>
            </div>
          </div>

          <div class="col-12 pt-0">


            <template>
              <v-tabs v-model="tab">
                <v-tab>Ingresos</v-tab>
                <v-tab>Gastos</v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item :key="0">
                  <PaymentTable :payments="userPayments"
                                @openDeletePayment="openDeletePayment"
                                @openUpdatePayment="openUpdatePayment">
                  </PaymentTable>
                </v-tab-item>
                <v-tab-item :key="1">
                  <UserTransactionTable :transactions="userTransactions"
                                        @openDeleteTransaction="openDeleteUserTransaction"
                                        @openIndividualTransaction="openIndividualTransaction"
                                        @openUpdateTransaction="openUpdateUserTransaction">
                  </UserTransactionTable>
                </v-tab-item>
              </v-tabs-items>
            </template>
          </div>
        </div>

        <v-dialog v-model="newPaymentDialog"
                  persistent
                  transition="dialog-bottom-transition"
                  width="600">
          <template v-slot:default="dialog">
            <v-card width="600px">
              <v-card-title class="mb-2">
                <div class="text-h5 font-weight-bold">Nueva transferencia</div>
              </v-card-title>
              <v-card-text>
                <payment-form :active-dialog="dialog.value"
                              @onAddPayment="handleAddPayment"
                              @close-dialog="dialog.value = false">
                </payment-form>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>


        <v-dialog v-model="newUserTransactionDialog"
                  persistent
                  transition="dialog-bottom-transition"
                  width="600">
          <template v-slot:default="dialog">
            <v-card width="600px">
              <v-card-title class="mb-2">
                <div class="text-h5 font-weight-bold">Nueva transacción</div>
              </v-card-title>
              <v-card-text>
                <transaction-form :active-dialog="dialog.value"
                                  @onAddUserTransaction="handleAddUserTransaction"
                                  @close-dialog="dialog.value = false">
                </transaction-form>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog v-model="updateUserTransactionDialog"
                  persistent
                  transition="dialog-bottom-transition"
                  width="600">
          <template v-slot:default="dialog">
            <v-card width="600px">
              <v-card-title class="mb-2">
                <div class="text-h5 font-weight-bold">Editar transacción</div>
              </v-card-title>
              <v-card-text>
                <transaction-form :active-dialog="dialog.value"
                                  update
                                  @onUpdateUserTransaction="handleUpdateUserTransaction"
                                  @close-dialog="dialog.value = false">
                </transaction-form>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog v-model="updatePaymentDialog"
                  persistent
                  transition="dialog-bottom-transition"
                  width="600">
          <template v-slot:default="dialog">
            <v-card width="600px">
              <v-card-title class="mb-2">
                <div class="text-h5 font-weight-bold">Editar transferencia</div>
              </v-card-title>
              <v-card-text>
                <payment-form :active-dialog="dialog.value"
                              update
                              @onUpdatePayment="handleUpdatePayment"
                              @close-dialog="dialog.value = false">
                </payment-form>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>


        <v-dialog v-model="individualTransactionDialog"
                  transition="dialog-bottom-transition"
                  width="400">
          <v-card width="400px">
            <v-card-title class="mb-2">
              <div class="text-h5 font-weight-bold">{{ TRANSACTION.concept }}</div>
            </v-card-title>
            <v-card-text>
              <IndividualTransactionUserView :transaction="TRANSACTION"></IndividualTransactionUserView>
            </v-card-text>
            <div class="d-flex white justify-center pb-5">
              <v-btn color="#F5223B"
                    @click="individualTransactionDialog = false">
                <div style="color:white">Cerrar</div>

              </v-btn>
            </div>
          </v-card>
        </v-dialog>


        <v-dialog v-model="deleteUserTransactionDialog"
                  transition="dialog-bottom-transition"
                  width="400">
          <ConfirmDelete confirmation-text="¿Estás seguro que deseas eliminar esta transacción?"
                        title="Borrar transacción"
                        @cancel="deleteUserTransactionDialog = false"
                        @confirm="handleDeleteUserTransaction">
          </ConfirmDelete>
        </v-dialog>

        <v-dialog v-model="deletePaymentDialog"
                  transition="dialog-bottom-transition"
                  width="400">
          <ConfirmDelete :action-button-color="'error'"
                        confirmation-text="¿Estás seguro que deseas eliminar esta transferencia?"
                        title="Borrar transferencia"
                        @cancel="deletePaymentDialog = false"
                        @confirm="handleDeletePayment">
          </ConfirmDelete>
        </v-dialog>

      

    </div>
</template>

<script>

import TransactionForm from "@/components/UserTransactions/TransactionForm.vue";
import {getFmtAmount} from "../services/utils";
import {mapActions, mapGetters, mapMutations} from "vuex";
import UserTransactionTable from "../components/UserTransactions/UserTransactionTable";
import IndividualTransactionUserView from "../components/UserTransactions/IndividualTransactionUserView";
import ConfirmDelete from "../components/ConfirmDelete";
import MonthPicker from "../mixins/MonthPicker";
import authService from "../services/auth";
import YearTransactionChart from "../components/UserTransactions/YearTransactionChart";
import PaymentForm from "../components/Payments/PaymentForm";
import PaymentTable from "../components/Payments/PaymentTable";

export default {
  name: "UserTransactionView",
  components: {
    PaymentTable,
    PaymentForm,
    YearTransactionChart,
    ConfirmDelete,
    IndividualTransactionUserView,
    UserTransactionTable,
    TransactionForm,
  },
  data: () => {
    return {
      authService,
      updatePaymentDialog: false,
      tab: null,
      individualTransactionDialog: false,
      deleteUserTransactionDialog: false,
      updateUserTransactionDialog: false,
      newUserTransactionDialog: false,
      newPaymentDialog: false,
      deletePaymentDialog: false,
      userTransactions: [],
      userYearTransactions: [],
      userPayments: [],
      userYearPayments: [],
      selectedCategory: 'Todas',
      currentPaymentId: null,
      userRole: null,
      heightSevenTwenty: window.innerHeight <= 720,
      widthThirteenSixtySix: window.innerWidth <= 1366,
      categories: [
        'Transporte',
        'Gasolina',
        'Casetas',
        'Papelería',
        'Computo',
        'Hotel',
        'Vuelos',
        'Restaurante',
        'Proveedores',
        'Capacitación',
        'Estudios / Beca',
        'Otro',
        'Todas'
      ],
      currentUserTransactionId: null,
      yearTransactionAmounts: null,
      yearAssignedAmounts: null,
    }
  },
  mixins: [MonthPicker],
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
      default: null,
    }
  },
  computed: {
    ...mapGetters([
      'TRANSACTION'
    ]),
    totalPayments() {
      let total = 0;

      if (this.userYearPayments.length > 0) {
        this.userYearPayments.forEach((payment) => {
          total += +payment.amount;
        });
      }
      return total;
    },
    totalTransactions() {
      let total = 0;

      if (this.userYearTransactions.length > 0) {
        this.userYearTransactions.forEach((transaction) => {
          total += +transaction.amount;
        });
      }
      return total;
    },
  },
  watch: {
    async month() {
      await this.getTransactions();
      await this.getPayments();
    },
    async selectedCategory() {
      await this.getTransactions();
    },
    async year() {
      await this.getYearOperations();
    }
  },
  methods: {
    getFmtAmount,
    ...mapActions([
      'SAVE_TRANSACTION',
      'GET_TRANSACTION',
      'GET_TRANSACTIONS',
      'DELETE_TRANSACTION',
      'UPDATE_TRANSACTION',
      'UPDATE_PAYMENT',
      'SAVE_PAYMENT',
      'GET_PAYMENTS',
      'DELETE_PAYMENT',
      'GET_PAYMENT'
    ]),
    ...mapMutations([
      'SET_LOADING',
      'SET_TRANSACTION',
      'SHOW_ERROR_ALERT',
      'SHOW_SUCCESS_ALERT',
      'SET_PAYMENT'
    ]),
    async handleAddUserTransaction(transaction) {
      try {
        this.SET_LOADING(true);
        await this.SAVE_TRANSACTION(transaction);
        this.SHOW_SUCCESS_ALERT("La transacción se ha agregado");
        await this.getTransactions();
        await this.getYearOperations();
        this.newUserTransactionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeletePayment() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_PAYMENT(this.currentPaymentId);
        this.SHOW_SUCCESS_ALERT("La transferencia ha sido eliminada");
        await this.getPayments();
        await this.getYearOperations();
        this.deletePaymentDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openIndividualTransaction(transactionId) {
      try {
        this.SET_LOADING(true);
        const transaction = await this.GET_TRANSACTION(transactionId);
        this.SET_TRANSACTION(transaction);
        this.individualTransactionDialog = true;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getTransactions() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        this.userTransactions = await this.GET_TRANSACTIONS({
          startDate,
          endDate,
          userId: this.userId,
          category: this.selectedCategory
        });
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getPayments() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        this.userPayments = await this.GET_PAYMENTS({uid: this.userId, endDate, startDate});
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleDeleteUserTransaction() {
      try {
        this.SET_LOADING(true);
        await this.DELETE_TRANSACTION(this.currentUserTransactionId);
        this.SHOW_SUCCESS_ALERT("La transacción ha sido eliminada");
        await this.getTransactions();
        await this.getYearOperations();
        this.deleteUserTransactionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openUpdateUserTransaction(transactionId) {
      try {
        this.SET_LOADING(true);
        const transaction = await this.GET_TRANSACTION(transactionId);
        this.SET_TRANSACTION(transaction);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.updateUserTransactionDialog = true;
    },
    async openUpdatePayment(paymentId) {
      try {
        this.SET_LOADING(true);
        const payment = await this.GET_PAYMENT(paymentId);
        this.SET_PAYMENT(payment);
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.updatePaymentDialog = true;
    },
    async handleAddPayment(payment) {
      try {
        this.SET_LOADING(true);
        payment.uid = this.userId;
        await this.SAVE_PAYMENT(payment);
        this.SHOW_SUCCESS_ALERT("La transferencia ha sido exitosa");
        await this.getPayments();
        this.newPaymentDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdateUserTransaction(transaction) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_TRANSACTION(transaction);
        this.SHOW_SUCCESS_ALERT("La transacción se ha actualizado");
        await this.getTransactions();
        await this.getYearOperations();
        this.updateUserTransactionDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async handleUpdatePayment(payment) {
      try {
        this.SET_LOADING(true);
        await this.UPDATE_PAYMENT(payment);
        this.SHOW_SUCCESS_ALERT("La transferencia se ha actualizado");
        await this.getPayments();
        await this.getYearOperations();
        this.updatePaymentDialog = false;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async openDeleteUserTransaction(transactionId) {
      try {
        this.SET_LOADING(true);
        this.currentUserTransactionId = transactionId;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deleteUserTransactionDialog = true;
    },
    getFmtYearOperations(operations) {
      let paymentMap = new Map();

      for (let i = 0; i < operations.length; i++) {
        const month = new Date(operations[i].date._seconds * 1000).getMonth();
        if (paymentMap.has(month)) {
          paymentMap.set(month, paymentMap.get(month) + +operations[i].amount);
        } else {
          paymentMap.set(month, +operations[i].amount);
        }
      }

      let yearAssignedAmounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let sum = 0;
      for (let i = 0; i < yearAssignedAmounts.length; i++) {
        if (paymentMap.has(i)) {
          sum += paymentMap.get(i);
        }

        yearAssignedAmounts[i] += sum;
      }
      return yearAssignedAmounts;
    },
    async openDeletePayment(paymentId) {
      try {
        this.SET_LOADING(true);
        this.currentPaymentId = paymentId;
      } catch (error) {
        this.SHOW_ERROR_ALERT(error.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
      this.deletePaymentDialog = true;
    },
    async getYearOperations() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.year, 0, 1).toISOString().slice(0, 10);
        const endDate = new Date(this.year, 11, 31).toISOString().slice(0, 10);

        this.userYearTransactions = await this.GET_TRANSACTIONS(
            {
              startDate,
              endDate,
              userId: this.userId,
              category: 'Todas'
            });
        this.userYearPayments = await this.GET_PAYMENTS({startDate, endDate, uid: this.userId});
        this.yearTransactionAmounts = this.getFmtYearOperations(this.userYearTransactions);
        this.yearAssignedAmounts = this.getFmtYearOperations(this.userYearPayments);
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    }
  },
  async mounted() {
    if (this.initialDate) {
      this.month = this.initialDate;
    }
    this.userRole = await authService.getRole();
    await this.getTransactions();
    await this.getYearOperations();
    await this.getPayments();
  }
}
</script>

<style scoped>
.year-chart-container {
  max-height: 250px;
}

.year-chart-loader {
  height: 250px;
}
</style>
