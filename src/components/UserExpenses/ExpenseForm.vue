<template>
  <v-form ref="expenseForm"
          lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="expense.concept"
            :rules="[requiredRule]"
            dense
            label="Concepto"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>
      <div class="col">
        <v-text-field
            v-model="expense.amount"
            :rules="[requiredRule, onlyNumbers]"
            dense
            label="Monto"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>
    </div>
    <div class="row row--dense">
      <div class="col">
        <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateOutFormatted"
                :rules="[requiredRule]"
                dense
                label="Fecha recibida"
                outlined
                v-bind="attrs"
                @blur="cardDateOut = parseDate(dateOutFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="cardDateOut"
              :allowed-dates="allowedDatesOut"
              no-title
              @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="col">
        <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateInFormatted"
                :rules="[requiredRule]"
                dense
                label="Fecha entregada"
                outlined
                v-bind="attrs"
                @blur="cardDateIn = parseDate(dateInFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="cardDateIn"
              :allowed-dates="allowedDatesIn"
              no-title
              @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>
    <div class="row row--dense">
      <div class="col">
        <v-file-input
            v-model="invoice"
            :rules="[requiredRule]"
            accept="application/pdf"
            dense
            label="Factura"
            outlined
            required
            type="file"
        ></v-file-input>
      </div>
      <div class="col">
        <v-file-input
            v-model="xml"
            accept="application/xml, text/xml"
            dense
            label="XML"
            outlined
            required
            type="file"
        ></v-file-input>
      </div>
    </div>

    <div class="d-flex justify-center">
      <v-btn class="mr-2"
             color="#F5223B"
             depressed
             @click="$emit('close-dialog')">
        <div style="color:white">
          Cerrar
        </div>
      </v-btn>
      <v-btn class="ml-2"
             color="primary"
             depressed
             @click="validate()">{{ update ? 'Actualizar' : 'Guardar' }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import File from '../../mixins/File';
import Rules from "../../mixins/Rules";
import {mapGetters} from "vuex";

export default {
  mixins: [File, Rules],
  name: "ExpenseForm",
  props: {
    activeDialog: {
      type: Boolean
    },
    update: {
      type: Boolean
    }
  },
  data(vm) {
    return {
      expense: {
        concept: "",
        cardDateOut: "",
        cardDateIn: "",
        amount: "",
        folio: "",
        invoice: null,
        xml: null,
      },
      invoice: null,
      xml: null,
      menu1: null,
      menu2: null,
      cardDateOut: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      cardDateIn: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateOutFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      dateInFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
    }
  },
  watch: {
    cardDateOut() {
      this.dateOutFormatted = this.formatDate(this.cardDateOut)
    },
    cardDateIn() {
      this.dateInFormatted = this.formatDate(this.cardDateIn)
    },
    activeDialog: {
      handler(activeDialogValue) {
        if (activeDialogValue) {
          if (this.update) {
            this.cardDateOut = new Date(this.EXPENSE.cardDateOut._seconds * 1000).toISOString().substr(0, 10);
            this.cardDateIn = new Date(this.EXPENSE.cardDateIn._seconds * 1000).toISOString().substr(0, 10);
            this.dateOutFormatted = this.formatDate(new Date(this.EXPENSE.cardDateOut._seconds * 1000).toISOString().substr(0, 10));
            this.dateInFormatted = this.formatDate(new Date(this.EXPENSE.cardDateIn._seconds * 1000).toISOString().substr(0, 10));
            this.expense = {...this.EXPENSE}
          }
        } else {
          this.$refs.expenseForm.reset();
        }
      },
      immediate: true
    },
  },
  computed: {
    ...mapGetters(['EXPENSE'])
  },
  methods: {
    async validate() {
      if (this.$refs.expenseForm.validate()) {
        this.expense.invoice = this.invoice ? await this.getBase64FromFile(this.invoice) : null;
        this.expense.xml = this.xml ? await this.getBase64FromFile(this.xml) : null;
        this.expense.folio = this.xml ? this.xml.name.slice(0, -4) : this.invoice.name.slice(0, -4);
        this.expense.cardDateOut = this.cardDateOut;
        this.expense.cardDateIn = this.cardDateIn;
        if (this.update) {
          this.$emit('onUpdateUserExpense', this.expense);
        } else {
          this.$emit('onAddUserExpense', this.expense);
        }
      }
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    allowedDatesOut(val) {
      return new Date(val) <= new Date(this.cardDateIn);
    },
    allowedDatesIn(val) {
      return new Date(val) >= new Date(this.cardDateOut);
    }
  }
}
</script>
