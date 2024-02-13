<template>
  <v-form ref="attendancesForm" lazy-validation>
    <div class="row row--dense mb-6">
      <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          max-width="320px"
          min-width="auto"
          offset-y
          transition="scale-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="dateRangeText"
              dense
              hide-details
              label="Periodo"
              outlined
              required
              v-bind="attrs"
              v-on="on">
          </v-text-field>
        </template>
        <v-date-picker
            v-model="dates"
            no-title
            range>
        </v-date-picker>
      </v-menu>
    </div>

    <div class="row row--dense">
      <v-textarea
          v-model="attendance.summary"
          :rules="[requiredRule]"
          counter="300"
          dense
          label="Motivo del viaje"
          maxlength="300"
          outlined
          required
          type="text"
      >
      </v-textarea>
    </div>

    <div class="d-flex justify-center">
      <v-btn
          class="mr-2"
          color="#F5223B"
          depressed
          @click="$emit('close-dialog')"
      >
        <div style="color:white">
          Cerrar
        </div>
      </v-btn>
      <v-dialog
          v-model="warningDialog"
          width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
          >
            Guardar
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 primary white--text">
            Atención
          </v-card-title>

          <v-card-text class="pt-4">
            Antes de continuar, revisa de nuevo el periodo de tu viaje de negocios. Si ya existe una asistencia
            guardada en los días que comprende el periodo esta será eliminada y reemplazada por la asistencia
            correspondiente
            a este viaje.

            <br>
            <br>
            Por favor, utiliza esta característica con cuidado.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red lighten-2"
                dark
                depressed
                @click="warningDialog = false"
            >
              Cancelar
            </v-btn>
            <v-btn
                color="#F5223B"
                dark
                @click="submitAttendances()"
            >
              Continuar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-form>
</template>

<script>
import Rules from "@/mixins/Rules";
import MonthPicker from "@/mixins/MonthPicker";
import {getWorkDaysBetweenPeriod} from '@/utils/DateHelper';

export default {
  name: "AttendancesForm",
  mixins: [
    Rules,
    MonthPicker
  ],
  props: {
    onDisplay: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    onDisplay(onDisplayNewValue) {
      if (onDisplayNewValue) {
        this.dates = [new Date().toISOString().substr(0, 10), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().substr(0, 10)];
        this.attendance = {
          summary: "",
          startDate: "",
          endDate: "",
        }
      }
      this.$refs.attendancesForm.resetValidation();
      this.warningDialog = false;
    }
  },
  data: () => {
    return {
      menu: false,
      warningDialog: false,
      dates: [new Date().toISOString().substr(0, 10), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().substr(0, 10)],
      attendance: {
        summary: "",
        startDate: "",
        endDate: "",
      }
    }
  },
  methods: {
    getWorkDaysBetweenPeriod,
    submitAttendances() {
      if (this.$refs.attendancesForm.validate()) {
        const startDate = new Date(this.dates[0]);
        const endDate = new Date(this.dates[1]);
        let workDays = [];

        if (startDate < endDate) {
          workDays = this.getWorkDaysBetweenPeriod(this.dates[0], this.dates[1]);
        } else {
          workDays = this.getWorkDaysBetweenPeriod(this.dates[1], this.dates[0]);
        }
        this.$emit('onSubmitAttendances', {
          workDays,
          summary: this.attendance.summary,
        });
      }
    }
  },
  computed: {
    dateRangeText: {
      get() {
        return this.dates.join(' / ');
      },
    },
  },
}
</script>

<style scoped>

</style>
