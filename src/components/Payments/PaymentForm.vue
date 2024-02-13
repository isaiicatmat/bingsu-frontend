<template>
  <v-form ref="paymentForm"
          lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="payment.amount"
            :rules="[requiredRule]"
            dense
            label="Monto"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>

      <div class="col">
        <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateFormatted"
                dense
                label="Fecha"
                outlined
                :rules="[requiredRule]"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="date"
              :allowed-dates="allowedDates"
              no-title
              @input="menu = false"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div class="d-flex justify-center">
      <v-btn class="mr-2"
             color="#F5223B"
             depressed
             @click="$emit('close-dialog')">
             <div style="color: white">
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
import Rules from '../../mixins/Rules';
import {mapGetters} from "vuex";

export default {
  name: "PaymentForm",
  mixins: [Rules],
  data(vm) {
    return {
      menu: false,
      payment: {
        amount: "",
        date: "",
      },
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
    }
  },
  props: {
    update: {
      type: Boolean
    },
    activeDialog: {
      type: Boolean
    },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
    activeDialog: {
      handler(activeDialogValue) {
        if (activeDialogValue) {
          if (this.update) {
            this.date = new Date(this.PAYMENT.date._seconds * 1000).toISOString().substr(0, 10);
            this.dateFormatted = this.formatDate(new Date(this.PAYMENT.date._seconds * 1000).toISOString().substr(0, 10));
            this.payment = {...this.PAYMENT};
          }
        } else {
          this.payment.amount = "";
          this.$refs.paymentForm.resetValidation();
        }
      },
      immediate: true
    },
  },
  methods: {
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    async validate() {
      if (this.$refs.paymentForm.validate()) {
        this.payment.date = this.date;
        if (this.update) {
          this.$emit('onUpdatePayment', this.payment);
        } else {
          this.$emit('onAddPayment', this.payment);
        }
      }
    },
    allowedDates(val) {
      return new Date(val) < new Date();
    }
  },
  computed: {
    ...mapGetters(['PAYMENT'])
  }
}
</script>

<style scoped>

</style>
