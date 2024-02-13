<template>
  <div>

    <v-row>
      <ExpensesFilter @filterInAction="callAllChanges"> </ExpensesFilter>     
    </v-row>

    <div class="row white rounded-lg">
      <div class="col-12">
        <div class="d-flex align-center justify-space-between px-4 pt-3">
          
          <div class="d-flex align-center">
            <img src="../assets/users_in_icon.jpg" class="mb-4 mr-2" style="width: 26px; height: 26px;">
            <p class="text-lg-h6 font-weight-bold"> Uso de tarjeta empresarial </p>
          </div>

          <div class="d-flex justify-end">
            <v-btn  v-if="userRole === 'admin' || userRole === 'maintainer'"
              small
              style="height: 32px"
              outlined
              color="primary"
              v-on:click="exportPDF()"
              class="white--text ma-2"
            >
              Reporte mensual
              <v-icon right dark>
                mdi-cloud-download
              </v-icon>
            </v-btn>
            <v-sheet v-else>
              <v-skeleton-loader type="button" class="mr-2 monthly_report_admin pa-2"></v-skeleton-loader>
            </v-sheet>
          </div>

        </div>

        <ExpensesTable 
          :expenses-summary="expensesSummary"
          @openUserExpenses="handleOpenUserExpenses"
          v-if="expensesSummary.length > 0"
        >
        </ExpensesTable>

        <v-sheet v-else>
          <div class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
            <div class="v-skeleton-loader__table-thead v-skeleton-loader__bone justify-start py-3 px-8" style="width: 100%">
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '6%', 'margin-right' : isDesktopWidth ? '56.8%' : nineHundredHeight ? '60%' : seventTwentyHeight ? '60%' : '57%', 'margin-left' : '1%'}"></div>
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone" :style="{'max-width': '6%'}"></div>
            </div>
            <div class="v-skeleton-loader__table-tbody v-skeleton-loader__bone pt-0" style="height:46.3vh">
              <div v-for="i in 10" :key="i" class="v-skeleton-loader__table-row-divider v-skeleton-loader__bone px-8">
                <div class="v-skeleton-loader__divider v-skeleton-loader__bone" style="height: 1px"></div>
                <div class="v-skeleton-loader__table-row v-skeleton-loader__bone justify-start" style="width: 100%; height: 46.5px">

                  <div 
                    class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                    :style="{
                      'width': isDesktopWidth ? '10%' : '12%', 
                      'margin-right': isDesktopWidth ? '54%' : nineHundredHeight ? '55.5%' : '52.5%'
                    }"
                  >
                    <div class="v-skeleton-loader__text v-skeleton-loader__bone" ></div>
                  </div>

                  <div class="v-skeleton-loader__table-cell v-skeleton-loader__bone" 
                    :style="{
                      'width': isDesktopWidth ? '7%' : '12%'
                    }"
                  >
                    <div class="v-skeleton-loader__text v-skeleton-loader__bone" ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-skeleton-loader class="mt-11 mr-6" type="table-tfoot"></v-skeleton-loader>
        </v-sheet>
      </div>
      <v-dialog
        transition="dialog-bottom-transition"
        width="1000"
        v-model="individualUserExpenseDialog"
      >
        <UserExpensesView
           class="pt-5 pb-1"
           style="height:fit-content"
          :user-id="user.id"
          :user-name="user.name"
          :initial-date="month"
          v-if="individualUserExpenseDialog"
        >
        </UserExpensesView>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import MonthPicker from "@/mixins/MonthPicker";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import authService from "@/services/auth";
import ExpensesTable from "@/components/Expenses/ExpensesTable.vue";
import { mapActions, mapMutations } from 'vuex';
import UserExpensesView from "@/views/UserExpensesView.vue";
import ExpensesFilter from "@/components/Expenses/ExpensesFilter.vue";

export default {
    name: "ExpensesView",
    props: {
    initialDate: {
      type: String,
      default: null
    },
    userId: {
      type: String,
      default: null
    }
  },
  components: {
    ExpensesTable,
    UserExpensesView,
    ExpensesFilter
  },
  mixins: [MonthPicker],
  data: () => {
    return {
        expensesSummary: [],
        individualUserExpenseDialog: false,
        user: {},
        monthExpenseAmounts: null,
        allExpensesMonth: [],
        userRole: null,
        authService: authService,
        isDesktopWidth: window.innerWidth > 1903,
        nineHundredHeight: window.innerHeight <= 900 && window.innerHeight >720,
        seventTwentyHeight: window.innerHeight <= 720,
    }
  },
  watch: {
    async month() {
        await this.getExpensesSummary();
    },
  },
  methods: {
    ...mapActions(['GET_EXPENSES', 'GET_USERS']),
    ...mapMutations(['SET_LOADING', 'SHOW_ERROR_ALERT']),
    
    async getExpensesSummary() {
      try {

        this.SET_LOADING(true);
        const startDate = new Date(this.month).toISOString().slice(0, 10);
        const endDate = this.getNextMonth(this.month).slice(0, 10);
        const response = await Promise.all([this.GET_USERS(), this.GET_EXPENSES({startDate, endDate})]);
        const expensesSummaryMap = new Map();
        const expensesSummary = [];
        const users = response[0];
        const expenses = response[1];
        let totalAmount = 0;

        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          expensesSummaryMap.set(user.id, {
            name: user.name + ' ' + user.firstLastName,
            amount: 0
          });
        }

        for (let i = 0; i < expenses.length; i++) {
          if (expensesSummaryMap.get(expenses[i].uid)) {
            const expenseSummary = expensesSummaryMap.get(expenses[i].uid);
            totalAmount += +expenses[i].amount;
            expensesSummaryMap.set(expenses[i].uid, {
              name: expenseSummary.name,
              amount: (+expenseSummary.amount) + (+expenses[i].amount),
            });
          }
        }

        expensesSummaryMap.forEach((value, key) => {
          expensesSummary.push({
            name: value.name,
            amount: value.amount,
            id: key,
          })
        });

        this.totalAmount = totalAmount;
        this.expensesSummary = expensesSummary;
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
    },
    async expensesReport() {
      const startDate = new Date(this.month).toISOString().slice(0, 10);
      const endDate = new Date(new Date(this.month).getFullYear(), new Date(this.month).getMonth() + 2, 0);
      const expenses = await this.GET_EXPENSES({startDate, endDate});
      const users = await this.GET_USERS();
      const currency = function(number){
        return new Intl.NumberFormat('es-MX', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(number);
      };
      let allExpensesMonth = [];

      expenses.forEach(value => {
        let user = users.find(user => value.uid == user.id)
        allExpensesMonth.push([
          new Date(value.cardDateOut._seconds * 1000).toISOString().split('T')[0],
          (user.name + ' ' + user.firstLastName).replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))),
          (value.concept).trim().replace(/^\w/, (c) => c.toUpperCase()),
          currency(value.amount),
          new Date(value.cardDateIn._seconds * 1000).toISOString().split('T')[0],
        ])
      });
      this.allExpensesMonth = allExpensesMonth;
    },
    handleOpenUserExpenses(user) {      
      this.user = user;
      this.individualUserExpenseDialog = true;
    },
    callAllChanges(value){
      if (value) {
        this.month = value;
      }
    },
    async exportPDF() {
      try {
        this.SET_LOADING(true);
        const doc = new jsPDF('l');
        const head = [['Fecha entregada', 'Nombre(s) y apellido(s)', 'Concepto / Empresa', 'Monto', 'Fecha recibida']];
        await this.expensesReport();
        const fmtYear = this.month.split('-')[0];
        const fmtMonth = this.month.split('-')[1];
        const month = new Date(fmtMonth).toLocaleDateString('es-MX', {month: 'long'}).toUpperCase();
        const year = new Date(+fmtYear, 1).toLocaleDateString('es-MX', {year: 'numeric'}).toUpperCase();
        let fileName = 'reporte_mensual_' + new Date(this.month).toISOString().slice(0, 10) + '.pdf';
        doc.autoTable({
            margin: {top: 25, bottom: 18},
            styles: {
              halign: 'center',
            },
            headStyles: {fillColor : [123, 148, 158]},
            alternateRowStyles: {fillColor : [245, 218, 132]},
            tableLineColor: [123, 148, 158],
            tableLineWidth: 0.1,
            head: head,
            body: this.allExpensesMonth,
            didDrawPage: function (data) {
              const firstPartHeaderPDF = 'CONTROL DE GASTOS '
              const secondPartHeaderPDF = ' TARJETA EMPRESARIAL PIE CONSULTING S. DE R.L. DE C.V.'
              doc.addImage({imageData: 'https://storage.googleapis.com/bingsu-backend.appspot.com/logo_pieHQ.jpg', format: 'JPEG', x: 14, y: 2, width: 40, height: 20});
              doc.setFontSize(14);
              doc.setTextColor(100);
              doc.text(firstPartHeaderPDF + month + ' ' + year + secondPartHeaderPDF, data.settings.margin.left = 150, 12, {align: 'center', lineHeightFactor: 1, maxWidth: 165});
              let disclaimer = "\nEl personal se obliga a guardar la información relacionada sobre los diversos gastos antes suscritos, puesto que una de las obligaciones que tiene es la citada en la Ley Federal del Trabajo, en su artículo 134, fracción XIII; el cual menciona: “Guardar escrupulosamente los secretos técnicos (…) así como de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa”. Y sus correlativos en otras Leyes en cuanto a protección de datos. Cualquier divulgación de estos traerá como consecuencia las penas señaladas en el Código Penal Federal en su artículo 210 y/o sus correlativos en el Código Penal para el Estado de Nuevo León.";

              doc.setFontSize(8);

              let pageSize = doc.internal.pageSize;
              let pageHeight = pageSize.height
                ? pageSize.height
                : pageSize.getHeight();
              doc.text(disclaimer, data.settings.margin.left = 14, pageHeight - 15, {align: 'justify', lineHeightFactor: 1, maxWidth: 265});
            },
        })
        doc.save(fileName)
      } catch (e) {
        this.SHOW_ERROR_ALERT(e.response.data.message);
      } finally {
        this.SET_LOADING(false);
      }
  }
  },
    async mounted() {
      await this.getExpensesSummary();
      this.userRole = await authService.getRole();
      if (this.initialDate) {
        this.month = this.initialDate;
      }
  }
}
</script>

<style >
.monthly_report_admin .v-skeleton-loader__button {
  width: 136px !important;
  height: 32px !important;
}
</style>