<template>
  <v-form ref="userPayrollForm" lazy-validation>
    <div class="row row--dense">
      <div class="col">
        <v-select v-model="payroll.type"
                  :items="payrollTypes"
                  dense
                  label="Tipo de nómina"
                  outlined
                  required>
        </v-select>
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
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
      </div>

      <div class="col">
        <v-file-input
          v-model="file"
          accept="application/pdf"
          dense
          :rules="[requiredRule]"
          label="Nómina"
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
        <div style="color:white">Cerrar</div>
      </v-btn>
      <v-btn class="ml-2"
             color="primary"
             depressed
             @click="validate()">
        Guardar
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import Rules from "@/mixins/Rules";
import File from '../../mixins/File';

export default {
  name: "UserPayrollForm",
  props: {
    activeDialog: {
      type: Boolean
    },
  },
  mixins: [Rules, File],
  data: (vm) => {
    return {
      payroll: {
        type: "Mes",
        date: "",
        file: "",
      },
      file: null,
      menu: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0],
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]),
      currentDate: new Date().toISOString().split('T')[0],
      payrollTypes: [
          "Mes",
          "Primera quincena",
          "Segunda quincena",
          "Aguinaldo",
      ],
    }
  },
  methods: {
    allowedDates(val) {
      return new Date(val) < new Date();
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${year}-${month}-${day}`
    },
    parseDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    async validate() {
      if (this.$refs.userPayrollForm.validate()) {
        this.payroll.date = this.date;
        this.payroll.file = this.file ? await this.getBase64FromFile(this.file) : null;
        this.$emit('onAddPayroll', this.payroll);
      }
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
    activeDialog: {
      handler(activeDialogValue) {
        if (activeDialogValue) {
          this.payroll.type = 'Mes',
          this.dateFormatted = this.formatDate(this.currentDate);
        } else {
          this.$refs.userPayrollForm.reset();
        }
      },
    }
  }
}
</script>