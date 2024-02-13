<template>
  <div>
    <v-row>
      <TransactionsFilter @filterInAction="callAllChanges">
      </TransactionsFilter>

      <TransactionsTotalExpenses
          :chart-color1="chartColor1"
          :chart-color2="chartColor2"
          :month-difference="monthDifference"
          :month-status="monthStatus"
          :month-transaction-amounts="monthTransactionAmounts"
          :solid-color="solidColor"
          :total-amount="totalAmount"
      >
      </TransactionsTotalExpenses>

    </v-row>

    <div class="row white rounded-lg">
      <div class="col-12">
        <div class="d-flex align-center px-4 pt-3">
          <div class="d-flex  align-center">
            <img class="mb-4 mr-2" src="../assets/users_in_icon.jpg" style="width: 26px; height: 26px;" alt="users">
            <p class="text-lg-h6 font-weight-bold">
              Transacciones por usuario
            </p>
          </div>
        </div>

        <TransactionsTable :transactions-summary="transactionsSummary"
                           @openUserTransactions="handleOpenUserTransactions"
                           v-if="transactionsSummary.length > 0"
        >
        </TransactionsTable>
        <v-sheet v-else >
          <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
            <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
                <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '4%', 'margin-right': isDesktopWidth ? '43%' : '69%', 'margin-left': '1%'}"></div>
                <div v-if="!tabletWidth" class="v-skeleton-loader__heading v-skeleton-loader__bone" style="max-width: 4%;"></div>
            </div>
            <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height: 34.4vh">
              <div v-for="i in 7" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" style="width: 100%; height: 46.5px">

                  <div class="v-skeleton-loader__table-cell v-skeleton-loader__bone" :style="{'width': '10%', 'margin-right': isDesktopWidth ? '38%' : '64.9%'}">
                    <div class="v-skeleton-loader__text v-skeleton-loader__bone" ></div>
                  </div>

                  <div v-if="!tabletWidth" class="v-skeleton-loader__table-cell v-skeleton-loader__bone" style="width: 5%;">
                    <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-skeleton-loader type="table-tfoot" class="mr-7"></v-skeleton-loader>
        </v-sheet>
      </div>
    </div>

    <v-dialog v-model="individualUserTransactionDialog"
              transition="dialog-bottom-transition"
              width="1680"
    >
      <UserTransactionView v-if="individualUserTransactionDialog"
                           class="pt-5 pb-5"
                           style="height:fit-content"
                           :initial-date="month"
                           :user-id="user.id"
                           :user-name="user.name">
      </UserTransactionView>
    </v-dialog>
  </div>
</template>

<script>
import MonthPicker from "../mixins/MonthPicker";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import {mapActions, mapMutations} from "vuex";
import UserTransactionView from "../views/UserTransactionsView";
import TransactionsFilter from "../components/Transactions/TransactionsFilter"
import TransactionsTotalExpenses from "../components/Transactions/TransactionsTotalExpenses"

export default {
  name: "TransactionsView",
  components: {
    UserTransactionView,
    TransactionsTable,
    TransactionsFilter,
    TransactionsTotalExpenses
  },
  mixins: [MonthPicker],
  props: {
    initialDate: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      transactionsSummary: [],
      chartColor1: null,
      chartColor2: null,
      monthStatus: null,
      individualUserTransactionDialog: false,
      user: {},
      totalAmount: -1,
      monthDifference: 0,
      lastMonthTotalAmount: 0,
      solidColor: null,
      monthTransactionAmounts: null,
      isDesktopWidth: window.innerWidth > 1903 && window.innerWidth > 1024,
      tabletWidth: window.innerWidth <= 1024,
    }
  },
  watch: {
    async month() {
      await this.getTransactionsSummary();
      await this.getLastMonthAmount();
      await this.getMonthTransactions();
    },

  },
  methods: {
    ...mapActions(['GET_TRANSACTIONS', 'GET_USERS']),
    ...mapMutations(['SET_LOADING', 'SHOW_ERROR_ALERT']),

    async getLastMonthAmount() {
      try {
        this.SET_LOADING(true);
        const startDate = this.getLastMonth(this.month).slice(0, 10);
        const endDate = new Date(this.month).toISOString().slice(0, 10);
        const transactions = await this.GET_TRANSACTIONS({startDate, endDate, category: 'Todas'});
        let lastMonthTotalAmount = 0;

        for (let i = 0; i < transactions.length; i++) {
          lastMonthTotalAmount += +transactions[i].amount;
        }
        var decreaseValue = lastMonthTotalAmount - this.totalAmount;
        (lastMonthTotalAmount) != 0 ? this.monthDifference = +(Math.abs((decreaseValue) / ((lastMonthTotalAmount))) * 100).toFixed(0) : this.monthDifference = 100;
        this.lastMonthTotalAmount = lastMonthTotalAmount;
        if (lastMonthTotalAmount >= this.totalAmount) {
          this.monthStatus = 'GOOD';
          this.chartColor1 = 'rgba(0, 161, 35, .53)';
          this.chartColor2 = 'rgba(0, 161,35, 0)';
          this.solidColor = 'rgb(0, 161,35, 1)';
        } else {
          this.monthStatus = 'BAD';
          this.chartColor1 = 'rgba(245, 34, 59, .53)';
          this.chartColor2 = 'rgba(245, 34, 59, 0)';
          this.solidColor = 'rgba(245, 34, 59, 1)';
        }
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async getTransactionsSummary() {
      try {

        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);

        const response = await Promise.all([this.GET_USERS(), this.GET_TRANSACTIONS({
          startDate,
          endDate,
          category: 'Todas'
        })]);
        const transactionsSummaryMap = new Map();
        const transactionsSummary = [];
        const users = response[0];
        const transactions = response[1];
        let totalAmount = 0;

        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          transactionsSummaryMap.set(user.id, {
            name: user.name + ' ' + user.firstLastName,
            amount: 0
          });
        }

        for (let i = 0; i < transactions.length; i++) {
          if (transactionsSummaryMap.get(transactions[i].uid)) {
            const transactionSummary = transactionsSummaryMap.get(transactions[i].uid);
            totalAmount += +transactions[i].amount;
            transactionsSummaryMap.set(transactions[i].uid, {
              name: transactionSummary.name,
              amount: (+transactionSummary.amount) + (+transactions[i].amount),
            });
          }
        }

        transactionsSummaryMap.forEach((value, key) => {
          transactionsSummary.push({
            name: value.name,
            amount: value.amount,
            id: key,
          })
        });

        this.totalAmount = totalAmount;
        this.transactionsSummary = transactionsSummary;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    handleOpenUserTransactions(user) {
      this.user = user;
      this.individualUserTransactionDialog = true;
    },
    callAllChanges(value) {
      if (value) {
        this.month = value;
      }
    },

    setFmtMonthTransactions(userMonthTransactions) {
      let monthTransactionAmounts = [0, 0, 0, 0, 0];
      for (let i = 0; i < userMonthTransactions.length; i++) {
        const date = new Date(userMonthTransactions[i].date._seconds * 1000);
        const dayOfWeek = (0 | date.getUTCDate() / 7);
        monthTransactionAmounts[dayOfWeek] += +userMonthTransactions[i].amount;
      }
      this.monthTransactionAmounts = monthTransactionAmounts;
    },
    async getMonthTransactions() {
      try {
        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);

        const userMonthTransactions = await this.GET_TRANSACTIONS(
            {
              startDate,
              endDate,
              userId: this.userId,
              category: 'Todas'
            });

        this.setFmtMonthTransactions(userMonthTransactions);

      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    }
  },
  async mounted() {
    await this.getTransactionsSummary();
    if (this.initialDate) {
      this.month = this.initialDate;
    }
    await this.getLastMonthAmount();
    await this.getMonthTransactions();

  }
}
</script>

<style>

#sk_gastos_line, #sk_gastos_title_line {
  height: 28px;
}

#sk_gastos_line .v-skeleton-loader__list-item, #sk_gastos_title_line .v-skeleton-loader__list-item {
  padding-left: 2px !important;
  align-content: baseline;
  height: 30px !important;
}

#sk_gastos_line .v-skeleton-loader__text {
  margin-top: 0px;
  width: 214px;
  height: 14px;
}

#sk_gastos_title_line .v-skeleton-loader__text {
  margin-top: 0px;
  width: 140px;
  height: 14px;
  flex: 0 0 100;
}

#sk_avatar_wallet .v-skeleton-loader__avatar {
  height: 38px;
  width: 38px;
}

</style>
