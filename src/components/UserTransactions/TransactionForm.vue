<template>
  <v-form ref="transactionForm"
          lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="transaction.concept"
            :rules="[requiredRule]"
            dense
            label="Concepto"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>
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
                v-model="dateFormatted"
                :rules="[requiredRule]"
                dense
                label="Fecha"
                outlined
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="date"
              :allowed-dates="allowedDates"
              no-title
              @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="transaction.amount"
            :rules="[requiredRule, onlyNumbers]"
            dense
            label="Monto"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>
      <v-col
          class="d-flex"
          cols="12"
          sm="6"
      >
        <v-select
            v-model="transaction.category"
            :items="categories"
            :rules="[requiredRule]"
            dense
            label="Categoría"
            outlined
        ></v-select>
      </v-col>
    </div>
    <div class="row row--dense">
      <div class="col">
        <v-file-input
            v-model="invoice"
            accept="application/pdf"
            dense
            :rules="[requiredRule]"
            label="Factura / Recibo"
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
  name: "TransactionForm",
  mixins: [File, Rules],
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
      transaction: {
        concept: "",
        date: "",
        category: "Transporte",
        amount: "",
        folio: "",
        invoice: null,
        xml: null,
        applicationDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      invoice: null,
      xml: null,
      menu1: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
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
        'Otro'
      ]
    }
  },
  computed: {
    ...mapGetters(['TRANSACTION'])
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
    activeDialog: {
      handler(activeDialogValue) {
        if (activeDialogValue) {
          if (this.update) {
            this.date = new Date(this.TRANSACTION.date._seconds * 1000).toISOString().substr(0, 10);
            this.dateFormatted = this.formatDate(new Date(this.TRANSACTION.date._seconds * 1000).toISOString().substr(0, 10));
            this.transaction = {...this.TRANSACTION};
          }
        } else {
          this.$refs.transactionForm.reset();
        }
      },
      immediate: true
    },
  },

  methods: {
    async validate() {
      if (this.$refs.transactionForm.validate()) {
        this.transaction.invoice = this.invoice ? await this.getBase64FromFile(this.invoice) : null;
        this.transaction.xml = this.xml ? await this.getBase64FromFile(this.xml) : null;
        this.transaction.folio = this.xml ? this.xml.name.slice(0, -4) : this.invoice.name.slice(0, -4);
        this.transaction.date = this.date;
        if (this.update) {
          this.$emit('onUpdateUserTransaction', this.transaction);
        } else {
          this.$emit('onAddUserTransaction', this.transaction);
        }
      }
    },

    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    formatLocaleDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('/')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    allowedDates(val) {
      return new Date(val) < new Date();
    }
  }
}
</script>


