<template>
  <v-form ref="contractForm"
          lazy-validation>
    <div class="row row--dense">
      <v-checkbox v-model="contract.indeterminate">
        <template v-slot:label>
          <div>
            Indeterminado
          </div>
        </template>
      </v-checkbox>
    </div>
    <div class="row row--dense">
      <div class="col">
        <v-text-field
            v-model="contract.amount"
            :rules="[requiredRule]"
            dense
            label="Monto"
            outlined
            required
            type="number"
        ></v-text-field>
      </div>
      <div class="col">
        <v-text-field
            v-model="contract.client"
            :rules="[requiredRule]"
            dense
            label="Nombre compañía"
            outlined
            required
            type="text"
        ></v-text-field>
      </div>
    </div>
    <div class="row row--dense"
         v-if="!contract.indeterminate">
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
                v-model="dateRangeText"
                dense
                readonly
                label="Periodo de contrato"
                outlined
                :rules="[requiredRule]"
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="dates"
              range
              no-title
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div class="d-flex justify-center">
      <v-btn class="mr-2"
             color="secondary"
             depressed
             @click="$emit('close-dialog')">Cerrar
      </v-btn>
      <v-btn class="ml-2"
             color="primary"
             depressed
             @click="validate()">{{update ? 'Actualizar' : 'Guardar'}}</v-btn>
    </div>
  </v-form>
</template>

<script>
import Rules from "@/mixins/Rules";

export default {
  name: "ContractForm",
  mixins: [Rules],
  props: {
    update: {
      type: Boolean,
      default: false,
    },
    activeDialog: {
      type: Boolean
    },
  },
  data: () => {
    return {
      contract: {
        amount: "",
        startDate: "",
        endDate: "",
        indeterminate: false,
        client: "",
      },
      menu: false,
      dates: [new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
    }
  },
  watch: {
    activeDialog: {
      handler(activeDialogValue) {
        if (activeDialogValue) {
          if (this.update) {
            // this.date = new Date(this.USER.hiringDate._seconds * 1000).toISOString().substr(0, 10);
            // this.dateFormatted = this.formatDate(new Date(this.USER.hiringDate._seconds * 1000).toISOString().substr(0, 10));
            // this.user = this.USER;
          }
        } else {
          this.contract.startDate = "";
          this.contract.amount = "";
          this.contract.client = "";
          this.contract.false = "";
          this.dates = [new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)];
          this.$refs.contractForm.resetValidation();
        }
      },
      immediate: true
    },
  },
  computed: {
    dateRangeText: {
      get() {
        return this.dates.join(' / ');
      },
    },
  },
  methods: {
    async validate() {
      if (this.$refs.contractForm.validate()) {
        if (!this.contract.indeterminate) {
          this.contract.startDate = this.dates[0];
          this.contract.endDate = this.dates[1];
        } else {
          this.contract.startDate = "";
          this.contract.endDate = "";
        }
        if (this.update) {
          this.$emit('onSubmitEditContract', this.contract);
        } else {
          this.$emit('onSubmitNewContract', this.contract);
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
